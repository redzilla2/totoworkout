import { appState } from '../state.js';
import { RestTimer } from '../utils/timer.js';

let currentRestTimer = null;

// Which exercise card the rest countdown widget should render inside (instead
// of one fixed widget pinned near the top of the page, which was invisible
// once you'd scrolled down to a later exercise), and whether it should be
// showing at all right now. Explicit flag rather than inferring visibility
// from currentRestTimer.secondsLeft > 0 — .stop() doesn't zero that out, so
// reading it after Skip Rest/Cancel/Finish could resurrect a stale countdown
// on the next render.
let restingExerciseIndex = null;
let restTimerVisible = false;

// Elapsed-time clock: module-level like currentRestTimer, so it survives the
// full re-renders that fire on every set-check / add-set / etc.
let elapsedTimerId = null;
let elapsedTimerSessionId = null;

export function renderActiveWorkoutView(container) {
  const state = appState.getState();
  const session = state.activeWorkout;

  if (!session) {
    stopElapsedTimer();
    container.innerHTML = `
      <div class="glass-card" style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 48px; margin-bottom: 12px;">🏋️</div>
        <div style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">No Active Workout Session</div>
        <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px;">
          Choose a routine from the Routines tab or start a blank workout session to begin tracking in real time!
        </div>
        <button class="btn" id="start-quick-session-btn">
          ⚡ Start Blank Workout Session
        </button>
      </div>
    `;

    container.querySelector('#start-quick-session-btn')?.addEventListener('click', () => {
      appState.startWorkoutFromRoutine({
        name: 'Quick Workout',
        category: 'Full Body',
        exercises: [
          { exerciseId: 'ex_bench_press', defaultSets: 3, defaultReps: 10, defaultWeight: 60 },
          { exerciseId: 'ex_squat', defaultSets: 3, defaultReps: 10, defaultWeight: 80 },
          { exerciseId: 'ex_lat_pulldown', defaultSets: 3, defaultReps: 10, defaultWeight: 50 }
        ]
      });
    });
    return;
  }

  let activeVolume = 0;
  let totalSets = 0;
  let completedSets = 0;

  session.exercises.forEach(ex => {
    ex.sets.forEach(s => {
      totalSets++;
      if (s.completed) {
        completedSets++;
        activeVolume += (s.reps * (s.weight || 1));
      }
    });
  });

  container.innerHTML = `
    <!-- Active Header Card -->
    <div class="glass-card" style="border-left: 5px solid ${session.color || '#6366f1'}; padding: 18px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <span style="font-size: 1.3rem; font-weight: 800;">${session.icon || '🏋️'} ${session.name}</span>
          <span class="badge" style="background: ${session.color || '#6366f1'}22; color: ${session.color || '#6366f1'}; margin-left: 6px;">${session.category}</span>
        </div>
        <button class="btn btn-danger" id="cancel-active-btn" style="width: auto; padding: 6px 12px; font-size: 0.8rem;">
          End / Discard
        </button>
      </div>

      <div style="display: flex; justify-content: space-around; background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: var(--radius-md); text-align: center;">
        <div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #a5b4fc;" id="elapsed-timer-digits">⏱️ 00:00</div>
          <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">ELAPSED</div>
        </div>
        <div style="width: 1px; background: var(--border-glass);"></div>
        <div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #10b981;">✅ ${completedSets}/${totalSets}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">SETS DONE</div>
        </div>
        <div style="width: 1px; background: var(--border-glass);"></div>
        <div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #f59e0b;">⚡ ${activeVolume.toLocaleString()}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">VOLUME (KG)</div>
        </div>
      </div>
    </div>

    <!-- Exercises Checklist -->
    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px;">
      ${session.exercises.map((ex, exIndex) => `
        <div class="glass-card" style="margin-bottom: 0; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <div style="font-weight: 700; font-size: 1.05rem;">💪 ${ex.name}</div>
              ${ex.repRange ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Target: ${ex.repRange === 'triset' ? 'triset' : `${ex.repRange} reps`}</div>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button class="btn btn-secondary add-set-btn" data-ex="${exIndex}" style="width: auto; padding: 4px 10px; font-size: 0.75rem;">+ Set</button>
              <button class="icon-btn delete-exercise-btn" data-ex="${exIndex}" title="Remove exercise from this workout" style="width: 30px; height: 30px; font-size: 12px; color: var(--accent-rose);">🗑️</button>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">⏱️ Rest:</span>
            <select class="form-select rest-time-select" data-ex="${exIndex}" style="width: auto; padding: 4px 8px; font-size: 0.78rem;">
              ${renderRestOptions(ex.restSeconds || 60)}
            </select>
          </div>

          ${restTimerVisible && restingExerciseIndex === exIndex ? `
            <!-- Rest Timer Box Widget — rendered right above this exercise's own set
                 rows so it's visible no matter how far down the page you've scrolled. -->
            <div class="rest-timer-box" id="rest-timer-widget" style="margin-bottom: 16px;">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); letter-spacing: 0.05em;">REST COUNTDOWN</div>
              <div class="timer-digits" id="rest-timer-digits">00:00</div>
              <div style="display: flex; justify-content: center; gap: 8px; margin-top: 8px;">
                <button class="btn btn-secondary" id="add-10s-btn" style="width: auto; padding: 4px 10px; font-size: 0.75rem;">+10s</button>
                <button class="btn btn-secondary" id="skip-rest-btn" style="width: auto; padding: 4px 10px; font-size: 0.75rem;">Skip Rest</button>
              </div>
            </div>
          ` : ''}

          <div style="display: grid; grid-template-columns: 28px 1fr 1fr 56px 28px; gap: 8px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); padding: 0 12px 6px 12px;">
            <div>SET</div>
            <div>WEIGHT (KG)</div>
            <div>REPS</div>
            <div style="text-align: center;">DONE</div>
            <div></div>
          </div>

          ${ex.sets.map((set, setIndex) => `
            <div class="set-row" style="display: grid; grid-template-columns: 28px 1fr 1fr 56px 28px; gap: 8px;">
              <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-secondary); display: flex; align-items: center;">#${setIndex + 1}</div>

              <input type="number" class="form-input weight-input" data-ex="${exIndex}" data-set="${setIndex}" value="${set.weight}" step="0.5" min="0" style="padding: 6px 8px; font-size: 0.85rem;">

              <input type="number" class="form-input reps-input" data-ex="${exIndex}" data-set="${setIndex}" value="${set.reps}" style="padding: 6px 8px; font-size: 0.85rem;">

              <button class="set-check ${set.completed ? 'completed' : ''}" data-ex="${exIndex}" data-set="${setIndex}">
                ${set.completed ? '✓' : ''}
              </button>

              <button class="icon-btn delete-set-btn" data-ex="${exIndex}" data-set="${setIndex}" title="Remove set" style="width: 28px; height: 28px; font-size: 11px; padding: 0; color: var(--accent-rose);">🗑️</button>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>

    <!-- Add Exercise To This Session Only -->
    <div class="glass-card">
      <div class="card-title" style="margin-bottom: 4px;">+ Add Exercise</div>
      <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 12px;">
        Only added to today's session — the saved routine stays unchanged.
      </div>

      <div class="form-group" style="margin-bottom: 10px;">
        <input type="text" class="form-input" id="session-exercise-search" placeholder="🔍 Search exercises by name or muscle group...">
      </div>

      <div class="form-group">
        <select class="form-select" id="session-exercise-select" size="6" style="height: auto;">
          ${renderSessionExerciseOptions(state.exercises)}
        </select>
      </div>

      <button class="btn" id="add-session-exercise-btn" style="margin-top: 12px;">+ Add to Workout</button>
    </div>

    <!-- Finish Session Floating Action -->
    <button class="btn" id="finish-workout-btn" style="background: linear-gradient(135deg, var(--accent-emerald), #059669); font-size: 1.1rem; padding: 16px;">
      🏆 Finish & Save Workout
    </button>
  `;

  startElapsedTimer(session, container);

  // Attach Event Handlers
  container.querySelector('#cancel-active-btn')?.addEventListener('click', () => {
    if (confirm('Discard current workout session?')) {
      if (currentRestTimer) currentRestTimer.stop();
      restTimerVisible = false;
      restingExerciseIndex = null;
      stopElapsedTimer();
      appState.cancelActiveWorkout();
    }
  });

  container.querySelector('#finish-workout-btn')?.addEventListener('click', () => {
    if (currentRestTimer) currentRestTimer.stop();
    restTimerVisible = false;
    restingExerciseIndex = null;
    stopElapsedTimer();
    appState.finishActiveWorkout();
  });

  // Set Checkbox click -> completes set and triggers Rest Timer
  container.querySelectorAll('.set-check').forEach(btn => {
    btn.addEventListener('click', () => {
      const exIdx = parseInt(btn.getAttribute('data-ex'), 10);
      const setIdx = parseInt(btn.getAttribute('data-set'), 10);

      const targetSet = session.exercises[exIdx].sets[setIdx];
      targetSet.completed = !targetSet.completed;

      appState.updateActiveWorkout(session);

      // Mark which exercise should show the widget *before* re-rendering, so the
      // render below actually includes it in that exercise's card.
      if (targetSet.completed) {
        restingExerciseIndex = exIdx;
        restTimerVisible = true;
      }

      // Re-render first so the countdown (started below) is the last thing to touch
      // the DOM — starting it before this render meant the render's static "00:00"
      // placeholder would immediately stomp the correct just-started digits.
      renderActiveWorkoutView(container);

      // Trigger Rest Timer when completing a set, using this exercise's own rest time
      if (targetSet.completed) {
        startRestCountdown(session.exercises[exIdx].restSeconds || 60, container);
      }
    });
  });

  // Input listeners for weight & reps updates
  container.querySelectorAll('.weight-input').forEach(input => {
    input.addEventListener('change', () => {
      const exIdx = parseInt(input.getAttribute('data-ex'), 10);
      const setIdx = parseInt(input.getAttribute('data-set'), 10);
      session.exercises[exIdx].sets[setIdx].weight = parseFloat(input.value || 0);
      appState.updateActiveWorkout(session);
    });
  });

  container.querySelectorAll('.reps-input').forEach(input => {
    input.addEventListener('change', () => {
      const exIdx = parseInt(input.getAttribute('data-ex'), 10);
      const setIdx = parseInt(input.getAttribute('data-set'), 10);
      session.exercises[exIdx].sets[setIdx].reps = parseInt(input.value || 0, 10);
      appState.updateActiveWorkout(session);
    });
  });

  // Rest time selector per exercise
  container.querySelectorAll('.rest-time-select').forEach(select => {
    select.addEventListener('change', () => {
      const exIdx = parseInt(select.getAttribute('data-ex'), 10);
      session.exercises[exIdx].restSeconds = parseInt(select.value, 10);
      appState.updateActiveWorkout(session);
    });
  });

  // Add Set button listener
  container.querySelectorAll('.add-set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const exIdx = parseInt(btn.getAttribute('data-ex'), 10);
      const lastSet = session.exercises[exIdx].sets[session.exercises[exIdx].sets.length - 1] || { reps: 10, weight: 20 };
      session.exercises[exIdx].sets.push({
        setNum: session.exercises[exIdx].sets.length + 1,
        reps: lastSet.reps,
        weight: lastSet.weight,
        completed: false
      });
      appState.updateActiveWorkout(session);
      renderActiveWorkoutView(container);
    });
  });

  // Remove a single set row from an exercise
  container.querySelectorAll('.delete-set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const exIdx = parseInt(btn.getAttribute('data-ex'), 10);
      const setIdx = parseInt(btn.getAttribute('data-set'), 10);
      session.exercises[exIdx].sets.splice(setIdx, 1);
      appState.updateActiveWorkout(session);
      renderActiveWorkoutView(container);
    });
  });

  // Remove an entire exercise from this workout session
  container.querySelectorAll('.delete-exercise-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const exIdx = parseInt(btn.getAttribute('data-ex'), 10);
      const exName = session.exercises[exIdx]?.name || 'this exercise';
      if (confirm(`Remove "${exName}" from this workout?`)) {
        // Deleting the exercise currently resting would otherwise leave the
        // countdown running with nowhere left to render its widget.
        if (restingExerciseIndex === exIdx) {
          if (currentRestTimer) currentRestTimer.stop();
          restTimerVisible = false;
          restingExerciseIndex = null;
        }
        session.exercises.splice(exIdx, 1);
        appState.updateActiveWorkout(session);
        renderActiveWorkoutView(container);
      }
    });
  });

  // Search filter for the session-only exercise picker
  container.querySelector('#session-exercise-search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = (state.exercises || []).filter(ex =>
      ex.name.toLowerCase().includes(query) || ex.category.toLowerCase().includes(query)
    );
    container.querySelector('#session-exercise-select').innerHTML = renderSessionExerciseOptions(filtered);
  });

  // Adds an exercise to *this session only* — 3 sets x 12 reps default, never
  // touches the underlying routine template.
  container.querySelector('#add-session-exercise-btn')?.addEventListener('click', () => {
    const exerciseId = container.querySelector('#session-exercise-select').value;
    if (!exerciseId) return;

    const exMeta = (state.exercises || []).find(e => e.id === exerciseId);
    if (!exMeta) return;

    const sets = [];
    for (let i = 0; i < 3; i++) {
      sets.push({ setNum: i + 1, reps: 12, weight: 0, completed: false });
    }

    session.exercises.push({
      name: exMeta.name,
      category: exMeta.category || 'General',
      repRange: null,
      restSeconds: 120,
      sets: sets
    });

    appState.updateActiveWorkout(session);
    renderActiveWorkoutView(container);
  });

  // Rest Timer Controls
  container.querySelector('#add-10s-btn')?.addEventListener('click', () => {
    if (currentRestTimer) currentRestTimer.addTime(10);
  });

  container.querySelector('#skip-rest-btn')?.addEventListener('click', () => {
    if (currentRestTimer) {
      currentRestTimer.stop();
      restTimerVisible = false;
      restingExerciseIndex = null;
      const widget = container.querySelector('#rest-timer-widget');
      if (widget) widget.style.display = 'none';
    }
  });
}

