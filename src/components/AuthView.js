import { supabase, isSupabaseConfigured } from '../supabaseClient.js';

export function renderAuthView(container, { onLocalOnly } = {}) {
  let mode = 'signin'; // 'signin' | 'signup'

  function render() {
    container.innerHTML = `
      <div class="glass-card" style="max-width: 360px; margin: 60px auto; padding: 28px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 40px;">💪</div>
          <div style="font-size: 1.3rem; font-weight: 800; margin-top: 4px;">TotoWorkouts</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            ${mode === 'signin' ? 'Sign in to sync your workouts' : 'Create an account to get started'}
          </div>
        </div>

        ${!isSupabaseConfigured ? `
          <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: var(--radius-md); padding: 12px; font-size: 0.8rem; color: #f59e0b; margin-bottom: 16px;">
            Cloud sync isn't configured yet (missing Supabase env vars). You can still use the app locally.
          </div>
          <button class="btn btn-secondary" id="local-only-btn">Continue without an account</button>
        ` : `
          <form id="auth-form">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="auth-email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="auth-password" required minlength="6" autocomplete="${mode === 'signin' ? 'current-password' : 'new-password'}">
            </div>

            <div id="auth-error" style="color: var(--accent-rose); font-size: 0.8rem; margin-bottom: 10px; display: none;"></div>
            <div id="auth-info" style="color: var(--accent-emerald); font-size: 0.8rem; margin-bottom: 10px; display: none;"></div>

            <button type="submit" class="btn" id="auth-submit-btn">
              ${mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div style="text-align: center; margin-top: 16px; font-size: 0.82rem; color: var(--text-secondary);">
            ${mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <button id="toggle-mode-btn" style="background: none; border: none; color: #a5b4fc; font-weight: 700; cursor: pointer; font-family: inherit;">
              ${mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        `}
      </div>
    `;

    container.querySelector('#local-only-btn')?.addEventListener('click', () => {
      onLocalOnly?.();
    });

    container.querySelector('#toggle-mode-btn')?.addEventListener('click', () => {
      mode = mode === 'signin' ? 'signup' : 'signin';
      render();
    });

    container.querySelector('#auth-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = container.querySelector('#auth-email').value.trim();
      const password = container.querySelector('#auth-password').value;
      const errorEl = container.querySelector('#auth-error');
      const infoEl = container.querySelector('#auth-info');
      const submitBtn = container.querySelector('#auth-submit-btn');

      errorEl.style.display = 'none';
      infoEl.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Please wait...';

      try {
        if (mode === 'signin') {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          // On success, the caller's onAuthStateChange subscription (set up in app.js)
          // picks up the new session and re-renders — nothing else to do here.
        } else {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          if (!data.session) {
            infoEl.textContent = 'Check your email to confirm your account, then sign in.';
            infoEl.style.display = 'block';
          }
        }
      } catch (err) {
        errorEl.textContent = err.message || 'Something went wrong.';
        errorEl.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = mode === 'signin' ? 'Sign In' : 'Sign Up';
      }
    });
  }

  render();
}
