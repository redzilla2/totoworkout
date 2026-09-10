import { appState } from '../state.js';
import { DEFAULT_EXERCISES } from '../data/exercises.js';
import { isCardioCategory, renderRoutineOptionGroups } from '../utils/helpers.js';
import { enableDragReorder, moveArrayItem } from '../utils/dragReorder.js';

// Hidden Master Admin page — a master routine catalog editor + a user
// list/delete panel, both restricted to appState.isAdmin(). Real enforcement
// lives server-side (RLS on master_routines, the auth check inside
// admin_list_users()/admin_delete_user() — see supabase/schema.sql); the
// guard in this file is only about not showing the page to anyone else.
//
// Deliberately NOT reactive like the rest of the app: edits here build up in
// local module state and only reach Supabase when the admin explicitly hits
// Save/Delete, since a routine save here can affect every future signup —
// worth a deliberate action, not an autosave-on-keystroke.

let activeTab = 'routines';

// Routines tab state
let masterRoutines = null; // null = not loaded yet
let loadError = null;
let selectedRoutineId = null;
let saveStatus = null; // null | 'saving' | 'saved' | { error }
let confirmingDeleteRoutine = false;

// Users tab state
let usersList = null; // null = not loaded yet
let usersError = null;
let usersLoading = false;
let confirmingDeleteUserId = null;
let userActionStatus = null; // null | 'deleting' | { error }

function resetModuleState() {
  activeTab = 'routines';
  masterRoutines = null;
  loadError = null;
  selectedRoutineId = null;
  saveStatus = null;
  confirmingDeleteRoutine = false;
  usersList = null;
  usersError = null;
  usersLoading = false;
  confirmingDeleteUserId = null;
  userActionStatus = null;
}

export function renderAdminView(container) {
  if (!appState.isAdmin()) {
    // Not shown via nav to a non-admin in the first place — this is just a
    // defensive fallback if currentView somehow ends up 'admin' anyway.
    container.innerHTML = `
      <div class="glass-card" style="text-align: center; padding: 30px 16px;">
        <div style="font-size: 32px; margin-bottom: 8px;">🔒</div>
        <div style="font-weight: 700;">Not authorized</div>
      </div>
    `;
    return;
  }

  if (masterRoutines === null && loadError === null) {
    loadMasterRoutines(container);
    container.innerHTML = `<div class="glass-card" style="text-align: center; padding: 30px 16px; color: var(--text-muted);">Loading master catalog…</div>`;
    return;
  }

  container.innerHTML = `
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title">🔐 Master Admin</div>
        <button class="btn btn-secondary" id="admin-back-btn" style="width: auto; padding: 6px 12px; font-size: 0.8rem;">← Back</button>
      </div>
      <div style="display: flex; gap: 6px;">
        <button class="admin-tab-btn" data-tab="routines" style="flex: 1; padding: 10px 4px; border-radius: var(--radius-md); border: 1px solid ${activeTab === 'routines' ? 'var(--accent-primary)' : 'var(--border-glass)'}; background: ${activeTab === 'routines' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)'}; color: var(--text-primary); font-weight: 700; font-size: 0.8rem; cursor: pointer; font-family: inherit;">📋 Master Routines</button>
        <button class="admin-tab-btn" data-tab="users" style="flex: 1; padding: 10px 4px; border-radius: var(--radius-md); border: 1px solid ${activeTab === 'users' ? 'var(--accent-primary)' : 'var(--border-glass)'}; background: ${activeTab === 'users' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)'}; color: var(--text-primary); font-weight: 700; font-size: 0.8rem; cursor: pointer; font-family: inherit;">👥 Users</button>
      </div>
    </div>

    ${activeTab === 'routines' ? renderRoutinesTab() : renderUsersTab()}
  `;

  container.querySelector('#admin-back-btn')?.addEventListener('click', () => {
    resetModuleState();
    appState.setView('analytics');
  });

  container.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab');
      if (activeTab === 'users' && usersList === null && !usersLoading) {
        loadUsers(container);
      }
      renderAdminView(container);
    });
  });

  if (activeTab === 'routines') attachRoutinesHandlers(container);
  else attachUsersHandlers(container);
}

async function loadMasterRoutines(container) {
  try {
    const routines = await appState.loadMasterRoutinesForAdmin();
    masterRoutines = routines;
    if (!selectedRoutineId && routines.length > 0) selectedRoutineId = routines[0].id;
    loadError = null;
  } catch (err) {
    console.error('Failed to load master routines:', err);
    loadError = err.message || 'Failed to load';
  }
  renderAdminView(container);
}

