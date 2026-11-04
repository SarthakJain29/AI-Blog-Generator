"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { localDraftStore, newDraft, titleFromContent } from "@/lib/drafts";
import type { Draft } from "@/lib/types";

/** Draft list with debounced autosave to the DraftStore. `ready` is false until hydrated from storage. */
export function useDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const stored = localDraftStore.load().sort((a, b) => b.updatedAt - a.updatedAt);
    if (stored.length) {
      setDrafts(stored);
      setActiveId(stored[0].id);
    } else {
      const d = newDraft();
      setDrafts([d]);
      setActiveId(d.id);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => localDraftStore.save(drafts), 400);
    return () => clearTimeout(timer.current);
  }, [drafts, ready]);

  const active = drafts.find((d) => d.id === activeId) ?? null;

  const update = useCallback((id: string, patch: Partial<Draft>) => {
    setDrafts((ds) =>
      ds.map((d) => {
        if (d.id !== id) return d;
        const next = { ...d, ...patch, updatedAt: Date.now() };
        if (patch.content !== undefined) next.title = titleFromContent(next.content, next.brief.topic || "Untitled draft");
        return next;
      }),
    );
  }, []);

  const create = useCallback(() => {
    const d = newDraft();
    setDrafts((ds) => [d, ...ds]);
    setActiveId(d.id);
  }, []);

  const remove = useCallback((id: string) => {
    setDrafts((ds) => {
      const rest = ds.filter((d) => d.id !== id);
      if (!rest.length) {
        const d = newDraft();
        setActiveId(d.id);
        return [d];
      }
      setActiveId((cur) => (cur === id ? rest[0].id : cur));
      return rest;
    });
  }, []);

  return { drafts, active, activeId, setActiveId, ready, update, create, remove };
}