// Ticking mm:ss clock counting up from session.startTime — recomputed from the
// absolute timestamp each tick so it can't drift. Called on every render (not
// just the first), so it always immediately resyncs the freshly-rendered
// digits element (otherwise it'd sit on the template's static "00:00"
// placeholder until the next scheduled tick, up to a second later — same
// class of bug the rest-timer digits had). Only keeps one underlying
// setInterval alive per session, re-querying its DOM target fresh each tick
// so it survives this view's frequent full re-renders.
function startElapsedTimer(session, container) {
  const updateDigits = () => {
    const el = container.querySelector('#elapsed-timer-digits');
    if (!el) return;
    const elapsedSecs = Math.max(0, Math.floor((Date.now() - session.startTime) / 1000));
    const mins = Math.floor(elapsedSecs / 60);
    const secs = elapsedSecs % 60;
    el.textContent = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  updateDigits();

  if (elapsedTimerId && elapsedTimerSessionId === session.id) return;
  stopElapsedTimer();
  elapsedTimerSessionId = session.id;
  elapsedTimerId = setInterval(updateDigits, 1000);
}

function stopElapsedTimer() {
  if (elapsedTimerId) {
    clearInterval(elapsedTimerId);
    elapsedTimerId = null;
  }
  elapsedTimerSessionId = null;
}

function startRestCountdown(seconds, container) {
  if (currentRestTimer) currentRestTimer.stop();

  // Re-query the widget/digits elements fresh on every tick rather than caching
  // them once — a set-check or add-set click re-renders this whole view (rebuilding
  // container.innerHTML) while the countdown keeps running, which would otherwise
  // orphan a cached reference and freeze the visible digits on the stale placeholder.
  const showWidget = () => {
    const widget = container.querySelector('#rest-timer-widget');
    if (widget) widget.style.display = 'block';
  };
  showWidget();

  currentRestTimer = new RestTimer(
    (secsLeft) => {
      showWidget();
      const digits = container.querySelector('#rest-timer-digits');
      if (digits) {
        const mins = Math.floor(secsLeft / 60);
        const s = secsLeft % 60;
        digits.textContent = `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    },
    () => {
      restTimerVisible = false;
      restingExerciseIndex = null;
      const widget = container.querySelector('#rest-timer-widget');
      if (widget) widget.style.display = 'none';
    }
  );

  currentRestTimer.start(seconds);
}

// Builds <option>s from 0:00 to 5:00 in 5-second steps, e.g. "1:35".
function renderRestOptions(selectedSeconds) {
  let html = '';
  for (let s = 0; s <= 300; s += 5) {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    const label = `${mins}:${String(secs).padStart(2, '0')}`;
    html += `<option value="${s}" ${s === selectedSeconds ? 'selected' : ''}>${label}</option>`;
  }
  return html;
}

function renderSessionExerciseOptions(list) {
  if (!list || list.length === 0) {
    return `<option value="" disabled selected>No exercises match your search</option>`;
  }
  return list.map(ex => `<option value="${ex.id}">${ex.name} (${ex.category})</option>`).join('');
}
