import { useSyncExternalStore, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CheckType =
  | "meal_breakfast"
  | "meal_lunch"
  | "meal_postworkout"
  | "meal_dinner"
  | "workout"
  | "cardio"
  | "study_morning"
  | "study_lunch"
  | "study_commute"
  | "water"
  | "sleep_ontime"
  | "no_doomscroll";

export type DailyCheck = {
  id: string;
  date: string;
  type: CheckType;
  completed: boolean;
  createdAt: number;
};

export type Adaptation = {
  id: string;
  hit: string;
  adaptation: string;
  createdAt: number;
};

export type Identity = {
  id: string;
  statement: string;
  active: boolean;
  createdAt: number;
};

// ---------------------------------------------------------------------------
// Reactive localStorage store
// ---------------------------------------------------------------------------

function createStore<T>(key: string, defaultValue: T) {
  let listeners: Array<() => void> = [];
  let cache: T | undefined;

  function get(): T {
    if (cache !== undefined) return cache;
    try {
      const raw = localStorage.getItem(key);
      cache = raw ? JSON.parse(raw) : defaultValue;
      return cache!;
    } catch {
      cache = defaultValue;
      return defaultValue;
    }
  }

  function set(value: T) {
    cache = value;
    localStorage.setItem(key, JSON.stringify(value));
    for (const l of listeners) l();
  }

  function update(fn: (prev: T) => T) {
    set(fn(get()));
  }

  function subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  return { get, set, update, subscribe };
}

function uid(): string {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------

const dailyChecksStore = createStore<DailyCheck[]>("wheel_checks", []);
const adaptationsStore = createStore<Adaptation[]>("wheel_adaptations", []);
const identitiesStore = createStore<Identity[]>("wheel_identities", []);

// ---------------------------------------------------------------------------
// Hooks — Daily Checks
// ---------------------------------------------------------------------------

export function useDailyChecksForDate(date: string): DailyCheck[] {
  const all = useSyncExternalStore(dailyChecksStore.subscribe, dailyChecksStore.get);
  return all.filter((c) => c.date === date);
}

export function useRecentChecks(): DailyCheck[] {
  const all = useSyncExternalStore(dailyChecksStore.subscribe, dailyChecksStore.get);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffISO = cutoff.toISOString().split("T")[0];
  return all.filter((c) => c.date >= cutoffISO);
}

export function useStreak(): number {
  const all = useSyncExternalStore(dailyChecksStore.subscribe, dailyChecksStore.get);
  let streak = 0;
  const d = new Date();
  d.setDate(d.getDate() - 1); // start from yesterday

  while (true) {
    const dateStr = d.toISOString().split("T")[0];
    const hasWorkout = all.some(
      (c) => c.date === dateStr && c.type === "workout" && c.completed
    );
    if (!hasWorkout) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function useToggleCheck() {
  return useCallback((type: CheckType, date: string) => {
    dailyChecksStore.update((checks) => {
      const existing = checks.find((c) => c.date === date && c.type === type);
      if (existing) {
        return checks.map((c) =>
          c.id === existing.id ? { ...c, completed: !c.completed } : c
        );
      }
      return [
        ...checks,
        { id: uid(), date, type, completed: true, createdAt: Date.now() },
      ];
    });
  }, []);
}

// ---------------------------------------------------------------------------
// Hooks — Adaptations
// ---------------------------------------------------------------------------

export function useAdaptations(): Adaptation[] {
  const all = useSyncExternalStore(adaptationsStore.subscribe, adaptationsStore.get);
  return [...all].sort((a, b) => b.createdAt - a.createdAt).slice(0, 50);
}

export function useAddAdaptation() {
  return useCallback((hit: string, adaptation: string) => {
    adaptationsStore.update((list) => [
      ...list,
      { id: uid(), hit, adaptation, createdAt: Date.now() },
    ]);
  }, []);
}

// ---------------------------------------------------------------------------
// Hooks — Identities
// ---------------------------------------------------------------------------

export function useIdentities(): Identity[] {
  const all = useSyncExternalStore(identitiesStore.subscribe, identitiesStore.get);
  return [...all].sort((a, b) => b.createdAt - a.createdAt);
}

export function useAddIdentity() {
  return useCallback((statement: string) => {
    identitiesStore.update((list) => [
      ...list,
      { id: uid(), statement, active: true, createdAt: Date.now() },
    ]);
  }, []);
}

export function useToggleIdentity() {
  return useCallback((id: string) => {
    identitiesStore.update((list) =>
      list.map((i) => (i.id === id ? { ...i, active: !i.active } : i))
    );
  }, []);
}

export function useRemoveIdentity() {
  return useCallback((id: string) => {
    identitiesStore.update((list) => list.filter((i) => i.id !== id));
  }, []);
}
