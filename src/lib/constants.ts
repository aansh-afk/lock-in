// ============================================================================
// The Wheel - Hardcoded Life Data Constants
// Schedule, Diet, Gym, and Study Plan
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ScheduleBlock = {
  start: string;
  end: string;
  label: string;
  activity: string;
  category:
    | "wake"
    | "commute"
    | "class"
    | "break"
    | "lunch"
    | "study"
    | "founder"
    | "saas"
    | "gym"
    | "cook"
    | "dinner"
    | "wind-down"
    | "sleep";
};

export type Meal = {
  name: string;
  time: string;
  items: Array<{
    item: string;
    amount: string;
    protein: number;
    calories: number;
  }>;
  totalProtein: number;
  totalCalories: number;
};

export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  notes: string;
};

export type WorkoutDay = {
  type: "upper" | "lower" | "rest";
  label: string;
  exercises: Exercise[];
};

export type StudyWeek = {
  week: string;
  topics: string[];
};

export type StudyModule = {
  number: number;
  name: string;
  month: number;
  weeks: StudyWeek[];
};

// ---------------------------------------------------------------------------
// Schedule
// ---------------------------------------------------------------------------

export const SCHEDULE: ScheduleBlock[] = [
  {
    start: "07:30",
    end: "08:00",
    label: "WAKE",
    activity: "Wake up, get ready, whey + banana",
    category: "wake",
  },
  {
    start: "08:00",
    end: "09:00",
    label: "COMMUTE",
    activity: "Rikshaw to college - flashcards/notes on phone",
    category: "commute",
  },
  {
    start: "09:00",
    end: "11:00",
    label: "CLASS",
    activity: "Self-study current exam module during lectures",
    category: "class",
  },
  {
    start: "11:00",
    end: "11:15",
    label: "BREAK",
    activity: "Short break",
    category: "break",
  },
  {
    start: "11:15",
    end: "13:15",
    label: "CLASS",
    activity: "Split: some lecture attention + self-study",
    category: "class",
  },
  {
    start: "13:15",
    end: "13:35",
    label: "LUNCH",
    activity: "Eat prepped meal",
    category: "lunch",
  },
  {
    start: "13:35",
    end: "14:15",
    label: "STUDY",
    activity: "40 min focused study - no phone",
    category: "study",
  },
  {
    start: "14:15",
    end: "17:00",
    label: "CLASS",
    activity: "Split: some lecture attention + self-study",
    category: "class",
  },
  {
    start: "17:00",
    end: "17:30",
    label: "COMMUTE",
    activity: "Rikshaw home - flashcards/notes on phone",
    category: "commute",
  },
  {
    start: "17:30",
    end: "18:30",
    label: "FOUNDER",
    activity: "Call with co-founder (hard cap at 1 hour)",
    category: "founder",
  },
  {
    start: "18:30",
    end: "19:30",
    label: "SAAS",
    activity: "SaaS development - hour 1",
    category: "saas",
  },
  {
    start: "19:30",
    end: "22:15",
    label: "GYM",
    activity:
      "Travel (15 min) + Workout (1 hr) + Cardio (30 min) + Travel (15 min)",
    category: "gym",
  },
  {
    start: "22:15",
    end: "22:30",
    label: "COOK",
    activity: "Prep dinner + tomorrow's lunch (15 min)",
    category: "cook",
  },
  {
    start: "22:30",
    end: "23:00",
    label: "DINNER",
    activity: "Eat",
    category: "dinner",
  },
  {
    start: "23:00",
    end: "00:00",
    label: "SAAS",
    activity: "SaaS development - hour 2",
    category: "saas",
  },
  {
    start: "00:00",
    end: "00:30",
    label: "WIND DOWN",
    activity: "No phone. Podcast on, phone face down. Lights off.",
    category: "wind-down",
  },
  {
    start: "00:30",
    end: "07:30",
    label: "SLEEP",
    activity: "7 hours until 07:30",
    category: "sleep",
  },
];

// ---------------------------------------------------------------------------
// Diet
// ---------------------------------------------------------------------------

