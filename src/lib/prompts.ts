import { LENGTHS } from "./types";
import type { GenerateRequest } from "./schema";

export interface PromptPair {
  system: string;
  user: string;
}

const SYSTEM =
  "You are ScribeAI, an expert blog editor. Write original, well-structured Markdown. " +
  "Use a single H1 title, H2/H3 sections, short paragraphs, and concrete examples. " +
  "Never invent statistics or quotes. Output Markdown only, with no preamble.";

function describe(b: GenerateRequest["brief"]) {
  const words = LENGTHS.find((l) => l.value === b.length)?.words ?? 800;
  const kw = b.keywords.length ? `Weave in these keywords naturally: ${b.keywords.join(", ")}.` : "";
  return `Topic: ${b.topic}\nAudience: ${b.audience}\nTone: ${b.tone}\nTarget length: about ${words} words.\n${kw}`;
}

export function buildPrompt(req: GenerateRequest): PromptPair {
  switch (req.mode) {
    case "outline":
      return {
        system: SYSTEM,
        user: `${describe(req.brief)}\n\nProduce only an outline: an H1 title, then 4-7 H2 sections each with 2-3 bullet points.`,
      };
    case "post":
      return {
        system: SYSTEM,
        user:
          `${describe(req.brief)}\n\n` +
          (req.outline ? `Follow this outline:\n${req.outline}\n\n` : "") +
          "Write the full blog post, ending with a short conclusion and a call to action.",
      };
    case "rewrite": {
      const instr = {
        shorter: "Cut roughly 30% while keeping every key point.",
        expand: "Expand with more depth, examples and transitions (~40% longer).",
        simplify: "Rewrite in plainer language a 12-year-old could follow; keep the structure.",
        punchier: "Rewrite only the introduction so it hooks the reader in two sentences; keep the rest unchanged.",
      }[req.action];
      return {
        system: SYSTEM,
        user: `${describe(req.brief)}\n\nRewrite the post below. ${instr} Return the complete post.\n\n---\n${req.content}`,
      };
    }
  }
}
