export const DEFAULT_EXERCISES = [
  // Anthony's Dumbbell Programme Exercises - Chest & Triceps
  { id: 'ex_db_floor_press', name: 'Dumbbell Floor Press', category: 'Chest', equipment: 'Dumbbell / Floor', defaultRest: 90 },
  { id: 'ex_neutral_db_floor_press', name: 'Neutral-Grip Dumbbell Floor Press', category: 'Chest', equipment: 'Dumbbell / Floor', defaultRest: 90 },
  { id: 'ex_db_pullover', name: 'Dumbbell Pullover', category: 'Chest', equipment: 'Dumbbell / Floor', defaultRest: 60 },

  // Back & Biceps
  { id: 'ex_single_arm_db_row', name: 'Single-Arm Dumbbell Row', category: 'Back', equipment: 'Dumbbell / Chair', defaultRest: 75 },
  { id: 'ex_bent_over_db_row', name: 'Bent-Over Dumbbell Row', category: 'Back', equipment: 'Dumbbell', defaultRest: 90 },
  
  // Shoulders
  { id: 'ex_standing_db_shoulder_press', name: 'Standing Dumbbell Shoulder Press', category: 'Shoulders', equipment: 'Dumbbell', defaultRest: 90 },
  { id: 'ex_arnold_press', name: 'Arnold Press', category: 'Shoulders', equipment: 'Dumbbell', defaultRest: 75 },
  { id: 'ex_db_lateral_raise', name: 'Dumbbell Lateral Raise', category: 'Shoulders', equipment: 'Dumbbell', defaultRest: 60 },
  { id: 'ex_bent_over_rear_delt_raise', name: 'Bent-Over Rear Delt Raise', category: 'Shoulders', equipment: 'Dumbbell', defaultRest: 60 },

  // Arms (Biceps & Triceps & Forearms)
  { id: 'ex_hammer_curl', name: 'Hammer Curl', category: 'Arms', equipment: 'Dumbbell', defaultRest: 60 },
  { id: 'ex_overhead_db_tricep_ext', name: 'Overhead Dumbbell Triceps Extension', category: 'Arms', equipment: 'Dumbbell', defaultRest: 60 },
  { id: 'ex_alt_db_curl', name: 'Alternating Dumbbell Curl', category: 'Arms', equipment: 'Dumbbell', defaultRest: 60 },
  { id: 'ex_floor_db_skull_crusher', name: 'Floor Dumbbell Skull Crusher', category: 'Arms', equipment: 'Dumbbell / Floor', defaultRest: 60 },
  { id: 'ex_cross_body_hammer_curl', name: 'Cross-Body Hammer Curl', category: 'Arms', equipment: 'Dumbbell', defaultRest: 45 },
  { id: 'ex_db_tate_press', name: 'Dumbbell Tate Press', category: 'Arms', equipment: 'Dumbbell / Floor', defaultRest: 45 },
  { id: 'ex_db_reverse_curl', name: 'Dumbbell Reverse Curl', category: 'Arms', equipment: 'Dumbbell', defaultRest: 45 },

  // Quads, Hamstrings & Calves
  { id: 'ex_goblet_squat', name: 'Goblet Squat', category: 'Legs', equipment: 'Dumbbell', defaultRest: 90 },
  { id: 'ex_double_db_front_squat', name: 'Double-Dumbbell Front Squat', category: 'Legs', equipment: 'Dumbbell', defaultRest: 90 },
  { id: 'ex_db_romanian_deadlift', name: 'Dumbbell Romanian Deadlift', category: 'Legs', equipment: 'Dumbbell', defaultRest: 90 },
  { id: 'ex_reverse_lunge', name: 'Reverse Lunge', category: 'Legs', equipment: 'Dumbbell', defaultRest: 75 },
  { id: 'ex_bulgarian_split_squat', name: 'Bulgarian Split Squat', category: 'Legs', equipment: 'Dumbbell / Sofa', defaultRest: 75 },
  { id: 'ex_db_glute_bridge', name: 'Dumbbell Glute Bridge', category: 'Legs', equipment: 'Dumbbell / Floor', defaultRest: 60 },
  { id: 'ex_single_leg_calf_raise', name: 'Single-Leg Calf Raise', category: 'Legs', equipment: 'Dumbbell', defaultRest: 45 },

  // Core & Abs
  { id: 'ex_weighted_crunch', name: 'Weighted Crunch', category: 'Core', equipment: 'Dumbbell', defaultRest: 45 },
  { id: 'ex_dead_bug', name: 'Dead Bug', category: 'Core', equipment: 'Bodyweight', defaultRest: 45 },
  { id: 'ex_lying_leg_raise', name: 'Lying Leg Raise', category: 'Core', equipment: 'Bodyweight', defaultRest: 45 },
  { id: 'ex_side_plank', name: 'Side Plank', category: 'Core', equipment: 'Bodyweight', defaultRest: 30 },

  // Upper/Lower Split - 6 Week Program Exercises
  { id: 'ex_bench_press', name: 'Barbell Bench Press', category: 'Chest', equipment: 'Barbell', defaultRest: 120 },
  { id: 'ex_incline_db_bench', name: 'Incline Dumbbell Bench Press', category: 'Chest', equipment: 'Dumbbell', defaultRest: 90 },
  { id: 'ex_dips', name: 'Dips', category: 'Chest', equipment: 'Dip Bars', defaultRest: 90 },
  { id: 'ex_weighted_chinup', name: 'Weighted Chin-Ups', category: 'Back', equipment: 'Pull-Up Bar', defaultRest: 120 },
  { id: 'ex_barbell_row', name: 'Barbell Row', category: 'Back', equipment: 'Barbell', defaultRest: 90 },
  { id: 'ex_lat_pulldown', name: 'Lat Pulldown', category: 'Back', equipment: 'Cable', defaultRest: 75 },
  { id: 'ex_deadlift', name: 'Deadlift', category: 'Back', equipment: 'Barbell', defaultRest: 150 },
  { id: 'ex_dumbbell_ohp', name: 'Dumbbell Overhead Press', category: 'Shoulders', equipment: 'Dumbbell', defaultRest: 90 },
  { id: 'ex_barbell_ohp', name: 'Barbell Overhead Press', category: 'Shoulders', equipment: 'Barbell', defaultRest: 120 },
  { id: 'ex_cable_lateral_raise', name: 'Cable Lateral Raise', category: 'Shoulders', equipment: 'Cable', defaultRest: 60 },
  { id: 'ex_close_grip_bench', name: 'Close-Grip Bench Press', category: 'Arms', equipment: 'Barbell', defaultRest: 90 },
  { id: 'ex_tricep_rope_pushdown', name: 'Tricep Rope Pushdown', category: 'Arms', equipment: 'Cable', defaultRest: 60 },
  { id: 'ex_skullcrushers', name: 'Skullcrushers', category: 'Arms', equipment: 'EZ Bar', defaultRest: 60 },
  { id: 'ex_barbell_curl', name: 'Barbell Curl', category: 'Arms', equipment: 'Barbell', defaultRest: 60 },
  { id: 'ex_dumbbell_curl', name: 'Dumbbell Curl', category: 'Arms', equipment: 'Dumbbell', defaultRest: 60 },
  { id: 'ex_squat', name: 'Back Squat', category: 'Legs', equipment: 'Barbell', defaultRest: 120 },
  { id: 'ex_front_squat', name: 'Front Squat', category: 'Legs', equipment: 'Barbell', defaultRest: 120 },
  { id: 'ex_rdl', name: 'Romanian Deadlift', category: 'Legs', equipment: 'Barbell', defaultRest: 120 },
  { id: 'ex_leg_press', name: 'Leg Press', category: 'Legs', equipment: 'Machine', defaultRest: 90 },
  { id: 'ex_lunges', name: 'Lunges', category: 'Legs', equipment: 'Dumbbell / Barbell', defaultRest: 75 },
  { id: 'ex_leg_extension', name: 'Leg Extension', category: 'Legs', equipment: 'Machine', defaultRest: 60 },
  { id: 'ex_leg_curl', name: 'Leg Curl', category: 'Legs', equipment: 'Machine', defaultRest: 60 },
  { id: 'ex_calf_raise_standing', name: 'Standing Calf Raise', category: 'Legs', equipment: 'Machine', defaultRest: 60 },
  { id: 'ex_calf_raise_machine', name: 'Calf Raise (Machine)', category: 'Legs', equipment: 'Machine', defaultRest: 60 },
  { id: 'ex_abs_triset', name: 'Abs Triset', category: 'Core', equipment: 'Bodyweight', defaultRest: 45 }
];
