import { appState } from '../state.js';
import { calculateStreak, calculateTotalVolume } from '../utils/helpers.js';

export function renderAnalyticsView(container) {
  const state = appState.getState();
  const history = state.history || [];

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

    <!-- Data Management & Backups -->
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
  `;

  // Attach Event Handlers
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
}