// ---------------------------------------------------------------------------
// Routines tab
// ---------------------------------------------------------------------------

function renderRoutinesTab() {
  if (loadError) {
    return `<div class="glass-card" style="color: var(--accent-rose); text-align: center;">⚠️ ${loadError}</div>`;
  }

  const routines = masterRoutines || [];
  const selected = routines.find(r => r.id === selectedRoutineId) || null;

  return `
    <div class="glass-card">
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 14px;">
        Edits here only seed <strong>brand-new signups</strong> going forward — existing users' already-saved routines are never touched.
      </div>

      <div class="form-group" style="margin-bottom: 12px;">
        <label class="form-label">Routine</label>
        <div style="display: flex; gap: 8px;">
          <select class="form-select" id="admin-routine-select" style="flex: 1;">
            ${renderRoutineOptionGroups(routines)}
          </select>
          <button class="btn btn-secondary" id="admin-new-routine-btn" style="width: auto; padding: 8px 12px; white-space: nowrap;">+ New</button>
        </div>
      </div>

      ${selected ? renderRoutineEditor(selected) : `<div style="text-align: center; color: var(--text-muted); padding: 16px;">No routines yet — add one above.</div>`}

      <div style="display: flex; gap: 8px; margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px;">
        <button class="btn" id="admin-save-routines-btn" style="flex: 1;">💾 Save to Master Catalog</button>
      </div>
      ${renderSaveStatus()}
    </div>
  `;
}

function renderSaveStatus() {
  if (saveStatus === 'saving') return `<div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 8px; text-align: center;">Saving…</div>`;
  if (saveStatus === 'saved') return `<div style="font-size: 0.78rem; color: var(--accent-emerald, #10b981); margin-top: 8px; text-align: center;">✓ Saved</div>`;
  if (saveStatus && saveStatus.error) return `<div style="font-size: 0.78rem; color: var(--accent-rose); margin-top: 8px; text-align: center;">⚠️ ${saveStatus.error}</div>`;
  return '';
}

