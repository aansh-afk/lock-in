import { useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../lib/auth";
import { SCHEDULE } from "../lib/constants";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert "HH:MM" to minutes since midnight */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// ---------------------------------------------------------------------------
// Browser notification permission + scheduled reminders
// ---------------------------------------------------------------------------

/** Request notification permission on mount, fire schedule-based reminders */
export function useNotifications() {
  const { userId } = useAuth();
  const unread = useQuery(
    api.notifications.listUnread,
    userId ? { userId } : "skip"
  );
  const markAllRead = useMutation(api.notifications.markAllRead);
  const shownIds = useRef<Set<string>>(new Set());
  const firedBlocks = useRef<Set<string>>(new Set());
  const permissionRef = useRef<NotificationPermission>("default");

  // ----- Request permission after a short delay on mount -----
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      // Delay the permission request slightly -- some browsers block
      // immediate permission requests fired during page load.
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

  // ----- Show Convex notifications as browser notifications -----
  useEffect(() => {
    if (!unread || unread.length === 0) return;
    if (!userId) return;

    for (const n of unread) {
      if (shownIds.current.has(n._id)) continue;
      shownIds.current.add(n._id);
      notify("The Wheel", n.message);
    }

    // Mark them read after showing
    markAllRead({ userId });
  }, [unread, notify, markAllRead, userId]);

  // ----- Schedule block reminders -----
  // Instead of matching exact HH:MM strings, we track which blocks have
  // already been notified and fire for any block whose start time has
  // passed but hasn't been notified yet (within a 2-minute window).
  // This makes notifications resilient to throttled/backgrounded timers.
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
    // Check every 30 seconds for better reliability
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [notify]);

  return {
    permission: typeof window !== "undefined" && "Notification" in window
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
