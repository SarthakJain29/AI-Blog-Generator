import type { GenerateRequest } from "../schema";
import type { LLMProvider } from "./provider";
import type { PromptPair } from "../prompts";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Deterministic offline "LLM". Builds a plausible post from the brief so the whole app works without keys. */
export function mockMarkdown(req: GenerateRequest): string {
  const { topic, audience, tone, keywords } = req.brief;
  const title = cap(topic.replace(/^write (a )?(blog )?(post )?(about:?\s*)?/i, "").trim() || topic);
  const kw = keywords.length ? keywords : [title.toLowerCase()];
  const k = (i: number) => kw[i % kw.length];

  if (req.mode === "outline") {
    return [
      `# ${title}: A Practical Guide`,
      "",
      "## Why it matters now",
      `- What changed for ${audience}`,
      `- The cost of ignoring ${k(0)}`,
      "## The core ideas",
      "- Three principles worth remembering",
      `- Where ${k(1)} fits in`,
      "## A step-by-step approach",
      "- Start small and measure",
      "- Common mistakes to avoid",
      "## Real-world examples",
      "- A before and after",
      "- What to copy, what to skip",
      "## Wrapping up",
      "- Key takeaways and a next step",
    ].join("\n");
  }

  if (req.mode === "rewrite") {
    const body = req.content;
    switch (req.action) {
      case "shorter": {
        const paras = body.split(/\n{2,}/);
        return paras.filter((_, i) => i % 3 !== 2 || /^#/.test(paras[i])).join("\n\n");
      }
      case "expand":
        return `${body}\n\n## Going deeper\n\nIf you want to go further with ${k(0)}, treat every idea above as an experiment: write down what you expect, run it for two weeks, and compare the result. Over time this habit compounds far more than any single tactic.`;
      case "simplify":
        return body.replace(/\b(utilize|leverage)\b/gi, "use").replace(/\b(furthermore|moreover)\b/gi, "also");
      case "punchier": {
        const paras = body.split(/\n{2,}/);
        const i = paras.findIndex((p) => !p.startsWith("#") && p.trim());
        if (i >= 0) paras[i] = `Here's the truth about ${k(0)}: most people get it wrong. You won't.`;
        return paras.join("\n\n");
      }
    }
  }

  const voice =
    { friendly: "Let's be honest:", professional: "In practice,", witty: "Plot twist:", authoritative: "The evidence is clear:" }[tone];
  const section = (h: string, body: string) => `## ${h}\n\n${body}\n`;
  return [
    `# ${title}: A Practical Guide`,
    "",
    `${voice} ${k(0)} is no longer optional for ${audience}. This guide cuts through the noise and gives you a clear way to start.`,
    "",
    section("Why it matters now", `The landscape around ${k(0)} has shifted. Teams that adapt early spend less time firefighting and more time creating value. For ${audience}, the gap between "aware" and "acting" is where most of the opportunity lives.`),
    section("The core ideas", `Three principles show up again and again:\n\n- **Clarity first.** Define what success looks like before you begin.\n- **Small bets.** Ship the smallest useful version of your ${k(1)} work.\n- **Feedback loops.** Measure, learn, and adjust weekly.`),
    section("A step-by-step approach", `1. Write down your goal in one sentence.\n2. List the three biggest obstacles.\n3. Pick one obstacle and run a one-week experiment.\n4. Review the results and decide: keep, change, or drop.\n\nRepeat this loop and ${k(2)} becomes a habit instead of a project.`),
    section("Common mistakes", `Most people over-plan and under-test. Others chase every new tactic instead of mastering one. Avoid both traps by keeping a short list of priorities and revisiting it often.`),
    section("Conclusion", `${cap(k(0))} rewards consistency over perfection. Pick one idea from this guide and try it this week.\n\n> *This draft was generated in ScribeAI mock mode. Add a Gemini or Groq key to get real model output.*`),
  ].join("\n");
}

/** Splits into word-ish chunks to imitate token streaming. */
export function chunk(text: string): string[] {
  return text.match(/\S+\s*|\s+/g) ?? [];
}

export function createMock(req: GenerateRequest, delayMs = 12): LLMProvider {
  return {
    name: "mock",
    async *stream(_prompt: PromptPair, signal) {
      for (const piece of chunk(mockMarkdown(req))) {
        if (signal?.aborted) return;
        if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
        yield piece;
      }
    },
  };
}
