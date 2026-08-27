import { appState } from '../state.js';
import { formatDisplayDate, calculateStreak, calculateTotalVolume, getScheduledRoutine } from '../utils/helpers.js';

export function renderCalendarView(container) {
  const state = appState.getState();
  const selectedDate = state.selectedDate || new Date().toISOString().split('T')[0];
  
  const curDateObj = new Date(selectedDate);
  const year = curDateObj.getFullYear();
  const month = curDateObj.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDaysInMonth = new Date(year, month, 0).getDate();

  // Only workouts you've actually completed/logged freeze a date's history — everything
  // else (including the auto-generated demo/sample data) defers to the live weekly
  // schedule, so editing the "master template" in Routines is reflected everywhere
  // until a date is actually logged.
  const selectedDateWorkouts = state.history.filter(h => h.date === selectedDate && h.userLogged);
  const streak = calculateStreak(state.history);
  const totalVol = calculateTotalVolume(state.history);
  const scheduledRoutine = selectedDateWorkouts.length === 0 ? getScheduledRoutine(state, selectedDate) : null;

  container.innerHTML = `
    <!-- Stats Header Bar -->
    <div class="glass-card" style="margin-bottom: 16px; padding: 16px;">
      <div style="display: flex; justify-content: space-around; align-items: center; text-align: center;">
        <div>
          <div style="font-size: 1.5rem; font-weight: 800; color: #f59e0b;">🔥 ${streak}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">DAY STREAK</div>
        </div>
        <div style="height: 30px; width: 1px; background: var(--border-glass);"></div>
        <div>
          <div style="font-size: 1.5rem; font-weight: 800; color: #10b981;">${state.history.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">SCHEDULED / LOGS</div>
        </div>
        <div style="height: 30px; width: 1px; background: var(--border-glass);"></div>
        <div>
          <div style="font-size: 1.5rem; font-weight: 800; color: #6366f1;">${(totalVol / 1000).toFixed(1)}k</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">TOTAL VOL (KG)</div>
        </div>
      </div>
    </div>

    <!-- Calendar Glass Card -->
    <div class="glass-card">
      <div class="calendar-header">
        <div class="month-title">${monthNames[month]} ${year}</div>
        <div class="month-selector">
          <button class="icon-btn" id="prev-month-btn">◀</button>
          <button class="icon-btn" id="today-month-btn" title="Go to Today">📅</button>
          <button class="icon-btn" id="next-month-btn">▶</button>
        </div>
      </div>

      <div class="calendar-weekdays">
        <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
      </div>

      <div class="calendar-grid" id="calendar-days-grid">
        ${renderCalendarDays(year, month, firstDayIndex, daysInMonth, prevDaysInMonth, state, selectedDate)}
      </div>
    </div>

    <!-- Selected Date Details & Editable Weight Recorder -->
    <div class="glass-card">
      <div class="card-header">
        <div>
          <div class="card-title">📅 ${formatDisplayDate(selectedDate)}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
            ${selectedDateWorkouts.length > 0 ? `${selectedDateWorkouts.length} workout session(s) scheduled/logged` : 'No workouts logged for this day'}
          </div>
        </div>
        <button class="btn btn-secondary" id="log-custom-workout-btn" style="width: auto; padding: 8px 14px; font-size: 0.85rem;">
          + Log Session
        </button>
      </div>

      ${selectedDateWorkouts.length > 0 ? `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${selectedDateWorkouts.map(w => `
            <div class="workout-card-editor" data-id="${w.id}" style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-glass); border-left: 4px solid ${w.color || '#6366f1'}; border-radius: var(--radius-md); padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <span style="font-weight: 800; font-size: 1.1rem;">${w.icon || '🏋️'} ${w.name}</span>
                  <span class="badge" style="background: ${w.color || '#6366f1'}22; color: ${w.color || '#6366f1'}; margin-left: 8px;">${w.category}</span>
                  ${w.userLogged ? '<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; margin-left: 4px;">✓ Logged</span>' : ''}
                </div>
                <button class="icon-btn delete-workout-btn" data-id="${w.id}" title="Delete Log" style="width: 28px; height: 28px; font-size: 12px; color: var(--accent-rose);">🗑️</button>
              </div>

              <div style="font-size: 0.82rem; color: var(--text-secondary); display: flex; gap: 16px; margin-bottom: 12px;">
                <span>⏱️ ${w.durationMinutes || 45} mins</span>
                <span>🏋️ <strong class="vol-display" style="color: var(--accent-emerald);">${(w.totalVolume || 0).toLocaleString()} kg total volume</strong></span>
              </div>

              <!-- Editable Exercises & Set Weights Table -->
              <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #a5b4fc; display: flex; justify-content: space-between; align-items: center;">
                  <span>EXERCISES & WEIGHT RECORDINGS</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">Enter weights & reps below</span>
                </div>

                ${w.exercises && w.exercises.length > 0 ? w.exercises.map((ex, exIdx) => `
                  <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 6px; color: var(--text-primary);">
                      💪 ${ex.name}
                    </div>

                    <div class="sets-rows-container" style="display: flex; flex-direction: column; gap: 6px;">
                      ${ex.sets ? ex.sets.map((set, setIdx) => `
                        <div class="set-input-row" style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem;">
                          <span style="width: 38px; color: var(--text-muted); font-weight: 700;">Set ${setIdx + 1}:</span>
                          
                          <div style="display: flex; align-items: center; gap: 4px; flex: 1;">
                            <input type="number" class="form-input ex-weight-input" 
                              data-wid="${w.id}" data-ex="${exIdx}" data-set="${setIdx}" 
                              value="${set.weight || 0}" step="0.5" min="0" style="padding: 4px 8px; font-size: 0.82rem; text-align: center;">
                            <span style="color: var(--text-muted);">kg</span>
                          </div>

                          <div style="display: flex; align-items: center; gap: 4px; flex: 1;">
                            <input type="number" class="form-input ex-reps-input" 
                              data-wid="${w.id}" data-ex="${exIdx}" data-set="${setIdx}" 
                              value="${set.reps || 10}" min="1" style="padding: 4px 8px; font-size: 0.82rem; text-align: center;">
                            <span style="color: var(--text-muted);">reps</span>
                          </div>
                        </div>
                      `).join('') : ''}
                    </div>

                    <!-- Add Set Button -->
                    <button class="add-set-btn" 
                      data-wid="${w.id}" data-ex="${exIdx}"
                      style="margin-top: 8px; width: 100%; padding: 6px; background: rgba(99,102,241,0.12); border: 1px dashed rgba(99,102,241,0.4); border-radius: var(--radius-md); color: #a5b4fc; font-size: 0.8rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s ease;">
                      + Add Set
                    </button>
                  </div>
                `).join('') : '<div style="font-size: 0.8rem; color: var(--text-muted);">No detailed exercises recorded for this log.</div>'}
              </div>

              <!-- Save Weights Button -->
              <button class="btn save-weights-btn" data-id="${w.id}" style="margin-top: 14px; padding: 10px; font-size: 0.88rem; background: linear-gradient(135deg, var(--accent-emerald), #059669);">
                💾 Save Weight Recordings
              </button>
            </div>
          `).join('')}
        </div>
      ` : scheduledRoutine ? `
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-glass); border-left: 4px solid ${scheduledRoutine.color || '#6366f1'}; border-radius: var(--radius-md); padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <span style="font-weight: 800; font-size: 1.1rem;">${scheduledRoutine.icon || '🏋️'} ${scheduledRoutine.name}</span>
              <span class="badge" style="background: ${scheduledRoutine.color || '#6366f1'}22; color: ${scheduledRoutine.color || '#6366f1'}; margin-left: 8px;">${scheduledRoutine.category}</span>
            </div>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px;">📋 Scheduled — not logged yet</div>

          <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
            ${(scheduledRoutine.exercises || []).map(exItem => {
              const exMeta = state.exercises.find(e => e.id === exItem.exerciseId);
              const exName = exMeta ? exMeta.name : exItem.exerciseId;
              const repsLabel = exItem.repRange
                ? (exItem.repRange === 'triset' ? 'triset' : `${exItem.repRange} reps`)
                : `${exItem.defaultReps || 10} reps`;
              return `
                <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
                  <span>${exName}</span>
                  <span style="color: var(--text-muted);">${exItem.defaultSets || 3} × ${repsLabel}</span>
                </div>
              `;
            }).join('')}
          </div>

          <button class="btn start-scheduled-btn" id="start-scheduled-btn" style="padding: 10px; font-size: 0.88rem; background: linear-gradient(135deg, ${scheduledRoutine.color || '#6366f1'}, var(--accent-secondary));">
            ▶ Start This Workout
          </button>
        </div>
      ` : `
        <div style="text-align: center; padding: 24px 10px; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 8px;">🛌</div>
          <div style="font-weight: 600; font-size: 0.95rem;">Rest Day / Empty Log</div>
          <div style="font-size: 0.8rem; margin-top: 4px;">Tap "+ Log Session" to schedule or record a workout for this date.</div>
        </div>
      `}
    </div>
  `;

  // Attach Month Selector Event Handlers
  container.querySelector('#prev-month-btn')?.addEventListener('click', () => {
    const prevDate = new Date(year, month - 1, 1);
    appState.setSelectedDate(formatDateString(prevDate));
  });

  container.querySelector('#next-month-btn')?.addEventListener('click', () => {
    const nextDate = new Date(year, month + 1, 1);
    appState.setSelectedDate(formatDateString(nextDate));
  });

  container.querySelector('#today-month-btn')?.addEventListener('click', () => {
    appState.setSelectedDate(formatDateString(new Date()));
  });

  // Calendar Day Selection
  container.querySelectorAll('.calendar-day').forEach(dayEl => {
    dayEl.addEventListener('click', () => {
      const dateAttr = dayEl.getAttribute('data-date');
      if (dateAttr) {
        appState.setSelectedDate(dateAttr);
      }
    });
  });

  // Save Weights Button Handler - MARKS AS LOGGED for streak count!
  container.querySelectorAll('.save-weights-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wId = btn.getAttribute('data-id');
      const workoutLog = state.history.find(h => h.id === wId);
      if (!workoutLog) return;

      const card = btn.closest('.workout-card-editor');
      if (!card) return;

      let newTotalVolume = 0;

      card.querySelectorAll('.ex-weight-input').forEach(input => {
        const exIdx = parseInt(input.getAttribute('data-ex'), 10);
        const setIdx = parseInt(input.getAttribute('data-set'), 10);
        const newWeight = parseFloat(input.value || 0);

        if (workoutLog.exercises[exIdx] && workoutLog.exercises[exIdx].sets[setIdx]) {
          workoutLog.exercises[exIdx].sets[setIdx].weight = newWeight;
        }
      });

      card.querySelectorAll('.ex-reps-input').forEach(input => {
        const exIdx = parseInt(input.getAttribute('data-ex'), 10);
        const setIdx = parseInt(input.getAttribute('data-set'), 10);
        const newReps = parseInt(input.value || 0, 10);

        if (workoutLog.exercises[exIdx] && workoutLog.exercises[exIdx].sets[setIdx]) {
          workoutLog.exercises[exIdx].sets[setIdx].reps = newReps;
        }
      });

      workoutLog.exercises.forEach(ex => {
        ex.sets.forEach(s => {
          newTotalVolume += (s.reps * (s.weight || 1));
        });
      });
      workoutLog.totalVolume = newTotalVolume;
      workoutLog.userLogged = true; // Mark as logged for streak increment!

      appState.addWorkoutLog(workoutLog);
      alert('Weight recordings saved & session logged! Streak updated.');
      renderCalendarView(container);
    });
  });

  // Delete log handler
  container.querySelectorAll('.delete-workout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this workout log entry?')) {
        appState.deleteWorkoutLog(id);
      }
    });
  });

  // Add Set button handler — inserts a new row inline without re-rendering
  container.querySelectorAll('.add-set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wId = btn.getAttribute('data-wid');
      const exIdx = parseInt(btn.getAttribute('data-ex'), 10);

      // Find the sets-rows-container for this exercise
      const setsContainer = btn.previousElementSibling;
      if (!setsContainer) return;

      // Read current set count from existing rows to number the new set correctly
      const existingRows = setsContainer.querySelectorAll('.set-input-row');
      const newSetIdx = existingRows.length;

      // Copy last set's values as defaults for the new row
      const lastRow = existingRows[existingRows.length - 1];
      const lastWeight = lastRow ? lastRow.querySelector('.ex-weight-input')?.value || 0 : 0;
      const lastReps = lastRow ? lastRow.querySelector('.ex-reps-input')?.value || 10 : 10;

      // Build and insert the new row
      const newRow = document.createElement('div');
      newRow.className = 'set-input-row';
      newRow.style.cssText = 'display: flex; align-items: center; gap: 8px; font-size: 0.8rem; animation: fadeIn 0.2s ease;';
      newRow.innerHTML = `
        <span style="width: 38px; color: var(--text-muted); font-weight: 700;">Set ${newSetIdx + 1}:</span>
        <div style="display: flex; align-items: center; gap: 4px; flex: 1;">
          <input type="number" class="form-input ex-weight-input"
            data-wid="${wId}" data-ex="${exIdx}" data-set="${newSetIdx}"
            value="${lastWeight}" step="0.5" min="0" style="padding: 4px 8px; font-size: 0.82rem; text-align: center;">
          <span style="color: var(--text-muted);">kg</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px; flex: 1;">
          <input type="number" class="form-input ex-reps-input"
            data-wid="${wId}" data-ex="${exIdx}" data-set="${newSetIdx}"
            value="${lastReps}" min="1" style="padding: 4px 8px; font-size: 0.82rem; text-align: center;">
          <span style="color: var(--text-muted);">reps</span>
        </div>
      `;
      setsContainer.appendChild(newRow);
    });
  });

  // Quick log modal launcher
  container.querySelector('#log-custom-workout-btn')?.addEventListener('click', () => {
    openQuickLogModal(selectedDate);
  });

  // Start today's/selected date's scheduled routine straight into an active session
  container.querySelector('#start-scheduled-btn')?.addEventListener('click', () => {
    if (scheduledRoutine) appState.startWorkoutFromRoutine(scheduledRoutine);
  });
}