export const MEALS: Meal[] = [
  {
    name: "Breakfast",
    time: "07:30",
    items: [
      { item: "Whey protein", amount: "1 scoop (30g)", protein: 25, calories: 120 },
      { item: "Banana", amount: "1 medium", protein: 1, calories: 105 },
      { item: "Whole milk", amount: "300ml", protein: 10, calories: 200 },
    ],
    totalProtein: 36,
    totalCalories: 425,
  },
  {
    name: "Lunch",
    time: "13:15",
    items: [
      { item: "Chicken breast", amount: "200g", protein: 46, calories: 220 },
      { item: "Roti", amount: "3 pieces (90g atta)", protein: 9, calories: 300 },
      { item: "Vegetables", amount: "100g", protein: 3, calories: 35 },
    ],
    totalProtein: 58,
    totalCalories: 555,
  },
  {
    name: "Post-Gym Shake",
    time: "22:00",
    items: [
      { item: "Whey protein", amount: "1 scoop (30g)", protein: 25, calories: 120 },
      { item: "Whole milk", amount: "300ml", protein: 10, calories: 200 },
    ],
    totalProtein: 35,
    totalCalories: 320,
  },
  {
    name: "Dinner",
    time: "22:30",
    items: [
      { item: "Chicken breast", amount: "200g", protein: 46, calories: 220 },
      { item: "Roti", amount: "3 pieces (90g atta)", protein: 9, calories: 300 },
      { item: "Whole eggs", amount: "2", protein: 12, calories: 140 },
      { item: "Vegetables", amount: "100g", protein: 3, calories: 35 },
    ],
    totalProtein: 70,
    totalCalories: 695,
  },
];

export const DAILY_TARGETS = {
  calories: 2000,
  protein: 155,
  carbs: 200,
  fat: 50,
} as const;

// ---------------------------------------------------------------------------
// Recipes - dead simple, no bullshit
// ---------------------------------------------------------------------------

export type Recipe = {
  name: string;
  prep: string;
  steps: string[];
};

export const RECIPES: Recipe[] = [
  {
    name: "Chicken Breast (200g)",
    prep: "5 min prep, 25 min cook",
    steps: [
      "Pat chicken dry with paper towel",
      "Season both sides: salt, black pepper, garlic powder",
      "Heat pan on medium-high with tiny bit of oil",
      "Cook 6-7 min per side until no pink inside",
      "Let rest 2-3 min before cutting",
    ],
  },
  {
    name: "Bulk Chicken (1.4kg Sunday)",
    prep: "10 min prep, 30 min cook",
    steps: [
      "Preheat oven to 200C",
      "Lay all breasts on baking tray lined with foil",
      "Season all: salt, pepper, garlic powder, paprika",
      "Bake 25-30 min until internal temp 75C",
      "Cool, slice into 200g portions",
      "Store in containers in fridge (lasts 4 days)",
    ],
  },
  {
    name: "Roti (2 pieces)",
    prep: "10 min",
    steps: [
      "Knead 60g whole wheat atta with water until smooth",
      "Divide into 2 balls",
      "Roll each into thin circle on floured surface",
      "Heat tawa/pan on high until very hot",
      "Place roti, wait 30s until bubbles appear",
      "Flip, press gently with cloth until it puffs",
      "Remove when both sides have brown spots",
    ],
  },
  {
    name: "Bulk Roti Dough (Week)",
    prep: "15 min",
    steps: [
      "Mix 500g whole wheat atta with ~250ml water and pinch of salt",
      "Knead for 5-8 minutes until smooth and elastic",
      "Cover with damp cloth",
      "Store in fridge (lasts 3-4 days)",
      "Pull out portions as needed, roll and cook fresh",
    ],
  },
  {
    name: "Whey Shake",
    prep: "1 min",
    steps: [
      "300ml cold water or milk in shaker",
      "Add 1 scoop (30g) whey protein",
      "Shake 15 seconds, drink",
      "With milk: +200 cal, +10g protein",
    ],
  },
  {
    name: "Scrambled Eggs (2)",
    prep: "1 min prep, 3 min cook",
    steps: [
      "Crack 2 eggs in bowl, pinch of salt",
      "Whisk with fork",
      "Medium heat, tiny bit of butter",
      "Pour in, stir slowly with spatula",
      "Remove when still slightly wet (they keep cooking)",
    ],
  },
  {
    name: "Vegetables (100g)",
    prep: "2 min",
    steps: [
      "Option 1: Frozen mixed veg - microwave 3 min",
      "Option 2: Broccoli - boil 4 min or microwave 3 min",
      "Option 3: Spinach - wilt in hot pan 1 min",
      "Season with salt and pepper. Done.",
    ],
  },
  {
    name: "Nightly Dinner Assembly",
    prep: "15 min total",
    steps: [
      "Take prepped chicken from fridge",
      "Make 2 rotis fresh (or from prepped dough)",
      "Heat or cook vegetables 3 min",
      "Cook 2 eggs (scrambled or fried)",
      "Plate everything. Eat.",
      "Pack tomorrow's lunch: chicken + 2 rotis + veg in container",
    ],
  },
];

