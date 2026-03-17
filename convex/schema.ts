import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(),
  }).index("by_email", ["email"]),

  adaptations: defineTable({
    userId: v.id("users"),
    hit: v.string(),
    adaptation: v.string(),
  }).index("by_user", ["userId"]),

  identityStatements: defineTable({
    userId: v.id("users"),
    statement: v.string(),
    active: v.boolean(),
  }).index("by_user", ["userId"]),

  aiMessages: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    content: v.string(),
  }).index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    message: v.string(),
    type: v.union(
      v.literal("reminder"),
      v.literal("nudge"),
      v.literal("ai")
    ),
    read: v.boolean(),
  }).index("by_user_and_read", ["userId", "read"]),

  dailyChecks: defineTable({
    userId: v.id("users"),
    date: v.string(),
    type: v.union(
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
    ),
    completed: v.boolean(),
  }).index("by_user_and_date", ["userId", "date"]),
});
