import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const signUp = mutation({
  args: { email: v.string(), password: v.string() },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (existing) throw new Error("Account already exists");
    return await ctx.db.insert("users", {
      email: args.email,
      password: args.password,
    });
  },
});

export const signIn = mutation({
  args: { email: v.string(), password: v.string() },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) throw new Error("No account with that email");
    if (user.password !== args.password) throw new Error("Wrong password");
    return user._id;
  },
});

export const currentUser = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("users"),
      email: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    if (!args.userId) return null;
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    return { _id: user._id, email: user.email };
  },
});