// ---------------------------------------------------------------------------
// Gym - Upper/Lower split
// ---------------------------------------------------------------------------

const UPPER_EXERCISES: Exercise[] = [
  { name: "Barbell Bench Press", sets: 3, reps: 8, notes: "Start light, nail form first" },
  { name: "Dumbbell Rows", sets: 3, reps: 10, notes: "One arm at a time. Squeeze at top." },
  { name: "Overhead Press (DB or Barbell)", sets: 3, reps: 10, notes: "Seated or standing. Full range." },
  { name: "Lat Pulldown", sets: 3, reps: 10, notes: "Wide grip. Feel the stretch." },
  { name: "Lateral Raises", sets: 3, reps: 15, notes: "Light weight. Control the negative." },
  { name: "Tricep Pushdowns", sets: 2, reps: 12, notes: "Cable. Lock elbows in place." },
  { name: "Bicep Curls", sets: 2, reps: 12, notes: "Dumbbells. No swinging." },
];

const LOWER_EXERCISES: Exercise[] = [
  { name: "Goblet Squats", sets: 3, reps: 10, notes: "Hold dumbbell at chest. Full depth." },
  { name: "Romanian Deadlifts", sets: 3, reps: 10, notes: "Dumbbells or barbell. Feel hamstrings." },
  { name: "Leg Press", sets: 3, reps: 10, notes: "Feet shoulder width. Full range." },
  { name: "Leg Curls", sets: 3, reps: 12, notes: "Machine. Slow negative." },
  { name: "Calf Raises", sets: 3, reps: 15, notes: "Pause at top. Full stretch bottom." },
  { name: "Plank", sets: 3, reps: 30, notes: "Hold 30s. Core tight. Don't sag." },
];

export const WORKOUTS: Record<"upper" | "lower" | "rest", WorkoutDay> = {
  upper: { type: "upper", label: "Upper", exercises: UPPER_EXERCISES },
  lower: { type: "lower", label: "Lower", exercises: LOWER_EXERCISES },
  rest: { type: "rest", label: "Rest Day", exercises: [] },
};

export const CARDIO = {
  duration: 30,
  type: "Incline treadmill walk",
  incline: "10-15%",
  speed: "5-6 km/h",
} as const;

/** Maps day-of-week (0=Sun .. 6=Sat) to workout type */
export const WORKOUT_CYCLE: Array<"upper" | "lower" | "rest"> = [
  "rest",   // Sunday
  "upper",  // Monday
  "lower",  // Tuesday
  "rest",   // Wednesday
  "upper",  // Thursday
  "lower",  // Friday
  "rest",   // Saturday
];

// ---------------------------------------------------------------------------
// Study Plan
// ---------------------------------------------------------------------------

