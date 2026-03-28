import { useState, useMemo } from "react";
import {
  Utensils,
  Droplets,
  ChefHat,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Flame,
  Egg,
  Wheat,
  Check,
} from "lucide-react";
import { MEALS, DAILY_TARGETS, RECIPES, type Meal } from "../../lib/constants";
import { useWebHaptics } from "web-haptics/react";
import {
  useDailyChecksForDate,
  useToggleCheck,
  type CheckType,
} from "../../lib/store";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const mealCheckType: Record<string, CheckType> = {
  Breakfast: "meal_breakfast",
  Lunch: "meal_lunch",
  "Post-Gym Shake": "meal_postworkout",
  Dinner: "meal_dinner",
};

/** Rough carb/fat estimates per meal for macro tracking */
const MEAL_EXTRA_MACROS: Record<string, { carbs: number; fat: number }> = {
  meal_breakfast: { carbs: 40, fat: 2 },
  meal_lunch: { carbs: 35, fat: 5 },
  meal_postworkout: { carbs: 3, fat: 1 },
  meal_dinner: { carbs: 35, fat: 18 },
};

const BONUS_ITEMS = [
  { label: "Extra rice (lunch + dinner)", cal: 260, protein: 0 },
  { label: "Peanut butter 2 tbps", cal: 190, protein: 8 },
  { label: "Milk in shakes (300ml x2)", cal: 400, protein: 20 },
  { label: "Nuts handful", cal: 150, protein: 0 },
] as const;

const SUNDAY_PREP_STEPS = [
  "Chicken: 1.4kg -- marinate all (salt, pepper, spices), bake 200C 25-30 min, store in 200g portions",
  "Rice: Bulk cook every 2-3 days (15 min), store in fridge",
  "Vegetables: Chop for week and store in containers. Frozen mixed veg = zero prep.",
] as const;

const NIGHTLY_STEPS = [
  "Take out tomorrow's lunch chicken from fridge",
  "Cook 2 eggs",
  "Heat rice (or make fresh)",
  "Heat vegetables",
  "Pack tomorrow's lunch container",
] as const;

