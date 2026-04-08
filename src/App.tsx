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
  const [dismissedNotifications, setDismissedNotifications] = useState(false);
  const { supported, permission, requestPermission } = useNotifications();

  const showInstallBanner = canInstall && !dismissedInstall;
  const showNotificationsBanner =
    supported && permission === "default" && !dismissedNotifications;
  const topBannerCount = Number(showInstallBanner) + Number(showNotificationsBanner);
  const topPaddingClass =
    topBannerCount === 2 ? "pt-32" : topBannerCount === 1 ? "pt-16" : "";

  return (
    <div className="min-h-screen min-h-dvh bg-black text-white">
      {(showInstallBanner || showNotificationsBanner) && (
        <div className="fixed top-0 left-0 right-0 z-50">
          {showInstallBanner && (
            <div className="bg-[#111] border-b border-[#222] px-4 py-3 flex items-center justify-between">
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

          {showNotificationsBanner && (
            <div className="bg-[#0f0f0f] border-b border-[#222] px-4 py-3 flex items-center justify-between gap-4">
              <span className="text-sm text-white/70">
                Enable browser reminders while The Wheel is active on this device.
              </span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setDismissedNotifications(true)}
                  className="text-xs text-[#555] px-2 py-1"
                >
                  Not now
                </button>
                <button
                  onClick={() => {
                    void requestPermission();
                  }}
                  className="text-xs text-black bg-white px-3 py-1 rounded font-bold"
                >
                  Allow
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <main className={`${topPaddingClass} pb-24`}>
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
