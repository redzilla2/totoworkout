import { appState } from '../state.js';
import { DAY_NAMES, DAY_SHORT_NAMES, formatDate, formatDisplayDate, calculateBMR, calculateTDEE, calculateCalorieTarget, pickProgram } from '../utils/helpers.js';
import { PROGRAMS } from '../data/defaultRoutines.js';

// Every field the wizard collects, in the order it asks for them. Module-level
// (not component-local) so it survives the re-renders that fire on every
// step change — same pattern used throughout this app (AuthView's `mode`,
// CalendarView's `selectedDay`, etc.).
let step = 0;
let wizard = {
  sex: null,           // 'male' | 'female'
  age: null,
  heightCm: null,
  weightKg: null,
  goal: null,           // 'lose' | 'maintain' | 'gain'
  intensity: null,      // 'gentle' | 'aggressive'
  equipment: null,      // 'dumbbell' | 'gym'
  daysPerWeek: null,
  trainingDays: [],     // array of 0-6 (Sun-Sat), length === daysPerWeek once locked in
  programStartDate: null
};

const STEP_COUNT = 7; // excludes the welcome screen from the progress count

// Defaults the program's start date to the coming Monday (or today, if
// today already is one) — a sensible "start of the week" default without
// forcing today specifically, since most people planning a new program
// think in terms of "starting next week."
function getDefaultStartDate() {
  const d = new Date();
  const day = d.getDay();
  const offsetToMonday = day === 1 ? 0 : (8 - day) % 7;
  d.setDate(d.getDate() + offsetToMonday);
  return formatDate(d);
}

