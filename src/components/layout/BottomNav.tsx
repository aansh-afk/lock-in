import {
  CalendarCheck,
  Dumbbell,
  BookOpen,
  UtensilsCrossed,
  Target,
  BarChart3,
} from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import type { Tab } from "../../App";

const tabs: Array<{ id: Tab; label: string; icon: typeof Target }> = [
  { id: "today", label: "Today", icon: CalendarCheck },
  { id: "train", label: "Train", icon: Dumbbell },
  { id: "study", label: "Study", icon: BookOpen },
  { id: "fuel", label: "Fuel", icon: UtensilsCrossed },
  { id: "wheel", label: "Wheel", icon: Target },
  { id: "progress", label: "Stats", icon: BarChart3 },
];

export function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  const { trigger } = useWebHaptics();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              trigger("nudge");
              onTabChange(tab.id);
            }}
            className={`flex flex-col items-center py-2 px-1.5 rounded-xl transition-all ${
              activeTab === tab.id
                ? "text-white"
                : "text-[#555] hover:text-[#888]"
            }`}
          >
            <tab.icon
              size={20}
              strokeWidth={activeTab === tab.id ? 2.5 : 1.5}
            />
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
