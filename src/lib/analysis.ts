export interface Analysis {
  words: number;
  readingMinutes: number;
  readability: number; // Flesch reading ease, 0-100
  readabilityLabel: string;
  headings: number;
  title: string;
  titleLength: number;
  keywordStats: { keyword: string; count: number; density: number }[];
  checks: { id: string; label: string; ok: boolean; hint: string }[];
  score: number; // 0-100
}

export function countWords(text: string): number {
  return (text.replace(/[#>*_`\-\d.]+(?=\s)/g, " ").match(/[A-Za-z0-9'’]+/g) ?? []).length;
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const m = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}

export function fleschReadingEase(text: string): number {
  const plain = text.replace(/[#>*_`]/g, "");
  const sentences = Math.max(1, (plain.match(/[.!?]+(\s|$)/g) ?? []).length);
  const words = plain.match(/[A-Za-z']+/g) ?? [];
  if (!words.length) return 0;
  const syll = words.reduce((n, w) => n + countSyllables(w), 0);
  const score = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syll / words.length);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function label(score: number): string {
  if (score >= 70) return "Easy";
  if (score >= 50) return "Fairly easy";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

export function analyze(markdown: string, keywords: string[] = []): Analysis {
  const words = countWords(markdown);
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1].trim() ?? "";
  const headings = (markdown.match(/^#{2,3}\s+/gm) ?? []).length;
  const lower = markdown.toLowerCase();
  const keywordStats = keywords
    .filter(Boolean)
    .map((keyword) => {
      const re = new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      const count = (lower.match(re) ?? []).length;
      return { keyword, count, density: words ? +((count / words) * 100).toFixed(2) : 0 };
    });
  const readability = fleschReadingEase(markdown);
  const paragraphs = markdown.split(/\n{2,}/).filter((p) => p.trim() && !p.startsWith("#"));
  const longestPara = Math.max(0, ...paragraphs.map((p) => countWords(p)));

  const checks = [
    { id: "title", label: "Title 30-65 characters", ok: title.length >= 30 && title.length <= 65, hint: `Currently ${title.length}. Search engines truncate long titles.` },
    { id: "length", label: "At least 300 words", ok: words >= 300, hint: `Currently ${words} words.` },
    { id: "headings", label: "3+ subheadings", ok: headings >= 3, hint: "Subheadings make posts scannable." },
    { id: "paras", label: "Paragraphs under 120 words", ok: longestPara <= 120, hint: "Break up walls of text." },
    { id: "read", label: "Readable (Flesch 50+)", ok: readability >= 50, hint: `Score ${readability}. Use shorter sentences.` },
    {
      id: "kw",
      label: "Keywords used (0.3-3% density)",
      ok: keywordStats.length === 0 ? true : keywordStats.every((k) => k.density >= 0.3 && k.density <= 3),
      hint: keywordStats.length ? "Aim for natural use of each keyword." : "No keywords set.",
    },
  ];
  const score = words === 0 ? 0 : Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  return {
    words,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    readability,
    readabilityLabel: label(readability),
    headings,
    title,
    titleLength: title.length,
    keywordStats,
    checks,
    score,
  };
}
