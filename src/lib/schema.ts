import { z } from "zod";

const brief = z.object({
  topic: z.string().trim().min(3, "Topic must be at least 3 characters").max(200),
  audience: z.string().trim().max(120).default("general readers"),
  tone: z.enum(["friendly", "professional", "witty", "authoritative"]).default("friendly"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  keywords: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
});

export const generateRequest = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("outline"), brief }),
  z.object({ mode: z.literal("post"), brief, outline: z.string().max(6000).optional() }),
  z.object({
    mode: z.literal("rewrite"),
    brief,
    content: z.string().min(20, "Nothing to rewrite yet").max(30000),
    action: z.enum(["shorter", "expand", "simplify", "punchier"]),
  }),
]);

export type GenerateRequest = z.infer<typeof generateRequest>;
