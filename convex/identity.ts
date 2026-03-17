import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.array(
    v.object({
      _id: v.id("identityStatements"),
      _creationTime: v.number(),
      userId: v.id("users"),
      statement: v.string(),
      active: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("identityStatements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    userId: v.id("users"),
    statement: v.string(),
  },
  returns: v.id("identityStatements"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("identityStatements", {
      userId: args.userId,
      statement: args.statement,
      active: true,
    });
  },
});

export const toggle = mutation({
  args: {
    userId: v.id("users"),
    id: v.id("identityStatements"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const statement = await ctx.db.get(args.id);
    if (statement === null || statement.userId !== args.userId) {
      throw new Error("Statement not found");
    }
    await ctx.db.patch(args.id, { active: !statement.active });
    return null;
  },
});

export const remove = mutation({
  args: {
    userId: v.id("users"),
    id: v.id("identityStatements"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const statement = await ctx.db.get(args.id);
    if (statement === null || statement.userId !== args.userId) {
      throw new Error("Statement not found");
    }
    await ctx.db.delete(args.id);
    return null;
  },
});
