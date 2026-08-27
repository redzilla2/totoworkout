import { appState } from '../state.js';

export function renderRoutinesView(container) {
  const state = appState.getState();
  const routines = state.routines || [];
  const exercises = state.exercises || [];

  container.innerHTML = `
    <!-- Workout Routines Section -->
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title">🏋️ Anthony's Workout Routines</div>
        <button class="btn btn-secondary" id="create-routine-modal-btn" style="width: auto; padding: 6px 12px; font-size: 0.8rem;">
          + New Routine
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${routines.map(r => `
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-glass); border-left: 4px solid ${r.color || '#6366f1'}; border-radius: var(--radius-md); padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div>
                <span style="font-weight: 800; font-size: 1.1rem;">${r.icon || '🔥'} ${r.name}</span>
                <span class="badge" style="background: ${r.color || '#6366f1'}22; color: ${r.color || '#6366f1'}; margin-left: 8px;">${r.category}</span>
              </div>
              <button class="icon-btn delete-routine-btn" data-id="${r.id}" style="width: 28px; height: 28px; font-size: 12px; color: var(--accent-rose);">🗑️</button>
            </div>

            <details style="margin-bottom: 12px;">
              <summary style="font-size: 0.82rem; color: var(--text-secondary); cursor: pointer;">
                ${r.exercises ? r.exercises.length : 0} exercises included
              </summary>
              <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
                ${(r.exercises || []).map(exItem => {
                  const exMeta = exercises.find(e => e.id === exItem.exerciseId);
                  const exName = exMeta ? exMeta.name : exItem.exerciseId;
                  const repsLabel = exItem.repRange
                    ? (exItem.repRange === 'triset' ? 'triset' : `${exItem.repRange} reps`)
                    : `${exItem.defaultReps || 10} reps`;
                  return `
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                      <span>${exName}</span>
                      <span style="color: var(--text-muted);">${exItem.defaultSets || 3} × ${repsLabel}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </details>

            <button class="btn start-routine-btn" data-id="${r.id}" style="padding: 8px 16px; font-size: 0.85rem; background: linear-gradient(135deg, ${r.color || '#6366f1'}, var(--accent-secondary));">
              ▶ Start Workout Session
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Exercise Database Library -->
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title">📖 Dumbbell Exercise Library (${exercises.length})</div>
      </div>

      <div class="form-group" style="margin-bottom: 12px;">
        <input type="text" class="form-input" id="exercise-search-input" placeholder="🔍 Search exercises by name or muscle group...">
      </div>

      <div id="exercise-list-container" style="display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto;">
        ${renderExerciseList(exercises)}
      </div>
    </div>
  `;

  // Attach Event Handlers
  container.querySelectorAll('.start-routine-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const routineId = btn.getAttribute('data-id');
      const routine = routines.find(r => r.id === routineId);
      if (routine) {
        appState.startWorkoutFromRoutine(routine);
      }
    });
  });

  container.querySelectorAll('.delete-routine-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const routineId = btn.getAttribute('data-id');
      if (confirm('Delete this workout routine template?')) {
        appState.deleteRoutine(routineId);
      }
    });
  });

  // Search input filter
  const searchInput = container.querySelector('#exercise-search-input');
  const exListContainer = container.querySelector('#exercise-list-container');
  if (searchInput && exListContainer) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = exercises.filter(ex => 
        ex.name.toLowerCase().includes(query) || ex.category.toLowerCase().includes(query)
      );
      exListContainer.innerHTML = renderExerciseList(filtered);
    });
  }

  // Custom Routine Creator Launcher
  container.querySelector('#create-routine-modal-btn')?.addEventListener('click', () => {
    openCreateRoutineModal();
  });
}

function renderExerciseList(exercises) {
  if (exercises.length === 0) {
    return `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No exercises found matching search.</div>`;
  }
  return exercises.map(ex => `
    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.6); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
      <div>
        <div style="font-weight: 700; font-size: 0.9rem;">${ex.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${ex.equipment || 'Dumbbell'} • ${ex.defaultRest || 60}s rest</div>
      </div>
      <span class="badge" style="background: rgba(99, 102, 241, 0.15); color: #a5b4fc;">${ex.category}</span>
    </div>
  `).join('');
}

// Custom Routine Creator Modal
function openCreateRoutineModal() {
  const exercises = appState.getState().exercises || [];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">Create Custom Routine</div>
        <button class="icon-btn" id="close-routine-modal">✕</button>
      </div>

      <form id="create-routine-form">
        <div class="form-group">
          <label class="form-label">Routine Name</label>
          <input type="text" class="form-input" id="r-name" placeholder="e.g. Upper Body Hypertrophy" required>
        </div>

        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" id="r-category">
            <option value="Push / Upper">Push / Upper</option>
            <option value="Legs / Core">Legs / Core</option>
            <option value="Arms">Arms</option>
            <option value="Full Body">Full Body</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Select Exercises</label>
          <div style="max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px;" id="routine-ex-checkboxes">
            ${exercises.map(ex => `
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; background: rgba(15, 23, 42, 0.6); padding: 8px; border-radius: var(--radius-sm);">
                <input type="checkbox" value="${ex.id}" data-name="${ex.name}">
                <span>${ex.name} <small style="color: var(--text-muted);">(${ex.category})</small></span>
              </label>
            `).join('')}
          </div>
        </div>

        <button type="submit" class="btn" style="margin-top: 12px;">Save Routine Template</button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#close-routine-modal').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  overlay.querySelector('#create-routine-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = overlay.querySelector('#r-name').value;
    const category = overlay.querySelector('#r-category').value;
    const checkedBoxes = overlay.querySelectorAll('#routine-ex-checkboxes input:checked');

    const selectedEx = Array.from(checkedBoxes).map(cb => ({
      exerciseId: cb.value,
      defaultSets: 3,
      defaultReps: 10,
      defaultWeight: 20
    }));

    if (selectedEx.length === 0) {
      alert('Please select at least one exercise for this routine.');
      return;
    }

    const categoryColors = {
      'Push / Upper': '#3b82f6', 'Legs / Core': '#10b981', 'Arms': '#8b5cf6', 'Full Body': '#f59e0b'
    };

    appState.addRoutine({
      id: 'routine_' + Date.now(),
      name: name,
      category: category,
      icon: '🔥',
      color: categoryColors[category] || '#6366f1',
      exercises: selectedEx
    });

    document.body.removeChild(overlay);
  });
}
