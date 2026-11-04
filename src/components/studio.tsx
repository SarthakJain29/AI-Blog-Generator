"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AlertCircle, Check, ClipboardCopy, Download, FileText, ListTree, Loader2, Menu, Plus, Sparkles, Square, Trash2, Wand2, X,
} from "lucide-react";
import { Logo } from "./logo";
import { useDrafts } from "./use-drafts";
import { analyze } from "@/lib/analysis";
import { ApiError, streamGenerate } from "@/lib/stream";
import { LENGTHS, REWRITE_ACTIONS, TONES, type Draft, type PostBrief, type RewriteAction } from "@/lib/types";

type Phase = "idle" | "outline" | "post" | "rewrite";
type View = "write" | "preview";

const IDEAS = ["Why async beats meetings", "A beginner's guide to composting", "How to price your freelance work"];

export function Studio() {
  const { drafts, active, setActiveId, ready, update, create, remove } = useDrafts();
  const [phase, setPhase] = useState<Phase>("idle");
  const [outline, setOutline] = useState("");
  const [view, setView] = useState<View>("write");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [kwInput, setKwInput] = useState("");
  const abort = useRef<AbortController | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/status").then((r) => r.json()).then((d) => setProvider(d.provider)).catch(() => setProvider(null));
  }, []);
  useEffect(() => setOutline(""), [active?.id]);

  const analysis = useMemo(() => analyze(active?.content ?? "", active?.brief.keywords), [active?.content, active?.brief.keywords]);
  const busy = phase !== "idle";

  if (!ready || !active) return <StudioSkeleton />;

  const setBrief = (patch: Partial<PostBrief>) => update(active.id, { brief: { ...active.brief, ...patch } });

  async function run(kind: Phase, extra: Record<string, unknown> = {}) {
    if (!active) return;
    setError(null); setNotice(null);
    if (active.brief.topic.trim().length < 3) { setError("Give your post a topic first (at least 3 characters)."); return; }
    const ctrl = new AbortController();
    abort.current = ctrl;
    setPhase(kind);
    const before = active.content;
    try {
      const body = { mode: kind === "rewrite" ? "rewrite" : kind, brief: active.brief, ...(kind === "post" && outline ? { outline } : {}), ...(kind === "rewrite" ? { content: before, ...extra } : {}) };
      const res = await streamGenerate(body as never, (acc) => {
        if (kind === "outline") setOutline(acc);
        else update(active.id, { content: acc });
      }, ctrl.signal);
      if (res.fallback) setNotice("The AI provider failed, so this draft came from mock mode.");
      setProvider(res.fallback ? "mock" : res.provider);
      if (kind !== "outline") setView("write");
    } catch (e) {
      if (kind !== "outline" && kind !== "post") update(active.id, { content: before });
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setPhase("idle"); abort.current = null;
    }
  }

  const copy = async (what: "md" | "html") => {
    const text = what === "md" ? active.content : previewRef.current?.innerHTML ?? "";
    try { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(null), 1600); }
    catch { setError("Clipboard is blocked by your browser. Use Download instead."); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([active.content], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url; a.download = `${(analysis.title || "post").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.md`;
    a.click(); URL.revokeObjectURL(url);
  };
  const addKeyword = () => {
    const k = kwInput.trim();
    if (k && !active.brief.keywords.includes(k) && active.brief.keywords.length < 8) setBrief({ keywords: [...active.brief.keywords, k] });
    setKwInput("");
  };

  const hasContent = active.content.trim().length > 0;

  return (
    <div className="flex h-dvh overflow-hidden bg-ink">
      {/* Drafts sidebar */}
      <aside className={`${drawer ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-panel transition-transform md:static md:translate-x-0`}>
        <div className="flex items-center justify-between p-4"><Logo /><button className="md:hidden" onClick={() => setDrawer(false)} aria-label="Close drafts"><X className="size-5" /></button></div>
        <div className="px-4">
          <button onClick={() => { create(); setDrawer(false); }} className="btn-glow flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm"><Plus className="size-4" /> New post</button>
        </div>
        <div className="mt-5 px-5 text-[11px] uppercase tracking-widest text-mute">Drafts · {drafts.length}</div>
        <ul className="scroll-thin mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {drafts.map((d) => (
            <li key={d.id} className="group relative">
              <button onClick={() => { setActiveId(d.id); setDrawer(false); }} disabled={busy}
                className={`w-full truncate rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${d.id === active.id ? "bg-white/10 text-white" : "text-mute hover:bg-white/5 hover:text-white"}`}>
                <FileText className="mr-2 inline size-3.5 opacity-60" />{d.title}
              </button>
              <button aria-label={`Delete ${d.title}`} disabled={busy}
                onClick={() => { if (!d.content || confirm(`Delete "${d.title}"?`)) remove(d.id); }}
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-lg p-1.5 text-mute hover:bg-white/10 hover:text-pink group-hover:block focus:block"><Trash2 className="size-3.5" /></button>
            </li>
          ))}
        </ul>
        <div className="border-t border-line p-4 text-xs text-mute">
          <ProviderBadge provider={provider} />
          <p className="mt-2">Drafts are saved in this browser.</p>
        </div>
      </aside>
      {drawer && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setDrawer(false)} />}

      <main className="grid min-w-0 flex-1 grid-rows-[auto_1fr] lg:grid-cols-[22rem_1fr_18rem] lg:grid-rows-1">
        {/* Brief column */}
        <section className="scroll-thin overflow-y-auto border-b border-line p-5 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center gap-3 md:hidden">
            <button onClick={() => setDrawer(true)} aria-label="Open drafts" className="btn-ghost rounded-xl p-2"><Menu className="size-5" /></button>
            <Link href="/" className="text-xs text-mute">← Home</Link>
          </div>
          <h2 className="mb-4 text-2xl" style={{ fontFamily: "var(--font-display)" }}>The brief</h2>
          <label className="mb-1 block text-xs text-mute" htmlFor="topic">Topic</label>
          <textarea id="topic" rows={2} className="field resize-none" placeholder="What should the post be about?" value={active.brief.topic} onChange={(e) => setBrief({ topic: e.target.value })} disabled={busy} maxLength={200} />
          {!active.brief.topic && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {IDEAS.map((i) => <button key={i} onClick={() => setBrief({ topic: i })} className="btn-ghost rounded-full px-2.5 py-1 text-xs">{i}</button>)}
            </div>
          )}
          <label className="mb-1 mt-4 block text-xs text-mute" htmlFor="aud">Audience</label>
          <input id="aud" className="field" value={active.brief.audience} onChange={(e) => setBrief({ audience: e.target.value })} disabled={busy} maxLength={120} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-mute" htmlFor="tone">Tone</label>
              <select id="tone" className="field" value={active.brief.tone} onChange={(e) => setBrief({ tone: e.target.value as PostBrief["tone"] })} disabled={busy}>
                {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-mute" htmlFor="len">Length</label>
              <select id="len" className="field" value={active.brief.length} onChange={(e) => setBrief({ length: e.target.value as PostBrief["length"] })} disabled={busy}>
                {LENGTHS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <label className="mb-1 mt-4 block text-xs text-mute" htmlFor="kw">Keywords (Enter to add)</label>
          <input id="kw" className="field" value={kwInput} onChange={(e) => setKwInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }} disabled={busy} maxLength={40} placeholder="e.g. remote work" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {active.brief.keywords.map((k) => (
              <button key={k} onClick={() => setBrief({ keywords: active.brief.keywords.filter((x) => x !== k) })} className="rounded-full bg-violet/25 px-2.5 py-1 text-xs hover:bg-pink/30" aria-label={`Remove keyword ${k}`}>{k} ×</button>
            ))}
          </div>

          <div className="mt-6 grid gap-2">
            <button className="btn-ghost flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm" disabled={busy} onClick={() => run("outline")}>
              {phase === "outline" ? <Loader2 className="size-4 animate-spin" /> : <ListTree className="size-4" />} Outline first
            </button>
            <button className="btn-glow flex items-center justify-center gap-2 rounded-xl py-3 text-sm" disabled={busy} onClick={() => run("post")}>
              {phase === "post" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} {outline ? "Write from outline" : "Generate post"}
            </button>
            {busy && <button className="btn-ghost flex items-center justify-center gap-2 rounded-xl py-2 text-sm" onClick={() => abort.current?.abort()}><Square className="size-3.5" /> Stop</button>}
          </div>

          {outline && (
            <div className="glass mt-5 rounded-2xl p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-mute"><span>Outline (editable)</span><button onClick={() => setOutline("")} className="hover:text-white">Discard</button></div>
              <textarea className="field scroll-thin h-48 font-mono text-xs" value={outline} onChange={(e) => setOutline(e.target.value)} disabled={phase === "outline"} aria-label="Outline" />
            </div>
          )}
        </section>

        {/* Editor column */}
        <section className="flex min-h-0 min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
            <div className="glass flex rounded-xl p-0.5 text-sm" role="tablist">
              {(["write", "preview"] as View[]).map((v) => (
                <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`rounded-lg px-3.5 py-1.5 capitalize ${view === v ? "bg-white/12 text-white" : "text-mute"}`}>{v}</button>
              ))}
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              <select aria-label="Rewrite" className="field !w-auto !py-1.5 text-xs" value="" disabled={busy || !hasContent} onChange={(e) => e.target.value && run("rewrite", { action: e.target.value as RewriteAction })}>
                <option value="">✦ Rewrite…</option>
                {REWRITE_ACTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
              <button className="btn-ghost rounded-lg p-2" disabled={!hasContent} onClick={() => copy("md")} title="Copy Markdown" aria-label="Copy Markdown">{copied === "md" ? <Check className="size-4 text-cyan" /> : <ClipboardCopy className="size-4" />}</button>
              <button className="btn-ghost rounded-lg px-2.5 py-2 text-xs" disabled={!hasContent} onClick={() => { setView("preview"); setTimeout(() => copy("html"), 50); }}>{copied === "html" ? "Copied!" : "Copy HTML"}</button>
              <button className="btn-ghost rounded-lg p-2" disabled={!hasContent} onClick={download} title="Download .md" aria-label="Download markdown"><Download className="size-4" /></button>
            </div>
          </div>

          {(error || notice) && (
            <div role="alert" className={`mx-4 mt-3 flex items-start gap-2 rounded-xl border px-3 py-2 text-sm ${error ? "border-pink/40 bg-pink/10 text-pink" : "border-amber/40 bg-amber/10 text-amber"}`}>
              <AlertCircle className="mt-0.5 size-4 shrink-0" /><span className="flex-1">{error ?? notice}</span>
              <button onClick={() => { setError(null); setNotice(null); }} aria-label="Dismiss"><X className="size-4" /></button>
            </div>
          )}

          <div className="scroll-thin min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">
            {!hasContent && !busy ? (
              <div className="mx-auto grid h-full max-w-md place-items-center text-center">
                <div>
                  <div className="btn-glow mx-auto mb-5 grid size-14 place-items-center rounded-2xl"><Wand2 className="size-6" /></div>
                  <h3 className="text-3xl" style={{ fontFamily: "var(--font-display)" }}>A blank page, for now.</h3>
                  <p className="mt-2 text-sm text-mute">Fill in the brief, then generate a post, or start typing here yourself.</p>
                  <button className="btn-ghost mt-5 rounded-full px-4 py-2 text-sm" onClick={() => update(active.id, { content: "# " })}>Write manually</button>
                </div>
              </div>
            ) : phase === "post" && !hasContent ? (
              <div className="mx-auto max-w-2xl space-y-3" aria-busy><div className="shimmer h-9 w-3/4 rounded-lg" />{[0, 1, 2, 3].map((i) => <div key={i} className="shimmer h-4 rounded" style={{ width: `${95 - i * 9}%` }} />)}</div>
            ) : view === "write" ? (
              <textarea aria-label="Post content (Markdown)" value={active.content} onChange={(e) => update(active.id, { content: e.target.value })} readOnly={busy}
                className="mx-auto block h-full min-h-[60vh] w-full max-w-2xl resize-none bg-transparent font-mono text-sm leading-7 text-white/90 outline-none" spellCheck />
            ) : (
              <article ref={previewRef} className={`prose-ink mx-auto max-w-2xl ${phase === "post" || phase === "rewrite" ? "caret" : ""}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{active.content}</ReactMarkdown>
              </article>
            )}
          </div>
        </section>

        {/* Insights column */}
        <aside className="scroll-thin hidden overflow-y-auto border-l border-line p-5 lg:block">
          <Insights a={analysis} />
        </aside>
      </main>

      {/* Mobile insights */}
      <details className="fixed bottom-3 right-3 z-20 lg:hidden">
        <summary className="btn-glow grid size-12 cursor-pointer list-none place-items-center rounded-full text-sm" aria-label="SEO insights">{analysis.score}</summary>
        <div className="glass absolute bottom-14 right-0 w-72 rounded-2xl bg-panel p-4"><Insights a={analysis} /></div>
      </details>
    </div>
  );
}

function Insights({ a }: { a: ReturnType<typeof analyze> }) {
  const ring = a.score >= 80 ? "text-cyan" : a.score >= 50 ? "text-amber" : "text-pink";
  return (
    <div>
      <h2 className="mb-3 text-2xl" style={{ fontFamily: "var(--font-display)" }}>Insights</h2>
      <div className="glass rounded-2xl p-4">
        <div className="text-xs text-mute">SEO score</div>
        <div className={`text-5xl ${ring}`} style={{ fontFamily: "var(--font-display)" }}>{a.score}<span className="text-lg text-mute">/100</span></div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        {[["Words", a.words], ["Read time", `${a.readingMinutes} min`], ["Headings", a.headings], ["Readability", a.words ? `${a.readability} · ${a.readabilityLabel}` : "—"]].map(([k, v]) => (
          <div key={k as string} className="rounded-xl border border-line p-2.5"><dt className="text-[11px] text-mute">{k}</dt><dd className="font-medium">{v}</dd></div>
        ))}
      </dl>
      <ul className="mt-4 space-y-2">
        {a.checks.map((c) => (
          <li key={c.id} className="flex gap-2 text-sm" title={c.hint}>
            <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full text-[10px] ${a.words === 0 ? "bg-white/10 text-mute" : c.ok ? "bg-cyan text-black" : "bg-pink/80 text-black"}`}>{a.words === 0 ? "" : c.ok ? "✓" : "!"}</span>
            <span><span className={c.ok && a.words ? "" : "text-mute"}>{c.label}</span>{a.words > 0 && !c.ok && <span className="block text-xs text-mute">{c.hint}</span>}</span>
          </li>
        ))}
      </ul>
      {a.keywordStats.length > 0 && (
        <div className="mt-4"><div className="mb-1 text-xs text-mute">Keyword density</div>
          {a.keywordStats.map((k) => <div key={k.keyword} className="flex justify-between text-sm"><span>{k.keyword}</span><span className="text-mute">{k.count}× · {k.density}%</span></div>)}
        </div>
      )}
    </div>
  );
}

function ProviderBadge({ provider }: { provider: string | null }) {
  const live = provider === "gemini" || provider === "groq";
  return (
    <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1" title={live ? "Using a live model" : "No API key: using built-in mock output"}>
      <i className={`size-2 rounded-full ${live ? "bg-cyan" : provider ? "bg-amber" : "bg-white/30"}`} />
      {provider ? (live ? `Live · ${provider}` : "Mock mode") : "Checking…"}
    </span>
  );
}

function StudioSkeleton() {
  return (
    <div className="grid h-dvh place-items-center bg-ink" role="status" aria-label="Loading studio">
      <div className="w-64 space-y-3"><div className="shimmer h-6 rounded" /><div className="shimmer h-4 w-3/4 rounded" /><div className="shimmer h-4 w-1/2 rounded" /></div>
    </div>
  );
}

export type { Draft };