export function renderOnboardingView(container) {
  function render() {
    container.innerHTML = `
      <div class="glass-card" style="max-width: 420px; margin: 24px auto; padding: 28px;">
        ${step > 0 ? `
          <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em; margin-bottom: 6px;">
            STEP ${step} OF ${STEP_COUNT}
          </div>
          <div style="height: 4px; background: rgba(255,255,255,0.08); border-radius: var(--radius-full); margin-bottom: 20px; overflow: hidden;">
            <div style="height: 100%; width: ${(step / STEP_COUNT) * 100}%; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); transition: width 0.3s ease;"></div>
          </div>
        ` : ''}
        ${renderStep()}
      </div>
    `;
    attachHandlers();
  }

  function renderStep() {
    switch (step) {
      case 0: return renderWelcome();
      case 1: return renderAboutYou();
      case 2: return renderGoal();
      case 3: return renderEquipment();
      case 4: return renderDaysPerWeek();
      case 5: return renderStartWeek();
      case 6: return renderPickDays();
      case 7: return renderSummary();
      default: return '';
    }
  }

  function renderWelcome() {
    return `
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 8px;">💪</div>
        <div style="font-size: 1.4rem; font-weight: 800; margin-bottom: 12px;">Welcome to TotoWorkouts</div>
        <div style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.5; margin-bottom: 28px;">
          A few short questions to tailor the perfect experience just for you
          (and don't worry, you can always adjust things later on!).
        </div>
        <button class="btn" id="onb-start-btn">Let's Get Started →</button>
        <button id="onb-skip-btn" style="background: none; border: none; color: var(--text-muted); font-size: 0.8rem; margin-top: 14px; cursor: pointer; font-family: inherit; display: block; width: 100%;">
          Skip for now
        </button>
      </div>
    `;
  }

  function renderAboutYou() {
    return `
      <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px;">About You</div>
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 18px;">
        Used to estimate your calorie needs — you can skip this and still get a workout plan.
      </div>

      <div class="form-group">
        <label class="form-label">Sex at Birth</label>
        <div style="display: flex; gap: 8px;">
          ${['male', 'female'].map(s => `
            <button class="onb-choice-btn" data-field="sex" data-value="${s}" style="flex: 1; padding: 12px; border-radius: var(--radius-md); border: 1px solid ${wizard.sex === s ? 'var(--accent-primary)' : 'var(--border-glass)'}; background: ${wizard.sex === s ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)'}; color: var(--text-primary); font-weight: 700; cursor: pointer; font-family: inherit; text-transform: capitalize;">
              ${s === 'male' ? '♂' : '♀'} ${s}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Age</label>
        <input type="number" class="form-input" id="onb-age" min="13" max="100" value="${wizard.age || ''}" placeholder="e.g. 30">
      </div>

      <div class="form-group">
        <label class="form-label">Height (cm)</label>
        <input type="number" class="form-input" id="onb-height" min="100" max="250" value="${wizard.heightCm || ''}" placeholder="e.g. 178">
      </div>

      <div class="form-group">
        <label class="form-label">Current Weight (kg)</label>
        <input type="number" class="form-input" id="onb-weight" min="30" max="300" step="0.1" value="${wizard.weightKg || ''}" placeholder="e.g. 82.5">
      </div>

      ${renderNav({ back: true, next: true })}
    `;
  }

  function renderGoal() {
    const goals = [
      { id: 'lose', icon: '📉', label: 'Lose Weight' },
      { id: 'maintain', icon: '⚖️', label: 'Maintain' },
      { id: 'gain', icon: '📈', label: 'Gain Weight' }
    ];
    return `
      <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px;">What's Your Goal?</div>
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 18px;">Shapes your suggested daily calorie target.</div>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: ${wizard.goal && wizard.goal !== 'maintain' ? '18px' : '0'};">
        ${goals.map(g => `
          <button class="onb-choice-btn" data-field="goal" data-value="${g.id}" style="padding: 14px; border-radius: var(--radius-md); border: 1px solid ${wizard.goal === g.id ? 'var(--accent-primary)' : 'var(--border-glass)'}; background: ${wizard.goal === g.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)'}; color: var(--text-primary); font-weight: 700; font-size: 0.95rem; cursor: pointer; font-family: inherit; text-align: left;">
            ${g.icon} ${g.label}
          </button>
        `).join('')}
      </div>

      ${wizard.goal && wizard.goal !== 'maintain' ? `
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">How fast?</label>
          <div style="display: flex; gap: 8px;">
            ${[
              { id: 'gentle', icon: '🐢', label: 'Gentle', hint: '0.5 kg/week' },
              { id: 'aggressive', icon: '🚀', label: 'Aggressive', hint: '1 kg/week' }
            ].map(o => `
              <button class="onb-choice-btn" data-field="intensity" data-value="${o.id}" style="flex: 1; padding: 12px; border-radius: var(--radius-md); border: 1px solid ${wizard.intensity === o.id ? 'var(--accent-primary)' : 'var(--border-glass)'}; background: ${wizard.intensity === o.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)'}; color: var(--text-primary); cursor: pointer; font-family: inherit;">
                <div style="font-weight: 700;">${o.icon} ${o.label}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">${o.hint}</div>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${renderNav({ back: true, next: !!wizard.goal && (wizard.goal === 'maintain' || !!wizard.intensity) })}
    `;
  }

  function renderEquipment() {
    const options = [
      { id: 'dumbbell', icon: '🏠', label: 'Home', hint: 'Dumbbells only' },
      { id: 'gym', icon: '🏋️', label: 'Full Gym', hint: 'Barbells, machines, cables' }
    ];
    return `
      <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px;">What Do You Have Access To?</div>
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 18px;">Picks a program that fits your equipment.</div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${options.map(o => `
          <button class="onb-choice-btn" data-field="equipment" data-value="${o.id}" style="padding: 14px; border-radius: var(--radius-md); border: 1px solid ${wizard.equipment === o.id ? 'var(--accent-primary)' : 'var(--border-glass)'}; background: ${wizard.equipment === o.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)'}; color: var(--text-primary); cursor: pointer; font-family: inherit; text-align: left;">
            <div style="font-weight: 700; font-size: 0.95rem;">${o.icon} ${o.label}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${o.hint}</div>
          </button>
        `).join('')}
      </div>

      ${renderNav({ back: true, next: !!wizard.equipment })}
    `;
  }

  function renderDaysPerWeek() {
    const preview = wizard.daysPerWeek ? pickProgram(PROGRAMS, wizard.daysPerWeek, wizard.equipment || 'gym') : null;
    return `
      <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px;">How Many Days a Week Can You Train?</div>
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 18px;">We'll recommend a program built around this.</div>

      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 16px;">
        ${[1, 2, 3, 4, 5, 6, 7].map(n => `
          <button class="onb-choice-btn" data-field="daysPerWeek" data-value="${n}" style="padding: 12px 0; border-radius: var(--radius-md); border: 1px solid ${wizard.daysPerWeek === n ? 'var(--accent-primary)' : 'var(--border-glass)'}; background: ${wizard.daysPerWeek === n ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)'}; color: var(--text-primary); font-weight: 800; cursor: pointer; font-family: inherit;">
            ${n}
          </button>
        `).join('')}
      </div>

      ${preview ? `
        <div style="background: rgba(99, 102, 241, 0.12); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 12px 14px; font-size: 0.85rem;">
          Recommended: <strong>${preview.label}</strong>
        </div>
      ` : ''}

      ${renderNav({ back: true, next: !!wizard.daysPerWeek })}
    `;
  }

  function renderStartWeek() {
    if (!wizard.programStartDate) wizard.programStartDate = getDefaultStartDate();
    return `
      <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px;">When Do You Want to Start?</div>
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 18px;">Defaults to the coming Monday — change it if you'd rather start sooner or later.</div>

      <div class="form-group">
        <label class="form-label">Start Date</label>
        <input type="date" class="form-input" id="onb-start-date" value="${wizard.programStartDate}" min="${formatDate(new Date())}">
      </div>

      ${renderNav({ back: true, next: true })}
    `;
  }

  function renderPickDays() {
    const target = wizard.daysPerWeek || 0;
    const picked = wizard.trainingDays.length;
    const atLimit = picked >= target;
    return `
      <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px;">Which Days Work Best?</div>
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 18px;">
        Pick exactly ${target} day${target === 1 ? '' : 's'} — <strong style="color: ${picked === target ? 'var(--accent-emerald)' : 'var(--text-primary)'};">${picked} of ${target} selected</strong>.
      </div>

      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 20px;">
        ${DAY_SHORT_NAMES.map((label, i) => {
          const selected = wizard.trainingDays.includes(i);
          const disabled = !selected && atLimit;
          return `
            <button class="onb-day-btn" data-day="${i}" ${disabled ? 'disabled' : ''} style="padding: 12px 0; border-radius: var(--radius-md); border: 1px solid ${selected ? 'var(--accent-primary)' : 'var(--border-glass)'}; background: ${selected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)'}; color: ${disabled ? 'var(--text-muted)' : 'var(--text-primary)'}; font-weight: 700; font-size: 0.72rem; cursor: ${disabled ? 'not-allowed' : 'pointer'}; font-family: inherit; opacity: ${disabled ? '0.4' : '1'};">
              ${label}
            </button>
          `;
        }).join('')}
      </div>

      ${renderNav({ back: true, next: picked === target })}
    `;
  }

  function renderSummary() {
    const program = pickProgram(PROGRAMS, wizard.daysPerWeek, wizard.equipment);
    const sortedDays = [...wizard.trainingDays].sort((a, b) => a - b);
    const bmr = calculateBMR({ gender: wizard.sex, age: wizard.age, weightKg: wizard.weightKg, heightCm: wizard.heightCm });
    const tdee = calculateTDEE(bmr, wizard.daysPerWeek);
    const calorieTarget = calculateCalorieTarget(tdee, wizard.goal, wizard.intensity);

    return `
      <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px;">🎉 Your Plan</div>
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 18px;">Review it below, then start whenever you're ready.</div>

      <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 14px; margin-bottom: 12px;">
        <div style="font-weight: 800; margin-bottom: 8px;">🗓️ ${program.label}</div>
        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.82rem;">
          ${sortedDays.map((day, i) => `
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-secondary);">${DAY_NAMES[day]}</span>
              <span style="font-weight: 600;">${program.routineIds[i] ? '💪 Workout' : '🛌 Rest'}</span>
            </div>
          `).join('')}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
          Starting the week of ${formatDisplayDate(wizard.programStartDate)}
        </div>
      </div>

      ${bmr && tdee ? `
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px;">
          <div style="font-weight: 800; margin-bottom: 8px;">🔥 Estimated Calorie Needs</div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
            <span style="color: var(--text-secondary);">BMR (at rest)</span>
            <span style="font-weight: 600;">${bmr.toLocaleString()} kcal</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
            <span style="color: var(--text-secondary);">Maintenance (TDEE)</span>
            <span style="font-weight: 600;">${tdee.toLocaleString()} kcal</span>
          </div>
          ${calorieTarget ? `
            <div style="display: flex; justify-content: space-between; font-size: 0.95rem; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
              <span style="font-weight: 700;">Daily Target${wizard.goal !== 'maintain' ? ` (${wizard.goal}, ${wizard.intensity})` : ''}</span>
              <span style="font-weight: 800; color: var(--accent-primary);">${calorieTarget.target.toLocaleString()} kcal</span>
            </div>
            ${calorieTarget.clamped ? `
              <div style="font-size: 0.72rem; color: #f59e0b; margin-top: 6px;">
                Capped at a safe minimum — that large a deficit isn't recommended without medical supervision.
              </div>
            ` : ''}
          ` : ''}
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 8px;">
            An estimate based on your stats and activity — not a substitute for medical or dietary advice.
          </div>
        </div>
      ` : `
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 20px;">
          No calorie estimate — you skipped the "About You" details.
        </div>
      `}

      <button class="btn" id="onb-finish-btn" style="margin-bottom: 10px;">🚀 Start My Plan</button>
      <button id="onb-back-btn-summary" style="background: none; border: none; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; font-family: inherit; display: block; width: 100%;">
        ← Back
      </button>
    `;
  }

  function renderNav({ back, next }) {
    return `
      <div style="display: flex; gap: 8px; margin-top: 22px;">
        ${back ? `<button class="btn btn-secondary" id="onb-back-btn" style="flex: 1;">← Back</button>` : ''}
        <button class="btn" id="onb-next-btn" style="flex: 2;" ${next ? '' : 'disabled'}>Continue →</button>
      </div>
    `;
  }

  function attachHandlers() {
    container.querySelector('#onb-start-btn')?.addEventListener('click', () => { step = 1; render(); });
    container.querySelector('#onb-skip-btn')?.addEventListener('click', () => appState.skipOnboarding());
    container.querySelector('#onb-back-btn')?.addEventListener('click', () => { step--; render(); });
    container.querySelector('#onb-back-btn-summary')?.addEventListener('click', () => { step = 6; render(); });

    container.querySelectorAll('.onb-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const field = btn.getAttribute('data-field');
        const raw = btn.getAttribute('data-value');
        wizard[field] = field === 'daysPerWeek' ? parseInt(raw, 10) : raw;
        // Changing days-per-week or equipment invalidates a day selection
        // made against the old count/program.
        if (field === 'daysPerWeek' || field === 'equipment') wizard.trainingDays = [];
        // Switching to Maintain drops any leftover gentle/aggressive pick.
        if (field === 'goal' && raw === 'maintain') wizard.intensity = null;
        render();
      });
    });

    container.querySelectorAll('.onb-day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const day = parseInt(btn.getAttribute('data-day'), 10);
        const idx = wizard.trainingDays.indexOf(day);
        if (idx >= 0) wizard.trainingDays.splice(idx, 1);
        else wizard.trainingDays.push(day);
        render();
      });
    });

    container.querySelector('#onb-next-btn')?.addEventListener('click', () => {
      if (step === 1) {
        wizard.age = parseInt(container.querySelector('#onb-age')?.value || '', 10) || null;
        wizard.heightCm = parseFloat(container.querySelector('#onb-height')?.value || '') || null;
        wizard.weightKg = parseFloat(container.querySelector('#onb-weight')?.value || '') || null;
      }
      if (step === 5) {
        wizard.programStartDate = container.querySelector('#onb-start-date')?.value || wizard.programStartDate;
      }
      step++;
      render();
    });

    container.querySelector('#onb-finish-btn')?.addEventListener('click', () => {
      appState.completeOnboarding({ ...wizard });
      // Reset for next time (e.g. a future "Retake Setup").
      step = 0;
      wizard = { sex: null, age: null, heightCm: null, weightKg: null, goal: null, intensity: null, equipment: null, daysPerWeek: null, trainingDays: [], programStartDate: null };
    });
  }

  render();
}
