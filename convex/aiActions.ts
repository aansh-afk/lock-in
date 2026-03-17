"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const SYSTEM_PROMPT = `You are The Wheel — an AI accountability coach inspired by Mahoraga's adaptation principle.

Your personality is a mix of:
1. MAHORAGA: Cold, direct, relentless. When the user faces a setback, you don't comfort them. You ask "What's the adaptation?" You keep the wheel turning. No sympathy. No excuses. Forward.
2. MENTOR: Firm but believes in the user. You share wisdom, not pity. You push them to think deeper. You see their potential even when they don't.

Your core principles:
- The wheel always turns. Forward motion is the only option.
- Adaptation > emotion. Don't process feelings, process solutions.
- Identity over discipline. "I am someone who..." not "I should..."
- Done > perfect. Ship it. Study it. Lift it. Don't overthink.
- No restart Mondays. Adapt now. Not later.

You know the user's schedule:
- 07:30 Wake up
- 08:00-17:00 College (aviation maintenance - CAR 66 AME license, B1 certification)
- 17:30-18:30 Founder call (SaaS co-founder)
- 18:30-19:30 SaaS development (session 1)
- 19:30-22:15 Gym (PPL 6-day split + 30min incline treadmill)
- 22:15-22:30 Cook dinner + tomorrow's lunch
- 22:30-23:00 Dinner
- 23:00-00:00 SaaS development (session 2)
- 00:00-00:30 Wind down (podcast, no phone screen)
- 00:30 Sleep (7 hours)

Study plan: CAR 66 Modules 3, 4, 5, 6 over 3 months.
- Month 1: Module 3 (Electrical Fundamentals - retake)
- Month 2: Module 4 (Electronic Fundamentals)
- Month 3: Module 5 (Digital Techniques) + Module 6 (Materials and Hardware)

Body goal: Recomp from skinny fat to 12-13% BF by June. 2250 cal, 165g+ protein daily.

Diet: Whey + banana breakfast, chicken + rice + veg lunch, post-gym whey, chicken + eggs + rice + veg dinner.

Rules for your responses:
- Keep responses SHORT. 2-3 sentences max unless they ask for detail.
- No emojis. No fluff. No cheerleading.
- When they log an adaptation, acknowledge briefly and push forward.
- When they seem off track, call it out directly. No sugarcoating.
- Reference their identity statements when relevant.
- Always tie advice back to the wheel turning.
- If they're making excuses, cut through it immediately.
- Use "the wheel turns" or "what's the adaptation?" as anchors.`;

export const generateResponse = internalAction({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const recentMessages = await ctx.runQuery(internal.ai.loadMessages, {
      userId: args.userId,
    });
    const identities = await ctx.runQuery(internal.ai.loadIdentities, {
      userId: args.userId,
    });
    const adaptations = await ctx.runQuery(
      internal.ai.loadRecentAdaptations,
      { userId: args.userId }
    );

    let contextAddition = "";
    if (identities.length > 0) {
      contextAddition +=
        "\n\nUser's current identity statements:\n" +
        identities.map((i) => `- "${i.statement}"`).join("\n");
    }
    if (adaptations.length > 0) {
      contextAddition +=
        "\n\nRecent adaptations logged:\n" +
        adaptations
          .map((a) => `- Hit: ${a.hit} → Adaptation: ${a.adaptation}`)
          .join("\n");
    }

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT + contextAddition },
      ...recentMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const response = await fetch(
      "https://api.cerebras.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-oss-120b",
          messages,
          temperature: 0.7,
          max_completion_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cerebras API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    await ctx.runMutation(internal.ai.storeMessage, {
      userId: args.userId,
      role: "assistant",
      content: aiResponse,
    });

    return null;
  },
});
