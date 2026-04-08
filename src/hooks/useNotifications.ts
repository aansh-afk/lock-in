import { useCallback, useEffect, useRef, useState } from "react";
import { SCHEDULE } from "../lib/constants";

/** Convert "HH:MM" to minutes since midnight */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

async function showReminderNotification(title: string, body?: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const options = {
    body,
    icon: "/wheel.svg",
    badge: "/wheel.svg",
    silent: false,
    data: { url: "/" },
  };

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
      return;
    }
  } catch {
    // Fall back to the page-level Notification API when the SW path fails.
  }

  try {
    new Notification(title, options);
  } catch {
    // Safari/iOS may not support the Notification constructor.
  }
}

export function useNotifications() {
  const firedBlocks = useRef<Set<string>>(new Set());
  const activeDay = useRef<string>("");
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : ("denied" as NotificationPermission),
  );

  useEffect(() => {
    if (!("Notification" in window)) return;

    const syncPermission = () => setPermission(Notification.permission);

    syncPermission();
    window.addEventListener("focus", syncPermission);
    document.addEventListener("visibilitychange", syncPermission);

    return () => {
      window.removeEventListener("focus", syncPermission);
      document.removeEventListener("visibilitychange", syncPermission);
    };
  }, []);

  const notify = useCallback((title: string, body?: string) => {
    void showReminderNotification(title, body);
  }, []);

  useEffect(() => {
    if (permission !== "granted") return;

    const check = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      if (activeDay.current !== today) {
        activeDay.current = today;
        firedBlocks.current.clear();
      }

      for (const block of SCHEDULE) {
        const reminderKey = `${today}:${block.start}`;

        if (firedBlocks.current.has(reminderKey)) continue;

        const blockMinutes = timeToMinutes(block.start);
        const elapsed = nowMinutes - blockMinutes;

        if (elapsed >= 0 && elapsed <= 2) {
          firedBlocks.current.add(reminderKey);
          notify(block.label, block.activity);
        }
      }
    };

    check();
    const interval = window.setInterval(check, 30_000);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [notify, permission]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "denied" as NotificationPermission;

    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);

    if (nextPermission === "granted") {
      await showReminderNotification(
        "Reminders enabled",
        "The Wheel will alert you while the app is active on this device.",
      );
    }

    return nextPermission;
  }, []);

  return {
    supported: typeof window !== "undefined" && "Notification" in window,
    permission,
    requestPermission,
  };
}
