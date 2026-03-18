import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect, useMemo } from "react";
import {
  SCHEDULE,
  HOLIDAY_SCHEDULE,
  getCurrentBlock,
  MEALS,
  type ScheduleBlock,
} from "../../lib/constants";
import {
  Check,
  Clock,
  Utensils,
  Dumbbell,
  Flame,
  Droplets,
  BookOpen,
  Brain,
} from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { useAuth } from "../../lib/auth";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CheckType =
  | "meal_breakfast"
  | "meal_lunch"
  | "meal_postworkout"
  | "meal_dinner"
  | "workout"
  | "cardio"
  | "study_morning"
  | "study_lunch"
  | "study_commute"
  | "water"
  | "sleep_ontime"
  | "no_doomscroll";

type ChecklistItem = {
  type: CheckType;
  label: string;
  icon: typeof Check;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { type: "meal_breakfast", label: "Breakfast", icon: Utensils },
  { type: "meal_lunch", label: "Lunch", icon: Utensils },
  { type: "meal_postworkout", label: "Post-Workout Shake", icon: Utensils },
  { type: "meal_dinner", label: "Dinner", icon: Utensils },
  { type: "workout", label: "Workout", icon: Dumbbell },
  { type: "cardio", label: "Cardio", icon: Flame },
  { type: "study_morning", label: "Morning Study", icon: BookOpen },
  { type: "study_lunch", label: "Lunch Study", icon: Brain },
  { type: "study_commute", label: "Commute Study", icon: BookOpen },
  { type: "water", label: "3L Water", icon: Droplets },
  { type: "sleep_ontime", label: "Sleep on Time", icon: Clock },
  { type: "no_doomscroll", label: "No Doomscroll", icon: Check },
];

const MEAL_MACROS: Record<string, { protein: number; calories: number }> = {
  meal_breakfast: { protein: 26, calories: 225 },
  meal_lunch: { protein: 53, calories: 450 },
  meal_postworkout: { protein: 25, calories: 120 },
  meal_dinner: { protein: 65, calories: 590 },
};

