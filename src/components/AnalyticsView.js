import { appState } from '../state.js';
import { calculateStreak, calculateTotalVolume, formatDate } from '../utils/helpers.js';

// Module-level (not component-local) so the selected range survives the full
// re-renders that fire on every appState.notify() — same pattern used by the
// Weekly Schedule editor's selected-day state. Kept independent per chart
// (not one shared range) so viewing a year of body weight doesn't also force
// a year of calorie bars, and vice versa.
let selectedRange = 'month';
let selectedCalorieRange = 'month';

// The Data Management & Backup card (export/restore-demo/clear-all) is
// destructive and app-wide, so it's restricted to the admin account rather
// than shown to every signed-in user.
const ADMIN_EMAIL = 'anthonybristol@gmail.com';

const RANGE_DAYS = { month: 30, '6month': 182, year: 365, all: Infinity };
const RANGE_LABELS = { month: 'Month', '6month': '6 Month', year: 'Year', all: 'All' };

export function renderAnalyticsView(container) {
  const state = appState.getState();
  const history = state.history || [];
  const bodyWeightLogs = state.bodyWeightLogs || [];

  const streak = calculateStreak(history);
  const totalVolume = calculateTotalVolume(history);

  // Calculate category distribution
  const categoryCounts = {};
  history.forEach(item => {
    const cat = item.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryColors = {
    'Push': '#3b82f6',
    'Pull': '#8b5cf6',
    'Legs': '#10b981',
    'Chest': '#ef4444',
    'Back': '#8b5cf6',
    'Shoulders': '#f59e0b',
    'Core': '#ec4899',
    'Cardio': '#06b6d4',
    'Full Body': '#f59e0b'
  };

  const sortedWeights = [...bodyWeightLogs].sort((a, b) => a.date.localeCompare(b.date));
  const filteredWeights = filterPointsByRange(sortedWeights, selectedRange);

  // One bar per day that actually has logged calories — not one per calendar
  // day, so the chart stays readable even over Year/All ranges instead of
  // needing horizontal scroll for hundreds of mostly-empty days. Multiple
  // workouts logged the same day (e.g. cardio + lifting) sum into one bar.
  const caloriesByDate = {};
  history.forEach(h => {
    if (!h.userLogged || !h.totalCalories) return;
    caloriesByDate[h.date] = (caloriesByDate[h.date] || 0) + h.totalCalories;
  });
  const sortedCalories = Object.keys(caloriesByDate).sort().map(date => ({ date, calories: caloriesByDate[date] }));
  const filteredCalories = filterPointsByRange(sortedCalories, selectedCalorieRange);

  const isAdmin = (appState.getUserEmail() || '').toLowerCase() === ADMIN_EMAIL;

  container.innerHTML = `
    <!-- Top Summary Grid -->
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title">📈 Performance Overview</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 800; color: #f59e0b;">🔥 ${streak}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700;">ACTIVE STREAK</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 800; color: #10b981;">${history.length}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700;">TOTAL WORKOUTS</div>
        </div>
      </div>

      <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); text-align: center;">
        <div style="font-size: 2rem; font-weight: 800; color: #6366f1;">${totalVolume.toLocaleString()} <span style="font-size: 1rem;">KG</span></div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700;">TOTAL LIFTED VOLUME</div>
      </div>
    </div>

    <!-- Body Weight Tracking -->
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title">⚖️ Body Weight</div>
      </div>

      <form id="log-weight-form" style="display: flex; gap: 8px; align-items: flex-end; margin-bottom: 16px;">
        <div class="form-group" style="flex: 1; margin-bottom: 0;">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" id="weight-date-input" value="${formatDate(new Date())}" max="${formatDate(new Date())}" required>
        </div>
        <div class="form-group" style="flex: 1; margin-bottom: 0;">
          <label class="form-label">Weight (kg)</label>
          <input type="number" class="form-input" id="weight-value-input" step="0.1" min="0" placeholder="e.g. 82.5" required>
        </div>
        <button type="submit" class="btn" style="width: auto; padding: 12px 16px;">Log</button>
      </form>

      ${bodyWeightLogs.length > 0 ? `
        <div style="display: flex; gap: 6px; margin-bottom: 14px;">
          ${Object.keys(RANGE_LABELS).map(key => `
            <button class="weight-range-pill" data-range="${key}" style="flex: 1; padding: 8px 4px; border-radius: var(--radius-md); border: 1px solid ${key === selectedRange ? 'var(--accent-cyan)' : 'var(--border-glass)'}; background: ${key === selectedRange ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)'}; color: ${key === selectedRange ? 'var(--text-primary)' : 'var(--text-secondary)'}; font-weight: 700; font-size: 0.75rem; cursor: pointer; font-family: inherit; transition: all 0.2s ease;">
              ${RANGE_LABELS[key]}
            </button>
          `).join('')}
        </div>

        <div id="weight-chart-wrapper" style="position: relative;">
          ${renderWeightChartSVG(filteredWeights)}
        </div>

        ${renderWeightSummaryRow(filteredWeights)}

        <details style="margin-top: 16px;">
          <summary style="font-size: 0.82rem; color: var(--text-secondary); cursor: pointer;">
            ${bodyWeightLogs.length} ${bodyWeightLogs.length === 1 ? 'entry' : 'entries'} logged
          </summary>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px; max-height: 220px; overflow-y: auto;">
            ${[...bodyWeightLogs].sort((a, b) => b.date.localeCompare(a.date)).map(w => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.6); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); font-size: 0.82rem;">
                <span>${formatShortMonthDay(w.date)}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <strong>${w.weightKg} kg</strong>
                  <button class="icon-btn delete-weight-btn" data-id="${w.id}" title="Delete" style="width: 24px; height: 24px; font-size: 11px; color: var(--accent-rose);">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </details>
      ` : `
        <div style="text-align: center; padding: 20px 10px; color: var(--text-muted);">
          <div style="font-size: 28px; margin-bottom: 6px;">⚖️</div>
          <div style="font-size: 0.85rem;">Log your weight above to start seeing your trend here.</div>
        </div>
      `}
    </div>

    <!-- Daily Calorie Expenditure -->
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title">🔥 Daily Calories</div>
      </div>

      ${sortedCalories.length > 0 ? `
        <div style="display: flex; gap: 6px; margin-bottom: 14px;">
          ${Object.keys(RANGE_LABELS).map(key => `
            <button class="calorie-range-pill" data-range="${key}" style="flex: 1; padding: 8px 4px; border-radius: var(--radius-md); border: 1px solid ${key === selectedCalorieRange ? 'var(--accent-rose)' : 'var(--border-glass)'}; background: ${key === selectedCalorieRange ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.03)'}; color: ${key === selectedCalorieRange ? 'var(--text-primary)' : 'var(--text-secondary)'}; font-weight: 700; font-size: 0.75rem; cursor: pointer; font-family: inherit; transition: all 0.2s ease;">
              ${RANGE_LABELS[key]}
            </button>
          `).join('')}
        </div>

        <div id="calorie-chart-wrapper" style="position: relative;">
          ${renderCalorieChartSVG(filteredCalories)}
        </div>

        ${renderCalorieSummaryRow(filteredCalories)}
      ` : `
        <div style="text-align: center; padding: 20px 10px; color: var(--text-muted);">
          <div style="font-size: 28px; margin-bottom: 6px;">🔥</div>
          <div style="font-size: 0.85rem;">Log a workout to start seeing daily calories burned here.</div>
        </div>
      `}
    </div>

    <!-- Workout Type Distribution -->
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title">📊 Workout Type Breakdown</div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${Object.keys(categoryCounts).length > 0 ? Object.keys(categoryCounts).map(cat => {
          const count = categoryCounts[cat];
          const pct = Math.round((count / history.length) * 100);
          const color = categoryColors[cat] || '#6366f1';
          return `
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">
                <span>${cat}</span>
                <span style="color: var(--text-secondary);">${count} sessions (${pct}%)</span>
              </div>
              <div style="height: 10px; width: 100%; background: rgba(255, 255, 255, 0.05); border-radius: var(--radius-full); overflow: hidden;">
                <div style="height: 100%; width: ${pct}%; background: ${color}; border-radius: var(--radius-full); transition: width 0.5s ease;"></div>
              </div>
            </div>
          `;
        }).join('') : '<div style="color: var(--text-muted); text-align: center;">No workout data logged yet.</div>'}
      </div>
    </div>

    <!-- Your Plan (calorie target + re-run the onboarding wizard) -->
    <div class="glass-card">
      <div class="card-header">
        <div class="card-title">🎯 Your Plan</div>
      </div>

      ${state.userProfile && state.userProfile.calorieTarget ? `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 12px;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700;">DAILY CALORIE TARGET</div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px; text-transform: capitalize;">${state.userProfile.goal || 'maintain'}${state.userProfile.intensity ? ' · ' + state.userProfile.intensity : ''}</div>
          </div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary);">${state.userProfile.calorieTarget.toLocaleString()} <span style="font-size: 0.9rem;">kcal</span></div>
        </div>
      ` : `
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
          No setup completed yet — run the quick setup to get a recommended program and calorie target.
        </div>
      `}

      <button class="btn btn-secondary" id="retake-setup-btn">🎯 ${state.userProfile ? 'Retake Setup' : 'Run Setup'}</button>
    </div>

    <!-- Data Management & Backups (admin-only) -->
    ${isAdmin ? `
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">⚙️ Data Management & Backup</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button class="btn btn-secondary" id="export-json-btn">
            💾 Export Data Backup (JSON)
          </button>

          <button class="btn btn-secondary" id="reload-demo-btn">
            🔄 Restore Demo Sample History
          </button>

          <button class="btn btn-danger" id="clear-data-btn">
            🗑️ Clear All App Data
          </button>
        </div>
      </div>
    ` : ''}
  `;

  // Attach Event Handlers
  container.querySelector('#retake-setup-btn')?.addEventListener('click', () => {
    appState.retakeOnboarding();
  });

  container.querySelector('#export-json-btn')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `totoworkouts_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  container.querySelector('#reload-demo-btn')?.addEventListener('click', () => {
    if (confirm('Reload realistic demo workout history across the calendar?')) {
      appState.resetDemoData();
    }
  });

  container.querySelector('#clear-data-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all workout history and state?')) {
      appState.clearAllData();
    }
  });

  container.querySelector('#log-weight-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = container.querySelector('#weight-date-input').value;
    const weight = parseFloat(container.querySelector('#weight-value-input').value);
    if (!date || !weight || weight <= 0) return;
    appState.logBodyWeight(date, weight);
  });

  container.querySelectorAll('.weight-range-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRange = btn.getAttribute('data-range');
      renderAnalyticsView(container);
    });
  });

  container.querySelectorAll('.calorie-range-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCalorieRange = btn.getAttribute('data-range');
      renderAnalyticsView(container);
    });
  });

  container.querySelectorAll('.delete-weight-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this weight entry?')) {
        appState.deleteBodyWeightLog(id);
      }
    });
  });

  setupWeightChartInteractivity(container, filteredWeights);
  setupCalorieChartInteractivity(container, filteredCalories);
}

// Shared by the Body Weight and Daily Calories charts — both deal in
// {date, ...} points sorted ascending, just filtered to a different range
// independently (see selectedRange / selectedCalorieRange).
function filterPointsByRange(sortedPoints, range) {
  if (range === 'all') return sortedPoints;
  const days = RANGE_DAYS[range] ?? RANGE_DAYS.month;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = formatDate(cutoff);
  return sortedPoints.filter(p => p.date >= cutoffStr);
}

function formatShortMonthDay(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Single source of truth for the chart's coordinate system — used both when
// building the SVG markup and when mapping pointer position back to the
// nearest data point for the hover layer, so the two can never drift apart.
function computeWeightChartLayout(points) {
  const W = 300, H = 170;
  const padL = 38, padR = 10, padT = 14, padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const weights = points.map(p => p.weightKg);
  let minW = Math.min(...weights);
  let maxW = Math.max(...weights);
  if (minW === maxW) { minW -= 1; maxW += 1; }
  const rangePad = (maxW - minW) * 0.15 || 1;
  minW -= rangePad;
  maxW += rangePad;

  const xForIndex = (i) => padL + (points.length > 1 ? (i / (points.length - 1)) * plotW : plotW / 2);
  const yForWeight = (w) => padT + plotH - ((w - minW) / (maxW - minW)) * plotH;

  return { W, H, padL, padR, padT, padB, plotW, plotH, minW, maxW, xForIndex, yForWeight };
}

function renderWeightChartSVG(points) {
  if (points.length < 2) {
    return `
      <div style="text-align: center; padding: 30px 10px; color: var(--text-muted); background: rgba(15, 23, 42, 0.4); border-radius: var(--radius-md);">
        <div style="font-size: 0.85rem;">Log at least 2 entries in this range to see a trend line.</div>
      </div>
    `;
  }

  const { W, H, padL, padR, padT, plotW, plotH, minW, maxW, xForIndex, yForWeight } = computeWeightChartLayout(points);

  // Y-axis: 4 evenly spaced reference gridlines with kg labels (recessive —
  // low-opacity lines, muted label ink, never competing with the data line).
  const tickCount = 4;
  const gridLines = [];
  for (let t = 0; t <= tickCount; t++) {
    const val = minW + (t / tickCount) * (maxW - minW);
    const y = yForWeight(val);
    gridLines.push(`
      <line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      <text x="${(padL - 6).toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="8" fill="var(--text-muted)">${val.toFixed(1)}</text>
    `);
  }

  // X-axis: a handful of evenly spaced date labels rather than one per point,
  // so they never collide regardless of how many entries are in range.
  const xLabelCount = Math.min(4, points.length);
  const xLabelIndices = [...new Set(
    Array.from({ length: xLabelCount }, (_, t) => Math.round((t / (xLabelCount - 1 || 1)) * (points.length - 1)))
  )];
  const xLabels = xLabelIndices.map(idx => `
    <text x="${xForIndex(idx).toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="8" fill="var(--text-muted)">${formatShortMonthDay(points[idx].date)}</text>
  `).join('');

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xForIndex(i).toFixed(1)} ${yForWeight(p.weightKg).toFixed(1)}`).join(' ');
  const floorY = (padT + plotH).toFixed(1);
  const areaPath = `${linePath} L ${xForIndex(points.length - 1).toFixed(1)} ${floorY} L ${xForIndex(0).toFixed(1)} ${floorY} Z`;

  return `
    <svg viewBox="0 0 ${W} ${H}" style="width: 100%; height: auto; display: block; overflow: visible;" id="weight-chart-svg">
      <defs>
        <linearGradient id="weightAreaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent-cyan)" stop-opacity="0.25" />
          <stop offset="100%" stop-color="var(--accent-cyan)" stop-opacity="0" />
        </linearGradient>
      </defs>
      ${gridLines.join('')}
      <path d="${areaPath}" fill="url(#weightAreaGradient)" stroke="none" />
      <path d="${linePath}" fill="none" stroke="var(--accent-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      ${xLabels}
      <line id="weight-crosshair-line" x1="0" y1="${padT}" x2="0" y2="${(padT + plotH).toFixed(1)}" stroke="rgba(255,255,255,0.3)" stroke-width="1" visibility="hidden" />
      <circle id="weight-crosshair-dot" r="4" fill="var(--accent-cyan)" stroke="var(--bg-dark)" stroke-width="1.5" visibility="hidden" />
      <rect id="weight-hover-target" x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="transparent" style="cursor: crosshair;" />
    </svg>
    <div id="weight-tooltip" style="position: absolute; display: none; pointer-events: none; background: rgba(15, 23, 42, 0.95); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 5px 9px; font-size: 0.72rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; z-index: 10; box-shadow: var(--shadow-card); transform: translateY(-100%);"></div>
  `;
}

