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
  },

  // Push Pull Legs Split - 6 Day Program (strength days 1-3, hypertrophy days 4-6;
  // source: thefitnessphantom.com/push-pull-legs-6-day-split-for-strength-and-hypertrophy)
  {
    id: 'routine_ppl_day1_push_str',
    name: 'PPL 6 Day - Push Strength',
    category: 'Push',
    icon: '📤',
    color: '#dc2626',
    exercises: [
      { exerciseId: 'ex_bench_press', defaultSets: 4, defaultReps: 8, defaultWeight: 0, repRange: '8,8,6,6' },
      { exerciseId: 'ex_incline_db_bench', defaultSets: 4, defaultReps: 8, defaultWeight: 0, repRange: '8,8,6,6' },
      { exerciseId: 'ex_barbell_ohp', defaultSets: 4, defaultReps: 8, defaultWeight: 0, repRange: '8,8,6,6' },
      { exerciseId: 'ex_dips', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_fedb_triceps_pushdown', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' }
    ]
  },
  {
    id: 'routine_ppl_day2_pull_str',
    name: 'PPL 6 Day - Pull Strength',
    category: 'Pull',
    icon: '📥',
    color: '#2563eb',
    exercises: [
      { exerciseId: 'ex_deadlift', defaultSets: 5, defaultReps: 8, defaultWeight: 0, repRange: '8,7,6,5,4' },
      { exerciseId: 'ex_fedb_weighted_pull_ups', defaultSets: 3, defaultReps: 4, defaultWeight: 0, repRange: '4-10' },
      { exerciseId: 'ex_lat_pulldown', defaultSets: 4, defaultReps: 8, defaultWeight: 0, repRange: '8,8,6,6' },
      { exerciseId: 'ex_fedb_seated_cable_rows', defaultSets: 4, defaultReps: 8, defaultWeight: 0, repRange: '8,8,6,6' },
      { exerciseId: 'ex_barbell_curl', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10,8,6' }
    ]
  },
  {
    id: 'routine_ppl_day3_legs_str',
    name: 'PPL 6 Day - Legs Strength',
    category: 'Legs / Core',
    icon: '🦵',
    color: '#16a34a',
    exercises: [
      { exerciseId: 'ex_squat', defaultSets: 4, defaultReps: 8, defaultWeight: 0, repRange: '8,8,6,6' },
      { exerciseId: 'ex_leg_press', defaultSets: 4, defaultReps: 8, defaultWeight: 0, repRange: '8,8,6,6' },
      { exerciseId: 'ex_smith_machine_lunges', defaultSets: 2, defaultReps: 8, defaultWeight: 0, repRange: '8 per side' },
      { exerciseId: 'ex_db_romanian_deadlift', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8,6,4' },
      { exerciseId: 'ex_fedb_barbell_hip_thrust', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8' },
      { exerciseId: 'ex_fedb_hanging_leg_raise', defaultSets: 2, defaultReps: 10, defaultWeight: 0, repRange: '10' },
      { exerciseId: 'ex_fedb_standing_cable_wood_chop', defaultSets: 2, defaultReps: 10, defaultWeight: 0, repRange: '10' },
      { exerciseId: 'ex_fedb_plank', defaultSets: 2, defaultReps: 60, defaultWeight: 0 }
    ]
  },
  {
    id: 'routine_ppl_day4_push_hyp',
    name: 'PPL 6 Day - Push Hypertrophy',
    category: 'Push',
    icon: '📤',
    color: '#fb923c',
    exercises: [
      { exerciseId: 'ex_fedb_barbell_incline_bench_press_medium_grip', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_fedb_butterfly', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_fedb_cable_crossover', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_dumbbell_ohp', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_fedb_front_dumbbell_raise', defaultSets: 4, defaultReps: 8, defaultWeight: 0, repRange: '8-10' },
      { exerciseId: 'ex_one_arm_overhead_tricep_ext', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_crossbody_tricep_pushdown', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10/arm' }
    ]
  },
  {
    id: 'routine_ppl_day5_pull_hyp',
    name: 'PPL 6 Day - Pull Hypertrophy',
    category: 'Pull',
    icon: '📥',
    color: '#38bdf8',
    exercises: [
      { exerciseId: 'ex_fedb_pullups', defaultSets: 4, defaultReps: 10, defaultWeight: 0, repRange: 'Max Reps' },
      { exerciseId: 'ex_fedb_close_grip_front_lat_pulldown', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_fedb_lying_t_bar_row', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_fedb_straight_arm_pulldown', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_fedb_face_pull', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_fedb_barbell_shrug', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12,10,10' },
      { exerciseId: 'ex_fedb_preacher_curl', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_fedb_reverse_barbell_curl', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' }
    ]
  },
  {
    id: 'routine_ppl_day6_legs_hyp',
    name: 'PPL 6 Day - Legs Hypertrophy',
    category: 'Legs / Core',
    icon: '🦵',
    color: '#4ade80',
    exercises: [
      { exerciseId: 'ex_leg_extension', defaultSets: 4, defaultReps: 20, defaultWeight: 0, repRange: '20,15,12,10' },
      { exerciseId: 'ex_fedb_hack_squat', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_leg_curl', defaultSets: 4, defaultReps: 20, defaultWeight: 0, repRange: '20,15,12,10' },
      { exerciseId: 'ex_bulgarian_split_squat', defaultSets: 2, defaultReps: 10, defaultWeight: 0, repRange: '10 per leg' },
      { exerciseId: 'ex_fedb_hyperextensions_back_extensions', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' },
      { exerciseId: 'ex_fedb_cable_crunch', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15-20' },
      { exerciseId: 'ex_fedb_hanging_leg_raise', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15-20' },
      { exerciseId: 'ex_knee_to_elbow_cable_crunch', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10/side' },
      { exerciseId: 'ex_fedb_ab_roller', defaultSets: 2, defaultReps: 60, defaultWeight: 0 }
    ]
  },

  // Hybrid Split - 5 Day Program (each major muscle group trained twice a
  // week; source: thefitnessphantom.com/5-day-gym-workout-schedule-with-pdf)
  {
    id: 'routine_hybrid5_day1',
    name: 'Hybrid 5 Day - Chest, Delts & Triceps',
    category: 'Push',
    icon: '🧨',
    color: '#f472b6',
    exercises: [
      { exerciseId: 'ex_bench_press', defaultSets: 4, defaultReps: 12, defaultWeight: 0, repRange: '12,10,8,6' },
      { exerciseId: 'ex_incline_db_bench', defaultSets: 4, defaultReps: 12, defaultWeight: 0, repRange: '12,10,8,6' },
      { exerciseId: 'ex_fedb_butterfly', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10' },
      { exerciseId: 'ex_dips', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-12' },
      { exerciseId: 'ex_cable_lateral_raise', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10/arm' },
      { exerciseId: 'ex_fedb_triceps_pushdown_rope_attachment', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' },
      { exerciseId: 'ex_one_arm_overhead_tricep_ext', defaultSets: 2, defaultReps: 10, defaultWeight: 0, repRange: '10/arm' }
    ]
  },
  {
    id: 'routine_hybrid5_day2',
    name: 'Hybrid 5 Day - Quads, Calves & Abs',
    category: 'Legs / Core',
    icon: '🦿',
    color: '#34d399',
    exercises: [
      { exerciseId: 'ex_squat', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' },
      { exerciseId: 'ex_leg_press', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' },
      { exerciseId: 'ex_leg_extension', defaultSets: 4, defaultReps: 20, defaultWeight: 0, repRange: '20,15,12,10' },
      { exerciseId: 'ex_calf_raise_standing', defaultSets: 4, defaultReps: 20, defaultWeight: 0, repRange: '20,15,12,10' },
      { exerciseId: 'ex_abs_circuit_10min', defaultSets: 1, defaultReps: 600, defaultWeight: 0 }
    ]
  },
  {
    id: 'routine_hybrid5_day3',
    name: 'Hybrid 5 Day - Back, Biceps & Forearms',
    category: 'Pull',
    icon: '🪝',
    color: '#818cf8',
    exercises: [
      { exerciseId: 'ex_fedb_pullups', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: 'To Failure' },
      { exerciseId: 'ex_lat_pulldown', defaultSets: 4, defaultReps: 12, defaultWeight: 0, repRange: '12,10,8,6' },
      { exerciseId: 'ex_fedb_seated_cable_rows', defaultSets: 4, defaultReps: 12, defaultWeight: 0, repRange: '12,10,8,6' },
      { exerciseId: 'ex_barbell_row', defaultSets: 4, defaultReps: 12, defaultWeight: 0, repRange: '12,10,8,6' },
      { exerciseId: 'ex_fedb_cable_rear_delt_fly', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' },
      { exerciseId: 'ex_barbell_curl', defaultSets: 3, defaultReps: 20, defaultWeight: 0, repRange: '20,15,12' },
      { exerciseId: 'ex_fedb_concentration_curls', defaultSets: 3, defaultReps: 15, defaultWeight: 0, repRange: '15/arm' },
      { exerciseId: 'ex_dumbbell_wrist_extension', defaultSets: 3, defaultReps: 12, defaultWeight: 0, repRange: '12-15' }
    ]
  },
  {
    id: 'routine_hybrid5_day4',
    name: 'Hybrid 5 Day - Chest, Hamstrings & Glutes',
    category: 'Full Body',
    icon: '🧱',
    color: '#fbbf24',
    exercises: [
      { exerciseId: 'ex_fedb_barbell_incline_bench_press_medium_grip', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' },
      { exerciseId: 'ex_high_to_low_cable_fly', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' },
      { exerciseId: 'ex_fedb_dumbbell_lunges', defaultSets: 2, defaultReps: 15, defaultWeight: 0, repRange: '15/leg' },
      { exerciseId: 'ex_leg_curl', defaultSets: 4, defaultReps: 20, defaultWeight: 0, repRange: '20,15,12,10' },
      { exerciseId: 'ex_rdl', defaultSets: 4, defaultReps: 12, defaultWeight: 0, repRange: '12,10,8,6' },
      { exerciseId: 'ex_fedb_standing_cable_wood_chop', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10/side' },
      { exerciseId: 'ex_fedb_landmine_180_s', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10/side' }
    ]
  },
  {
    id: 'routine_hybrid5_day5',
    name: 'Hybrid 5 Day - Back & Shoulders',
    category: 'Pull / Shoulders',
    icon: '🛡️',
    color: '#22d3ee',
    exercises: [
      { exerciseId: 'ex_arnold_press', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' },
      { exerciseId: 'ex_bent_over_rear_delt_raise', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' },
      { exerciseId: 'ex_fedb_close_grip_front_lat_pulldown', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' },
      { exerciseId: 'ex_fedb_t_bar_row_with_handle', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' },
      { exerciseId: 'ex_single_arm_db_row', defaultSets: 2, defaultReps: 15, defaultWeight: 0, repRange: '15/side' },
      { exerciseId: 'ex_fedb_dumbbell_shrug', defaultSets: 4, defaultReps: 15, defaultWeight: 0, repRange: '15,12,10,8' }
    ]
  }
];
