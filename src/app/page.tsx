import Link from "next/link";
import { ArrowRight, BarChart3, FileDown, Gauge, Layers, PenLine, Wand2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { HeroDemo } from "@/components/hero-demo";

const features = [
  { icon: Wand2, title: "Streaming drafts", body: "Watch the post write itself token by token. Stop any time; keep what you like.", span: "md:col-span-2" },
  { icon: Layers, title: "Outline first", body: "Approve the structure before spending a single token on prose.", span: "" },
  { icon: BarChart3, title: "Live SEO score", body: "Title length, keyword density, Flesch readability and more, updated as you type.", span: "" },
  { icon: PenLine, title: "One-click rewrites", body: "Shorter, deeper, simpler or a punchier intro without leaving the editor.", span: "md:col-span-2" },
  { icon: FileDown, title: "Export anywhere", body: "Copy Markdown or HTML, or download a .md file ready for your CMS.", span: "" },
  { icon: Gauge, title: "Runs without keys", body: "Gemini and Groq free tiers supported. No key? A built-in mock mode keeps everything working.", span: "md:col-span-2" },
];

const steps = [
  ["01", "Brief it", "Topic, audience, tone, length and keywords."],
  ["02", "Outline & draft", "Approve an outline, then stream the full post."],
  ["03", "Polish & ship", "Edit, rewrite, check the score, export."],
];

const faqs = [
  ["Do I need an API key?", "No. Without a key the app runs in mock mode with deterministic sample output. Add GEMINI_API_KEY or GROQ_API_KEY (both have free tiers) for real generations."],
  ["Where are my drafts stored?", "In your browser's local storage. Nothing is sent to a server except the brief you generate from."],
  ["Is the SEO score real?", "It is a transparent heuristic (six checks you can see), not a ranking guarantee. It's a fast editor aid."],
];

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden grain">
      <div className="aurora"><i /></div>
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <a href="#features" className="hidden px-3 py-2 text-mute hover:text-white sm:block">Features</a>
          <a href="#faq" className="hidden px-3 py-2 text-mute hover:text-white sm:block">FAQ</a>
          <Link href="/studio" className="btn-glow rounded-full px-4 py-2">Open studio</Link>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-5 pb-16 pt-14 text-center sm:pt-24">
          <p className="reveal glass mx-auto mb-7 w-fit rounded-full px-4 py-1.5 text-xs text-mute">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-cyan align-middle" />
            Free · Gemini &amp; Groq · works offline in mock mode
          </p>
          <h1 className="reveal text-gradient text-5xl leading-[1.02] sm:text-7xl" style={{ fontFamily: "var(--font-display)", animationDelay: ".08s" }}>
            Blog posts that write
            <br />
            themselves. <em className="not-italic text-white/90">Beautifully.</em>
          </h1>
          <p className="reveal mx-auto mt-6 max-w-xl text-lg text-mute" style={{ animationDelay: ".16s" }}>
            Give ScribeAI a topic. Get a structured, SEO-aware draft streamed live, then edit, score and export it from one studio.
          </p>
          <div className="reveal mt-9 flex flex-wrap justify-center gap-3" style={{ animationDelay: ".24s" }}>
            <Link href="/studio" className="btn-glow inline-flex items-center gap-2 rounded-full px-6 py-3">
              Start writing <ArrowRight className="size-4" />
            </Link>
            <a href="#features" className="btn-ghost rounded-full px-6 py-3">See what&apos;s inside</a>
          </div>
          <div className="reveal mt-16" style={{ animationDelay: ".34s" }}>
            <HeroDemo />
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="mb-10 text-4xl sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Everything between <span className="text-gradient">idea</span> and <span className="text-gradient">publish</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            {features.map(({ icon: Icon, title, body, span }) => (
              <article key={title} className={`glass group rounded-3xl p-6 transition-transform hover:-translate-y-1 md:col-span-1 ${span}`}>
                <span className="mb-5 grid size-10 place-items-center rounded-xl bg-white/8 text-pink transition-colors group-hover:bg-pink group-hover:text-black">
                  <Icon className="size-5" />
                </span>
                <h3 className="mb-1.5 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-mute">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(([n, t, d]) => (
              <div key={n} className="rounded-3xl border border-line p-7">
                <div className="text-gradient text-5xl" style={{ fontFamily: "var(--font-display)" }}>{n}</div>
                <h3 className="mt-3 text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-mute">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="mb-8 text-4xl" style={{ fontFamily: "var(--font-display)" }}>Questions</h2>
          <div className="space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="glass group rounded-2xl px-5 py-4">
                <summary className="cursor-pointer list-none font-medium marker:hidden">{q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-mute">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 pb-24">
          <div className="glass rounded-[2rem] p-10 text-center">
            <h2 className="text-4xl sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Your next post is one topic away.</h2>
            <Link href="/studio" className="btn-glow mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3">
              Open the studio <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-line py-8 text-center text-xs text-mute">
        ScribeAI · built with Next.js, TypeScript &amp; Tailwind · free-tier friendly
      </footer>
    </div>
  );
}
