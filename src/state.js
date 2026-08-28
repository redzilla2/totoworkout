import { DEFAULT_EXERCISES } from './data/exercises.js';
import { DEFAULT_ROUTINES } from './data/defaultRoutines.js';
import { generateSampleHistory } from './data/sampleHistory.js';
import { formatDate, isCardioCategory, estimateStrengthCalories, getLatestBodyWeightKg } from './utils/helpers.js';
import { moveArrayItem } from './utils/dragReorder.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

const STORAGE_KEY = 'totoworkouts_app_state_v4'; // Version bump for streak flag sync
const CLOUD_SAVE_DEBOUNCE_MS = 1000;

// Day-of-week (0=Sun..6=Sat) -> routineId|null. Defaults to the Upper/Lower Split
// (Anthony's current program) on Mon/Tue/Thu/Fri, rest days elsewhere — fully
// editable per day from the Weekly Schedule editor.
function defaultSchedule() {
  return {
    0: null,
    1: 'routine_ul_upper_1',
    2: 'routine_ul_lower_1',
    3: null,
    4: 'routine_ul_upper_2',
    5: 'routine_ul_lower_2',
    6: null
  };
}

function defaultAppData() {
  return {
    routines: DEFAULT_ROUTINES,
    schedule: defaultSchedule(),
    history: generateSampleHistory(),
    bodyWeightLogs: [],
    activeWorkout: null,
    currentView: 'calendar',
    selectedDate: formatDate(new Date())
  };
}

// Built-in routines are identified by their stable id. A saved copy of one
// (in localStorage or Supabase) permanently freezes it as of whenever it was
// first saved — code-side edits to DEFAULT_ROUTINES (renames, recoloring,
// etc.) never reach a browser that already has data, since the persisted
// routines array always wins over the fresh default. To keep built-in
// routines' identity in sync with the current code while still preserving
// anything the user actually customized (exercises, sets/reps added via the
// Schedule editor), re-sync just the label fields from the current default on
// every load; leave routines with no matching id (user-created ones) alone.
// Also append any brand-new built-in routines (ids added to DEFAULT_ROUTINES
// since this browser/account last saved) so a whole new program shows up for
// returning users too, not just brand-new signups.
function syncBuiltInRoutineMetadata(routines) {
  if (!routines) return routines;
  const defaultsById = new Map(DEFAULT_ROUTINES.map(r => [r.id, r]));
  const existingIds = new Set(routines.map(r => r.id));
  const synced = routines.map(r => {
    const def = defaultsById.get(r.id);
    if (!def) return r;
    return { ...r, name: def.name, icon: def.icon, color: def.color, category: def.category };
  });
  const newBuiltIns = DEFAULT_ROUTINES.filter(def => !existingIds.has(def.id));
  return synced.concat(newBuiltIns);
}

function loadLocalData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        routines: syncBuiltInRoutineMetadata(parsed.routines) || DEFAULT_ROUTINES,
        schedule: parsed.schedule || defaultSchedule(),
        history: parsed.history || generateSampleHistory(),
        bodyWeightLogs: parsed.bodyWeightLogs || [],
        activeWorkout: parsed.activeWorkout || null,
        currentView: parsed.currentView || 'calendar',
        selectedDate: parsed.selectedDate || formatDate(new Date())
      };
    }
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
  }
  return defaultAppData();
}