function renderRoutineEditor(routine) {
  return `
    <div style="display: flex; gap: 8px; margin-bottom: 10px;">
      <input type="text" class="form-input" id="admin-routine-name" value="${escapeAttr(routine.name)}" placeholder="Routine name" style="flex: 2;">
      <input type="text" class="form-input" id="admin-routine-icon" value="${escapeAttr(routine.icon || '')}" placeholder="🏋️" style="flex: 0 0 56px; text-align: center;">
    </div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px; align-items: center;">
      <input type="text" class="form-input" id="admin-routine-category" value="${escapeAttr(routine.category || '')}" placeholder="Category label (e.g. Push, Legs)" style="flex: 1;">
      <input type="color" id="admin-routine-color" value="${routine.color || '#6366f1'}" style="width: 40px; height: 40px; padding: 2px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); background: transparent; cursor: pointer;">
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
      ${routine.exercises.length > 0 ? routine.exercises.map((exItem, idx) => {
        const exMeta = DEFAULT_EXERCISES.find(e => e.id === exItem.exerciseId);
        const exName = exMeta ? exMeta.name : exItem.exerciseId;
        const cardio = isCardioCategory(exMeta?.category);
        return `
          <div class="exercise-card" style="background: rgba(15, 23, 42, 0.6); padding: 10px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 4px; min-width: 0;">
                <span class="drag-handle" title="Drag to reorder">⠿</span>
                <div style="font-weight: 700; font-size: 0.9rem;">${cardio ? '🏃' : ''} ${exName}</div>
              </div>
              <button class="icon-btn admin-remove-exercise-btn" data-idx="${idx}" title="Remove" style="width: 28px; height: 28px; font-size: 12px; color: var(--accent-rose);">🗑️</button>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
              ${cardio ? `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <input type="number" class="form-input admin-exercise-minutes-input" data-idx="${idx}" value="${exItem.defaultMinutes || 20}" min="1" style="width: 54px; padding: 4px 6px; font-size: 0.82rem; text-align: center;">
                  <span style="color: var(--text-muted);">min</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <input type="number" class="form-input admin-exercise-calories-input" data-idx="${idx}" value="${exItem.defaultCalories || 150}" min="0" style="width: 54px; padding: 4px 6px; font-size: 0.82rem; text-align: center;">
                  <span style="color: var(--text-muted);">cal</span>
                </div>
              ` : `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <input type="number" class="form-input admin-exercise-sets-input" data-idx="${idx}" value="${exItem.defaultSets || 3}" min="1" style="width: 54px; padding: 4px 6px; font-size: 0.82rem; text-align: center;">
                  <span style="color: var(--text-muted);">sets</span>
                </div>
                <span style="color: var(--text-muted);">×</span>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <input type="number" class="form-input admin-exercise-reps-input" data-idx="${idx}" value="${exItem.defaultReps || 10}" min="1" style="width: 54px; padding: 4px 6px; font-size: 0.82rem; text-align: center;">
                  <span style="color: var(--text-muted);">reps</span>
                </div>
              `}
            </div>
          </div>
        `;
      }).join('') : `<div style="font-size: 0.82rem; color: var(--text-muted); text-align: center; padding: 12px;">No exercises yet — add one below.</div>`}
    </div>

    <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 14px; margin-bottom: 14px;">
      <div style="font-size: 0.82rem; font-weight: 700; color: #a5b4fc; margin-bottom: 10px;">+ ADD EXERCISE</div>

      <div class="form-group" style="margin-bottom: 10px;">
        <input type="text" class="form-input" id="admin-new-exercise-search" placeholder="🔍 Search exercises by name or muscle group...">
      </div>

      <div class="form-group">
        <select class="form-select" id="admin-new-exercise-select" size="6" style="height: auto;">
          ${renderExerciseOptions(DEFAULT_EXERCISES)}
        </select>
      </div>

      <div id="admin-new-exercise-strength-fields" style="display: flex; gap: 8px; margin-bottom: 12px;">
        <div style="flex: 1;">
          <label class="form-label">Sets</label>
          <input type="number" class="form-input" id="admin-new-exercise-sets" value="3" min="1">
        </div>
        <div style="flex: 1;">
          <label class="form-label">Reps</label>
          <input type="number" class="form-input" id="admin-new-exercise-reps" value="10" min="1">
        </div>
      </div>

      <div id="admin-new-exercise-cardio-fields" style="display: none; gap: 8px; margin-bottom: 12px;">
        <div style="flex: 1;">
          <label class="form-label">Minutes</label>
          <input type="number" class="form-input" id="admin-new-exercise-minutes" value="20" min="1">
        </div>
        <div style="flex: 1;">
          <label class="form-label">Calories</label>
          <input type="number" class="form-input" id="admin-new-exercise-calories" value="150" min="0">
        </div>
      </div>

      <button class="btn btn-secondary" id="admin-add-exercise-btn">+ Add Exercise</button>
    </div>

    ${confirmingDeleteRoutine ? `
      <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.35); border-radius: var(--radius-md); padding: 10px 12px; margin-bottom: 4px;">
        <div style="font-size: 0.8rem; margin-bottom: 8px;">Delete "${escapeAttr(routine.name)}" from the master catalog?</div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" id="admin-cancel-delete-routine-btn" style="flex: 1;">Cancel</button>
          <button class="btn btn-danger" id="admin-confirm-delete-routine-btn" style="flex: 1;">Yes, Delete</button>
        </div>
      </div>
    ` : `
      <button class="btn btn-danger" id="admin-delete-routine-btn" style="width: 100%;">🗑️ Delete This Routine</button>
    `}
  `;
}

function renderExerciseOptions(list) {
  if (list.length === 0) {
    return `<option value="" disabled selected>No exercises match your search</option>`;
  }
  return list.map(ex => `<option value="${ex.id}">${ex.name} (${ex.category})</option>`).join('');
}

