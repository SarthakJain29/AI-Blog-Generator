import { describe, expect, it } from "vitest";
import { resolveProviderName } from "./index";
import { sseData } from "./provider";
import { chunk, createMock, mockMarkdown } from "./mock";
import { generateRequest } from "../schema";
import { buildPrompt } from "../prompts";

const brief = { topic: "Remote work", audience: "managers", tone: "witty", length: "short", keywords: ["async"] } as const;

describe("provider selection", () => {
  it("defaults to mock with no keys", () => expect(resolveProviderName({})).toBe("mock"));
  it("auto-detects gemini then groq", () => {
    expect(resolveProviderName({ GEMINI_API_KEY: "k", GROQ_API_KEY: "k" })).toBe("gemini");
    expect(resolveProviderName({ GROQ_API_KEY: "k" })).toBe("groq");
  });
  it("falls back to mock when requested provider has no key", () => {
    expect(resolveProviderName({ LLM_PROVIDER: "groq", GEMINI_API_KEY: "k" })).toBe("mock");
  });
  it("can force mock even with keys", () => {
    expect(resolveProviderName({ LLM_PROVIDER: "mock", GEMINI_API_KEY: "k" })).toBe("mock");
  });
});

describe("mock provider", () => {
  const req = generateRequest.parse({ mode: "post", brief });
  it("streams text that reassembles to the full markdown", async () => {
    let out = "";
    for await (const c of createMock(req, 0).stream(buildPrompt(req))) out += c;
    expect(out).toBe(mockMarkdown(req));
    expect(out.startsWith("# ")).toBe(true);
  });
  it("chunks losslessly", () => expect(chunk("a b  c\n\nd").join("")).toBe("a b  c\n\nd"));
  it("supports every rewrite action", () => {
    for (const action of ["shorter", "expand", "simplify", "punchier"] as const) {
      const r = generateRequest.parse({ mode: "rewrite", brief, action, content: "# T\n\nFirst para here.\n\nSecond para.\n\nThird para furthermore." });
      expect(mockMarkdown(r).length).toBeGreaterThan(0);
    }
  });
});

describe("request schema", () => {
  it("rejects short topics", () => {
    expect(generateRequest.safeParse({ mode: "post", brief: { ...brief, topic: "ab" } }).success).toBe(false);
  });
  it("applies defaults", () => {
    const r = generateRequest.parse({ mode: "outline", brief: { topic: "Cooking basics" } });
    expect(r.brief.tone).toBe("friendly");
  });
});

describe("sseData", () => {
  it("parses events split across chunks", async () => {
    const enc = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(enc.encode('data: {"a":1}\n\nda'));
        c.enqueue(enc.encode('ta: two\n\n'));
        c.close();
      },
    });
    const out: string[] = [];
    for await (const d of sseData(body)) out.push(d);
    expect(out).toEqual(['{"a":1}', "two"]);
  });
});
