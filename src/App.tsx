import { useState } from "react";
import { useAuth } from "./lib/auth";
import { SignIn } from "./components/auth/SignIn";
import { BottomNav } from "./components/layout/BottomNav";
import { TodayView } from "./components/today/TodayView";
import { TrainView } from "./components/train/TrainView";
import { StudyView } from "./components/study/StudyView";
import { WheelView } from "./components/wheel/WheelView";
import { ProgressView } from "./components/progress/ProgressView";
import { MealsView } from "./components/meals/MealsView";
import { useNotifications } from "./hooks/useNotifications";

export type Tab = "today" | "train" | "study" | "fuel" | "wheel" | "progress";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("today");

  // Must call hooks unconditionally (React rules of hooks)
  useNotifications();

  if (isLoading) {
    return (
      <div className="min-h-screen min-h-dvh bg-black flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-16 h-16 animate-spin"
        >
          {/* Outer ring */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="#FAD399"
            strokeWidth="3"
            opacity="0.3"
          />
          {/* Two spokes */}
          <line
            x1="100"
            y1="78"
            x2="100"
            y2="25"
            stroke="#FAD399"
            strokeWidth="1.5"
            opacity="0.3"
          />
          <line
            x1="122"
            y1="100"
            x2="175"
            y2="100"
            stroke="#FAD399"
            strokeWidth="1.5"
            opacity="0.3"
          />
          {/* Center dot */}
          <circle cx="100" cy="100" r="4" fill="#FAD399" opacity="0.8" />
        </svg>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen min-h-dvh bg-black text-white">
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
