export type Tone = "friendly" | "professional" | "witty" | "authoritative";
export type Length = "short" | "medium" | "long";
export type Mode = "outline" | "post" | "rewrite";

export interface PostBrief {
  topic: string;
  audience: string;
  tone: Tone;
  length: Length;
  keywords: string[];
}

export interface Draft {
  id: string;
  title: string;
  brief: PostBrief;
  content: string; // markdown
  createdAt: number;
  updatedAt: number;
}

export const TONES: { value: Tone; label: string }[] = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "witty", label: "Witty" },
  { value: "authoritative", label: "Authoritative" },
];

export const LENGTHS: { value: Length; label: string; words: number }[] = [
  { value: "short", label: "Short · ~400 words", words: 400 },
  { value: "medium", label: "Medium · ~800 words", words: 800 },
  { value: "long", label: "Long · ~1400 words", words: 1400 },
];

export const REWRITE_ACTIONS = [
  { value: "shorter", label: "Make shorter" },
  { value: "expand", label: "Expand" },
  { value: "simplify", label: "Simplify language" },
  { value: "punchier", label: "Punchier intro" },
] as const;
export type RewriteAction = (typeof REWRITE_ACTIONS)[number]["value"];
