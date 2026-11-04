import type { Draft, PostBrief } from "./types";

const KEY = "scribeai.drafts.v1";

export const DEFAULT_BRIEF: PostBrief = {
  topic: "",
  audience: "small business owners",
  tone: "friendly",
  length: "medium",
  keywords: [],
};

export function newDraft(now = Date.now()): Draft {
  return {
    id: `d_${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    title: "Untitled draft",
    brief: { ...DEFAULT_BRIEF },
    content: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function titleFromContent(content: string, fallback = "Untitled draft"): string {
  return content.match(/^#\s+(.+)$/m)?.[1].trim() || fallback;
}

/** Storage interface so localStorage can later be swapped for a real database. */
export interface DraftStore {
  load(): Draft[];
  save(drafts: Draft[]): void;
}

export const localDraftStore: DraftStore = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as Draft[]) : [];
    } catch {
      return [];
    }
  },
  save(drafts) {
    try {
      localStorage.setItem(KEY, JSON.stringify(drafts));
    } catch {
      /* quota or private mode: drafts stay in memory only */
    }
  },
};
