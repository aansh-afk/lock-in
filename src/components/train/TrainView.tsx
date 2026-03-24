import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect, useCallback } from "react";
import {
  getTodayWorkout,
  CARDIO,
  type WorkoutDay,
  type Exercise,
} from "../../lib/constants";
import { Dumbbell, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { useAuth } from "../../lib/auth";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MUSCLE_GROUPS: Record<string, string> = {
  upper: "Chest, Back, Shoulders, Arms",
  lower: "Quads, Hamstrings, Glutes, Calves, Core",
  rest: "Recovery",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTodayDateISO(): string {
  return new Date().toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProgressBar({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-white/50 text-xs">Progress</span>
        <span className="text-white/70 text-xs font-medium">
          {completed}/{total} exercises
        </span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: "#FAD399",
          }}
        />
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise,
  checked,
  onToggle,
}: {
  exercise: Exercise;
  index: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`glass-card flex items-start gap-3 transition-all duration-200 border-l-4 ${
        checked ? "border-l-white opacity-60" : "border-l-[#333]"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-sm ${
            checked ? "line-through text-white/40" : "text-white/90"
          }`}
        >
          {exercise.name}
        </p>
        <p className="text-white font-mono text-xs font-medium mt-1">
          {exercise.sets} x {exercise.reps}
        </p>
        {exercise.notes && (
          <p className="text-white/30 text-xs mt-1">{exercise.notes}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
          checked
            ? "border-white bg-white"
            : "border-[#333] bg-transparent hover:border-white/40"
        }`}
      >
        {checked && <Check size={14} className="text-black" />}
      </button>
    </div>
  );
}

function CardioCard({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`glass-card border-l-4 transition-all duration-200 ${
        checked ? "border-l-white opacity-60" : "border-l-[#333]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`font-semibold text-sm uppercase ${
              checked ? "line-through text-white/40" : "text-white/90"
            }`}
          >
            Incline Treadmill
          </p>
          <p className="text-[#888] font-mono text-xs font-medium mt-1">
            {CARDIO.duration} min | {CARDIO.incline} incline | {CARDIO.speed}
          </p>
        </div>
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
            checked
              ? "border-white bg-white"
              : "border-[#333] bg-transparent hover:border-white/40"
          }`}
        >
          {checked && <Check size={14} className="text-black" />}
        </button>
      </div>
    </div>
  );
}

function ProgressionRules() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <span className="text-white/50 text-xs uppercase tracking-wider font-medium">
          Progression Rules
        </span>
        {expanded ? (
          <ChevronUp size={16} className="text-white/30" />
        ) : (
          <ChevronDown size={16} className="text-white/30" />
        )}
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2">
          <p className="text-white/40 text-xs">
            Add weight when all reps are clean
          </p>
          <p className="text-white/40 text-xs">
            Upper body: <span className="text-white">+2.5kg</span> | Lower
            body: <span className="text-white">+5kg</span>
          </p>
          <p className="text-white/40 text-xs">
            Compound rest: <span className="text-white">90s</span> |
            Isolation rest: <span className="text-white">60s</span>
          </p>
        </div>
      )}
    </div>
  );
}

