/**
 * Format Date to YYYY-MM-DD
 */
export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format display date like "Monday, Oct 24"
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Calculate current workout streak (consecutive active days)
 * STARTS AT 0 - Only increases when a workout is logged/completed by the user!
 */
export function calculateStreak(history) {
  if (!history || history.length === 0) return 0;
  
  // Filter only workouts explicitly logged/completed by the user
  const userLogs = history.filter(item => item.userLogged === true || item.completedByUser === true);
  if (userLogs.length === 0) return 0;

  const datesSet = new Set(userLogs.map(item => item.date));
  let streak = 0;
  const today = new Date();
  
  let checkDate = new Date(today);
  const todayStr = formatDate(checkDate);
  
  if (!datesSet.has(todayStr)) {
    // Check yesterday if today hasn't been logged yet
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  while (datesSet.has(formatDate(checkDate))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  return streak;
}

/**
 * Calculate total volume lifted across all workouts
 */
export function calculateTotalVolume(history) {
  if (!history) return 0;
  return history.reduce((sum, item) => sum + (item.totalVolume || 0), 0);
}

/**
 * Estimate 1 Rep Max using Epley Formula: 1RM = Weight * (1 + Reps/30)
 */
export function calculate1RM(weight, reps) {
  if (!weight || !reps) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/**
 * Cardio exercises are logged by minutes/calories instead of sets of
 * reps/weight — this is the single switch every view checks to decide which
 * shape a given exercise's `sets` entries are in.
 */
export function isCardioCategory(category) {
  return category === 'Cardio';
}

// --- Calorie estimation for strength/resistance training ---
//
// Cardio exercises already carry a user-entered calorie count per set, but
// strength sets never did — there's no way to burn 0 kcal doing a real
// workout, that's just a gap in what got tracked. Estimate it instead, using
// the standard MET (Metabolic Equivalent of Task) formula:
//   kcal = MET × 3.5 × bodyWeightKg / 200 × minutes
// This is the same method most fitness trackers use for activities without a
// heart-rate sensor — it can't know your actual effort, so treat it as a
// reasonable estimate, not a lab-measured number.

// General resistance training at moderate-to-vigorous effort, per the
// Compendium of Physical Activities. One blended value rather than a MET
// per exercise/intensity — good enough for an estimate, and avoids needing
// an effort rating on every single movement.
const STRENGTH_TRAINING_MET = 5.0;

// Used only when the user hasn't logged a body weight yet, so a first
// workout still gets a plausible estimate instead of 0 kcal — a rough
// population-average adult, nothing more.
const DEFAULT_BODY_WEIGHT_KG = 75;

/** Most recent logged body weight, or the population-average fallback. */
export function getLatestBodyWeightKg(state) {
  const logs = state?.bodyWeightLogs;
  if (!logs || logs.length === 0) return DEFAULT_BODY_WEIGHT_KG;
  const latest = [...logs].sort((a, b) => b.date.localeCompare(a.date))[0];
  return latest?.weightKg || DEFAULT_BODY_WEIGHT_KG;
}

/** Estimated calories burned for `minutes` of resistance training. */
export function estimateStrengthCalories(minutes, bodyWeightKg) {
  if (!minutes || minutes <= 0) return 0;
  const weight = bodyWeightKg || DEFAULT_BODY_WEIGHT_KG;
  return Math.round(STRENGTH_TRAINING_MET * 3.5 * weight / 200 * minutes);
}

// Indexed to match JS Date#getDay() (0 = Sunday ... 6 = Saturday)
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * Looks up the routine (if any) scheduled for a given date's day-of-week,
 * via state.schedule (a { [dayOfWeek]: routineId|null } map) — unless that
 * specific date was dismissed from the calendar (state.dismissedScheduleDates,
 * an array of "YYYY-MM-DD" strings), which skips just that one occurrence
 * without touching the recurring weekly pattern.
 */
export function getScheduledRoutine(state, dateStr) {
  if (!dateStr || !state || !state.schedule) return null;
  if (state.dismissedScheduleDates?.includes(dateStr)) return null;
  const parts = dateStr.split('-');
  if (parts.length < 3) return null;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const routineId = state.schedule[d.getDay()];
  if (!routineId) return null;
  return (state.routines || []).find(r => r.id === routineId) || null;
}

// --- Onboarding: BMR / calorie target and program recommendation ---

/**
 * Basal Metabolic Rate via the Mifflin-St Jeor equation — the current
 * standard formula (more accurate than the older Harris-Benedict one).
 * 'other' averages the male/female offsets, since there's no third
 * physiological formula — same approach used by most inclusive BMR tools.
 */
export function calculateBMR({ gender, age, weightKg, heightCm }) {
  if (!age || !weightKg || !heightCm) return null;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const offset = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
  return Math.round(base + offset);
}

/**
 * BMR alone is "calories to stay alive lying still" — scale it by activity
 * level to get an actual daily calorie target (TDEE). Derived from training
 * days/week rather than asking a separate "how active are you" question,
 * using the standard Harris-Benedict activity multipliers.
 */
export function calculateTDEE(bmr, trainingDaysPerWeek) {
  if (!bmr) return null;
  let multiplier;
  if (trainingDaysPerWeek <= 1) multiplier = 1.2;      // sedentary
  else if (trainingDaysPerWeek <= 3) multiplier = 1.375; // lightly active
  else if (trainingDaysPerWeek <= 5) multiplier = 1.55;  // moderately active
  else multiplier = 1.725;                                // very active
  return Math.round(bmr * multiplier);
}

// Roughly 7700 kcal per kg of body fat — the commonly-used international
// approximation (the "3500 kcal per lb" figure most US sources cite, converted).
const KCAL_PER_KG = 7700;

// Weekly rate of change for each intensity option, in kg — used to turn a
// goal into a daily calorie adjustment from TDEE.
const GOAL_INTENSITY_KG_PER_WEEK = { gentle: 0.5, aggressive: 1 };

// Never suggest a target below this, regardless of how aggressive a deficit
// works out to — a floor most nutrition guidance agrees is the point where
// "just eat less" needs medical supervision instead of an app's estimate.
const MIN_SAFE_CALORIE_TARGET = 1200;

/**
 * Turns a maintenance calorie figure (TDEE) into a daily target for the
 * chosen goal. `goal` is 'lose' | 'maintain' | 'gain'; `intensity` is
 * 'gentle' (0.5 kg/week) | 'aggressive' (1 kg/week) — ignored for 'maintain'.
 * Returns { target, clamped } — `clamped` is true when a deficit would have
 * gone under the safety floor and was capped instead.
 */
export function calculateCalorieTarget(tdee, goal, intensity) {
  if (!tdee) return null;
  if (goal !== 'lose' && goal !== 'gain') return { target: tdee, clamped: false };

  const kgPerWeek = GOAL_INTENSITY_KG_PER_WEEK[intensity] || GOAL_INTENSITY_KG_PER_WEEK.gentle;
  const dailyAdjustment = Math.round((kgPerWeek * KCAL_PER_KG) / 7);
  const raw = goal === 'lose' ? tdee - dailyAdjustment : tdee + dailyAdjustment;

  if (goal === 'lose' && raw < MIN_SAFE_CALORIE_TARGET) {
    return { target: MIN_SAFE_CALORIE_TARGET, clamped: true };
  }
  return { target: raw, clamped: false };
}

/**
 * Picks the built-in program (see data/defaultRoutines.js PROGRAMS) that
 * best fits the number of days the user can train, preferring an exact
 * match on daysPerWeek and breaking ties (currently only the two 5-day
 * programs) by equipment access. Falls back to the closest daysPerWeek
 * among all programs for counts outside the 3-6 range any program covers.
 */
export function pickProgram(programs, daysPerWeek, equipment) {
  const exact = programs.filter(p => p.daysPerWeek === daysPerWeek);
  if (exact.length > 0) {
    return exact.find(p => p.equipment === equipment) || exact[0];
  }
  let closest = programs[0];
  let closestDiff = Math.abs(programs[0].daysPerWeek - daysPerWeek);
  programs.forEach(p => {
    const diff = Math.abs(p.daysPerWeek - daysPerWeek);
    if (diff < closestDiff || (diff === closestDiff && p.equipment === equipment)) {
      closest = p;
      closestDiff = diff;
    }
  });
  return closest;
}
