import type { GenerateRequest } from "../schema";
import { createGemini } from "./gemini";
import { createGroq } from "./groq";
import { createMock } from "./mock";
import type { LLMProvider, ProviderName } from "./provider";

type Env = Record<string, string | undefined>;

/** Which provider will be used for the given env. Pure, so it is unit-testable. */
export function resolveProviderName(env: Env = process.env): ProviderName {
  const wanted = env.LLM_PROVIDER?.toLowerCase();
  if (wanted === "mock") return "mock";
  if (wanted === "gemini" && env.GEMINI_API_KEY) return "gemini";
  if (wanted === "groq" && env.GROQ_API_KEY) return "groq";
  if (!wanted || wanted === "") {
    if (env.GEMINI_API_KEY) return "gemini";
    if (env.GROQ_API_KEY) return "groq";
  }
  return "mock"; // missing key or unknown value -> safe fallback
}

export function getProvider(req: GenerateRequest, env: Env = process.env): LLMProvider {
  switch (resolveProviderName(env)) {
    case "gemini":
      return createGemini(env.GEMINI_API_KEY!, env.GEMINI_MODEL || undefined);
    case "groq":
      return createGroq(env.GROQ_API_KEY!, env.GROQ_MODEL || undefined);
    default:
      return createMock(req);
  }
}

export { createMock } from "./mock";
export { ProviderError } from "./provider";
export type { LLMProvider, ProviderName } from "./provider";
