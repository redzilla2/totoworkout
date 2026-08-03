export const DEFAULT_ROUTINES = [
  {
    id: 'routine_mon_upper_a',
    name: 'Monday - Upper Body A',
    category: 'Push / Upper',
    icon: '🔥',
    color: '#3b82f6',
    exercises: [
      { exerciseId: 'ex_db_floor_press', defaultSets: 3, defaultReps: 8, defaultWeight: 20 },
      { exerciseId: 'ex_single_arm_db_row', defaultSets: 3, defaultReps: 10, defaultWeight: 22 },
      { exerciseId: 'ex_standing_db_shoulder_press', defaultSets: 2, defaultReps: 8, defaultWeight: 14 },
      { exerciseId: 'ex_db_lateral_raise', defaultSets: 2, defaultReps: 12, defaultWeight: 8 },
      { exerciseId: 'ex_hammer_curl', defaultSets: 2, defaultReps: 10, defaultWeight: 12 },
      { exerciseId: 'ex_overhead_db_tricep_ext', defaultSets: 2, defaultReps: 10, defaultWeight: 16 }
    ]
  },
  {
    id: 'routine_tue_lower_a',
    name: 'Tuesday - Lower Body A & Core',
    category: 'Legs / Core',
    icon: '🦵',
    color: '#10b981',
    exercises: [
      { exerciseId: 'ex_goblet_squat', defaultSets: 3, defaultReps: 10, defaultWeight: 24 },
      { exerciseId: 'ex_db_romanian_deadlift', defaultSets: 3, defaultReps: 10, defaultWeight: 24 },
      { exerciseId: 'ex_reverse_lunge', defaultSets: 2, defaultReps: 8, defaultWeight: 12 },
      { exerciseId: 'ex_single_leg_calf_raise', defaultSets: 2, defaultReps: 15, defaultWeight: 10 },
      { exerciseId: 'ex_weighted_crunch', defaultSets: 2, defaultReps: 12, defaultWeight: 10 },
      { exerciseId: 'ex_dead_bug', defaultSets: 2, defaultReps: 10, defaultWeight: 0 }
    ]
  },
  {
    id: 'routine_wed_arms',
    name: 'Wednesday - Arms & Forearms',
    category: 'Arms',
    icon: '⚡',
    color: '#8b5cf6',
    exercises: [
      { exerciseId: 'ex_alt_db_curl', defaultSets: 3, defaultReps: 10, defaultWeight: 12 },
      { exerciseId: 'ex_floor_db_skull_crusher', defaultSets: 3, defaultReps: 10, defaultWeight: 10 },
      { exerciseId: 'ex_cross_body_hammer_curl', defaultSets: 2, defaultReps: 12, defaultWeight: 10 },
      { exerciseId: 'ex_db_tate_press', defaultSets: 2, defaultReps: 12, defaultWeight: 8 },
      { exerciseId: 'ex_db_reverse_curl', defaultSets: 2, defaultReps: 12, defaultWeight: 8 }
    ]
  },
  {
    id: 'routine_thu_upper_b',
    name: 'Thursday - Upper Body B',
    category: 'Push / Upper',
    icon: '💥',
    color: '#f59e0b',
    exercises: [
      { exerciseId: 'ex_neutral_db_floor_press', defaultSets: 3, defaultReps: 10, defaultWeight: 20 },
      { exerciseId: 'ex_bent_over_db_row', defaultSets: 3, defaultReps: 10, defaultWeight: 20 },
      { exerciseId: 'ex_arnold_press', defaultSets: 2, defaultReps: 10, defaultWeight: 12 },
      { exerciseId: 'ex_bent_over_rear_delt_raise', defaultSets: 2, defaultReps: 12, defaultWeight: 6 },
      { exerciseId: 'ex_db_pullover', defaultSets: 2, defaultReps: 12, defaultWeight: 18 },
      { exerciseId: 'ex_lying_leg_raise', defaultSets: 2, defaultReps: 12, defaultWeight: 0 },
      { exerciseId: 'ex_side_plank', defaultSets: 2, defaultReps: 40, defaultWeight: 0 }
    ]
  },
  {
    id: 'routine_fri_lower_b',
    name: 'Friday - Lower Body B & Glutes',
    category: 'Legs',
    icon: '🎯',
    color: '#ec4899',
    exercises: [
      { exerciseId: 'ex_double_db_front_squat', defaultSets: 3, defaultReps: 8, defaultWeight: 18 },
      { exerciseId: 'ex_db_romanian_deadlift', defaultSets: 3, defaultReps: 10, defaultWeight: 24 },
      { exerciseId: 'ex_bulgarian_split_squat', defaultSets: 2, defaultReps: 8, defaultWeight: 12 },
      { exerciseId: 'ex_db_glute_bridge', defaultSets: 2, defaultReps: 12, defaultWeight: 24 },
      { exerciseId: 'ex_single_leg_calf_raise', defaultSets: 2, defaultReps: 15, defaultWeight: 10 }
    ]
  }
];
