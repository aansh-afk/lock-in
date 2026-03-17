import { useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../lib/auth";
import { SCHEDULE } from "../lib/constants";

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

  // ----- Request permission on mount -----
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        permissionRef.current = perm;
      });
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

  // ----- Schedule block reminders (check every minute) -----
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      const timeStr = `${hh}:${mm}`;

      for (const block of SCHEDULE) {
        if (block.start === timeStr && !firedBlocks.current.has(block.start)) {
          firedBlocks.current.add(block.start);
          notify(block.label, block.activity);
        }
      }
    };

    check();
    const interval = setInterval(check, 60_000);
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
