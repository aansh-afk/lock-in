import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const checkTypeValidator = v.union(
  v.literal("meal_breakfast"),
  v.literal("meal_lunch"),
  v.literal("meal_postworkout"),
  v.literal("meal_dinner"),
  v.literal("workout"),
  v.literal("cardio"),
  v.literal("study_morning"),
  v.literal("study_lunch"),
  v.literal("study_commute"),
  v.literal("water"),
  v.literal("sleep_ontime"),
  v.literal("no_doomscroll")
);

/**
 * List all daily checks for the user for today's date.
 */
export const listToday = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.array(
    v.object({
      _id: v.id("dailyChecks"),
      _creationTime: v.number(),
      userId: v.id("users"),
      date: v.string(),
      type: checkTypeValidator,
      completed: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    if (!args.userId) return [];

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    return await ctx.db
      .query("dailyChecks")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", args.userId!).eq("date", today)
      )
      .collect();
  },
});

/**
 * Toggle a daily check. If a check for this user+date+type exists, flip its
 * completed field. If it doesn't exist, create it with completed=true.
 */
export const toggle = mutation({
  args: {
    userId: v.id("users"),
    type: checkTypeValidator,
    date: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("dailyChecks")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .collect();

    const match = existing.find((check) => check.type === args.type);

    if (match) {
      await ctx.db.patch(match._id, { completed: !match.completed });
    } else {
      await ctx.db.insert("dailyChecks", {
        userId: args.userId,
        date: args.date,
        type: args.type,
        completed: true,
      });
    }

    return null;
  },
});

/**
 * List all daily checks for the user for the last 30 days.
 */
export const listRecent = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.array(
    v.object({
      _id: v.id("dailyChecks"),
      _creationTime: v.number(),
      userId: v.id("users"),
      date: v.string(),
      type: checkTypeValidator,
      completed: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    if (!args.userId) return [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10);

    const allChecks = await ctx.db
      .query("dailyChecks")
      .withIndex("by_user_and_date", (q) => q.eq("userId", args.userId!))
      .collect();

    return allChecks.filter((check) => check.date >= thirtyDaysAgoStr);
  },
});

/**
 * Count consecutive days (going backwards from yesterday) where the user
 * completed at least their workout check. Simple streak counter.
 */
export const getStreak = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.number(),
  handler: async (ctx, args) => {
    if (!args.userId) return 0;

    let streak = 0;
    const date = new Date();
    // Start from yesterday
    date.setDate(date.getDate() - 1);

    for (let i = 0; i < 365; i++) {
      const dateStr = date.toISOString().slice(0, 10);

      const checks = await ctx.db
        .query("dailyChecks")
        .withIndex("by_user_and_date", (q) =>
          q.eq("userId", args.userId!).eq("date", dateStr)
        )
        .collect();

      const workoutDone = checks.some(
        (check) => check.type === "workout" && check.completed
      );

      if (!workoutDone) break;

      streak++;
      date.setDate(date.getDate() - 1);
    }

    return streak;
  },
});