function attachRoutinesHandlers(container) {
  const routines = masterRoutines || [];
  const selected = routines.find(r => r.id === selectedRoutineId) || null;

  container.querySelector('#admin-routine-select')?.addEventListener('change', (e) => {
    selectedRoutineId = e.target.value;
    confirmingDeleteRoutine = false;
    renderAdminView(container);
  });
  const selectEl = container.querySelector('#admin-routine-select');
  if (selectEl && selectedRoutineId) selectEl.value = selectedRoutineId;

  container.querySelector('#admin-new-routine-btn')?.addEventListener('click', () => {
    const routine = {
      id: 'master_' + Date.now(),
      name: 'New Routine',
      icon: '🏋️',
      color: '#6366f1',
      category: '',
      exercises: []
    };
    masterRoutines = [...routines, routine];
    selectedRoutineId = routine.id;
    saveStatus = null;
    renderAdminView(container);
  });

  if (!selected) return;

  enableDragReorder(container, {
    itemSelector: '.exercise-card',
    handleSelector: '.drag-handle',
    onReorder: (fromIndex, toIndex) => {
      moveArrayItem(selected.exercises, fromIndex, toIndex);
      saveStatus = null;
      renderAdminView(container);
    }
  });

  container.querySelector('#admin-routine-name')?.addEventListener('change', (e) => {
    selected.name = e.target.value.trim() || selected.name;
    saveStatus = null;
    renderAdminView(container);
  });
  container.querySelector('#admin-routine-icon')?.addEventListener('change', (e) => {
    selected.icon = e.target.value.trim();
    saveStatus = null;
    renderAdminView(container);
  });
  container.querySelector('#admin-routine-category')?.addEventListener('change', (e) => {
    selected.category = e.target.value.trim();
    saveStatus = null;
    renderAdminView(container);
  });
  container.querySelector('#admin-routine-color')?.addEventListener('change', (e) => {
    selected.color = e.target.value;
    saveStatus = null;
    renderAdminView(container);
  });

  container.querySelectorAll('.admin-remove-exercise-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      selected.exercises.splice(idx, 1);
      saveStatus = null;
      renderAdminView(container);
    });
  });

  container.querySelectorAll('.admin-exercise-sets-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      selected.exercises[idx].defaultSets = parseInt(input.value || '1', 10) || 1;
      saveStatus = null;
    });
  });
  container.querySelectorAll('.admin-exercise-reps-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      selected.exercises[idx].defaultReps = parseInt(input.value || '1', 10) || 1;
      saveStatus = null;
    });
  });
  container.querySelectorAll('.admin-exercise-minutes-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      selected.exercises[idx].defaultMinutes = parseInt(input.value || '1', 10) || 1;
      saveStatus = null;
    });
  });
  container.querySelectorAll('.admin-exercise-calories-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.getAttribute('data-idx'), 10);
      selected.exercises[idx].defaultCalories = parseInt(input.value || '0', 10) || 0;
      saveStatus = null;
    });
  });

  function updateAddExerciseFieldsVisibility() {
    const select = container.querySelector('#admin-new-exercise-select');
    const exMeta = DEFAULT_EXERCISES.find(e => e.id === select?.value);
    const cardio = isCardioCategory(exMeta?.category);
    const strengthFields = container.querySelector('#admin-new-exercise-strength-fields');
    const cardioFields = container.querySelector('#admin-new-exercise-cardio-fields');
    if (strengthFields) strengthFields.style.display = cardio ? 'none' : 'flex';
    if (cardioFields) cardioFields.style.display = cardio ? 'flex' : 'none';
  }
  updateAddExerciseFieldsVisibility();

  container.querySelector('#admin-new-exercise-select')?.addEventListener('change', updateAddExerciseFieldsVisibility);

  container.querySelector('#admin-new-exercise-search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = DEFAULT_EXERCISES.filter(ex =>
      ex.name.toLowerCase().includes(query) || ex.category.toLowerCase().includes(query)
    );
    container.querySelector('#admin-new-exercise-select').innerHTML = renderExerciseOptions(filtered);
    updateAddExerciseFieldsVisibility();
  });

  container.querySelector('#admin-add-exercise-btn')?.addEventListener('click', () => {
    const exerciseId = container.querySelector('#admin-new-exercise-select').value;
    if (!exerciseId) return;
    const exMeta = DEFAULT_EXERCISES.find(e => e.id === exerciseId);
    const cardio = isCardioCategory(exMeta?.category);

    if (cardio) {
      const minutes = parseInt(container.querySelector('#admin-new-exercise-minutes').value || '20', 10);
      const calories = parseInt(container.querySelector('#admin-new-exercise-calories').value || '150', 10);
      selected.exercises.push({ exerciseId, defaultSets: 1, defaultMinutes: minutes || 20, defaultCalories: calories || 0 });
    } else {
      const sets = parseInt(container.querySelector('#admin-new-exercise-sets').value || '3', 10);
      const reps = parseInt(container.querySelector('#admin-new-exercise-reps').value || '10', 10);
      selected.exercises.push({ exerciseId, defaultSets: sets || 3, defaultReps: reps || 10, defaultWeight: 0 });
    }
    saveStatus = null;
    renderAdminView(container);
  });

  container.querySelector('#admin-delete-routine-btn')?.addEventListener('click', () => {
    confirmingDeleteRoutine = true;
    renderAdminView(container);
  });
  container.querySelector('#admin-cancel-delete-routine-btn')?.addEventListener('click', () => {
    confirmingDeleteRoutine = false;
    renderAdminView(container);
  });
  container.querySelector('#admin-confirm-delete-routine-btn')?.addEventListener('click', () => {
    masterRoutines = routines.filter(r => r.id !== selected.id);
    selectedRoutineId = masterRoutines.length > 0 ? masterRoutines[0].id : null;
    confirmingDeleteRoutine = false;
    saveStatus = null;
    renderAdminView(container);
  });

  container.querySelector('#admin-save-routines-btn')?.addEventListener('click', async () => {
    saveStatus = 'saving';
    renderAdminView(container);
    try {
      await appState.saveMasterRoutines(masterRoutines);
      saveStatus = 'saved';
    } catch (err) {
      console.error('Failed to save master routines:', err);
      saveStatus = { error: err.message || 'Failed to save' };
    }
    renderAdminView(container);
  });
}