export const STUDY_MODULES: StudyModule[] = [
  {
    number: 3,
    name: "Electrical Fundamentals (Retake)",
    month: 1,
    weeks: [
      {
        week: "Week 1",
        topics: [
          "DC Foundations",
          "Electron Theory",
          "Static Electricity",
          "Electrical Terminology",
          "Generation of Electricity",
          "DC Sources",
        ],
      },
      {
        week: "Week 2",
        topics: [
          "DC Circuits and Components",
          "DC Circuits",
          "Resistance/Resistor",
          "Power",
          "Capacitance/Capacitor",
        ],
      },
      {
        week: "Week 3",
        topics: [
          "Magnetism and AC Foundations",
          "Magnetism",
          "Inductance/Inductor",
          "DC Motor/Generator Theory",
          "AC Theory",
        ],
      },
      {
        week: "Week 4",
        topics: [
          "AC Systems",
          "R/C/L Circuits",
          "Transformers",
          "Filters",
          "AC Generators",
          "AC Motors",
          "Practice exam",
        ],
      },
    ],
  },
  {
    number: 4,
    name: "Electronic Fundamentals (New)",
    month: 2,
    weeks: [
      {
        week: "Week 1-2",
        topics: [
          "Semiconductors",
          "Diodes",
          "Transistors",
          "Integrated circuits",
        ],
      },
      {
        week: "Week 3",
        topics: ["PCBs and Servomechanisms"],
      },
      {
        week: "Week 4",
        topics: [
          "Radio Communication",
          "ELT",
          "ADS-B",
          "Practice questions",
        ],
      },
    ],
  },
  {
    number: 5,
    name: "Digital Techniques",
    month: 3,
    weeks: [
      {
        week: "Week 1-2",
        topics: [
          "Numbering Systems",
          "Logic Circuits",
          "Data Buses",
          "Computer Structure",
        ],
      },
    ],
  },
  {
    number: 10,
    name: "Aviation Legislation",
    month: 3,
    weeks: [
      {
        week: "Week 3",
        topics: [
          "CAR 66 - All topics up to Subpart C (detail)",
          "CAR 145 - All topics + AMC & CA Forms",
          "CAR-M - CAMO, ARC, Continuing Airworthiness",
          "CAR 21 - CA Forms, Subparts, Findings, Validity",
        ],
      },
      {
        week: "Week 4",
        topics: [
          "Series B, C, F, H, M, T, X",
          "Section 8 - Landing categories, ETOPS, Nav",
          "CAP 3100 (AoP & Indexes, Annex)",
          "SMS (Full)",
          "FTST (145/CAR-M) - 7-10 questions",
          "Rules, Acts & ICAO Annexes",
          "Exam Prep all modules",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

/** Day 1 of the lock-in */
export const START_DATE = new Date("2026-03-15T00:00:00");

/** M8/M9 on-demand exam target */
export const MAY_EXAM_DATE = new Date("2026-05-15T00:00:00");

/** M3/M4/M5/M10 exam target date */
export const EXAM_DATE = new Date("2026-06-15T00:00:00");

/** Days until M8/M9 May exam */
export function getDaysUntilMayExam(date: Date): number {
  const diff = MAY_EXAM_DATE.getTime() - date.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** How many days since the lock-in started (0-indexed, day 1 = 0) */
export function getDayNumber(date: Date): number {
  const diff = date.getTime() - START_DATE.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

/** How many days until the exam */
export function getDaysUntilExam(date: Date): number {
  const diff = EXAM_DATE.getTime() - date.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** Get all dates from START_DATE to today as YYYY-MM-DD strings */
export function getAllDaysSinceStart(date: Date): string[] {
  const days: string[] = [];
  const current = new Date(START_DATE);
  while (current <= date) {
    days.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return days;
}

// ---------------------------------------------------------------------------
// Non-Negotiables
// ---------------------------------------------------------------------------

export const NON_NEGOTIABLES: string[] = [
  "Hit every meal - no skipping, no junk",
  "Train 4 days a week - Upper/Lower, no excuses",
  "Study every available minute - commute, class, lunch",
  "SaaS gets 2 hours daily - no more, no less",
  "Sleep by 00:30 - 7 hours minimum",
];

// ---------------------------------------------------------------------------
// M8/M9 Retake Study Plan (May on-demand exam)
// ---------------------------------------------------------------------------

export type ExamModule = {
  number: number;
  name: string;
  topics: Array<{ section: string; subtopics: string[] }>;
};

export const RETAKE_MODULES: ExamModule[] = [
  {
    number: 8,
    name: "Basic Aerodynamics",
    topics: [
      {
        section: "Physics of the Atmosphere",
        subtopics: ["ISA", "Pressure", "Temperature", "Density", "Altitude"],
      },
      {
        section: "Aerodynamics",
        subtopics: [
          "Airflow around a body",
          "Boundary layer",
          "Drag (parasite, induced, total)",
          "Lift (Bernoulli, Newton)",
          "Lift/drag ratio",
          "Aerofoil contamination (ice, frost)",
        ],
      },
      {
        section: "Theory of Flight",
        subtopics: [
          "Relationship between lift, weight, thrust, drag",
          "Glide ratio",
          "Steady-state flights",
          "Load factor in turns",
          "Stalling",
        ],
      },
      {
        section: "Flight Stability and Dynamics",
        subtopics: [
          "Longitudinal, lateral, directional stability",
          "Static and dynamic stability",
        ],
      },
    ],
  },
  {
    number: 9,
    name: "Human Factors",
    topics: [
      {
        section: "General",
        subtopics: [
          "Human error models (SHELL, Reason)",
          "Murphy's law",
          "Error types & error chains",
        ],
      },
      {
        section: "Human Performance & Limitations",
        subtopics: [
          "Vision and visual limitations",
          "Hearing and noise",
          "Information processing",
          "Attention and perception",
          "Memory (sensory, short-term, long-term)",
          "Claustrophobia and physical access",
        ],
      },
      {
        section: "Social Psychology",
        subtopics: [
          "Responsibility - individual and group",
          "Motivation and demotivation",
          "Peer pressure",
          "Teamwork and team management",
        ],
      },
      {
        section: "Factors Affecting Performance",
        subtopics: [
          "Fitness/health",
          "Stress (domestic/work)",
          "Time pressure and deadlines",
          "Workload (overload/underload)",
          "Sleep and fatigue",
          "Alcohol, medication, drugs",
          "Shift work",
        ],
      },
      {
        section: "Physical Environment",
        subtopics: [
          "Noise and fumes",
          "Illumination",
          "Climate and temperature",
          "Workplace design/ergonomics",
        ],
      },
      {
        section: "Tasks & Communication",
        subtopics: [
          "Visual inspection and visual aids",
          "Repetitive tasks",
          "Communication within and between teams",
          "Logging and recording",
          "Keeping up to date (currency)",
        ],
      },
      {
        section: "Human Error in Maintenance",
        subtopics: [
          "Error models specific to aviation maintenance",
          "Implications of errors",
          "Avoiding and managing errors (dirty dozen)",
        ],
      },
    ],
  },
];

/** 8-week study phases for M8/M9 retake */
export const RETAKE_PHASES = [
  { weeks: "1-2", label: "Gap Finding", activity: "Practice papers for both modules, identify weak topics" },
  { weeks: "3-4", label: "Deep Dive", activity: "Target weak sections, reread + handwrite notes" },
  { weeks: "5-6", label: "Drill", activity: "Timed practice papers, mixed questions" },
  { weeks: "7-8", label: "Lock In", activity: "Full mock exams, review all mistakes" },
] as const;

/** Returns current retake phase based on weeks since start */
export function getRetakePhase(date: Date): typeof RETAKE_PHASES[number] {
  const weeksSinceStart = Math.floor(getDayNumber(date) / 7);
  if (weeksSinceStart < 2) return RETAKE_PHASES[0];
  if (weeksSinceStart < 4) return RETAKE_PHASES[1];
  if (weeksSinceStart < 6) return RETAKE_PHASES[2];
  return RETAKE_PHASES[3];
}

// ---------------------------------------------------------------------------
// Holiday Schedule (replaces weekday schedule on holidays)
// ---------------------------------------------------------------------------

export const HOLIDAY_SCHEDULE: ScheduleBlock[] = [
  { start: "07:30", end: "08:00", label: "WAKE", activity: "Wake up, get ready, whey + banana", category: "wake" },
  { start: "08:00", end: "10:00", label: "M8 STUDY", activity: "Module 8 - Aerodynamics deep study", category: "study" },
  { start: "10:00", end: "10:15", label: "BREAK", activity: "Short break", category: "break" },
  { start: "10:15", end: "12:15", label: "M9 STUDY", activity: "Module 9 - Human Factors deep study", category: "study" },
  { start: "12:15", end: "13:00", label: "LUNCH", activity: "Eat prepped meal", category: "lunch" },
  { start: "13:00", end: "14:30", label: "MAIN STUDY", activity: "Current month module (M3/M4/M5/M10)", category: "study" },
  { start: "14:30", end: "14:45", label: "BREAK", activity: "Short break", category: "break" },
  { start: "14:45", end: "16:15", label: "PRACTICE", activity: "M8/M9 practice papers & questions", category: "study" },
  { start: "16:15", end: "17:00", label: "REVIEW", activity: "Review mistakes from practice papers", category: "study" },
  { start: "17:30", end: "18:30", label: "FOUNDER", activity: "Call with co-founder (hard cap at 1 hour)", category: "founder" },
  { start: "18:30", end: "19:30", label: "SAAS", activity: "SaaS development - hour 1", category: "saas" },
  { start: "19:30", end: "22:15", label: "GYM", activity: "Travel (15 min) + Workout (1 hr) + Cardio (30 min) + Travel (15 min)", category: "gym" },
  { start: "22:15", end: "22:30", label: "COOK", activity: "Prep dinner + tomorrow's lunch (15 min)", category: "cook" },
  { start: "22:30", end: "23:00", label: "DINNER", activity: "Eat", category: "dinner" },
  { start: "23:00", end: "00:00", label: "SAAS", activity: "SaaS development - hour 2", category: "saas" },
  { start: "00:00", end: "00:30", label: "WIND DOWN", activity: "No phone. Podcast on, phone face down. Lights off.", category: "wind-down" },
  { start: "00:30", end: "07:30", label: "SLEEP", activity: "7 hours until 07:30", category: "sleep" },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Converts "HH:MM" to total minutes from midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Returns which schedule block the given date/time falls in, or null
 * if no block matches. Handles midnight crossover blocks correctly
 * (e.g. 23:00-00:00, 00:00-00:30, 00:30-07:30).
 */
export function getCurrentBlock(date: Date): ScheduleBlock | null {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  for (const block of SCHEDULE) {
    const start = timeToMinutes(block.start);
    const end = timeToMinutes(block.end);

    if (end > start) {
      // Normal block: start and end on same side of midnight
      if (currentMinutes >= start && currentMinutes < end) {
        return block;
      }
    } else {
      // Midnight-crossing block: e.g. 23:00 -> 00:00 means start=1380, end=0
      // Current time is in this block if it's >= start OR < end
      if (currentMinutes >= start || currentMinutes < end) {
        return block;
      }
    }
  }

  return null;
}

/**
 * Returns today's workout based on day of week mapped to the Upper/Lower cycle.
 */
export function getTodayWorkout(date: Date): WorkoutDay {
  const dayOfWeek = date.getDay(); // 0=Sun .. 6=Sat
  const workoutType = WORKOUT_CYCLE[dayOfWeek];
  return WORKOUTS[workoutType];
}

/**
 * Study plan start: March 2026.
 * Month 1 (March) = Module 3, Month 2 (April) = Module 4,
 * Month 3 (May) = Modules 5+6. If outside range, returns last module.
 */
export function getCurrentStudyModule(date: Date): StudyModule {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed: 0=Jan, 2=Mar

  // Study month 1 = March 2026 (year=2026, month=2)
  const studyMonth = (year - 2026) * 12 + (month - 2) + 1; // 1-indexed

  if (studyMonth <= 0) {
    return STUDY_MODULES[0];
  }

  // Find the module matching this study month
  const matched = STUDY_MODULES.find((m) => m.month === studyMonth);
  if (matched) {
    return matched;
  }

  // Month 3 has two modules (5 and 10). For month 3, return module 5 as the primary.
  // If beyond range, return the last module.
  if (studyMonth === 3) {
    return STUDY_MODULES[2]; // Module 5
  }

  return STUDY_MODULES[STUDY_MODULES.length - 1];
}

/**
 * Returns the current study module and the week within that module
 * based on which week of the month it is (1-indexed).
 * Returns null if no matching week is found.
 */
export function getCurrentStudyWeek(
  date: Date
): { module: StudyModule; week: StudyWeek } | null {
  const dayOfMonth = date.getDate();
  // Week 1 = days 1-7, Week 2 = days 8-14, Week 3 = days 15-21, Week 4 = days 22+
  const weekIndex = Math.min(Math.floor((dayOfMonth - 1) / 7), 3);

  const mod = getCurrentStudyModule(date);

  // For month 3, modules 5 and 10 share the month.
  // Module 5 covers weeks 1-2, Module 10 covers weeks 3-4.
  const year = date.getFullYear();
  const month = date.getMonth();
  const studyMonth = (year - 2026) * 12 + (month - 2) + 1;

  if (studyMonth === 3) {
    if (weekIndex <= 1) {
      // Weeks 1-2: Module 5
      const module5 = STUDY_MODULES[2];
      const week = module5.weeks[0]; // "Week 1-2"
      if (week) {
        return { module: module5, week };
      }
    } else {
      // Weeks 3-4: Module 10
      const module10 = STUDY_MODULES[3];
      const localWeekIndex = weekIndex - 2; // 0 or 1
      const week = module10.weeks[localWeekIndex];
      if (week) {
        return { module: module10, week };
      }
    }
    return null;
  }

  // For other months, map week index to the module's weeks array
  if (weekIndex < mod.weeks.length) {
    return { module: mod, week: mod.weeks[weekIndex] };
  }

  // If current week exceeds defined weeks, return last defined week
  if (mod.weeks.length > 0) {
    return { module: mod, week: mod.weeks[mod.weeks.length - 1] };
  }

  return null;
}
