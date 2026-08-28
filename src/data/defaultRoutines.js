export const DEFAULT_ROUTINES = [
  {
    id: 'routine_mon_upper_a',
    name: 'Dumbbell 5 Day - Upper Body A',
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
    name: 'Dumbbell 5 Day - Lower Body A & Core',
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
    name: 'Dumbbell 5 Day - Arms & Forearms',
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
    name: 'Dumbbell 5 Day - Upper Body B',
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
    name: 'Dumbbell 5 Day - Lower Body B & Glutes',
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
  },

  // Upper/Lower Split - 6 Week Program (4-day split, run for 6 weeks with progressive overload)
  {
    id: 'routine_ul_upper_1',
    name: 'UpperLower 4 Day - Upper 1',
    category: 'Upper Body',
    icon: '💪',
    color: '#0ea5e9',
    exercises: [
      { exerciseId: 'ex_bench_press', defaultSets: 3, defaultReps: 5, defaultWeight: 0, repRange: '5-8' },
      { exerciseId: 'ex_dumbbell_ohp', defaultSets: 3, defaultReps: 6, defaultWeight: 0, repRange: '6-10' },
      { exerciseId: 'ex_weighted_chinup', defaultSets: 3, defaultReps: 6, defaultWeight: 0, repRange: '6-10' },
      { exerciseId: 'ex_single_arm_db_row', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_cable_lateral_raise', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_close_grip_bench', defaultSets: 3, defaultReps: 6, defaultWeight: 0, repRange: '6-10' },
      { exerciseId: 'ex_tricep_rope_pushdown', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' }
    ]
  },
  {
    id: 'routine_ul_lower_1',
    name: 'UpperLower 4 Day - Lower 1',
    category: 'Lower Body',
    icon: '🦵',
    color: '#22c55e',
    exercises: [
      { exerciseId: 'ex_squat', defaultSets: 3, defaultReps: 5, defaultWeight: 0, repRange: '5-8' },
      { exerciseId: 'ex_rdl', defaultSets: 3, defaultReps: 6, defaultWeight: 0, repRange: '6-10' },
      { exerciseId: 'ex_leg_press', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_lunges', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-10' },
      { exerciseId: 'ex_calf_raise_standing', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_abs_triset', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: 'triset' },
      { exerciseId: 'ex_barbell_curl', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' }
    ]
  },
  {
    id: 'routine_ul_upper_2',
    name: 'UpperLower 4 Day - Upper 2',
    category: 'Upper Body',
    icon: '🔥',
    color: '#a855f7',
    exercises: [
      { exerciseId: 'ex_incline_db_bench', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_barbell_ohp', defaultSets: 3, defaultReps: 5, defaultWeight: 0, repRange: '5-8' },
      { exerciseId: 'ex_barbell_row', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_lat_pulldown', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' },
      { exerciseId: 'ex_dips', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_cable_lateral_raise', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-13' },
      { exerciseId: 'ex_skullcrushers', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' }
    ]
  },
  {
    id: 'routine_ul_lower_2',
    name: 'UpperLower 4 Day - Lower 2',
    category: 'Lower Body',
    icon: '⚡',
    color: '#f97316',
    exercises: [
      { exerciseId: 'ex_deadlift', defaultSets: 3, defaultReps: 5, defaultWeight: 0, repRange: '5' },
      { exerciseId: 'ex_front_squat', defaultSets: 3, defaultReps: 6, defaultWeight: 0, repRange: '6-10' },
      { exerciseId: 'ex_bulgarian_split_squat', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-12' },
      { exerciseId: 'ex_leg_extension', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' },
      { exerciseId: 'ex_leg_curl', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' },
      { exerciseId: 'ex_calf_raise_machine', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' },
      { exerciseId: 'ex_abs_triset', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: 'triset' },
      { exerciseId: 'ex_dumbbell_curl', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' }
    ]
  },

  // Gym Full Body Split - 3 Day Program
  {
    id: 'routine_fb_day1',
    name: 'FullBody 3 Day - Day 1',
    category: 'Full Body',
    icon: '🏋️',
    color: '#14b8a6',
    exercises: [
      { exerciseId: 'ex_fedb_barbell_squat', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_bench_press', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_lat_pulldown', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_fedb_barbell_shoulder_press', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' },
      { exerciseId: 'ex_barbell_curl', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' },
      { exerciseId: 'ex_skullcrushers', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' },
      { exerciseId: 'ex_leg_curl', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' }
    ]
  },
  {
    id: 'routine_fb_day2',
    name: 'FullBody 3 Day - Day 2',
    category: 'Full Body',
    icon: '🚀',
    color: '#eab308',
    exercises: [
      { exerciseId: 'ex_barbell_row', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_incline_db_bench', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_fedb_standing_dumbbell_upright_row', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' },
      { exerciseId: 'ex_db_lateral_raise', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' },
      { exerciseId: 'ex_hammer_curl', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' },
      { exerciseId: 'ex_fedb_triceps_pushdown', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' },
      { exerciseId: 'ex_leg_extension', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_fedb_seated_leg_curl', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' }
    ]
  },
  {
    id: 'routine_fb_day3',
    name: 'FullBody 3 Day - Day 3',
    category: 'Full Body',
    icon: '🔱',
    color: '#f43f5e',
    exercises: [
      { exerciseId: 'ex_rdl', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_chest_supported_row_neutral', defaultSets: 4, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_leg_press', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_fedb_flat_bench_cable_flyes', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_fedb_reverse_flyes', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_fedb_reverse_barbell_curl', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' },
      { exerciseId: 'ex_french_press_overhead_ext', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' }
    ]
  }
];
