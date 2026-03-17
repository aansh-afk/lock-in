import {
  query,
  mutation,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const listMessages = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.array(
    v.object({
      _id: v.id("aiMessages"),
      _creationTime: v.number(),
      userId: v.id("users"),
      role: v.union(
        v.literal("user"),
        v.literal("assistant"),
        v.literal("system")
      ),
      content: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("aiMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .order("asc")
      .take(100);
  },
});

export const sendMessage = mutation({
  args: { userId: v.id("users"), message: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("aiMessages", {
      userId: args.userId,
      role: "user",
      content: args.message,
    });

    await ctx.scheduler.runAfter(0, internal.aiActions.generateResponse, {
      userId: args.userId,
    });

    return null;
  },
});

export const clearMessages = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("aiMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    return null;
  },
});

// Internal helpers for the AI action

export const loadMessages = internalQuery({
  args: { userId: v.id("users") },
  returns: v.array(
    v.object({
      role: v.string(),
      content: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("aiMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(20);
    return messages.reverse().map((m) => ({ role: m.role, content: m.content }));
  },
});

export const loadIdentities = internalQuery({
  args: { userId: v.id("users") },
  returns: v.array(v.object({ statement: v.string() })),
  handler: async (ctx, args) => {
    const statements = await ctx.db
      .query("identityStatements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return statements
      .filter((s) => s.active)
      .map((s) => ({ statement: s.statement }));
  },
});

export const loadRecentAdaptations = internalQuery({
  args: { userId: v.id("users") },
  returns: v.array(v.object({ hit: v.string(), adaptation: v.string() })),
  handler: async (ctx, args) => {
    const adaptations = await ctx.db
      .query("adaptations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(5);
    return adaptations.map((a) => ({ hit: a.hit, adaptation: a.adaptation }));
  },
});

export const storeMessage = internalMutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    content: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("aiMessages", {
      userId: args.userId,
      role: args.role,
      content: args.content,
    });
    return null;
  },
});
