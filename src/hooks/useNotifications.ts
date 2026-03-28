import { useEffect, useRef, useCallback } from "react";
import { SCHEDULE } from "../lib/constants";

/** Convert "HH:MM" to minutes since midnight */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Request notification permission on mount, fire schedule-based reminders */
export function useNotifications() {
  const firedBlocks = useRef<Set<string>>(new Set());
  const permissionRef = useRef<NotificationPermission>("default");

  // Request permission after a short delay on mount
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      const timer = setTimeout(() => {
        Notification.requestPermission().then((perm) => {
          permissionRef.current = perm;
        });
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      permissionRef.current = Notification.permission;
    }
  }, []);

  const notify = useCallback((title: string, body?: string) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    try {
      new Notification(title, {
        body,
        icon: "/wheel.svg",
        badge: "/wheel.svg",
        silent: false,
      });
    } catch {
      // Safari/iOS may not support Notification constructor
    }
  }, []);

  // Schedule block reminders
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      for (const block of SCHEDULE) {
        if (firedBlocks.current.has(block.start)) continue;

        const blockMinutes = timeToMinutes(block.start);
        const elapsed = nowMinutes - blockMinutes;

        // Fire if we're within 0-2 minutes past the block start
        if (elapsed >= 0 && elapsed <= 2) {
          firedBlocks.current.add(block.start);
          notify(block.label, block.activity);
        }
      }
    };

    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [notify]);

  return {
    permission:
      typeof window !== "undefined" && "Notification" in window
        ? Notification.permission
        : ("denied" as NotificationPermission),
    requestPermission: async () => {
      if (!("Notification" in window)) return "denied" as NotificationPermission;
      const perm = await Notification.requestPermission();
      permissionRef.current = perm;
      return perm;
    },
  };
}
