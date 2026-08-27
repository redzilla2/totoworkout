import { supabase } from '../supabaseClient.js';

export function renderUpdatePasswordView(container, { onDone } = {}) {
  container.innerHTML = `
    <div class="glass-card" style="max-width: 360px; margin: 60px auto; padding: 28px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 40px;">🔑</div>
        <div style="font-size: 1.3rem; font-weight: 800; margin-top: 4px;">Set a New Password</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
          Choose a new password for your account.
        </div>
      </div>

      <form id="update-password-form">
        <div class="form-group">
          <label class="form-label">New Password</label>
          <input type="password" class="form-input" id="new-password" required minlength="6" autocomplete="new-password">
        </div>
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <input type="password" class="form-input" id="confirm-password" required minlength="6" autocomplete="new-password">
        </div>

        <div id="update-password-error" style="color: var(--accent-rose); font-size: 0.8rem; margin-bottom: 10px; display: none;"></div>

        <button type="submit" class="btn" id="update-password-submit-btn">Save New Password</button>
      </form>
    </div>
  `;

  container.querySelector('#update-password-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = container.querySelector('#new-password').value;
    const confirmPassword = container.querySelector('#confirm-password').value;
    const errorEl = container.querySelector('#update-password-error');
    const submitBtn = container.querySelector('#update-password-submit-btn');

    errorEl.style.display = 'none';

    if (newPassword !== confirmPassword) {
      errorEl.textContent = "Passwords don't match.";
      errorEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      onDone?.();
    } catch (err) {
      errorEl.textContent = err.message || 'Something went wrong.';
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save New Password';
    }
  });
}
