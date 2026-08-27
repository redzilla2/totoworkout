import { DEFAULT_EXERCISES } from './data/exercises.js';
import { DEFAULT_ROUTINES } from './data/defaultRoutines.js';
import { generateSampleHistory } from './data/sampleHistory.js';
import { formatDate } from './utils/helpers.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

const STORAGE_KEY = 'totoworkouts_app_state_v4'; // Version bump for streak flag sync
const CLOUD_SAVE_DEBOUNCE_MS = 1000;

function defaultAppData() {
  return {
    routines: DEFAULT_ROUTINES,
    history: generateSampleHistory(),
    activeWorkout: null,
    currentView: 'calendar',
    selectedDate: formatDate(new Date())
  };
}

function loadLocalData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        routines: parsed.routines || DEFAULT_ROUTINES,
        history: parsed.history || generateSampleHistory(),
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

    // When cloud sync isn't configured, skip the auth gate entirely.
    this.localOnly = !isSupabaseConfigured;
    this.authReady = !isSupabaseConfigured;

    this.state = { exercises: DEFAULT_EXERCISES, ...loadLocalData() };
  }

  // Resolves the initial Supabase session and starts listening for auth changes.
  // No-ops (synchronously) when Supabase env vars aren't set.
  async init() {
    if (!isSupabaseConfigured) return;

    const { data: { session } } = await supabase.auth.getSession();
    this.session = session;
    this.authReady = true;

    if (session) {
      await this.loadCloudState();
    } else {
      this.notifyListeners();
    }

    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      const hadSession = !!this.session;
      this.session = newSession;

      if (newSession && !hadSession) {
        await this.loadCloudState();
      } else if (!newSession && hadSession) {
        // Signed out: fall back to whatever's cached on this device.
        this.state = { exercises: DEFAULT_EXERCISES, ...loadLocalData() };
        this.notifyListeners();
      }
    });
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
        routines: cloud.routines || DEFAULT_ROUTINES,
        history: cloud.history || generateSampleHistory(),
        activeWorkout: cloud.activeWorkout || null,
        currentView: cloud.currentView || 'calendar',
        selectedDate: cloud.selectedDate || formatDate(new Date())
      };
      this.saveLocal();
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
        history: this.state.history,
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
    clearTimeout(this.cloudSaveTimer);
    this.cloudSaveTimer = setTimeout(() => this.saveToCloud(), CLOUD_SAVE_DEBOUNCE_MS);
  }

  async saveToCloud() {
    if (!this.session) return;
    const { error } = await supabase.from('app_state').upsert({
      user_id: this.session.user.id,
      data: {
        routines: this.state.routines,
        history: this.state.history,
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
      notes: '',
      userLogged: true,
      exercises: routine.exercises.map(exItem => {
        const exMeta = this.state.exercises.find(e => e.id === exItem.exerciseId) || { name: exItem.exerciseId, category: routine.category };
        const setsCount = exItem.defaultSets || 3;
        const sets = [];
        for (let i = 0; i < setsCount; i++) {
          sets.push({
            setNum: i + 1,
            reps: exItem.defaultReps || 10,
            weight: exItem.defaultWeight || 0,
            completed: false
          });
        }
        return {
          name: exMeta.name,
          category: exMeta.category || 'General',
          repRange: exItem.repRange || null,
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
    session.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          totalVolume += (s.reps * (s.weight || 1));
        }
      });
    });

    const completedLog = {
      id: 'log_' + Date.now(),
      date: formatDate(new Date()),
      name: session.name,
      category: session.category,
      color: session.color,
      icon: session.icon,
      durationMinutes: durationMinutes,
      totalVolume: totalVolume,
      notes: session.notes || '',
      userLogged: true, // Flag for user completion
      exercises: session.exercises
    };

    this.addWorkoutLog(completedLog);
    this.state.activeWorkout = null;
    this.state.currentView = 'calendar';
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
    this.notify();
  }

  resetDemoData() {
    this.state.history = generateSampleHistory();
    this.notify();
  }

  clearAllData() {
    this.state.history = [];
    this.state.activeWorkout = null;
    this.notify();
  }
}

export const appState = new AppState();
