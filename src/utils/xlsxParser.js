import * as XLSX from 'xlsx';

/**
 * Parses an XLSX file ArrayBuffer or File object and converts it into structured workout logs / routines.
 * Handles both:
 * 1. Log tables (Date, Exercise, Sets, Reps, Weight, Notes)
 * 2. Programme sheets (Day, Exercise, Sets, Rep Range, Rest, Equipment / Setup, Primary Focus, Progression)
 */
export async function parseWorkoutXLSX(fileOrBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });

          const results = [];
          const routinesMap = new Map();

          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (!rawRows || rawRows.length < 2) return;

            // Find header row index
            let headerIdx = -1;
            for (let i = 0; i < Math.min(10, rawRows.length); i++) {
              const rowStr = rawRows[i].join(' ').toLowerCase();
              if (rowStr.includes('exercise') || rowStr.includes('workout') || rowStr.includes('day')) {
                headerIdx = i;
                break;
              }
            }

            if (headerIdx === -1) return;

            const headers = rawRows[headerIdx].map(h => String(h || '').toLowerCase().trim());
            const dataRows = rawRows.slice(headerIdx + 1);

            dataRows.forEach(row => {
              if (!row || row.length === 0) return;

              const getCol = (names) => {
                for (const n of names) {
                  const idx = headers.findIndex(h => h.includes(n));
                  if (idx !== -1 && row[idx] !== undefined && row[idx] !== null && String(row[idx]).trim() !== '') {
                    return String(row[idx]).trim();
                  }
                }
                return '';
              };

              const dayName = getCol(['day', 'date', 'weekday']);
              const exerciseName = getCol(['exercise', 'movement']);
              const setsCountVal = getCol(['sets', 'target sets']);
              const repsVal = getCol(['rep range', 'reps', 'rep']);
              const restVal = getCol(['rest']);
              const focusVal = getCol(['primary focus', 'category', 'muscle']);

              if (!exerciseName) return;

              const setsCount = parseInt(setsCountVal || '3', 10) || 3;
              const repMatch = repsVal.match(/(\d+)/);
              const reps = repMatch ? parseInt(repMatch[1], 10) : 10;

              const sessionKey = dayName || sheetName;

              if (!routinesMap.has(sessionKey)) {
                routinesMap.set(sessionKey, {
                  date: new Date().toISOString().split('T')[0],
                  name: `${dayName} - Workout`,
                  category: focusVal || 'Full Body',
                  exercises: []
                });
              }

              const session = routinesMap.get(sessionKey);
              const setsArr = [];
              for (let s = 0; s < setsCount; s++) {
                setsArr.push({ reps: reps, weight: 15, completed: true });
              }

              session.exercises.push({
                name: exerciseName,
                category: focusVal || 'General',
                sets: setsArr
              });
            });
          });

          const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
          let colorIdx = 0;

          routinesMap.forEach((session) => {
            let totalVol = 0;
            session.exercises.forEach(ex => {
              ex.sets.forEach(s => totalVol += (s.reps * s.weight));
            });

            results.push({
              id: 'xlsx_' + Math.random().toString(36).substr(2, 9),
              date: session.date,
              name: session.name,
              category: session.category,
              color: colors[colorIdx % colors.length],
              icon: '🏋️',
              durationMinutes: 45,
              totalVolume: totalVol,
              notes: 'Imported from Anthony Dumbbell Programme',
              exercises: session.exercises
            });
            colorIdx++;
          });

          resolve(results);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(fileOrBuffer);
    } catch (err) {
      reject(err);
    }
  });
}