const DIET_RULES = [
  "No skipping meals. You're recomping, not cutting.",
  "Hit 165g+ protein every day. Most important number.",
  "Same meals every day. No decision fatigue.",
  "Sunday prep is mandatory. 1 hour saves every weeknight.",
  "Water: 3L minimum daily. Carry a bottle everywhere.",
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTodayDateISO(): string {
  return new Date().toISOString().split("T")[0];
}

function isSunday(): boolean {
  return new Date().getDay() === 0;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MacroProgressBar({
  label,
  current,
  target,
  unit,
  color,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}) {
  const pct = Math.min((current / target) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-white/40 text-xs w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-white/50 text-xs w-20 text-right shrink-0">
        {current}
        {unit} / {target}
        {unit}
      </span>
    </div>
  );
}

function MealCard({
  meal,
  checked,
  onToggle,
}: {
  meal: Meal;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`glass-card relative transition-all duration-300 ${
        checked ? "border-l-[3px] border-l-white" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white/90">{meal.name}</span>
          <span className="text-white/30 text-xs">{meal.time}</span>
        </div>
        <button
          onClick={onToggle}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            checked
              ? "border-white bg-white check-pop"
              : "border-[#333] bg-transparent hover:border-white/40"
          }`}
          aria-label={`Mark ${meal.name} as ${checked ? "incomplete" : "complete"}`}
        >
          {checked && <Check size={14} className="text-black" />}
        </button>
      </div>

      {/* Item rows */}
      <div className="space-y-1.5">
        {meal.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center text-xs text-white/50 gap-2"
          >
            <span className="flex-1 truncate">{item.item}</span>
            <span className="text-white/25 w-24 text-right shrink-0">
              {item.amount}
            </span>
            <span className="w-10 text-right shrink-0 text-white/60">
              {item.protein}g
            </span>
            <span className="w-12 text-right shrink-0 text-white/40">
              {item.calories}
            </span>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-end gap-4 mt-3 pt-2 border-t border-white/5">
        <span className="text-xs font-medium text-white">
          {meal.totalProtein}g protein
        </span>
        <span className="text-xs font-medium text-[#888]">
          {meal.totalCalories} cal
        </span>
      </div>
    </div>
  );
}

function WaterCard({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`glass-card flex items-center justify-between transition-all duration-300 ${
        checked ? "border-l-[3px] border-l-white" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <Droplets size={18} className="text-white" />
        <div>
          <p className="text-sm font-bold text-white/90">WATER</p>
          <p className="text-white/30 text-xs">3L minimum</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          checked
            ? "border-white bg-white check-pop"
            : "border-[#333] bg-transparent hover:border-white/40"
        }`}
        aria-label={`Mark water as ${checked ? "incomplete" : "complete"}`}
      >
        {checked && <Check size={14} className="text-black" />}
      </button>
    </div>
  );
}

function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen,
  children,
}: {
  title: string;
  icon: typeof ChefHat;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-card">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-white" />
          <span className="text-xs font-bold uppercase tracking-wider text-white/70">
            {title}
          </span>
        </div>
        {open ? (
          <ChevronDown size={16} className="text-white/30" />
        ) : (
          <ChevronRight size={16} className="text-white/30" />
        )}
      </button>
      {open && <div className="mt-3 pt-3 border-t border-white/5">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function MealsView() {
  const todayISO = getTodayDateISO();
  const todayChecks = useDailyChecksForDate(todayISO);
  const toggleCheck = useToggleCheck();
  const { trigger } = useWebHaptics();

  // Build a set of completed check types for fast lookup
  const completedSet = useMemo(() => {
    const set = new Set<string>();
    for (const check of todayChecks) {
      if (check.completed) {
        set.add(check.type);
      }
    }
    return set;
  }, [todayChecks]);

  const isMealDone = (mealName: string): boolean => {
    const checkType = mealCheckType[mealName];
    return checkType ? completedSet.has(checkType) : false;
  };

  const isWaterDone = completedSet.has("water");

  // Calculate consumed macros based on checked meals
  const consumed = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    for (const meal of MEALS) {
      const checkType = mealCheckType[meal.name];
      if (checkType && completedSet.has(checkType)) {
        calories += meal.totalCalories;
        protein += meal.totalProtein;
        const extra = MEAL_EXTRA_MACROS[checkType];
        if (extra) {
          carbs += extra.carbs;
          fat += extra.fat;
        }
      }
    }

    return { calories, protein, carbs, fat };
  }, [completedSet]);

  const handleMealToggle = (mealName: string) => {
    const checkType = mealCheckType[mealName];
    if (!checkType) return;
    trigger("success");
    toggleCheck(checkType, todayISO);
  };

  const handleWaterToggle = () => {
    trigger("success");
    toggleCheck("water", todayISO);
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
      {/* ---- Header ---- */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Utensils size={20} className="text-white" />
          <h1 className="text-2xl font-bold tracking-tight">FUEL</h1>
        </div>
        <p className="text-white/40 text-sm">
          {DAILY_TARGETS.calories} cal | {DAILY_TARGETS.protein}g+ protein
        </p>
      </div>

      {/* ---- Daily Macro Summary ---- */}
      <div className="glass-card mb-6 space-y-3">
        <h2 className="text-white/50 text-xs uppercase tracking-wider font-medium mb-1">
          Today's Macros
        </h2>
        <MacroProgressBar
          label="Calories"
          current={consumed.calories}
          target={DAILY_TARGETS.calories}
          unit=""
          color="#FAD399"
        />
        <MacroProgressBar
          label="Protein"
          current={consumed.protein}
          target={DAILY_TARGETS.protein}
          unit="g"
          color="#FAD399"
        />
        <MacroProgressBar
          label="Carbs"
          current={consumed.carbs}
          target={DAILY_TARGETS.carbs}
          unit="g"
          color="#FAD399"
        />
        <MacroProgressBar
          label="Fat"
          current={consumed.fat}
          target={DAILY_TARGETS.fat}
          unit="g"
          color="#FAD399"
        />
        <p className="text-white/20 text-[10px] pt-1">
          Based on checked meals below
        </p>
      </div>

      {/* ---- Meal Cards ---- */}
      <div className="space-y-3 mb-6">
        {MEALS.map((meal) => (
          <MealCard
            key={meal.name}
            meal={meal}
            checked={isMealDone(meal.name)}
            onToggle={() => handleMealToggle(meal.name)}
          />
        ))}
      </div>

      {/* ---- Water Tracker ---- */}
      <div className="mb-6">
        <WaterCard checked={isWaterDone} onToggle={handleWaterToggle} />
      </div>

      {/* ---- Bonus Calories ---- */}
      <div className="glass-card mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} className="text-[#888]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white/60">
            Fill the Gap (~865 cal)
          </h2>
        </div>
        <div className="space-y-1.5">
          {BONUS_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-white/40">{item.label}</span>
              <div className="flex items-center gap-3">
                {item.protein > 0 && (
                  <span className="text-white/50">{item.protein}g P</span>
                )}
                <span className="text-[#888]">+{item.cal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Sunday Prep (collapsible, auto-open on Sundays) ---- */}
      <div className="mb-3">
        <CollapsibleSection
          title="Sunday Prep"
          icon={ChefHat}
          defaultOpen={isSunday()}
        >
          <div className="space-y-3">
            {SUNDAY_PREP_STEPS.map((step, i) => (
              <div key={i} className="flex gap-2 text-xs text-white/50">
                <span className="text-white shrink-0 font-mono">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* ---- Nightly Routine (collapsible, default closed) ---- */}
      <div className="mb-3">
        <CollapsibleSection
          title="Nightly Prep (15 min)"
          icon={ShoppingCart}
          defaultOpen={false}
        >
          <div className="space-y-2">
            {NIGHTLY_STEPS.map((step, i) => (
              <div key={i} className="flex gap-2 text-xs text-white/50">
                <span className="text-white shrink-0 font-mono">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* ---- Recipes ---- */}
      <div className="mb-3">
        <CollapsibleSection
          title="Recipes"
          icon={Utensils}
          defaultOpen={false}
        >
          <div className="space-y-4">
            {RECIPES.map((recipe, i) => (
              <div key={i} className={i > 0 ? "pt-4 border-t border-[#222]" : ""}>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-bold text-white/90">
                    {recipe.name}
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">
                    {recipe.prep}
                  </span>
                </div>
                <div className="space-y-1">
                  {recipe.steps.map((step, j) => (
                    <div key={j} className="flex gap-2 text-xs text-white/50">
                      <span className="text-white/30 shrink-0 font-mono w-4 text-right">
                        {j + 1}.
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* ---- Diet Rules ---- */}
      <div className="glass-card">
        <div className="flex items-center gap-2 mb-3">
          <Egg size={14} className="text-white" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white/60">
            Rules
          </h2>
        </div>
        <div className="space-y-2">
          {DIET_RULES.map((rule, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <Wheat size={10} className="text-white/20 shrink-0 mt-0.5" />
              <span className="text-white/40">{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