function renderWeightSummaryRow(points) {
  if (points.length === 0) return '';
  const latest = points[points.length - 1];
  const first = points[0];
  const delta = latest.weightKg - first.weightKg;
  // Neutral ink, not a status color — a weight change isn't inherently
  // "good" or "bad," that depends on the person's own goal.
  const deltaStr = points.length > 1 ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)} kg` : '—';

  return `
    <div style="display: flex; justify-content: space-around; margin-top: 14px; text-align: center;">
      <div>
        <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent-cyan);">${latest.weightKg} kg</div>
        <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">LATEST</div>
      </div>
      <div style="width: 1px; background: var(--border-glass);"></div>
      <div>
        <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">${deltaStr}</div>
        <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">CHANGE IN RANGE</div>
      </div>
    </div>
  `;
}

// Crosshair + tooltip on hover/touch, per the dataviz skill's line-chart
// interaction guidance — re-queries the SVG's own elements each render call
// rather than caching across re-renders, same defensive pattern used by the
// rest/elapsed timers elsewhere in the app.
function setupWeightChartInteractivity(container, points) {
  const svg = container.querySelector('#weight-chart-svg');
  const hoverTarget = container.querySelector('#weight-hover-target');
  if (!svg || !hoverTarget || points.length < 2) return;

  const layout = computeWeightChartLayout(points);
  const crosshairLine = svg.querySelector('#weight-crosshair-line');
  const crosshairDot = svg.querySelector('#weight-crosshair-dot');
  const tooltip = container.querySelector('#weight-tooltip');

  function nearestIndexForClientX(clientX) {
    const rect = svg.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * layout.W;
    let nearest = 0;
    let minDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(layout.xForIndex(i) - relX);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    return nearest;
  }

  function showAt(index) {
    const p = points[index];
    const x = layout.xForIndex(index);
    const y = layout.yForWeight(p.weightKg);

    crosshairLine.setAttribute('x1', x);
    crosshairLine.setAttribute('x2', x);
    crosshairLine.setAttribute('visibility', 'visible');
    crosshairDot.setAttribute('cx', x);
    crosshairDot.setAttribute('cy', y);
    crosshairDot.setAttribute('visibility', 'visible');

    if (tooltip) {
      tooltip.style.display = 'block';
      tooltip.textContent = `${formatShortMonthDay(p.date)} · ${p.weightKg} kg`;
      tooltip.style.left = `${((x / layout.W) * 100).toFixed(1)}%`;
      tooltip.style.top = `${((y / layout.H) * 100).toFixed(1)}%`;
    }
  }

  function hide() {
    crosshairLine.setAttribute('visibility', 'hidden');
    crosshairDot.setAttribute('visibility', 'hidden');
    if (tooltip) tooltip.style.display = 'none';
  }

  hoverTarget.addEventListener('mousemove', (e) => showAt(nearestIndexForClientX(e.clientX)));
  hoverTarget.addEventListener('mouseleave', hide);
  hoverTarget.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (touch) showAt(nearestIndexForClientX(touch.clientX));
  }, { passive: true });
  hoverTarget.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) showAt(nearestIndexForClientX(touch.clientX));
  }, { passive: true });
  hoverTarget.addEventListener('touchend', hide);
}

// Single source of truth for the bar chart's coordinate system — same
// "layout function shared by render + hover" pattern as computeWeightChartLayout.
// Unlike the weight line (a windowed/zoomed range so small fluctuations are
// still visible), a bar chart's value axis always starts at 0 — anything
// else exaggerates the differences between bars, since height/area is what's
// actually being compared here, not just vertical position.
function computeCalorieChartLayout(points) {
  const W = 300, H = 170;
  const padL = 32, padR = 10, padT = 14, padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const maxVal = Math.max(...points.map(p => p.calories), 1);
  const axisMax = maxVal * 1.15; // headroom so the tallest bar doesn't touch the top edge

  const slot = points.length > 0 ? plotW / points.length : plotW;
  const barGap = 2; // fixed 2px surface gap between adjacent bars, per the dataviz skill
  const barWidth = Math.max(2, slot - barGap);

  const xForIndex = (i) => padL + i * slot + slot / 2;
  const yForValue = (v) => padT + plotH - (v / axisMax) * plotH;
  const heightForValue = (v) => (v / axisMax) * plotH;

  return { W, H, padL, padR, padT, padB, plotW, plotH, axisMax, barWidth, xForIndex, yForValue, heightForValue };
}

// A bar rounded only at the top (4px, per the dataviz skill's mark spec) —
// the bottom stays flush with the baseline it's anchored to.
function roundedTopBarPath(x, width, top, bottom, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, bottom - top));
  return `M ${x} ${bottom} L ${x} ${(top + r).toFixed(1)} Q ${x} ${top.toFixed(1)} ${(x + r).toFixed(1)} ${top.toFixed(1)} L ${(x + width - r).toFixed(1)} ${top.toFixed(1)} Q ${(x + width).toFixed(1)} ${top.toFixed(1)} ${(x + width).toFixed(1)} ${(top + r).toFixed(1)} L ${(x + width).toFixed(1)} ${bottom} Z`;
}

function renderCalorieChartSVG(points) {
  if (points.length === 0) return '';

  const { W, H, padL, padR, padT, plotW, plotH, axisMax, barWidth, xForIndex, yForValue, heightForValue } = computeCalorieChartLayout(points);

  // Y-axis: 4 evenly spaced reference gridlines from 0, recessive per the
  // dataviz skill — low-opacity lines, muted label ink, never competing
  // with the bars themselves.
  const tickCount = 4;
  const gridLines = [];
  for (let t = 0; t <= tickCount; t++) {
    const val = (t / tickCount) * axisMax;
    const y = yForValue(val);
    gridLines.push(`
      <line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      <text x="${(padL - 6).toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="8" fill="var(--text-muted)">${Math.round(val)}</text>
    `);
  }

  // X-axis: a handful of evenly spaced date labels rather than one per bar,
  // so they never collide regardless of how many logged days are in range.
  const xLabelCount = Math.min(4, points.length);
  const xLabelIndices = [...new Set(
    Array.from({ length: xLabelCount }, (_, t) => Math.round((t / (xLabelCount - 1 || 1)) * (points.length - 1)))
  )];
  const xLabels = xLabelIndices.map(idx => `
    <text x="${xForIndex(idx).toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="8" fill="var(--text-muted)">${formatShortMonthDay(points[idx].date)}</text>
  `).join('');

  const floorY = padT + plotH;
  const bars = points.map((p, i) => {
    const x = xForIndex(i) - barWidth / 2;
    const top = floorY - heightForValue(p.calories);
    return `<path class="calorie-bar" data-index="${i}" d="${roundedTopBarPath(x, barWidth, top, floorY, 4)}" fill="var(--accent-rose)" opacity="0.85" />`;
  }).join('');

  return `
    <svg viewBox="0 0 ${W} ${H}" style="width: 100%; height: auto; display: block; overflow: visible;" id="calorie-chart-svg">
      ${gridLines.join('')}
      ${bars}
      ${xLabels}
      <rect id="calorie-hover-target" x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="transparent" style="cursor: crosshair;" />
    </svg>
    <div id="calorie-tooltip" style="position: absolute; display: none; pointer-events: none; background: rgba(15, 23, 42, 0.95); border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 5px 9px; font-size: 0.72rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; z-index: 10; box-shadow: var(--shadow-card); transform: translate(-50%, -100%);"></div>
  `;
}

function renderCalorieSummaryRow(points) {
  if (points.length === 0) return '';
  const total = points.reduce((sum, p) => sum + p.calories, 0);
  const avg = Math.round(total / points.length);

  return `
    <div style="display: flex; justify-content: space-around; margin-top: 14px; text-align: center;">
      <div>
        <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent-rose);">${total.toLocaleString()}</div>
        <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">TOTAL KCAL IN RANGE</div>
      </div>
      <div style="width: 1px; background: var(--border-glass);"></div>
      <div>
        <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">${avg.toLocaleString()}</div>
        <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">AVG PER LOGGED DAY</div>
      </div>
    </div>
  `;
}

// Per-mark hover tooltip (not a crosshair — this is a bar chart, each mark
// is its own discrete value, per the dataviz skill's interaction guidance).
// Same re-query-fresh-every-render defensive pattern as the weight chart.
function setupCalorieChartInteractivity(container, points) {
  const svg = container.querySelector('#calorie-chart-svg');
  const hoverTarget = container.querySelector('#calorie-hover-target');
  if (!svg || !hoverTarget || points.length === 0) return;

  const layout = computeCalorieChartLayout(points);
  const tooltip = container.querySelector('#calorie-tooltip');
  const bars = [...svg.querySelectorAll('.calorie-bar')];

  function nearestIndexForClientX(clientX) {
    const rect = svg.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * layout.W;
    let nearest = 0;
    let minDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(layout.xForIndex(i) - relX);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    return nearest;
  }

  function showAt(index) {
    const p = points[index];
    const x = layout.xForIndex(index);
    const y = layout.yForValue(p.calories);

    bars.forEach((bar, i) => bar.setAttribute('opacity', i === index ? '1' : '0.85'));

    if (tooltip) {
      tooltip.style.display = 'block';
      tooltip.textContent = `${formatShortMonthDay(p.date)} · ${p.calories.toLocaleString()} kcal`;
      tooltip.style.left = `${((x / layout.W) * 100).toFixed(1)}%`;
      tooltip.style.top = `${((y / layout.H) * 100).toFixed(1)}%`;
    }
  }

  function hide() {
    bars.forEach(bar => bar.setAttribute('opacity', '0.85'));
    if (tooltip) tooltip.style.display = 'none';
  }

  hoverTarget.addEventListener('mousemove', (e) => showAt(nearestIndexForClientX(e.clientX)));
  hoverTarget.addEventListener('mouseleave', hide);
  hoverTarget.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (touch) showAt(nearestIndexForClientX(touch.clientX));
  }, { passive: true });
  hoverTarget.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) showAt(nearestIndexForClientX(touch.clientX));
  }, { passive: true });
  hoverTarget.addEventListener('touchend', hide);
}
