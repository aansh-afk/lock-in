import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.array(
    v.object({
      _id: v.id("adaptations"),
      _creationTime: v.number(),
      userId: v.id("users"),
      hit: v.string(),
      adaptation: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("adaptations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .order("desc")
      .take(50);
  },
});

export const add = mutation({
  args: {
    userId: v.id("users"),
    hit: v.string(),
    adaptation: v.string(),
  },
  returns: v.id("adaptations"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("adaptations", {
      userId: args.userId,
      hit: args.hit,
      adaptation: args.adaptation,
    });
  },
});
