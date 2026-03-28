import { useState } from "react";
import { BottomNav } from "./components/layout/BottomNav";
import { TodayView } from "./components/today/TodayView";
import { TrainView } from "./components/train/TrainView";
import { StudyView } from "./components/study/StudyView";
import { WheelView } from "./components/wheel/WheelView";
import { ProgressView } from "./components/progress/ProgressView";
import { MealsView } from "./components/meals/MealsView";
import { useNotifications } from "./hooks/useNotifications";
import { useInstallPrompt } from "./hooks/useInstallPrompt";

export type Tab = "today" | "train" | "study" | "fuel" | "wheel" | "progress";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const { canInstall, install } = useInstallPrompt();
  const [dismissedInstall, setDismissedInstall] = useState(false);

  useNotifications();

  return (
    <div className="min-h-screen min-h-dvh bg-black text-white">
      {/* Install banner */}
      {canInstall && !dismissedInstall && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#111] border-b border-[#222] px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-[#FAD399]/80">Install The Wheel as an app</span>
          <div className="flex gap-2">
            <button
              onClick={() => setDismissedInstall(true)}
              className="text-xs text-[#555] px-2 py-1"
            >
              Later
            </button>
            <button
              onClick={install}
              className="text-xs text-black bg-[#FAD399] px-3 py-1 rounded font-bold"
            >
              Install
            </button>
          </div>
        </div>
      )}
      <main className="pb-24">
        {activeTab === "today" && <TodayView />}
        {activeTab === "train" && <TrainView />}
        {activeTab === "study" && <StudyView />}
        {activeTab === "fuel" && <MealsView />}
        {activeTab === "wheel" && <WheelView />}
        {activeTab === "progress" && <ProgressView />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
