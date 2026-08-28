import { appState } from './state.js';
import { renderCalendarView } from './components/CalendarView.js';
import { renderActiveWorkoutView } from './components/ActiveWorkoutView.js';
import { renderRoutinesView } from './components/RoutinesView.js';
import { renderAnalyticsView } from './components/AnalyticsView.js';
import { renderAuthView } from './components/AuthView.js';
import { renderUpdatePasswordView } from './components/UpdatePasswordView.js';
import { renderScheduleEditorView } from './components/ScheduleEditorView.js';
import { renderOnboardingView } from './components/OnboardingView.js';

export async function initApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  function renderShell() {
    if (appState.isAuthLoading()) {
      appRoot.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; color: var(--text-secondary);">
          Loading...
        </div>
      `;
      return;
    }

    if (appState.needsPasswordReset()) {
      renderUpdatePasswordView(appRoot, { onDone: () => appState.completePasswordRecovery() });
      return;
    }

    if (appState.needsAuth()) {
      renderAuthView(appRoot, { onLocalOnly: () => appState.enableLocalOnly() });
      return;
    }

    if (appState.needsOnboarding()) {
      renderOnboardingView(appRoot);
      return;
    }

    const state = appState.getState();
    const currentView = state.currentView || 'calendar';
    const hasActiveWorkout = !!state.activeWorkout;
    const userEmail = appState.getUserEmail();

    appRoot.innerHTML = `
      <!-- Sticky Mobile Header -->
      <header class="app-header">
        <div class="brand">
          <div class="brand-icon">💪</div>
          <div class="brand-title">TotoWorkouts</div>
        </div>
        ${userEmail ? `
          <div class="header-actions">
            <span style="font-size: 0.72rem; color: var(--text-muted); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${userEmail}">${userEmail}</span>
            <button class="icon-btn" id="sign-out-btn" title="Sign out">⎋</button>
          </div>
        ` : ''}
      </header>

      <!-- Dynamic View Container -->
      <main class="view-container" id="view-content"></main>

      <!-- Mobile Bottom Navigation Bar -->
      <nav class="bottom-nav">
        <button class="nav-item ${currentView === 'calendar' ? 'active' : ''}" data-view="calendar">
          <span class="nav-icon">📅</span>
          <span>Calendar</span>
        </button>

        <button class="nav-item ${hasActiveWorkout ? 'active-workout-tab' : ''} ${currentView === 'active' ? 'active' : ''}" data-view="active">
          <span class="nav-icon">${hasActiveWorkout ? '⚡' : '🏋️'}</span>
          <span>${hasActiveWorkout ? 'Live Session' : 'Active'}</span>
        </button>

        <button class="nav-item ${(currentView === 'routines' || currentView === 'schedule-editor') ? 'active' : ''}" data-view="routines">
          <span class="nav-icon">📋</span>
          <span>Routines</span>
        </button>

        <button class="nav-item ${currentView === 'analytics' ? 'active' : ''}" data-view="analytics">
          <span class="nav-icon">📈</span>
          <span>Stats</span>
        </button>
      </nav>
    `;

    // Render inner content view
    const contentEl = appRoot.querySelector('#view-content');
    if (contentEl) {
      if (currentView === 'calendar') renderCalendarView(contentEl);
      else if (currentView === 'active') renderActiveWorkoutView(contentEl);
      else if (currentView === 'routines') renderRoutinesView(contentEl);
      else if (currentView === 'schedule-editor') renderScheduleEditorView(contentEl);
      else if (currentView === 'analytics') renderAnalyticsView(contentEl);
    }

    // Nav Item Click Handlers
    appRoot.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        if (targetView) appState.setView(targetView);
      });
    });

    // Sign Out Handler
    appRoot.querySelector('#sign-out-btn')?.addEventListener('click', () => {
      appState.signOut();
    });
  }

  // Subscribe state changes to re-render UI
  appState.subscribe(() => {
    renderShell();
  });

  // Initial render (shows a loading/auth screen until the session check resolves)
  renderShell();

  await appState.init();
}