const CATEGORY_COLORS: Record<string, string> = {
  wake: "#FAD399",
  commute: "#FAD399",
  class: "#FAD399",
  break: "#FAD399",
  lunch: "#FAD399",
  study: "#FAD399",
  founder: "#FAD399",
  saas: "#FAD399",
  gym: "#FAD399",
  cook: "#FAD399",
  dinner: "#FAD399",
  "wind-down": "#FAD399",
  sleep: "#FAD399",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTimeLeft(endTime: string): string {
  const now = new Date();
  const [h, m] = endTime.split(":").map(Number);
  const end = new Date(now);
  end.setHours(h, m, 0, 0);
  if (end < now && h < 12) end.setDate(end.getDate() + 1);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return "ending";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Lock in";
}

function getDateString(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getTodayDateISO(): string {
  return new Date().toISOString().split("T")[0];
}

function formatBlockTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

function isBlockPast(block: ScheduleBlock): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [endH, endM] = block.end.split(":").map(Number);
  const endMinutes = endH * 60 + endM;

  // Handle midnight crossover: if endMinutes < startMinutes, block crosses midnight
  const [startH, startM] = block.start.split(":").map(Number);
  const startMinutes = startH * 60 + startM;

  if (endMinutes <= startMinutes) {
    // Midnight-crossing block: past only if current time is past end AND past midnight
    return currentMinutes >= endMinutes && currentMinutes < startMinutes;
  }
  return currentMinutes >= endMinutes;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CurrentBlockCard({ block }: { block: ScheduleBlock | null }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!block) {
    return (
      <div className="glass-card mb-6 border-l-4 border-l-gray-500">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
          Current Block
        </p>
        <p className="text-lg font-bold text-white/60">Rest</p>
        <p className="text-white/30 text-sm">Between scheduled blocks</p>
      </div>
    );
  }

  const color = CATEGORY_COLORS[block.category] ?? "#6b7280";

  return (
    <div
      className="glass-card mb-6 border-l-4 border-l-white"
    >
      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
        Current Block
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-white">
            {block.label}
          </p>
          <p className="text-white/60 text-sm mt-0.5">{block.activity}</p>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-sm font-medium">
            {formatTimeLeft(block.end)}
          </p>
          <p className="text-white/30 text-xs mt-0.5">
            {formatBlockTime(block.start)} - {formatBlockTime(block.end)}
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckItem({
  item,
  checked,
  onToggle,
}: {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      onClick={onToggle}
      className={`glass-card flex items-center gap-3 w-full text-left transition-all duration-200 ${
        checked ? "border-white/30" : ""
      }`}
      style={{
        padding: "0.75rem 1rem",
        opacity: checked ? 0.7 : 1,
      }}
    >
      <Icon
        size={16}
        className={checked ? "text-white" : "text-white/40"}
      />
      <span
        className={`text-sm flex-1 ${
          checked ? "text-white/50 line-through" : "text-white/90"
        }`}
      >
        {item.label}
      </span>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          checked
            ? "border-white bg-white"
            : "border-[#333] bg-transparent"
        }`}
      >
        {checked && <Check size={12} className="text-black" />}
      </div>
    </button>
  );
}

function MacroBar({
  label,
  current,
  target,
  color,
}: {
  label: string;
  current: number;
  target: number;
  color: string;
}) {
  const pct = Math.min((current / target) * 100, 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-white/50 text-xs">{label}</span>
        <span className="text-white/70 text-xs font-medium">
          {current} / {target}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function ScheduleTimeline({ currentBlock, schedule }: { currentBlock: ScheduleBlock | null; schedule: ScheduleBlock[] }) {
  // Filter out the sleep block to keep the timeline compact
  const timelineBlocks = schedule.filter((b) => b.category !== "sleep");

  return (
    <div className="space-y-0">
      {timelineBlocks.map((block, i) => {
        const isCurrent =
          currentBlock !== null &&
          block.start === currentBlock.start &&
          block.end === currentBlock.end;
        const isPast = !isCurrent && isBlockPast(block);
        const color = CATEGORY_COLORS[block.category] ?? "#6b7280";

        return (
          <div
            key={i}
            className={`flex items-center gap-3 py-1.5 px-3 rounded-lg transition-all ${
              isCurrent ? "bg-white/[0.04]" : ""
            }`}
          >
            <span
              className={`text-xs font-mono w-12 shrink-0 ${
                isPast ? "text-white/15" : isCurrent ? "text-white" : "text-white/30"
              }`}
            >
              {formatBlockTime(block.start)}
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: isPast ? "#555" : isCurrent ? "#FAD399" : "#333",
              }}
            />
            <span
              className={`text-xs ${
                isPast
                  ? "text-white/15"
                  : isCurrent
                    ? "text-white/90 font-medium"
                    : "text-white/40"
              }`}
            >
              {block.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function getHolidayKey(): string {
  return `wheel_holiday_${new Date().toISOString().split("T")[0]}`;
}

export function TodayView() {
  const { userId } = useAuth();
  const dailyChecks = useQuery(api.daily.listToday, userId ? { userId } : "skip");
  const toggleCheck = useMutation(api.daily.toggle);
  const { trigger } = useWebHaptics();

  const [isHoliday, setIsHoliday] = useState(() => {
    return localStorage.getItem(getHolidayKey()) === "true";
  });

  const activeSchedule = isHoliday ? HOLIDAY_SCHEDULE : SCHEDULE;

  const toggleHoliday = () => {
    const next = !isHoliday;
    setIsHoliday(next);
    if (next) {
      localStorage.setItem(getHolidayKey(), "true");
    } else {
      localStorage.removeItem(getHolidayKey());
    }
    trigger("nudge");
  };

  const [currentBlock, setCurrentBlock] = useState<ScheduleBlock | null>(
    getCurrentBlock(new Date())
  );

  // Re-evaluate current block every minute using active schedule
  useEffect(() => {
    const evalBlock = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      for (const block of activeSchedule) {
        const [sh, sm] = block.start.split(":").map(Number);
        const [eh, em] = block.end.split(":").map(Number);
        const start = sh * 60 + sm;
        const end = eh * 60 + em;
        if (end > start) {
          if (currentMinutes >= start && currentMinutes < end) {
            setCurrentBlock(block);
            return;
          }
        } else {
          if (currentMinutes >= start || currentMinutes < end) {
            setCurrentBlock(block);
            return;
          }
        }
      }
      setCurrentBlock(null);
    };
    evalBlock();
    const interval = setInterval(evalBlock, 60_000);
    return () => clearInterval(interval);
  }, [activeSchedule]);

  // Build a set of completed check types for fast lookup
  const completedSet = useMemo(() => {
    const set = new Set<string>();
    if (dailyChecks) {
      for (const check of dailyChecks) {
        if (check.completed) {
          set.add(check.type);
        }
      }
    }
    return set;
  }, [dailyChecks]);

  // Calculate macros from completed meals
  const macros = useMemo(() => {
    let protein = 0;
    let calories = 0;
    for (const [type, values] of Object.entries(MEAL_MACROS)) {
      if (completedSet.has(type)) {
        protein += values.protein;
        calories += values.calories;
      }
    }
    return { protein, calories };
  }, [completedSet]);

  const handleToggle = async (type: CheckType) => {
    trigger("success");
    await toggleCheck({ type, date: getTodayDateISO(), userId: userId! });
  };

  const completedCount = completedSet.size;
  const totalCount = CHECKLIST_ITEMS.length;

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-24">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">TODAY</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {getDateString()} &middot; {getGreeting()}
          </p>
        </div>
        <button
          onClick={toggleHoliday}
          className={`text-xs font-mono px-3 py-1.5 rounded border transition-all ${
            isHoliday
              ? "bg-[#FAD399] text-black border-[#FAD399] font-bold"
              : "bg-transparent text-[#555] border-[#333] hover:border-[#555]"
          }`}
        >
          {isHoliday ? "HOLIDAY" : "Holiday?"}
        </button>
      </div>

      {/* Current Block Indicator */}
      <CurrentBlockCard block={currentBlock} />

      {/* Daily Progress Summary */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white/50 text-xs uppercase tracking-wider font-medium">
          Daily Checklist
        </h2>
        <span className="text-white/30 text-xs">
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        {CHECKLIST_ITEMS.map((item) => (
          <CheckItem
            key={item.type}
            item={item}
            checked={completedSet.has(item.type)}
            onToggle={() => handleToggle(item.type)}
          />
        ))}
      </div>

      {/* Macro Tracker */}
      <div className="glass-card mb-8">
        <h2 className="text-white/50 text-xs uppercase tracking-wider font-medium mb-3">
          Nutrition
        </h2>
        <MacroBar
          label="Protein"
          current={macros.protein}
          target={165}
          color="#FAD399"
        />
        <MacroBar
          label="Calories"
          current={macros.calories}
          target={2250}
          color="#FAD399"
        />
        <p className="text-white/20 text-[10px] mt-2">
          Based on checked meals &middot; Target: {MEALS.length} meals
        </p>
      </div>

      {/* Schedule Timeline */}
      <div className="glass-card">
        <h2 className="text-white/50 text-xs uppercase tracking-wider font-medium mb-3">
          Schedule
        </h2>
        <ScheduleTimeline currentBlock={currentBlock} schedule={activeSchedule} />
      </div>
    </div>
  );
}