// ---------------------------------------------------------------------------
// Users tab
// ---------------------------------------------------------------------------

async function loadUsers(container) {
  usersLoading = true;
  usersError = null;
  try {
    usersList = await appState.adminListUsers();
  } catch (err) {
    console.error('Failed to load users:', err);
    usersError = err.message || 'Failed to load users';
    usersList = null;
  }
  usersLoading = false;
  renderAdminView(container);
}

function renderUsersTab() {
  const myEmail = (appState.getUserEmail() || '').toLowerCase();

  return `
    <div class="glass-card">
      <div class="card-title" style="margin-bottom: 12px;">Registered Users</div>

      ${usersLoading ? `<div style="text-align: center; color: var(--text-muted); padding: 16px;">Loading…</div>` : ''}
      ${usersError ? `<div style="color: var(--accent-rose); text-align: center; padding: 8px;">⚠️ ${usersError}</div>` : ''}
      ${userActionStatus && userActionStatus.error ? `<div style="color: var(--accent-rose); text-align: center; padding: 8px; font-size: 0.8rem;">⚠️ ${userActionStatus.error}</div>` : ''}

      ${!usersLoading && usersList ? `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${usersList.length === 0 ? `<div style="text-align: center; color: var(--text-muted); padding: 16px;">No users found.</div>` : usersList.map(u => {
            const isSelf = (u.email || '').toLowerCase() === myEmail;
            return `
              <div style="background: rgba(15, 23, 42, 0.6); padding: 10px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                  <div style="min-width: 0;">
                    <div style="font-weight: 700; font-size: 0.88rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeAttr(u.email || '(no email)')}${isSelf ? ' <span style="color: var(--text-muted); font-weight: 400;">(you)</span>' : ''}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                      Joined ${formatShortDate(u.created_at)}${u.last_sign_in_at ? ` · Last in ${formatShortDate(u.last_sign_in_at)}` : ''}
                    </div>
                  </div>
                  ${!isSelf ? `<button class="icon-btn admin-delete-user-btn" data-id="${u.id}" title="Delete account" style="width: 32px; height: 32px; font-size: 13px; color: var(--accent-rose); flex-shrink: 0;">🗑️</button>` : ''}
                </div>
                ${confirmingDeleteUserId === u.id ? `
                  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(244, 63, 94, 0.25);">
                    <div style="font-size: 0.78rem; margin-bottom: 8px;">Permanently delete this account and all its data? This can't be undone.</div>
                    <div style="display: flex; gap: 8px;">
                      <button class="btn btn-secondary admin-cancel-delete-user-btn" style="flex: 1; padding: 6px;">Cancel</button>
                      <button class="btn btn-danger admin-confirm-delete-user-btn" data-id="${u.id}" style="flex: 1; padding: 6px;" ${userActionStatus === 'deleting' ? 'disabled' : ''}>${userActionStatus === 'deleting' ? 'Deleting…' : 'Yes, Delete'}</button>
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function attachUsersHandlers(container) {
  container.querySelectorAll('.admin-delete-user-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      confirmingDeleteUserId = btn.getAttribute('data-id');
      userActionStatus = null;
      renderAdminView(container);
    });
  });

  container.querySelectorAll('.admin-cancel-delete-user-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      confirmingDeleteUserId = null;
      renderAdminView(container);
    });
  });

  container.querySelectorAll('.admin-confirm-delete-user-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      userActionStatus = 'deleting';
      renderAdminView(container);
      try {
        await appState.adminDeleteUser(id);
        usersList = usersList.filter(u => u.id !== id);
        confirmingDeleteUserId = null;
        userActionStatus = null;
      } catch (err) {
        console.error('Failed to delete user:', err);
        userActionStatus = { error: err.message || 'Failed to delete user' };
      }
      renderAdminView(container);
    });
  });
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatShortDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