function RestDayView() {
  return (
    <div className="space-y-6">
      <div className="glass-card text-center py-8">
        <Dumbbell size={32} className="text-white/10 mx-auto mb-4" />
        <p className="text-xl font-bold text-white/60 mb-2">REST DAY</p>
        <p className="text-white/30 text-sm">
          The wheel rests. Meal prep. Light review if you want.
        </p>
      </div>

      <div className="glass-card">
        <h3 className="text-white/50 text-xs uppercase tracking-wider font-medium mb-3">
          Sunday Tasks
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#555] mt-1.5 shrink-0" />
            <p className="text-white/60 text-sm">
              Meal prep - Cook 1.4kg chicken breast
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#555] mt-1.5 shrink-0" />
            <p className="text-white/60 text-sm">Prep roti dough for the week</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#555] mt-1.5 shrink-0" />
            <p className="text-white/60 text-sm">Chop vegetables</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TrainView() {
  const { userId } = useAuth();
  const toggleCheck = useMutation(api.daily.toggle);
  const { trigger } = useWebHaptics();

  const todayISO = getTodayDateISO();
  const trainKey = `wheel_train_${todayISO}`;
  const cardioKey = `wheel_cardio_${todayISO}`;

  const [workout] = useState<WorkoutDay>(() => getTodayWorkout(new Date()));
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    () => {
      try {
        const stored = localStorage.getItem(trainKey);
        if (stored) {
          const indices: number[] = JSON.parse(stored);
          return new Set(indices);
        }
      } catch {
        // ignore corrupt data
      }
      return new Set();
    }
  );
  const [cardioComplete, setCardioComplete] = useState(() => {
    try {
      return localStorage.getItem(cardioKey) === "true";
    } catch {
      return false;
    }
  });
  const [workoutToggled, setWorkoutToggled] = useState(false);
  const [cardioToggled, setCardioToggled] = useState(false);

  const isRestDay = workout.type === "rest";
  const exerciseCount = workout.exercises.length;
  const completedCount = completedExercises.size;
  const allExercisesDone = completedCount === exerciseCount && exerciseCount > 0;

  // Toggle daily "workout" check when all exercises are completed
  useEffect(() => {
    if (allExercisesDone && !workoutToggled) {
      trigger("success");
      setWorkoutToggled(true);
      void toggleCheck({ type: "workout", date: getTodayDateISO(), userId: userId! });
    }
  }, [allExercisesDone, workoutToggled, trigger, toggleCheck]);

  // Toggle daily "cardio" check when cardio is completed
  useEffect(() => {
    if (cardioComplete && !cardioToggled) {
      setCardioToggled(true);
      void toggleCheck({ type: "cardio", date: getTodayDateISO(), userId: userId! });
    }
  }, [cardioComplete, cardioToggled, toggleCheck]);

  const handleExerciseToggle = useCallback(
    (index: number) => {
      trigger("nudge");
      setCompletedExercises((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        // Persist to localStorage immediately
        try {
          localStorage.setItem(trainKey, JSON.stringify([...next]));
        } catch {
          // storage full or unavailable
        }
        return next;
      });
    },
    [trigger, trainKey]
  );

  const handleCardioToggle = useCallback(() => {
    trigger("success");
    setCardioComplete((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(cardioKey, String(next));
      } catch {
        // storage full or unavailable
      }
      return next;
    });
  }, [trigger, cardioKey]);

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Dumbbell
            size={20}
            className={isRestDay ? "text-white/20" : "text-white"}
          />
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            {workout.type === "rest"
              ? "Rest Day"
              : `${workout.type === "upper" ? "Upper" : "Lower"} Day`}
          </h1>
        </div>
        <p className="text-white/40 text-sm">{MUSCLE_GROUPS[workout.type]}</p>
      </div>

      {isRestDay ? (
        <RestDayView />
      ) : (
        <>
          {/* Progress Bar */}
          <ProgressBar completed={completedCount} total={exerciseCount} />

          {/* Exercise List */}
          <div className="space-y-3 mb-8">
            {workout.exercises.map((exercise, i) => (
              <ExerciseCard
                key={i}
                exercise={exercise}
                index={i}
                checked={completedExercises.has(i)}
                onToggle={() => handleExerciseToggle(i)}
              />
            ))}
          </div>

          {/* Cardio Section */}
          <div className="mb-8">
            <h2 className="text-white/50 text-xs uppercase tracking-wider font-medium mb-3">
              Cardio
            </h2>
            <CardioCard
              checked={cardioComplete}
              onToggle={handleCardioToggle}
            />
          </div>

          {/* Progression Rules */}
          <ProgressionRules />
        </>
      )}
    </div>
  );
}
