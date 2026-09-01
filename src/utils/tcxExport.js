/**
 * Builds a minimal, valid Garmin Training Center Database (.tcx) XML
 * document for one logged workout — the file format Strava (and most
 * other fitness platforms) natively import.
 *
 * Deliberately TCX rather than the raw binary .fit format: .fit is
 * Garmin's own byte-level encoding (definition messages, data messages, a
 * CRC checksum, a large table of per-field types) — doable to hand-roll,
 * but far more fragile than a text format, since a single malformed field
 * produces a file that just silently fails to import with no useful error.
 * TCX is plain, well-documented XML that gets the same result into Strava.
 *
 * Strava's file import (fit/tcx/gpx alike) is fundamentally built around a
 * continuous timeline — a duration, not discrete sets/reps/weight — so a
 * strength session can only ever export as a generic duration+calories
 * summary here, same as it'd show up if you logged it as a manual "Weight
 * Training" activity in Strava directly. Cardio exports the same way, just
 * with a specific activity type (Running/Biking) inferred where possible.
 * See getCardioPortion vs getWholeSessionPortion below.
 */

// Trackpoints need *some* start-of-day clock time — this app only tracks
// the date a workout was logged on, not a real time of day, for either
// live sessions (their real startTime isn't persisted onto the finished
// log) or quick/routine-logged entries. Noon is an arbitrary but
// unsurprising placeholder; Strava's stats care about date/duration/
// calories, not the exact clock time, so this is cosmetic.
const PLACEHOLDER_HOUR = 12;

// TCX's Activity Sport attribute only accepts a small enum ('Running',
// 'Biking', 'Other') — everything that isn't clearly one of the first two
// falls back to 'Other', which Strava still imports fine as a generic
// workout.
function inferTcxSport(exerciseNames) {
  const joined = exerciseNames.join(' ').toLowerCase();
  if (/\b(run|running|treadmill|jog)\b/.test(joined)) return 'Running';
  if (/\b(bik|bike|cycl|spin)\b/.test(joined)) return 'Biking';
  return 'Other';
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Sums the cardio-category exercises' minutes/calories out of a logged
 * workout — the portion of it (possibly the whole thing, possibly just
 * part of a mixed session) that's actually exportable as a cardio activity.
 * Returns null if there's nothing cardio in it.
 */
export function getCardioPortion(workoutLog, isCardioCategoryFn) {
  let minutes = 0;
  let calories = 0;
  const exerciseNames = [];
  (workoutLog.exercises || []).forEach(ex => {
    if (!isCardioCategoryFn(ex.category)) return;
    exerciseNames.push(ex.name);
    (ex.sets || []).forEach(s => {
      minutes += (s.minutes || 0);
      calories += (s.calories || 0);
    });
  });
  if (minutes <= 0) return null;
  return { minutes, calories, exerciseNames, isGenericSummary: false };
}

/**
 * Fallback for a session with no cardio component at all (pure strength) —
 * exports the log's own total duration/calories as a generic activity,
 * same shape a manually-added Strava "Weight Training" entry would have.
 * Flagged isGenericSummary so buildActivityTcx's notes can be upfront that
 * this is a duration+calories summary, not a set-by-set record — the file
 * format has no way to carry that regardless of what wrote it.
 */
export function getWholeSessionPortion(workoutLog) {
  const minutes = workoutLog.durationMinutes || 0;
  if (minutes <= 0) return null;
  return {
    minutes,
    calories: workoutLog.totalCalories || 0,
    exerciseNames: (workoutLog.exercises || []).map(ex => ex.name),
    isGenericSummary: true
  };
}

/** Builds the TCX XML string for one logged workout (or just its cardio
 * portion — see getCardioPortion vs getWholeSessionPortion above). */
export function buildActivityTcx(workoutLog, portion) {
  const [y, m, d] = workoutLog.date.split('-').map(Number);
  const start = new Date(y, m - 1, d, PLACEHOLDER_HOUR, 0, 0);
  const end = new Date(start.getTime() + portion.minutes * 60000);
  const startIso = start.toISOString().replace(/\.\d{3}Z$/, 'Z');
  const endIso = end.toISOString().replace(/\.\d{3}Z$/, 'Z');
  const totalSeconds = Math.round(portion.minutes * 60);
  const sport = inferTcxSport(portion.exerciseNames);
  const notes = xmlEscape(
    portion.isGenericSummary
      ? `${workoutLog.name} — logged in TotoWorkouts (duration/calorie summary; set/rep/weight detail isn't carried by this file format)`
      : `${portion.exerciseNames.join(', ') || workoutLog.name} — logged in TotoWorkouts`
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">
  <Activities>
    <Activity Sport="${sport}">
      <Id>${startIso}</Id>
      <Lap StartTime="${startIso}">
        <TotalTimeSeconds>${totalSeconds}</TotalTimeSeconds>
        <DistanceMeters>0</DistanceMeters>
        <Calories>${Math.round(portion.calories)}</Calories>
        <Intensity>Active</Intensity>
        <TriggerMethod>Manual</TriggerMethod>
        <Track>
          <Trackpoint>
            <Time>${startIso}</Time>
          </Trackpoint>
          <Trackpoint>
            <Time>${endIso}</Time>
          </Trackpoint>
        </Track>
      </Lap>
      <Notes>${notes}</Notes>
    </Activity>
  </Activities>
</TrainingCenterDatabase>
`;
}

/** Triggers a browser download of the given TCX XML string. */
export function downloadTcx(xml, filenameBase) {
  const dataStr = 'data:application/xml;charset=utf-8,' + encodeURIComponent(xml);
  const anchor = document.createElement('a');
  anchor.setAttribute('href', dataStr);
  anchor.setAttribute('download', `${filenameBase}.tcx`);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
