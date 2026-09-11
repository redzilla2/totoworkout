// Built-in routine ids that used to exist here but were deliberately
// removed (not renamed — see syncBuiltInRoutineMetadata in state.js for
// renames, which are handled separately). A saved account that already has
// one of these gets it pruned on next load, including any weekly-schedule
// day pointing at it — see state.js. Never add a user-created routine's id
// here; those use a distinct 'routine_custom_'/'routine_<timestamp>' id
// scheme and are never touched by this list.
export const REMOVED_BUILTIN_ROUTINE_IDS = [
  'routine_wed_arms' // folded the 5-day Dumbbell program down to 4 (Upper Lower 4 Day DB)
];

export const DEFAULT_ROUTINES = [
  {
    id: 'routine_mon_upper_a',
    name: 'Upper Lower 4 Day DB - Upper Body A',
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
    name: 'Upper Lower 4 Day DB - Lower Body A & Core',
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
    id: 'routine_thu_upper_b',
    name: 'Upper Lower 4 Day DB - Upper Body B',
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
    name: 'Upper Lower 4 Day DB - Lower Body B & Glutes',
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
  },

  // Kettlebell Full Body Split - 3 Day Program (ballistic/full-body focus
  // each day, rather than a body-part split — the standard way kettlebell
  // training is programmed)
  {
    id: 'routine_kb_day1',
    name: 'Kettlebell 3 Day - Day 1',
    category: 'Full Body',
    icon: '🔔',
    color: '#7c3aed',
    exercises: [
      { exerciseId: 'ex_kb_swing', defaultSets: 4, defaultReps: 15, defaultWeight: 16 },
      { exerciseId: 'ex_kb_goblet_squat', defaultSets: 3, defaultReps: 10, defaultWeight: 16 },
      { exerciseId: 'ex_kb_single_arm_ohp', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8/arm' },
      { exerciseId: 'ex_fedb_one_arm_kettlebell_row', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '10/arm' },
      { exerciseId: 'ex_fedb_kettlebell_turkish_get_up_squat_style', defaultSets: 3, defaultReps: 3, defaultWeight: 12, repRange: '3/side' },
      { exerciseId: 'ex_kb_russian_twist', defaultSets: 3, defaultReps: 20, defaultWeight: 8 }
    ]
  },
  {
    id: 'routine_kb_day2',
    name: 'Kettlebell 3 Day - Day 2',
    category: 'Full Body',
    icon: '💥',
    color: '#0891b2',
    exercises: [
      { exerciseId: 'ex_kb_clean', defaultSets: 4, defaultReps: 8, defaultWeight: 16, repRange: '8/arm' },
      { exerciseId: 'ex_kb_snatch', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8/arm' },
      { exerciseId: 'ex_fedb_alternating_renegade_row', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '5/side' },
      { exerciseId: 'ex_kb_push_press', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8/arm' },
      { exerciseId: 'ex_kb_reverse_lunge', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '10/leg' },
      { exerciseId: 'ex_fedb_kettlebell_windmill', defaultSets: 3, defaultReps: 6, defaultWeight: 12, repRange: '6/side' }
    ]
  },
  {
    id: 'routine_kb_day3',
    name: 'Kettlebell 3 Day - Day 3',
    category: 'Full Body',
    icon: '🌀',
    color: '#db2777',
    exercises: [
      { exerciseId: 'ex_kb_sumo_deadlift', defaultSets: 4, defaultReps: 10, defaultWeight: 20 },
      { exerciseId: 'ex_fedb_kettlebell_one_legged_deadlift', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8/leg' },
      { exerciseId: 'ex_kb_floor_press', defaultSets: 3, defaultReps: 10, defaultWeight: 16 },
      { exerciseId: 'ex_kb_halo', defaultSets: 3, defaultReps: 10, defaultWeight: 8, repRange: '10/direction' },
      { exerciseId: 'ex_fedb_one_arm_kettlebell_row', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '10/arm' },
      { exerciseId: 'ex_kb_russian_twist', defaultSets: 3, defaultReps: 20, defaultWeight: 8 }
    ]
  },

  // Kettlebell 2 Day Program (alternating Strength / Power & Conditioning
  // full-body days — the standard low-frequency kettlebell structure per
  // general kettlebell-training guidance: 2-3x/week full body, blending
  // strength work with ballistic conditioning)
  {
    id: 'routine_kb2_day1',
    name: 'Kettlebell 2 Day - Day 1 (Strength Focus)',
    category: 'Full Body',
    icon: '🔔',
    color: '#7c3aed',
    exercises: [
      { exerciseId: 'ex_kb_goblet_squat', defaultSets: 4, defaultReps: 10, defaultWeight: 20 },
      { exerciseId: 'ex_kb_deadlift', defaultSets: 4, defaultReps: 8, defaultWeight: 20 },
      { exerciseId: 'ex_kb_single_arm_ohp', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8/arm' },
      { exerciseId: 'ex_fedb_one_arm_kettlebell_row', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '10/arm' },
      { exerciseId: 'ex_fedb_kettlebell_turkish_get_up_squat_style', defaultSets: 3, defaultReps: 3, defaultWeight: 12, repRange: '3/side' },
      { exerciseId: 'ex_kb_russian_twist', defaultSets: 3, defaultReps: 20, defaultWeight: 8 }
    ]
  },
  {
    id: 'routine_kb2_day2',
    name: 'Kettlebell 2 Day - Day 2 (Power & Conditioning Focus)',
    category: 'Full Body',
    icon: '💥',
    color: '#0891b2',
    exercises: [
      { exerciseId: 'ex_kb_swing', defaultSets: 5, defaultReps: 15, defaultWeight: 16 },
      { exerciseId: 'ex_kb_clean', defaultSets: 4, defaultReps: 8, defaultWeight: 16, repRange: '8/arm' },
      { exerciseId: 'ex_kb_snatch', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8/arm' },
      { exerciseId: 'ex_kb_reverse_lunge', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '10/leg' },
      { exerciseId: 'ex_fedb_alternating_renegade_row', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '5/side' },
      { exerciseId: 'ex_fedb_kettlebell_windmill', defaultSets: 3, defaultReps: 6, defaultWeight: 12, repRange: '6/side' }
    ]
  },

  // Kettlebell 4 Day Program - Upper/Lower Split (source:
  // thefitnessphantom.com/4-day-kettlebell-workout-plan, "Plan A") — mirrors
  // the existing UpperLower 4 Day gym program's structure, just with
  // kettlebell-only movements.
  {
    id: 'routine_kb4_upper1',
    name: 'Kettlebell 4 Day - Upper 1',
    category: 'Upper Body',
    icon: '🔔',
    color: '#0ea5e9',
    exercises: [
      { exerciseId: 'ex_kb_pushup', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' },
      { exerciseId: 'ex_kb_floor_press', defaultSets: 2, defaultReps: 10, defaultWeight: 16, repRange: '10-15' },
      { exerciseId: 'ex_kb_gorilla_row', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '10-15' },
      { exerciseId: 'ex_kb_push_press', defaultSets: 3, defaultReps: 10, defaultWeight: 12, repRange: '10-12' },
      { exerciseId: 'ex_kb_swing', defaultSets: 3, defaultReps: 15, defaultWeight: 16, repRange: '15-20' },
      { exerciseId: 'ex_kb_kneeling_chop', defaultSets: 2, defaultReps: 10, defaultWeight: 8, repRange: '10/side' }
    ]
  },
  {
    id: 'routine_kb4_lower1',
    name: 'Kettlebell 4 Day - Lower 1',
    category: 'Lower Body',
    icon: '🦵',
    color: '#22c55e',
    exercises: [
      { exerciseId: 'ex_kb_suitcase_deadlift', defaultSets: 3, defaultReps: 10, defaultWeight: 20, repRange: '10-12' },
      { exerciseId: 'ex_kb_goblet_squat', defaultSets: 3, defaultReps: 10, defaultWeight: 20, repRange: '10-15' },
      { exerciseId: 'ex_kb_front_lunge', defaultSets: 3, defaultReps: 10, defaultWeight: 12, repRange: '10/leg' },
      { exerciseId: 'ex_kb_hamstring_march', defaultSets: 2, defaultReps: 10, defaultWeight: 0, repRange: '10/leg' },
      { exerciseId: 'ex_kb_step_up', defaultSets: 3, defaultReps: 10, defaultWeight: 12, repRange: '10/leg' },
      { exerciseId: 'ex_kb_glute_bridge', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '10-12' }
    ]
  },
  {
    id: 'routine_kb4_upper2',
    name: 'Kettlebell 4 Day - Upper 2',
    category: 'Upper Body',
    icon: '🔥',
    color: '#a855f7',
    exercises: [
      { exerciseId: 'ex_fedb_kettlebell_seesaw_press', defaultSets: 3, defaultReps: 10, defaultWeight: 12, repRange: '10-12' },
      { exerciseId: 'ex_fedb_alternating_renegade_row', defaultSets: 2, defaultReps: 10, defaultWeight: 16, repRange: '10-15' },
      { exerciseId: 'ex_kb_close_grip_pushup', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10-15' },
      { exerciseId: 'ex_kb_halo', defaultSets: 3, defaultReps: 15, defaultWeight: 8, repRange: '15-20' },
      { exerciseId: 'ex_fedb_kettlebell_thruster', defaultSets: 2, defaultReps: 10, defaultWeight: 12, repRange: '10/side' },
      { exerciseId: 'ex_kb_slashers', defaultSets: 2, defaultReps: 10, defaultWeight: 8, repRange: '10/side' },
      { exerciseId: 'ex_kb_crush_curl', defaultSets: 2, defaultReps: 12, defaultWeight: 10, repRange: '12-15' }
    ]
  },
  {
    id: 'routine_kb4_lower2',
    name: 'Kettlebell 4 Day - Lower 2',
    category: 'Lower Body',
    icon: '⚡',
    color: '#f97316',
    exercises: [
      { exerciseId: 'ex_kb_deck_squat', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '10-12' },
      { exerciseId: 'ex_kb_bob_and_weave', defaultSets: 3, defaultReps: 10, defaultWeight: 12, repRange: '10/leg' },
      { exerciseId: 'ex_fedb_kettlebell_one_legged_deadlift', defaultSets: 2, defaultReps: 10, defaultWeight: 12, repRange: '10/leg' },
      { exerciseId: 'ex_kb_bulgarian_split_squat', defaultSets: 3, defaultReps: 10, defaultWeight: 12, repRange: '10/leg' },
      { exerciseId: 'ex_kb_unilateral_leg_curl', defaultSets: 3, defaultReps: 10, defaultWeight: 0, repRange: '10/leg' }
    ]
  },

  // Kettlebell 5 Day Program - Push/Pull/Legs Split (source:
  // thefitnessphantom.com/5-day-kettlebell-workout-routine)
  {
    id: 'routine_kb5_push1',
    name: 'Kettlebell 5 Day - Push',
    category: 'Push',
    icon: '📤',
    color: '#dc2626',
    exercises: [
      { exerciseId: 'ex_kb_pushup', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-10' },
      { exerciseId: 'ex_kb_single_arm_ohp', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-12' },
      { exerciseId: 'ex_kb_sit_and_press', defaultSets: 3, defaultReps: 6, defaultWeight: 8, repRange: '6-10' },
      { exerciseId: 'ex_fedb_kettlebell_thruster', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-12' },
      { exerciseId: 'ex_kb_floor_press', defaultSets: 3, defaultReps: 10, defaultWeight: 16, repRange: '10-12' },
      { exerciseId: 'ex_kb_push_press', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-12' }
    ]
  },
  {
    id: 'routine_kb5_pull1',
    name: 'Kettlebell 5 Day - Pull',
    category: 'Pull',
    icon: '📥',
    color: '#2563eb',
    exercises: [
      { exerciseId: 'ex_kb_swing', defaultSets: 3, defaultReps: 8, defaultWeight: 16, repRange: '8-12' },
      { exerciseId: 'ex_kb_snatch', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-10' },
      { exerciseId: 'ex_kb_gorilla_row', defaultSets: 3, defaultReps: 8, defaultWeight: 16, repRange: '8-12' },
      { exerciseId: 'ex_fedb_alternating_renegade_row', defaultSets: 3, defaultReps: 8, defaultWeight: 16, repRange: '8-10' },
      { exerciseId: 'ex_kb_pullover', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-10' },
      { exerciseId: 'ex_kb_deadlift', defaultSets: 3, defaultReps: 8, defaultWeight: 20, repRange: '8-10' }
    ]
  },
  {
    id: 'routine_kb5_legs1',
    name: 'Kettlebell 5 Day - Legs & Core',
    category: 'Legs / Core',
    icon: '🦵',
    color: '#16a34a',
    exercises: [
      { exerciseId: 'ex_kb_squat', defaultSets: 3, defaultReps: 8, defaultWeight: 20, repRange: '8-12' },
      { exerciseId: 'ex_kb_bob_and_weave', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-10/leg' },
      { exerciseId: 'ex_kb_goblet_squat', defaultSets: 3, defaultReps: 8, defaultWeight: 20, repRange: '8-12' },
      { exerciseId: 'ex_kb_good_morning', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-10' },
      { exerciseId: 'ex_kb_side_bend', defaultSets: 3, defaultReps: 10, defaultWeight: 8, repRange: '10-12/side' },
      { exerciseId: 'ex_kb_russian_twist', defaultSets: 3, defaultReps: 10, defaultWeight: 8, repRange: '10-12' }
    ]
  },
  {
    id: 'routine_kb5_push2',
    name: 'Kettlebell 5 Day - Push & Core',
    category: 'Push',
    icon: '🧨',
    color: '#fb923c',
    exercises: [
      { exerciseId: 'ex_kb_jerk', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-12' },
      { exerciseId: 'ex_kb_floor_press', defaultSets: 3, defaultReps: 8, defaultWeight: 16, repRange: '8-12' },
      { exerciseId: 'ex_kb_narrow_grip_pushup', defaultSets: 3, defaultReps: 8, defaultWeight: 0, repRange: '8-10' },
      { exerciseId: 'ex_fedb_kettlebell_thruster', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-12' },
      { exerciseId: 'ex_kb_straight_arm_situp', defaultSets: 3, defaultReps: 8, defaultWeight: 8, repRange: '8-10' },
      { exerciseId: 'ex_kb_deadbug', defaultSets: 3, defaultReps: 30, defaultWeight: 8 }
    ]
  },
  {
    id: 'routine_kb5_pull2',
    name: 'Kettlebell 5 Day - Pull & Legs',
    category: 'Pull',
    icon: '🪝',
    color: '#38bdf8',
    exercises: [
      { exerciseId: 'ex_kb_deadlift', defaultSets: 3, defaultReps: 8, defaultWeight: 20, repRange: '8-10' },
      { exerciseId: 'ex_kb_suitcase_row', defaultSets: 3, defaultReps: 8, defaultWeight: 16, repRange: '8-12' },
      { exerciseId: 'ex_kb_high_pull', defaultSets: 3, defaultReps: 8, defaultWeight: 16, repRange: '8-12' },
      { exerciseId: 'ex_kb_swing', defaultSets: 3, defaultReps: 8, defaultWeight: 16, repRange: '8-12' },
      { exerciseId: 'ex_kb_rack_lunge', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-10/leg' },
      { exerciseId: 'ex_kb_step_up', defaultSets: 3, defaultReps: 8, defaultWeight: 12, repRange: '8-12' }
    ]
  }
];

// Groups the built-in routines above into their named programs, in the
// order each program's days are meant to run across a week — used by the
// onboarding wizard to recommend a program from "how many days can you
// train" and assign its days to the specific weekdays picked, without
// having to pattern-match the (inconsistent, historically-grown) routine id
// schemes. User-created routines are never part of a program.
export const PROGRAMS = [
  {
    id: 'upperlower4db',
    label: 'Upper Lower 4 Day DB',
    daysPerWeek: 4,
    equipment: 'dumbbell', // no barbell/machine access needed
    routineIds: ['routine_mon_upper_a', 'routine_tue_lower_a', 'routine_thu_upper_b', 'routine_fri_lower_b']
  },
  {
    id: 'upperlower4',
    label: 'UpperLower 4 Day',
    daysPerWeek: 4,
    equipment: 'gym',
    routineIds: ['routine_ul_upper_1', 'routine_ul_lower_1', 'routine_ul_upper_2', 'routine_ul_lower_2']
  },
  {
    id: 'fullbody3',
    label: 'FullBody 3 Day',
    daysPerWeek: 3,
    equipment: 'gym',
    routineIds: ['routine_fb_day1', 'routine_fb_day2', 'routine_fb_day3']
  },
  {
    id: 'ppl6',
    label: 'PPL 6 Day',
    daysPerWeek: 6,
    equipment: 'gym',
    routineIds: ['routine_ppl_day1_push_str', 'routine_ppl_day2_pull_str', 'routine_ppl_day3_legs_str', 'routine_ppl_day4_push_hyp', 'routine_ppl_day5_pull_hyp', 'routine_ppl_day6_legs_hyp']
  },
  {
    id: 'hybrid5',
    label: 'Hybrid 5 Day',
    daysPerWeek: 5,
    equipment: 'gym',
    routineIds: ['routine_hybrid5_day1', 'routine_hybrid5_day2', 'routine_hybrid5_day3', 'routine_hybrid5_day4', 'routine_hybrid5_day5']
  },
  {
    id: 'kettlebell3',
    label: 'Kettlebell 3 Day',
    daysPerWeek: 3,
    equipment: 'kettlebell',
    routineIds: ['routine_kb_day1', 'routine_kb_day2', 'routine_kb_day3']
  },
  {
    id: 'kettlebell2',
    label: 'Kettlebell 2 Day',
    daysPerWeek: 2,
    equipment: 'kettlebell',
    routineIds: ['routine_kb2_day1', 'routine_kb2_day2']
  },
  {
    id: 'kettlebell4',
    label: 'Kettlebell 4 Day',
    daysPerWeek: 4,
    equipment: 'kettlebell',
    routineIds: ['routine_kb4_upper1', 'routine_kb4_lower1', 'routine_kb4_upper2', 'routine_kb4_lower2']
  },
  {
    id: 'kettlebell5',
    label: 'Kettlebell 5 Day',
    daysPerWeek: 5,
    equipment: 'kettlebell',
    routineIds: ['routine_kb5_push1', 'routine_kb5_pull1', 'routine_kb5_legs1', 'routine_kb5_push2', 'routine_kb5_pull2']
  }
];