class AppState {
  constructor() {
    this.listeners = [];
    this.session = null;
    this.cloudSaveTimer = null;
    this.cloudSaveDirty = false;
    this.passwordRecovery = false;

    // When cloud sync isn't configured, skip the auth gate entirely.
    this.localOnly = !isSupabaseConfigured;
    this.authReady = !isSupabaseConfigured;

    this.state = { exercises: DEFAULT_EXERCISES, ...loadLocalData() };
    // Persist immediately in case syncBuiltInRoutineMetadata() just corrected
    // anything above — otherwise the fix only lives in memory until some
    // unrelated action happens to trigger the next save.
    this.saveLocal();

    // Subscribe as early as possible (synchronously, right here in the constructor) —
    // supabase-js starts parsing any recovery/magic-link tokens out of the URL the
    // moment createClient() runs, and fires PASSWORD_RECOVERY to whatever's listening
    // at that moment. Waiting until init() (after an awaited getSession() call) to
    // subscribe is too late: the event has often already fired to no one, and
    // getSession() just hands back the resulting session as if it were a normal login.
    if (isSupabaseConfigured) {
      this._authReadyPromise = new Promise((resolve) => {
        this._resolveAuthReady = resolve;
      });

      supabase.auth.onAuthStateChange(async (event, newSession) => {
        const hadSession = !!this.session;
        this.session = newSession;
        this.authReady = true;

        if (event === 'PASSWORD_RECOVERY') {
          // Arrived here via a "reset password" email link. Gate the app on the
          // update-password screen instead of dropping straight into the account.
          this.passwordRecovery = true;
          this.notifyListeners();
        } else if (newSession && !hadSession) {
          await this.loadCloudState();
        } else if (!newSession) {
          // Signed out (or never signed in): fall back to whatever's cached locally.
          this.state = { exercises: DEFAULT_EXERCISES, ...loadLocalData() };
          this.notifyListeners();
        }

        this._resolveAuthReady?.();
        this._resolveAuthReady = null;
      });

      // The cloud save is debounced (see scheduleCloudSave) so rapid edits don't
      // spam an upsert per keystroke — but that leaves a window where a page
      // refresh (or the phone backgrounding/reloading the tab) cancels the
      // pending timer before it fires. On the very next load, loadCloudState()
      // unconditionally overwrites local data with whatever's in the cloud —
      // so a workout finished right before that refresh would still be sitting
      // in localStorage, get immediately clobbered by the stale cloud copy, and
      // look like it was never logged at all. 'visibilitychange' firing on
      // hidden reliably precedes that navigation (unlike 'beforeunload', which
      // often doesn't leave enough time for an in-flight fetch to complete), so
      // flushing here closes the race instead of waiting out the debounce.
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.flushCloudSave();
      });
      window.addEventListener('pagehide', () => this.flushCloudSave());
    }
  }

  // Waits for the initial Supabase session/recovery check to resolve.
  // No-ops (synchronously) when Supabase env vars aren't set.
  async init() {
    if (!isSupabaseConfigured) return;
    await this._authReadyPromise;
  }

  async loadCloudState() {
    const userId = this.session.user.id;
    const { data, error } = await supabase
      .from('app_state')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Failed to load cloud state, falling back to local data:', error);
      this.state = { exercises: DEFAULT_EXERCISES, ...loadLocalData() };
      this.notifyListeners();
      return;
    }

    if (data && data.data) {
      const cloud = data.data;
      this.state = {
        exercises: DEFAULT_EXERCISES,
        routines: syncBuiltInRoutineMetadata(cloud.routines) || DEFAULT_ROUTINES,
        schedule: cloud.schedule || defaultSchedule(),
        history: cloud.history || generateSampleHistory(),
        bodyWeightLogs: cloud.bodyWeightLogs || [],
        activeWorkout: cloud.activeWorkout || null,
        currentView: cloud.currentView || 'calendar',
        selectedDate: cloud.selectedDate || formatDate(new Date())
      };
      this.saveLocal();
      // Push any built-in-routine correction straight back up too, so the cloud
      // copy doesn't keep re-serving a stale name/color on the next device that
      // signs in.
      await this.saveToCloud();
      this.notifyListeners();
    } else {
      // First sign-in on this account: push whatever's on this device up to the cloud.
      await this.saveToCloud();
      this.notifyListeners();
    }
  }

  needsAuth() {
    return isSupabaseConfigured && this.authReady && !this.session && !this.localOnly;
  }

  needsPasswordReset() {
    return this.passwordRecovery;
  }

  // Called once the user has successfully set a new password from the recovery screen.
  async completePasswordRecovery() {
    this.passwordRecovery = false;
    if (this.session) {
      await this.loadCloudState();
    } else {
      this.notifyListeners();
    }
  }

  isAuthLoading() {
    return isSupabaseConfigured && !this.authReady;
  }

  hasSession() {
    return !!this.session;
  }

  getUserEmail() {
    return this.session?.user?.email || null;
  }

  enableLocalOnly() {
    this.localOnly = true;
    this.notifyListeners();
  }

  async signOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }

  saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        routines: this.state.routines,
        schedule: this.state.schedule,
        history: this.state.history,
        bodyWeightLogs: this.state.bodyWeightLogs,
        activeWorkout: this.state.activeWorkout,
        currentView: this.state.currentView,
        selectedDate: this.state.selectedDate
      }));
    } catch (err) {
      console.error('Failed to save state to localStorage:', err);
    }
  }

  scheduleCloudSave() {
    if (!isSupabaseConfigured || !this.session) return;
    this.cloudSaveDirty = true;
    clearTimeout(this.cloudSaveTimer);
    this.cloudSaveTimer = setTimeout(() => this.saveToCloud(), CLOUD_SAVE_DEBOUNCE_MS);
  }

  // Sends a pending debounced save right now instead of waiting out the
  // timer — see the visibilitychange/pagehide listeners in the constructor
  // for why this matters. No-ops if nothing's actually pending, so it's safe
  // to call from a listener that can fire many times (tab-switching, etc.)
  // without spamming redundant upserts.
  flushCloudSave() {
    if (!this.cloudSaveDirty) return;
    clearTimeout(this.cloudSaveTimer);
    this.saveToCloud();
  }

  async saveToCloud() {
    if (!this.session) return;
    this.cloudSaveDirty = false;
    const { error } = await supabase.from('app_state').upsert({
      user_id: this.session.user.id,
      data: {
        routines: this.state.routines,
        schedule: this.state.schedule,
        history: this.state.history,
        bodyWeightLogs: this.state.bodyWeightLogs,
        activeWorkout: this.state.activeWorkout,
        currentView: this.state.currentView,
        selectedDate: this.state.selectedDate
      }
    });
    if (error) console.error('Failed to sync state to Supabase:', error);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Persists locally (instant) and schedules a debounced cloud sync, then re-renders.
  notify() {
    this.saveLocal();
    this.scheduleCloudSave();
    this.notifyListeners();
  }

  getState() {
    return this.state;
  }

  setView(viewName) {
    this.state.currentView = viewName;
    this.notify();
  }

  setSelectedDate(dateStr) {
    this.state.selectedDate = dateStr;
    this.notify();
  }

  addWorkoutLog(workout) {
    // Explicitly flag user-logged workouts for streak count
    workout.userLogged = true;
    const existingIndex = this.state.history.findIndex(h => h.id === workout.id);
    if (existingIndex >= 0) {
      this.state.history[existingIndex] = workout;
    } else {
      this.state.history.unshift(workout);
    }
    this.notify();
  }

  deleteWorkoutLog(workoutId) {
    this.state.history = this.state.history.filter(h => h.id !== workoutId);
    this.notify();
  }

  startWorkoutFromRoutine(routine) {
    const activeSession = {
      id: 'session_' + Date.now(),
      startTime: Date.now(),
      name: routine.name,
      category: routine.category || 'Custom',
      color: routine.color || '#6366f1',
      icon: routine.icon || '🏋️',
      // Tags the eventual log with which scheduled routine it came from, so
      // logging something else (a manual cardio session, an ad-hoc lift) on
      // the same day doesn't make the calendar think this routine is done.
      routineId: routine.id || null,
      notes: '',
      userLogged: true,
      exercises: routine.exercises.map(exItem => {
        const exMeta = this.state.exercises.find(e => e.id === exItem.exerciseId) || { name: exItem.exerciseId, category: routine.category };
        const cardio = isCardioCategory(exMeta.category);

        let sets;
        if (cardio) {
          // Cardio is logged as a single minutes/calories block, not multiple
          // sets of reps/weight.
          sets = [{
            setNum: 1,
            minutes: exItem.defaultMinutes || 20,
            calories: exItem.defaultCalories || 150,
            completed: false
          }];
        } else {
          const setsCount = exItem.defaultSets || 3;
          sets = [];
          for (let i = 0; i < setsCount; i++) {
            sets.push({
              setNum: i + 1,
              reps: exItem.defaultReps || 10,
              weight: exItem.defaultWeight || 0,
              completed: false
            });
          }
        }

        return {
          name: exMeta.name,
          category: exMeta.category || 'General',
          repRange: exItem.repRange || null,
          // Every exercise starts at a flat 2:00 rest — adjust per exercise in the
          // rest selector below (heavier lifts vs. quick isolation/ab work, etc.).
          restSeconds: 120,
          sets: sets
        };
      })
    };

    this.state.activeWorkout = activeSession;
    this.state.currentView = 'active';
    this.notify();
  }

  updateActiveWorkout(activeSession) {
    // Persists (locally + debounced cloud sync) without a full shell re-render,
    // so typing in a weight/reps input doesn't lose focus mid-edit.
    this.state.activeWorkout = activeSession;
    this.saveLocal();
    this.scheduleCloudSave();
  }

  finishActiveWorkout() {
    if (!this.state.activeWorkout) return;
    const session = this.state.activeWorkout;
    const endTime = Date.now();
    const durationMinutes = Math.max(1, Math.round((endTime - session.startTime) / 60000));

    let totalVolume = 0;
    let totalCalories = 0;
    let cardioMinutes = 0;
    let hasCompletedStrengthSets = false;
    session.exercises.forEach(ex => {
      const cardio = isCardioCategory(ex.category);
      ex.sets.forEach(s => {
        if (s.completed) {
          if (cardio) {
            totalCalories += (s.calories || 0);
            cardioMinutes += (s.minutes || 0);
          } else {
            totalVolume += (s.reps * (s.weight || 1));
            hasCompletedStrengthSets = true;
          }
        }
      });
    });

    // Strength sets never had a calorie figure at all — logged cardio already
    // carries a user-entered count above, so only estimate the *remaining*
    // (non-cardio) portion of the session's duration, using MET × body
    // weight × time. See utils/helpers.js for the formula and its caveats.
    if (hasCompletedStrengthSets) {
      const strengthMinutes = Math.max(0, durationMinutes - cardioMinutes);
      totalCalories += estimateStrengthCalories(strengthMinutes, getLatestBodyWeightKg(this.state));
    }
    // Flags the log's total as partly/fully an estimate rather than a fully
    // user-entered figure, so the UI can label it "(est.)" instead of
    // presenting a MET-formula guess as a precisely measured number.
    const caloriesEstimated = hasCompletedStrengthSets;

    const completedLog = {
      id: 'log_' + Date.now(),
      date: formatDate(new Date()),
      name: session.name,
      category: session.category,
      color: session.color,
      icon: session.icon,
      routineId: session.routineId || null,
      durationMinutes: durationMinutes,
      totalVolume: totalVolume,
      totalCalories: totalCalories,
      caloriesEstimated: caloriesEstimated,
      notes: session.notes || '',
      userLogged: true, // Flag for user completion
      exercises: session.exercises
    };

    this.addWorkoutLog(completedLog);
    this.state.activeWorkout = null;
    this.state.currentView = 'calendar';
    // Jump the calendar to the date this session was actually logged under, so the
    // just-finished workout is immediately visible rather than landing invisibly on
    // whatever date happened to be selected before the workout started.
    this.state.selectedDate = completedLog.date;
    this.notify();
  }

  cancelActiveWorkout() {
    this.state.activeWorkout = null;
    this.state.currentView = 'calendar';
    this.notify();
  }

  addRoutine(routine) {
    this.state.routines.unshift(routine);
    this.notify();
  }

  deleteRoutine(routineId) {
    this.state.routines = this.state.routines.filter(r => r.id !== routineId);
    // Clear any day slots that pointed at the now-deleted routine.
    Object.keys(this.state.schedule || {}).forEach(day => {
      if (this.state.schedule[day] === routineId) this.state.schedule[day] = null;
    });
    this.notify();
  }

  // --- Weekly Schedule editor ---

  // Assigns (or clears, with routineId = null) the routine that runs on a given
  // day of week (0=Sun..6=Sat).
  setDaySchedule(dayOfWeek, routineId) {
    this.state.schedule[dayOfWeek] = routineId || null;
    this.notify();
  }

  // Creates a fresh empty routine and assigns it to the given day — used when
  // adding the first exercise to a day that's currently a rest day.
  createRoutineForDay(dayOfWeek, name) {
    const routine = {
      id: 'routine_custom_' + Date.now(),
      name: name || 'Custom Day',
      category: 'Custom',
      icon: '🏋️',
      color: '#6366f1',
      exercises: []
    };
    this.state.routines.unshift(routine);
    this.state.schedule[dayOfWeek] = routine.id;
    this.notify();
    return routine;
  }

  addExerciseToRoutine(routineId, exerciseEntry) {
    const routine = this.state.routines.find(r => r.id === routineId);
    if (!routine) return;
    routine.exercises.push(exerciseEntry);
    this.notify();
  }

  removeExerciseFromRoutine(routineId, exerciseIndex) {
    const routine = this.state.routines.find(r => r.id === routineId);
    if (!routine) return;
    routine.exercises.splice(exerciseIndex, 1);
    this.notify();
  }

  // Reorders a routine's exercise list (drag-to-reorder in the Schedule editor).
  reorderRoutineExercises(routineId, fromIndex, toIndex) {
    const routine = this.state.routines.find(r => r.id === routineId);
    if (!routine || !routine.exercises[fromIndex]) return;
    moveArrayItem(routine.exercises, fromIndex, toIndex);
    this.notify();
  }

  // Patches a single exercise entry within a routine (e.g. { defaultSets, defaultReps }).
  updateRoutineExercise(routineId, exerciseIndex, patch) {
    const routine = this.state.routines.find(r => r.id === routineId);
    if (!routine || !routine.exercises[exerciseIndex]) return;
    Object.assign(routine.exercises[exerciseIndex], patch);
    this.notify();
  }

  resetDemoData() {
    this.state.history = generateSampleHistory();
    this.notify();
  }

  clearAllData() {
    this.state.history = [];
    this.state.bodyWeightLogs = [];
    this.state.activeWorkout = null;
    this.notify();
  }

  // --- Body weight tracking ---

  // One entry per calendar date — logging the same date again overwrites it
  // rather than creating a duplicate point on the chart.
  logBodyWeight(dateStr, weightKg) {
    const existingIndex = this.state.bodyWeightLogs.findIndex(w => w.date === dateStr);
    const entry = {
      id: existingIndex >= 0 ? this.state.bodyWeightLogs[existingIndex].id : 'bw_' + Date.now(),
      date: dateStr,
      weightKg
    };
    if (existingIndex >= 0) {
      this.state.bodyWeightLogs[existingIndex] = entry;
    } else {
      this.state.bodyWeightLogs.push(entry);
    }
    this.notify();
  }

  deleteBodyWeightLog(id) {
    this.state.bodyWeightLogs = this.state.bodyWeightLogs.filter(w => w.id !== id);
    this.notify();
  }
}

export const appState = new AppState();
