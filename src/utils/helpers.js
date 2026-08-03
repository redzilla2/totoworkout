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
