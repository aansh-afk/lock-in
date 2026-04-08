import { useState, useMemo } from "react";
import {
  BookOpen,
  Target,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  getCurrentStudyModule,
  getCurrentStudyWeek,
  STUDY_MODULES,
  type StudyModule,
  type StudyWeek,
} from "../../lib/constants";

type ModuleStatus = "past" | "current" | "future";

const STUDY_STEPS = [
  "READ",
  "WRITE",
  "SPAM QUESTIONS",
  "REVIEW MISTAKES",
  "MOVE ON",
] as const;

const STUDY_SCHEDULE = [
  { time: "08:00 - 09:00", activity: "Commute flashcards", tool: "Phone" },
  {
    time: "09:00 - 11:00",
    activity: "Current module - READ + WRITE",
    tool: "Textbook + notebook",
  },
  {
    time: "11:15 - 13:15",
    activity: "Split: follow lecture + self-study",
    tool: "Textbook",
  },
  {
    time: "13:35 - 14:15",
    activity: "SPAM QUESTIONS on today's content",
    tool: "Phone / papers",
  },
  {
    time: "14:15 - 17:00",
    activity: "Continue READ + WRITE",
    tool: "Textbook + notebook",
  },
  { time: "17:00 - 17:30", activity: "Commute flashcards", tool: "Phone" },
] as const;

function getModuleStatus(
  mod: StudyModule,
  currentModule: StudyModule
): ModuleStatus {
  if (mod.number === currentModule.number) return "current";
  if (mod.month < currentModule.month) return "past";
  if (
    mod.month === currentModule.month &&
    mod.number < currentModule.number
  )
    return "past";
  return "future";
}

export function StudyView() {
  const now = useMemo(() => new Date(), []);
  const currentModule = useMemo(() => getCurrentStudyModule(now), [now]);
  const currentStudyWeek = useMemo(() => getCurrentStudyWeek(now), [now]);

  // Determine which week name is "current" for auto-expand
  const currentWeekName = currentStudyWeek?.week.week ?? null;

  // Track expanded weeks - current week starts expanded
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (currentWeekName) {
      initial.add(currentWeekName);
    }
    return initial;
  });

  const toggleWeek = (weekName: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekName)) {
        next.delete(weekName);
      } else {
        next.add(weekName);
      }
      return next;
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-white" />
          <h2 className="text-xl font-bold">STUDY</h2>
        </div>
        <p className="text-white/40 text-sm">
          Module {currentModule.number} &mdash; {currentModule.name}
        </p>
      </div>

      {/* Module Progress Overview */}
      <div className="flex gap-2 mb-6">
        {STUDY_MODULES.map((mod) => {
          const status = getModuleStatus(mod, currentModule);
          return (
            <div
              key={mod.number}
              className={`
                flex-1 py-1.5 rounded-xl text-center text-xs font-semibold transition-all
                ${
                  status === "current"
                    ? "glass border-white text-white"
                    : status === "past"
                      ? "glass border-[#555] text-[#555]"
                      : "glass text-white/20"
                }
              `}
            >
              <span className="block text-[10px] opacity-60 mb-0.5">
                {status === "past" ? (
                  <CheckCircle2 size={10} className="inline" />
                ) : status === "current" ? (
                  <Target size={10} className="inline" />
                ) : (
                  <Circle size={10} className="inline" />
                )}
              </span>
              M{mod.number}
            </div>
          );
        })}
      </div>

      {/* Current Week Card */}
      {currentStudyWeek && (
        <div className="glass-card mb-6 border-l-2 border-l-white">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {currentStudyWeek.week.week}
            </h3>
            <span className="text-white/30 text-xs">
              &mdash; {currentStudyWeek.week.topics[0]}
            </span>
          </div>
          <div className="space-y-1.5">
            {currentStudyWeek.week.topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-1 h-1 rounded-full bg-white/50 shrink-0" />
                <span className="text-white/80 text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Module Breakdown */}
      <div className="mb-6">
        <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">
          Module {currentModule.number} Breakdown
        </h3>
        <div className="space-y-2">
          {currentModule.weeks.map((week) => {
            const isExpanded = expandedWeeks.has(week.week);
            const isCurrent = week.week === currentWeekName;

            return (
              <div
                key={week.week}
                className={`glass overflow-hidden transition-all ${
                  isCurrent ? "border-[#555]" : ""
                }`}
              >
                <button
                  onClick={() => toggleWeek(week.week)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    {isCurrent ? (
                      <Target size={12} className="text-white shrink-0" />
                    ) : (
                      <Circle size={12} className="text-white/20 shrink-0" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? "text-white" : "text-white/60"
                      }`}
                    >
                      {week.week}
                    </span>
                    <span className="text-white/25 text-xs">
                      {week.topics[0]}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={14} className="text-white/30" />
                  ) : (
                    <ChevronRight size={14} className="text-white/30" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 pt-0 space-y-1.5 border-t border-white/5">
                    {week.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2.5 py-0.5">
                        <div
                          className={`w-1 h-1 rounded-full shrink-0 ${
                            isCurrent ? "bg-white/50" : "bg-white/20"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            isCurrent ? "text-white/80" : "text-white/50"
                          }`}
                        >
                          {topic}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Method */}
      <div className="glass-card mb-6">
        <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">
          Study Method
        </h3>
        <div className="flex items-center gap-1 flex-wrap">
          {STUDY_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-1">
              <span className="text-white font-mono text-[11px] font-semibold whitespace-nowrap">
                {step}
              </span>
              {i < STUDY_STEPS.length - 1 && (
                <span className="text-white/20 text-[11px]">&rarr;</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-white/20 text-[10px] mt-2">
          Don't perfectionist-loop. Move on once you understand it.
        </p>
      </div>

      {/* Study Schedule */}
      <div className="glass-card mb-6">
        <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">
          Daily Study Blocks
        </h3>
        <div className="space-y-2">
          {STUDY_SCHEDULE.map((block, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-white/30 text-[11px] font-mono w-[100px] shrink-0 pt-px">
                {block.time}
              </span>
              <div className="min-w-0">
                <span className="text-white/70 text-xs block">
                  {block.activity}
                </span>
                <span className="text-white/20 text-[10px]">{block.tool}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Targets */}
      <div className="flex gap-2 flex-wrap mb-8">
        <span className="glass px-3 py-1.5 text-[11px] text-white/40 font-medium">
          Pass: 75%
        </span>
        <span className="glass px-3 py-1.5 text-[11px] text-white font-semibold">
          Target: 95%+
        </span>
        <span className="glass px-3 py-1.5 text-[11px] text-white/40 font-medium">
          DGCA June 16–20
        </span>
      </div>
    </div>
  );
}
