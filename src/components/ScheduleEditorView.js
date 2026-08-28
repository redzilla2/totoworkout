import { appState } from '../state.js';
import { DAY_NAMES, DAY_SHORT_NAMES, isCardioCategory } from '../utils/helpers.js';

// Module-level (not component-local) so the selected day survives the full
// re-renders that fire every time appState.notify() runs — same pattern
// ActiveWorkoutView uses for its rest-timer reference.
let selectedDay = new Date().getDay();

export function renderScheduleEditorView(container) {
  const state = appState.getState();
  const routines = state.routines || [];
  const exercises = state.exercises || [];
  const schedule = state.schedule || {};

  const assignedRoutineId = schedule[selectedDay] || '';
  const assignedRoutine = routines.find(r => r.id === assignedRoutineId) || null;

  container.innerHTML = `
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title">🗓️ Weekly Schedule</div>
        <button class="btn btn-secondary" id="back-to-routines-btn" style="width: auto; padding: 6px 12px; font-size: 0.8rem;">← Back</button>
      </div>
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 14px;">
        Pick a day, then add or remove exercises. Changes apply to that weekday everywhere in the calendar going forward.
      </div>

      <div style="display: flex; gap: 6px; margin-bottom: 4px;">
        ${DAY_SHORT_NAMES.map((label, i) => `
          <button class="day-pill" data-day="${i}" style="flex: 1; padding: 10px 2px; border-radius: var(--radius-md); border: 1px solid ${i === selectedDay ? 'var(--accent-primary)' : 'var(--border-glass)'}; background: ${i === selectedDay ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)'}; color: ${i === selectedDay ? 'var(--text-primary)' : 'var(--text-secondary)'}; font-weight: 700; font-size: 0.72rem; cursor: pointer; font-family: inherit; transition: all 0.2s ease;">
            ${label}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="glass-card">
      <div class="form-group" style="margin-bottom: 16px;">
        <label class="form-label">Routine for ${DAY_NAMES[selectedDay]}</label>
        <select class="form-select" id="day-routine-select">
          <option value="">— Rest Day —</option>
          ${routines.map(r => `<option value="${r.id}" ${r.id === assignedRoutineId ? 'selected' : ''}>${r.icon || ''} ${r.name}</option>`).join('')}
        </select>
      </div>

      ${assignedRoutine ? `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <span style="font-weight: 800; font-size: 1.05rem;">${assignedRoutine.icon || '🏋️'} ${assignedRoutine.name}</span>
          <span class="badge" style="background: ${assignedRoutine.color || '#6366f1'}22; color: ${assignedRoutine.color || '#6366f1'};">${assignedRoutine.category}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
          ${assignedRoutine.exercises.length > 0 ? assignedRoutine.exercises.map((exItem, idx) => {
            const exMeta = exercises.find(e => e.id === exItem.exerciseId);
            const exName = exMeta ? exMeta.name : exItem.exerciseId;
            const cardio = isCardioCategory(exMeta?.category);
            const targetHint = exItem.repRange
              ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Target: ${exItem.repRange === 'triset' ? 'triset' : `${exItem.repRange} reps`}</div>`
              : '';
            return `
              <div style="background: rgba(15, 23, 42, 0.6); padding: 10px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem;">${cardio ? '🏃' : ''} ${exName}</div>
                    ${targetHint}
                  </div>
                  <button class="icon-btn remove-exercise-btn" data-idx="${idx}" title="Remove" style="width: 28px; height: 28px; font-size: 12px; color: var(--accent-rose);">🗑️</button>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
                  ${cardio ? `
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <input type="number" class="form-input exercise-minutes-input" data-idx="${idx}" value="${exItem.defaultMinutes || 20}" min="1" style="width: 54px; padding: 4px 6px; font-size: 0.82rem; text-align: center;">
                      <span style="color: var(--text-muted);">min</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <input type="number" class="form-input exercise-calories-input" data-idx="${idx}" value="${exItem.defaultCalories || 150}" min="0" style="width: 54px; padding: 4px 6px; font-size: 0.82rem; text-align: center;">
                      <span style="color: var(--text-muted);">cal</span>
                    </div>
                  ` : `
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <input type="number" class="form-input exercise-sets-input" data-idx="${idx}" value="${exItem.defaultSets || 3}" min="1" style="width: 54px; padding: 4px 6px; font-size: 0.82rem; text-align: center;">
                      <span style="color: var(--text-muted);">sets</span>
                    </div>
                    <span style="color: var(--text-muted);">×</span>
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <input type="number" class="form-input exercise-reps-input" data-idx="${idx}" value="${exItem.defaultReps || 10}" min="1" style="width: 54px; padding: 4px 6px; font-size: 0.82rem; text-align: center;">
                      <span style="color: var(--text-muted);">reps</span>
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('') : `<div style="font-size: 0.82rem; color: var(--text-muted); text-align: center; padding: 12px;">No exercises yet — add one below.</div>`}
        </div>
      ` : `
        <div style="text-align: center; padding: 16px 10px; color: var(--text-muted); margin-bottom: 16px;">
          <div style="font-size: 28px; margin-bottom: 6px;">🛌</div>
          <div style="font-weight: 600; font-size: 0.9rem;">Rest Day</div>
          <div style="font-size: 0.8rem; margin-top: 2px;">Add an exercise below to turn this into a workout day.</div>
        </div>
      `}

      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 14px;">
        <div style="font-size: 0.82rem; font-weight: 700; color: #a5b4fc; margin-bottom: 10px;">+ ADD EXERCISE</div>

        <div class="form-group" style="margin-bottom: 10px;">
          <input type="text" class="form-input" id="new-exercise-search" placeholder="🔍 Search exercises by name or muscle group...">
        </div>

        <div class="form-group">
          <select class="form-select" id="new-exercise-select" size="6" style="height: auto;">
            ${renderExerciseOptions(exercises)}
          </select>
        </div>

        <div id="new-exercise-strength-fields" style="display: flex; gap: 8px; margin-bottom: 12px;">
          <div style="flex: 1;">
            <label class="form-label">Sets</label>
            <input type="number" class="form-input" id="new-exercise-sets" value="3" min="1">
          </div>
          <div style="flex: 1;">
            <label class="form-label">Reps</label>
            <input type="number" class="form-input" id="new-exercise-reps" value="10" min="1">
          </div>
        </div>

        <div id="new-exercise-cardio-fields" style="display: none; gap: 8px; margin-bottom: 12px;">
          <div style="flex: 1;">
            <label class="form-label">Minutes</label>
            <input type="number" class="form-input" id="new-exercise-minutes" value="20" min="1">
          </div>
          <div style="flex: 1;">
            <label class="form-label">Calories</label>
            <input type="number" class="form-input" id="new-exercise-calories" value="150" min="0">
          </div>
        </div>

        <button class="btn" id="add-exercise-btn">+ Add to ${DAY_NAMES[selectedDay]}</button>
      </div>
    </div>
  `;

  container.querySelector('#back-to-routines-btn')?.addEventListener('click', () => {
    appState.setView('routines');
  });

  container.querySelectorAll('.day-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDay = parseInt(btn.getAttribute('data-day'), 10);
      renderScheduleEditorView(container);
    });
  });

  container.querySelector('#day-routine-select')?.addEventListener('change', (e) => {
    appState.setDaySchedule(selectedDay, e.target.value || null);
  });

  container.querySelectorAll('.remove-exercise-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (assignedRoutine) appState.removeExerciseFromRoutine(assignedRoutine.id, idx);
    });
  });

  container.querySelectorAll('.exercise-sets-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      const sets = parseInt(input.value || '1', 10);
      if (assignedRoutine) appState.updateRoutineExercise(assignedRoutine.id, idx, { defaultSets: sets || 1 });
    });
  });

  container.querySelectorAll('.exercise-reps-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      const reps = parseInt(input.value || '1', 10);
      if (assignedRoutine) appState.updateRoutineExercise(assignedRoutine.id, idx, { defaultReps: reps || 1 });
    });
  });

  container.querySelectorAll('.exercise-minutes-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      const minutes = parseInt(input.value || '1', 10);
      if (assignedRoutine) appState.updateRoutineExercise(assignedRoutine.id, idx, { defaultMinutes: minutes || 1 });
    });
  });

  container.querySelectorAll('.exercise-calories-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      const calories = parseInt(input.value || '0', 10);
      if (assignedRoutine) appState.updateRoutineExercise(assignedRoutine.id, idx, { defaultCalories: calories || 0 });
    });
  });

  // Toggles which "+ ADD EXERCISE" field group is visible based on the
  // currently-selected exercise's category.
  function updateAddExerciseFieldsVisibility() {
    const select = container.querySelector('#new-exercise-select');
    const exMeta = exercises.find(e => e.id === select?.value);
    const cardio = isCardioCategory(exMeta?.category);
    const strengthFields = container.querySelector('#new-exercise-strength-fields');
    const cardioFields = container.querySelector('#new-exercise-cardio-fields');
    if (strengthFields) strengthFields.style.display = cardio ? 'none' : 'flex';
    if (cardioFields) cardioFields.style.display = cardio ? 'flex' : 'none';
  }
  updateAddExerciseFieldsVisibility();

  container.querySelector('#new-exercise-select')?.addEventListener('change', updateAddExerciseFieldsVisibility);

  container.querySelector('#new-exercise-search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = exercises.filter(ex =>
      ex.name.toLowerCase().includes(query) || ex.category.toLowerCase().includes(query)
    );
    container.querySelector('#new-exercise-select').innerHTML = renderExerciseOptions(filtered);
    updateAddExerciseFieldsVisibility();
  });

  container.querySelector('#add-exercise-btn')?.addEventListener('click', () => {
    const exerciseId = container.querySelector('#new-exercise-select').value;
    if (!exerciseId) return;

    const exMeta = exercises.find(e => e.id === exerciseId);
    const cardio = isCardioCategory(exMeta?.category);

    let targetRoutine = assignedRoutine;
    if (!targetRoutine) {
      targetRoutine = appState.createRoutineForDay(selectedDay, `${DAY_NAMES[selectedDay]} Custom`);
    }

    if (cardio) {
      const minutes = parseInt(container.querySelector('#new-exercise-minutes').value || '20', 10);
      const calories = parseInt(container.querySelector('#new-exercise-calories').value || '150', 10);
      appState.addExerciseToRoutine(targetRoutine.id, {
        exerciseId,
        defaultSets: 1,
        defaultMinutes: minutes || 20,
        defaultCalories: calories || 0
      });
    } else {
      const sets = parseInt(container.querySelector('#new-exercise-sets').value || '3', 10);
      const reps = parseInt(container.querySelector('#new-exercise-reps').value || '10', 10);
      appState.addExerciseToRoutine(targetRoutine.id, {
        exerciseId,
        defaultSets: sets || 3,
        defaultReps: reps || 10,
        defaultWeight: 0
      });
    }
  });
}

function renderExerciseOptions(list) {
  if (list.length === 0) {
    return `<option value="" disabled selected>No exercises match your search</option>`;
  }
  return list.map(ex => `<option value="${ex.id}">${ex.name} (${ex.category})</option>`).join('');
}
