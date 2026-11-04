# developer.md

## 1. Audit of the original project (v1)

**Intent:** "ScribeAI", an AI blog builder: sign in with Google, create chat-style drafts, send a topic, get a blog post back. (Package names also referenced a "prescription-ai", a leftover from a template.)

**Stack found:** Turborepo + Bun monorepo; `apps/web` (Next.js 15, Tailwind 4, Firebase Auth), `apps/api` (Express + MongoDB/Mongoose + Firebase Admin), `packages/{db,utils,eslint-config,typescript-config}`.

**What worked:** landing page markup, chat sidebar/layout, Firebase Google sign-in plumbing, Mongo models, CRUD for chats and user messages.

**Broken / missing:**
- **No AI at all.** The assistant reply was a hard-coded `setTimeout` string. The core feature did not exist.
- Hard dependency on three external accounts (Firebase, MongoDB, Google) before anything runs; nothing worked without them.
- API: all routes in one file, `(req as any)` everywhere, `start()` runs before routes are registered, port default mismatch (5000 vs 5001), leftover `/api/prescriptions` stubs, no input validation, error handler leaks messages, CORS wide open.
- Dockerfile referenced `bun.lockb` (repo has `bun.lock`), single `COPY` before install, Node 18.
- Frontend: assistant output rendered with `dangerouslySetInnerHTML` (XSS), `<prose>` classes without the typography plugin, errors only `console.error`, auth failure silently shows an empty chat, hero input value unused, testimonials/logo cloud placeholders, `.env` lines in README conflicting with code.
- Zero tests; `bun.lock` + Bun-only scripts; `test` task in turbo with no tests; `lint` used the deprecated `next lint`.

## 2. Research (similar products)

- **Jasper / Writesonic** ([comparison](https://clickup.com/blog/jasper-ai-vs-writesonic/)): win on brand voice, long-form workflow and **SEO optimisation built into the editor** (Writesonic + Surfer score). → I built a transparent SEO score panel and tone/audience/keyword controls.
- **Copy.ai**: structured inputs rather than a blank chat box. → "Brief" form instead of a chat transcript.
- **Notion AI**: AI lives *inside* the document with inline actions (shorter, expand, fix tone). → One-click rewrite menu.
- **Medium / Ghost / Substack editors** ([comparison](https://www.wisp.blog/compare/medium/ghost)): praised for low friction, clean distraction-free writing, autosave and Markdown. → Autosave, Markdown + preview, distraction-free centred column.
- **vibrant.design** (visual inspiration): content-first, colourful gradient-driven showcase. → dark ink background with aurora gradients, glass panels, serif display type.

Takeaways applied: structured brief, streaming, outline-first, SEO feedback, inline rewrites, autosave, export.

## 3. Decisions

1. **Branch name:** the task asked for `claude/revamp-v2`; the environment mandated `claude/revamp-v2-fpu17b`, so work is on that branch.
2. **Monorepo → single Next.js app.** The old split needed Mongo + Firebase + two deploy targets to show a chat box. A single Next.js app with route handlers deploys to Vercel's free tier in one click and runs with zero config. Old code remains in git history.
3. **Auth + DB removed; drafts in localStorage behind a `DraftStore` interface.** Free-only, no accounts, instant demo. Trade-off: no cross-device sync (roadmap item).
4. **Chat UI → "brief + editor + insights" studio.** A blog is a document, not a conversation; this matches how competing products work.
5. **No SDKs for LLMs.** Plain `fetch` + SSE parsing keeps the abstraction tiny and testable (one interface: `stream(prompt) → AsyncGenerator<string>`).
6. **Fallback to mock on provider failure** (checked before the response is committed) so the demo never breaks.
7. **Markdown rendering via react-markdown** (no raw HTML), fixing the XSS issue.
8. npm instead of Bun (ubiquitous, works on all free hosts); TypeScript pinned to 5.9.
9. Default models are aliases/currently-available ids (`gemini-flash-lite-latest`, `openai/gpt-oss-120b`) because named versions get retired; both are overridable via env.

## 4. Setup & run

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm test && npm run lint && npm run typecheck && npm run build
```

### Environment variables (all optional)

| Var | Purpose | Where to get it |
| --- | --- | --- |
| `LLM_PROVIDER` | `gemini` \| `groq` \| `mock`; empty = auto-detect | n/a |
| `GEMINI_API_KEY` | Google Gemini | https://aistudio.google.com/apikey (free) |
| `GEMINI_MODEL` | override model | default `gemini-flash-lite-latest` |
| `GROQ_API_KEY` | Groq | https://console.groq.com/keys (free) |
| `GROQ_MODEL` | override model | default `openai/gpt-oss-120b` |

No key → mock mode. Never commit `.env*` (ignored; only `.env.example` is tracked).

## 5. Deploy (free)

**Vercel:** import the repo, framework auto-detected as Next.js, add `GEMINI_API_KEY` and/or `GROQ_API_KEY` in Project Settings → Environment Variables, deploy. (Also works on Netlify/Cloudflare with their Next adapters.) Note the in-memory rate limiter is per-instance; fine for a demo.

## 6. Known issues

- Rate limiting is in-memory (resets on cold start, not shared across instances).
- SEO score is a heuristic; syllable counting is approximate.
- Drafts are per-browser; clearing site data deletes them.
- Mock mode output is generic by design.

## 7. Blockers & workarounds

- **Live providers verified (updated after keys were refreshed).** Gemini (`gemini-flash-lite-latest`) and Groq (`openai/gpt-oss-120b`) both streamed real posts through `/api/generate` with `X-Fallback: 0`. Two default models had to change: Groq's `llama-3.3-70b-versatile` returned `model_not_found` for this key, and `gemini-flash-latest` returned 503 "high demand" (so the default is the lighter flash-lite alias). Earlier 404s on `gemini-2.0-flash`/`gemini-2.5-*` came from the old key. Model availability changes often: if one is rejected, set `GEMINI_MODEL` / `GROQ_MODEL`.
- The research step used web search summaries; vibrant.design's CSS could not be fetched (markdown only), so the visual style is my interpretation of its mood, not a copy.

## 8. Progress

**Done:** audit, research, migration to Next.js + TS, provider layer (Gemini/Groq/mock + fallback), streaming API with validation + rate limit, studio UI (brief, outline, editor/preview, rewrites, insights, export, drafts), landing page, tests (15), CI workflow, README, CHANGES, screenshots.
**In progress:** –
**Next:** component tests (Playwright); cloud sync.
