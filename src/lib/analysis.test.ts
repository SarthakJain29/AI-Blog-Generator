import { describe, expect, it } from "vitest";
import { analyze, countWords, fleschReadingEase } from "./analysis";

describe("analysis", () => {
  it("counts words ignoring markdown markers", () => {
    expect(countWords("# Hello world\n\n- one two\n> three")).toBe(5);
  });
  it("scores simple text easier than dense text", () => {
    const easy = fleschReadingEase("The cat sat. The dog ran. We had fun.");
    const hard = fleschReadingEase("Notwithstanding considerable organisational complexities, institutional stakeholders operationalised interdisciplinary methodologies.");
    expect(easy).toBeGreaterThan(hard);
  });
  it("returns zero score for empty content", () => {
    expect(analyze("").score).toBe(0);
  });
  it("computes keyword density and title", () => {
    const md = "# A reasonably descriptive blog title here\n\n" + "remote work is great. ".repeat(30);
    const a = analyze(md, ["remote work"]);
    expect(a.title).toContain("descriptive");
    expect(a.keywordStats[0].count).toBe(30);
    expect(a.keywordStats[0].density).toBeGreaterThan(3);
    expect(a.checks.find((c) => c.id === "kw")?.ok).toBe(false);
  });
});
