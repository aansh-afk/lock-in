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
    number: 6,
    name: "Materials and Hardware",
    month: 1,
    weeks: [
      {
        week: "Week 1",
        topics: [
          "6.1 Ferrous Materials — alloy steels, heat treatment, testing (L2)",
          "6.2 Non-Ferrous — aluminium, titanium, copper, magnesium, Alclad (L2)",
          "6.3 Composites — fibre-reinforced, carbon fibre, Kevlar, honeycomb (L2)",
        ],
      },
      {
        week: "Week 2",
        topics: [
          "6.4 Corrosion — ALL types, galvanic series, prevention, treatment (L3 ★)",
          "6.4 Deep dive — pitting, inter-granular, stress, exfoliation, fretting, microbiological",
        ],
      },
      {
        week: "Week 3",
        topics: [
          "6.5 Fasteners — screw threads, bolts, studs, locking devices, rivets (L2)",
          "6.6 Pipes and Unions — rigid/flexible, connectors, standard unions (L2)",
          "6.11 Electrical Cables and Connectors — crimping, coaxial, identification (L2)",
        ],
      },
      {
        week: "Week 4",
        topics: [
          "6.7 Springs — types, materials, applications (L2)",
          "6.8 Bearings — plain, roller, ball, loads, materials (L2)",
          "6.9 Transmissions — gear types, ratios, belts, chains (L2)",
          "6.10 Control Cables — swaging, inspection, tension, Bowden (L2)",
          "Practice papers — 80 MCQ timed mocks",
        ],
      },
    ],
  },
  {
    number: 7,
    name: "Maintenance Practices",
    month: 2,
    weeks: [
      {
        week: "Week 1",
        topics: [
          "7.1 Safety Precautions — fire extinguishers, workshop safety (L3 ★)",
          "7.2 Workshop Practices (L3 ★)",
          "7.3 Tools — torque wrenches, micrometers, verniers, power tools (L3 ★)",
        ],
      },
      {
        week: "Week 2",
        topics: [
          "7.5 Engineering Drawings — ATA 100, ISO, AN, MS, NAS standards (L2)",
          "7.6 Fits and Clearances — drill sizes, classes of fits, tolerances (L2)",
          "7.7 EWIS — crimping, bonding, testing, cable looming, shielding (L3 ★)",
        ],
      },
      {
        week: "Week 3",
        topics: [
          "7.8 Riveting — joints, spacing, pitch, dimpling, inspection (L2)",
          "7.9-7.13 Pipes, Springs, Bearings, Transmissions, Control Cables (L2)",
          "7.14 Sheet Metal + Composite repair (L2)",
          "7.15 Welding, Brazing, Soldering, Bonding (L2)",
        ],
      },
      {
        week: "Week 4",
        topics: [
          "7.16 Weight and Balance — CG calculation, weighing procedures (L2)",
          "7.17 Aircraft Handling — taxiing, towing, jacking, storage (L2)",
          "7.18 Disassembly/Inspection/Repair/Assembly — defect types (L3 ★)",
          "7.19 Abnormal Events — hard landing, lightning, turbulence (L2)",
          "7.20 Maintenance Procedures — MEL, ADs, SBs, CRS (L2)",
          "Practice papers — 80 MCQ + 2 essays timed mocks",
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
        week: "Week 1",
        topics: [
          "5.2 Numbering Systems — binary, octal, hex, conversions (L1)",
          "5.5 Logic Circuits — AND/OR/NAND/NOR/XOR, truth tables (L2)",
          "5.6 Computer Structure — CPU, RAM, ROM, EPROM, firmware (L2)",
          "5.3 Data Conversion — ADC/DAC operation (L1)",
          "5.4 Data Buses — ARINC 429, ARINC 629 (L2)",
        ],
      },
      {
        week: "Week 2",
        topics: [
          "5.10 Fibre Optics — transmission, connectors, couplers (L1)",
          "5.11 Electronic Displays — CRT, LED, LCD, EFIS, EICAS, ECAM (L2)",
          "5.12 ESD — handling precautions, wrist straps, packaging (L2)",
          "5.13 Software Management Control (L2)",
          "5.14 EME — EMC, EMI, HIRF, lightning protection (L2)",
          "5.15 Typical Aircraft Systems — ACARS, FBW, FMS, GPS, TCAS, BITE (L2)",
          "Practice papers — 40 MCQ timed mocks",
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
        week: "Week 1",
        topics: [
          "10.1 Regulatory Framework — ICAO, DGCA, CAR relationships (L1)",
          "10.2 CAR 66 — Certifying Staff, detailed (L2)",
          "10.3 CAR 145 — Approved Maintenance Organisations (L2)",
          "10.5 CAR 21 — Certification, C of A, Registration (L1-2)",
          "10.6 CAR-M — Continuing Airworthiness (L2)",
        ],
      },
      {
        week: "Week 2",
        topics: [
          "10.4 Air Operations — CAR-OPS, AOC, MEL/CDL (L1)",
          "10.7 National/International Req — ADs, SBs, mods, ETOPS (L1-2)",
          "10.8 Safety Management System (L2)",
          "10.9 Fuel Tank Safety (L1)",
          "Rules, Acts & ICAO Annexes",
          "Full mock — 40 MCQ + 1 essay timed",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

/** Day 1 of the lock-in (fresh start) */
export const START_DATE = new Date("2026-04-08T00:00:00");

/** DGCA Session 02 exam window: June 16-20, 2026 */
export const EXAM_DATE = new Date("2026-06-16T00:00:00");

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
// Exam Info
// ---------------------------------------------------------------------------

export const EXAM_INFO = {
  session: "Session 02 of 2026",
  window: "June 16–20, 2026",
  passmark: 75,
  target: 95,
  modules: [
    { number: 5, name: "Digital Techniques", questions: "40 MCQ", time: "50 min", level3: false },
    { number: 6, name: "Materials & Hardware", questions: "80 MCQ", time: "100 min", level3: true },
    { number: 7, name: "Maintenance Practices", questions: "80 MCQ + 2 essays", time: "140 min", level3: true },
    { number: 10, name: "Aviation Legislation", questions: "40 MCQ + 1 essay", time: "70 min", level3: false },
  ],
  rules: [
    "75% pass for MCQ and essay independently",
    "No negative marking",
    "90-day wait after failed attempt",
    "All first attempts — no retakes",
  ],
} as const;

// ---------------------------------------------------------------------------
// Holiday Schedule (replaces weekday schedule on holidays)
// ---------------------------------------------------------------------------

export const HOLIDAY_SCHEDULE: ScheduleBlock[] = [
  { start: "07:30", end: "08:00", label: "WAKE", activity: "Wake up, get ready, whey + banana", category: "wake" },
  { start: "08:00", end: "10:30", label: "DEEP STUDY", activity: "Current module - READ + WRITE (2.5 hrs focused)", category: "study" },
  { start: "10:30", end: "10:45", label: "BREAK", activity: "Short break", category: "break" },
  { start: "10:45", end: "13:00", label: "DEEP STUDY", activity: "Continue current module - practice questions", category: "study" },
  { start: "13:00", end: "13:30", label: "LUNCH", activity: "Eat prepped meal", category: "lunch" },
  { start: "13:30", end: "15:30", label: "PRACTICE", activity: "Timed mock papers for current module", category: "study" },
  { start: "15:30", end: "15:45", label: "BREAK", activity: "Short break", category: "break" },
  { start: "15:45", end: "17:00", label: "REVIEW", activity: "Review mistakes + weak topics", category: "study" },
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
 * Study plan start: April 2026.
 * Month 1 (April) = Module 6, Month 2 (May) = Module 7A,
 * Month 3 (June) = Modules 5+10 (M10 via extra classes).
 */
export function getCurrentStudyModule(date: Date): StudyModule {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed: 0=Jan, 3=Apr

  // Study month 1 = April 2026 (year=2026, month=3)
  const studyMonth = (year - 2026) * 12 + (month - 3) + 1; // 1-indexed

  if (studyMonth <= 0) {
    return STUDY_MODULES[0];
  }

  // Find the module matching this study month
  const matched = STUDY_MODULES.find((m) => m.month === studyMonth);
  if (matched) {
    return matched;
  }

  // Month 3 has two modules (5 and 10). Return module 5 as the primary.
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

  // For month 3 (June), modules 5 and 10 share the month.
  // Module 5 covers weeks 1-2, Module 10 covers weeks 3-4.
  const year = date.getFullYear();
  const month = date.getMonth();
  const studyMonth = (year - 2026) * 12 + (month - 3) + 1;

  if (studyMonth === 3) {
    if (weekIndex <= 1) {
      // Weeks 1-2: Module 5
      const module5 = STUDY_MODULES[2];
      const week = module5.weeks[weekIndex];
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