function renderCalendarDays(year, month, firstDayIndex, daysInMonth, prevDaysInMonth, state, selectedDate) {
  let html = '';
  const todayStr = new Date().toISOString().split('T')[0];
  const history = state.history || [];

  // Same rule as the day-detail panel: only actually-logged workouts count as
  // "logged" dots — everything else defers to the live weekly schedule.
  const historyMap = {};
  history.forEach(item => {
    if (!item.userLogged) return;
    if (!historyMap[item.date]) historyMap[item.date] = [];
    historyMap[item.date].push(item);
  });

  // Renders either the logged workout dots for a date, or — if nothing's been
  // logged yet — a hollow dot in the scheduled routine's color, so the weekly
  // schedule is visible on the calendar before you've actually logged anything.
  function renderDots(dateStr) {
    const logs = historyMap[dateStr] || [];
    if (logs.length > 0) {
      return logs.map(l => `<div class="workout-dot" style="background: ${l.color || '#6366f1'}; color: ${l.color || '#6366f1'};"></div>`).join('');
    }
    const scheduled = getScheduledRoutine(state, dateStr);
    if (scheduled) {
      const c = scheduled.color || '#6366f1';
      return `<div class="workout-dot" style="background: transparent; border: 1.5px solid ${c}; color: ${c};"></div>`;
    }
    return '';
  }

  // Prev month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevDaysInMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = formatDateString(prevMonthDate);
    html += `<div class="calendar-day other-month" data-date="${dateStr}">
      <span class="day-number">${dayNum}</span>
      <div class="day-dots">
        ${renderDots(dateStr)}
      </div>
    </div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const dateStr = formatDateString(curDate);
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;

    html += `
      <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${dateStr}">
        <span class="day-number">${d}</span>
        <div class="day-dots">
          ${renderDots(dateStr)}
        </div>
      </div>
    `;
  }

  // Next month padding
  const totalCells = firstDayIndex + daysInMonth;
  const nextMonthPadding = (totalCells > 35 ? 42 : 35) - totalCells;
  for (let j = 1; j <= nextMonthPadding; j++) {
    const nextMonthDate = new Date(year, month + 1, j);
    const dateStr = formatDateString(nextMonthDate);
    html += `<div class="calendar-day other-month" data-date="${dateStr}">
      <span class="day-number">${j}</span>
      <div class="day-dots">
        ${renderDots(dateStr)}
      </div>
    </div>`;
  }

  return html;
}

function formatDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function openQuickLogModal(dateStr) {
  const exercises = appState.getState().exercises || [];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">Log Workout (${dateStr})</div>
        <button class="icon-btn" id="close-modal-btn">✕</button>
      </div>

      <form id="quick-log-form">
        <div class="form-group">
          <label class="form-label">Workout Routine Name</label>
          <input type="text" class="form-input" id="log-name" placeholder="e.g. Upper Body Workout" required value="Custom Workout">
        </div>

        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" id="log-category">
            <option value="Push / Upper">Push / Upper</option>
            <option value="Legs / Core">Legs / Core</option>
            <option value="Arms">Arms</option>
            <option value="Full Body" selected>Full Body</option>
            <option value="Cardio">Cardio</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Default Set Weight (kg)</label>
          <input type="number" class="form-input" id="log-default-weight" value="20" step="0.5" min="0">
        </div>

        <div class="form-group">
          <label class="form-label">Select Exercise to Include</label>
          <select class="form-select" id="log-exercise-select">
            ${exercises.map(ex => `<option value="${ex.name}">${ex.name} (${ex.category})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Notes & Comments</label>
          <textarea class="form-textarea" id="log-notes" rows="2" placeholder="Entered weights and completed session."></textarea>
        </div>

        <button type="submit" class="btn" style="margin-top: 10px;">Save Workout Log</button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#close-modal-btn').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  overlay.querySelector('#quick-log-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = overlay.querySelector('#log-name').value;
    const category = overlay.querySelector('#log-category').value;
    const defaultWeight = parseFloat(overlay.querySelector('#log-default-weight').value || 20);
    const selectedExName = overlay.querySelector('#log-exercise-select').value;
    const notes = overlay.querySelector('#log-notes').value;

    const colors = {
      'Push / Upper': '#3b82f6', 'Legs / Core': '#10b981', 'Arms': '#8b5cf6',
      'Full Body': '#f59e0b', 'Cardio': '#06b6d4'
    };

    appState.addWorkoutLog({
      id: 'log_' + Date.now(),
      date: dateStr,
      name: name,
      category: category,
      color: colors[category] || '#6366f1',
      icon: '🏋️',
      durationMinutes: 45,
      totalVolume: defaultWeight * 30,
      notes: notes,
      userLogged: true, // Flag for user completion
      exercises: [
        {
          name: selectedExName,
          category: category,
          sets: [
            { reps: 10, weight: defaultWeight, completed: true },
            { reps: 10, weight: defaultWeight, completed: true },
            { reps: 10, weight: defaultWeight, completed: true }
          ]
        }
      ]
    });

    document.body.removeChild(overlay);
  });
}
