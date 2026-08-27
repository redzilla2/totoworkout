export function generateSampleHistory() {
  const history = [];

  const routinesMap = {
    1: { // Monday
      name: 'Dumbbell 5 Day - Upper Body A',
      category: 'Push / Upper',
      color: '#3b82f6',
      icon: '🔥',
      exercises: [
        { name: 'Dumbbell Floor Press', category: 'Chest', sets: [{ reps: 8, weight: 20, completed: true }, { reps: 8, weight: 20, completed: true }, { reps: 8, weight: 20, completed: true }] },
        { name: 'Single-Arm Dumbbell Row', category: 'Back', sets: [{ reps: 10, weight: 22, completed: true }, { reps: 10, weight: 22, completed: true }, { reps: 10, weight: 22, completed: true }] },
        { name: 'Standing Dumbbell Shoulder Press', category: 'Shoulders', sets: [{ reps: 8, weight: 14, completed: true }, { reps: 8, weight: 14, completed: true }] },
        { name: 'Dumbbell Lateral Raise', category: 'Shoulders', sets: [{ reps: 12, weight: 8, completed: true }, { reps: 12, weight: 8, completed: true }] },
        { name: 'Hammer Curl', category: 'Arms', sets: [{ reps: 10, weight: 12, completed: true }, { reps: 10, weight: 12, completed: true }] },
        { name: 'Overhead Dumbbell Triceps Extension', category: 'Arms', sets: [{ reps: 10, weight: 16, completed: true }, { reps: 10, weight: 16, completed: true }] }
      ]
    },
    2: { // Tuesday
      name: 'Dumbbell 5 Day - Lower Body A & Core',
      category: 'Legs / Core',
      color: '#10b981',
      icon: '🦵',
      exercises: [
        { name: 'Goblet Squat', category: 'Legs', sets: [{ reps: 10, weight: 24, completed: true }, { reps: 10, weight: 24, completed: true }, { reps: 10, weight: 24, completed: true }] },
        { name: 'Dumbbell Romanian Deadlift', category: 'Legs', sets: [{ reps: 10, weight: 24, completed: true }, { reps: 10, weight: 24, completed: true }, { reps: 10, weight: 24, completed: true }] },
        { name: 'Reverse Lunge', category: 'Legs', sets: [{ reps: 8, weight: 12, completed: true }, { reps: 8, weight: 12, completed: true }] },
        { name: 'Single-Leg Calf Raise', category: 'Legs', sets: [{ reps: 15, weight: 10, completed: true }, { reps: 15, weight: 10, completed: true }] },
        { name: 'Weighted Crunch', category: 'Core', sets: [{ reps: 12, weight: 10, completed: true }, { reps: 12, weight: 10, completed: true }] },
        { name: 'Dead Bug', category: 'Core', sets: [{ reps: 10, weight: 0, completed: true }, { reps: 10, weight: 0, completed: true }] }
      ]
    },
    3: { // Wednesday
      name: 'Dumbbell 5 Day - Arms & Forearms',
      category: 'Arms',
      color: '#8b5cf6',
      icon: '⚡',
      exercises: [
        { name: 'Alternating Dumbbell Curl', category: 'Arms', sets: [{ reps: 10, weight: 12, completed: true }, { reps: 10, weight: 12, completed: true }, { reps: 10, weight: 12, completed: true }] },
        { name: 'Floor Dumbbell Skull Crusher', category: 'Arms', sets: [{ reps: 10, weight: 10, completed: true }, { reps: 10, weight: 10, completed: true }, { reps: 10, weight: 10, completed: true }] },
        { name: 'Cross-Body Hammer Curl', category: 'Arms', sets: [{ reps: 12, weight: 10, completed: true }, { reps: 12, weight: 10, completed: true }] },
        { name: 'Dumbbell Tate Press', category: 'Arms', sets: [{ reps: 12, weight: 8, completed: true }, { reps: 12, weight: 8, completed: true }] },
        { name: 'Dumbbell Reverse Curl', category: 'Arms', sets: [{ reps: 12, weight: 8, completed: true }, { reps: 12, weight: 8, completed: true }] }
      ]
    },
    4: { // Thursday
      name: 'Dumbbell 5 Day - Upper Body B',
      category: 'Push / Upper',
      color: '#f59e0b',
      icon: '💥',
      exercises: [
        { name: 'Neutral-Grip Dumbbell Floor Press', category: 'Chest', sets: [{ reps: 10, weight: 20, completed: true }, { reps: 10, weight: 20, completed: true }, { reps: 10, weight: 20, completed: true }] },
        { name: 'Bent-Over Dumbbell Row', category: 'Back', sets: [{ reps: 10, weight: 20, completed: true }, { reps: 10, weight: 20, completed: true }, { reps: 10, weight: 20, completed: true }] },
        { name: 'Arnold Press', category: 'Shoulders', sets: [{ reps: 10, weight: 12, completed: true }, { reps: 10, weight: 12, completed: true }] },
        { name: 'Bent-Over Rear Delt Raise', category: 'Shoulders', sets: [{ reps: 12, weight: 6, completed: true }, { reps: 12, weight: 6, completed: true }] },
        { name: 'Dumbbell Pullover', category: 'Chest', sets: [{ reps: 12, weight: 18, completed: true }, { reps: 12, weight: 18, completed: true }] },
        { name: 'Lying Leg Raise', category: 'Core', sets: [{ reps: 12, weight: 0, completed: true }, { reps: 12, weight: 0, completed: true }] },
        { name: 'Side Plank', category: 'Core', sets: [{ reps: 40, weight: 0, completed: true }, { reps: 40, weight: 0, completed: true }] }
      ]
    },
    5: { // Friday
      name: 'Dumbbell 5 Day - Lower Body B & Glutes',
      category: 'Legs',
      color: '#ec4899',
      icon: '🎯',
      exercises: [
        { name: 'Double-Dumbbell Front Squat', category: 'Legs', sets: [{ reps: 8, weight: 18, completed: true }, { reps: 8, weight: 18, completed: true }, { reps: 8, weight: 18, completed: true }] },
        { name: 'Dumbbell Romanian Deadlift', category: 'Legs', sets: [{ reps: 10, weight: 24, completed: true }, { reps: 10, weight: 24, completed: true }, { reps: 10, weight: 24, completed: true }] },
        { name: 'Bulgarian Split Squat', category: 'Legs', sets: [{ reps: 8, weight: 12, completed: true }, { reps: 8, weight: 12, completed: true }] },
        { name: 'Dumbbell Glute Bridge', category: 'Legs', sets: [{ reps: 12, weight: 24, completed: true }, { reps: 12, weight: 24, completed: true }] },
        { name: 'Single-Leg Calf Raise', category: 'Legs', sets: [{ reps: 15, weight: 10, completed: true }, { reps: 15, weight: 10, completed: true }] }
      ]
    }
  };

  const fmt = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Generate sessions ONLY for August and September 2026 (starting August 1st)
  const monthsToGenerate = [
    { year: 2026, month: 7, days: 31 }, // August 2026
    { year: 2026, month: 8, days: 30 }  // September 2026
  ];

  monthsToGenerate.forEach(({ year, month, days }) => {
    for (let day = 1; day <= days; day++) {
      const d = new Date(year, month, day);
      const dayOfWeek = d.getDay();

      const matched = routinesMap[dayOfWeek];
      if (matched) {
        const dateStr = fmt(year, month, day);

        let totalVolume = 0;
        matched.exercises.forEach(ex => {
          ex.sets.forEach(s => {
            totalVolume += (s.reps * (s.weight || 1));
          });
        });

        history.push({
          id: `anthony_${dateStr}`,
          date: dateStr,
          name: matched.name,
          category: matched.category,
          color: matched.color,
          icon: matched.icon,
          durationMinutes: 45,
          totalVolume: totalVolume,
          notes: 'Targeting 1-2 RIR.',
          exercises: JSON.parse(JSON.stringify(matched.exercises))
        });
      }
    }
  });

  return history;
}
