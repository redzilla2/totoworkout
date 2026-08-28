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
 * via state.schedule (a { [dayOfWeek]: routineId|null } map).
 */
export function getScheduledRoutine(state, dateStr) {
  if (!dateStr || !state || !state.schedule) return null;
  const parts = dateStr.split('-');
  if (parts.length < 3) return null;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const routineId = state.schedule[d.getDay()];
  if (!routineId) return null;
  return (state.routines || []).find(r => r.id === routineId) || null;
}
