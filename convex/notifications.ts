import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const listUnread = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.array(
    v.object({
      _id: v.id("notifications"),
      _creationTime: v.number(),
      userId: v.id("users"),
      message: v.string(),
      type: v.union(
        v.literal("reminder"),
        v.literal("nudge"),
        v.literal("ai")
      ),
      read: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) =>
        q.eq("userId", args.userId!).eq("read", false)
      )
      .order("desc")
      .take(10);
  },
});

export const markAllRead = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) =>
        q.eq("userId", args.userId).eq("read", false)
      )
      .collect();
    for (const notification of unread) {
      await ctx.db.patch(notification._id, { read: true });
    }
    return null;
  },
});

export const create = internalMutation({
  args: {
    userId: v.id("users"),
    message: v.string(),
    type: v.union(
      v.literal("reminder"),
      v.literal("nudge"),
      v.literal("ai")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      message: args.message,
      type: args.type,
      read: false,
    });
    return null;
  },
});
