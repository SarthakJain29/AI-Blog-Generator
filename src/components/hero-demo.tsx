"use client";

import { useEffect, useState } from "react";

const TEXT =
  "# Why async beats meetings\n\nMost teams don't have a communication problem. They have a calendar problem. Here's how three small habits give your week back...";

/** Looping typewriter shown in the hero to demonstrate streaming. */
export function HeroDemo() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v > TEXT.length + 40 ? 0 : v + 1)), 45);
    return () => clearInterval(t);
  }, []);
  const shown = TEXT.slice(0, n);
  const [h, ...rest] = shown.split("\n\n");
  return (
    <div className="glass mx-auto max-w-3xl rounded-3xl p-1.5 text-left shadow-2xl shadow-violet/20">
      <div className="flex items-center gap-1.5 px-4 py-3">
        <i className="size-2.5 rounded-full bg-pink/80" /><i className="size-2.5 rounded-full bg-amber/80" /><i className="size-2.5 rounded-full bg-cyan/80" />
        <span className="ml-3 text-xs text-mute">studio · streaming draft</span>
      </div>
      <div className="grid min-h-44 gap-6 rounded-2xl bg-black/30 p-6 sm:grid-cols-[1fr_auto]">
        <div className={n <= TEXT.length ? "caret" : ""} aria-live="off">
          <p className="text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>{h.replace(/^# /, "")}</p>
          <p className="mt-3 text-sm leading-relaxed text-mute">{rest.join("\n\n")}</p>
        </div>
        <div className="hidden w-36 sm:block">
          <div className="text-xs text-mute">SEO score</div>
          <div className="text-gradient text-5xl" style={{ fontFamily: "var(--font-display)" }}>{Math.min(92, Math.round(n / 1.6))}</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full btn-glow" style={{ width: `${Math.min(92, n / 1.6)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
