# CHANGES: what changed and why

## Architecture in one minute

```
src/app/page.tsx            landing page (server component)
src/app/studio/page.tsx     renders <Studio/> (client)
src/app/api/generate        POST: validate → rate-limit → prompt → provider stream
src/app/api/status          GET: which provider is active (for the UI badge)
src/lib/schema.ts           Zod request schema (discriminated union on `mode`)
src/lib/prompts.ts          builds {system,user} prompts per mode
src/lib/llm/*               provider interface + gemini, groq, mock, selection
src/lib/analysis.ts         pure SEO/readability functions
src/lib/drafts.ts           Draft factory + DraftStore (localStorage impl)
src/lib/stream.ts           client-side streaming fetch helper
src/components/*            Studio, hooks, hero demo, logo
```

Flow: the UI sends a `brief` (+ mode) → the route validates it, picks a provider, and **streams** plain-text chunks back → the UI appends chunks into the draft → `analyze()` re-scores on every change → drafts autosave (debounced) to localStorage.

Interview line: *"Everything external sits behind one tiny interface, `stream(prompt): AsyncGenerator<string>`, so Gemini, Groq and a deterministic mock are interchangeable, and the whole app is testable and demoable offline."*

## Feature by feature

1. **Stack migration (monorepo → one Next.js + TS app).** *Why:* v1 required Firebase + Mongo + two services to run, and had no AI. One app = one deploy, zero config. Strict TS, ESLint, Vitest, CI added.
2. **LLM provider abstraction + mock mode** (`lib/llm`). `resolveProviderName(env)` is pure (tested): explicit `LLM_PROVIDER` wins if its key exists, otherwise auto-detect Gemini → Groq → mock. Gemini and Groq are raw `fetch` + SSE (`sseData` parser handles events split across network chunks). Mock builds a post from the brief and streams it word by word.
3. **Streaming API with resilience.** The route reads the *first* chunk before replying; if the provider fails (bad key, quota, 5xx) it silently switches to mock and sets `X-Fallback: 1` so the UI can tell the user. Mid-stream failures keep the partial draft. Zod validation → 400 with a readable message; JSON parse errors → 400; in-memory sliding-window rate limiter → 429 + `Retry-After`.
4. **Brief form instead of chat.** Topic, audience, tone, length, keywords (chips). Structured input gives better prompts and a document-centric product.
5. **Outline-first.** `mode: "outline"` streams an editable outline; `mode: "post"` receives it and follows it.
6. **Editor + preview + autosave + multiple drafts.** Write/Preview tabs, Markdown rendered with react-markdown (replaces v1's `dangerouslySetInnerHTML`, closing an XSS hole). `useDrafts` hydrates from storage and saves debounced; storage is behind a `DraftStore` interface so a real DB can replace it.
7. **SEO & readability insights** (`analysis.ts`, unit-tested). Six transparent checks → score; Flesch reading ease with a syllable heuristic; keyword density per keyword.
8. **Rewrite actions.** shorter / expand / simplify / punchier intro; on failure the original content is restored.
9. **Export.** Copy Markdown, copy HTML (from the rendered preview DOM), download `.md`.
10. **UX states.** Skeleton while hydrating and while waiting for the first token, empty state with a "write manually" path, dismissible error/notice banners, Stop button (AbortController), disabled controls while busy, mobile drawer + floating score button, `prefers-reduced-motion`.
11. **Design.** Dark ink canvas, animated aurora gradients, grain, glass panels, Instrument Serif display + Inter, gradient accent buttons, bento feature grid, typewriter hero demo. Inspired by the vibrant gradient-forward gallery aesthetic but original.
12. **Removed:** Firebase/Mongo/Express, `/api/prescriptions` stubs, Docker/Turbo config, placeholder testimonials.

## Testing

`npm test`: provider selection, mock streaming reconstructs exactly, every rewrite action, request-schema validation/defaults, SSE parsing across chunk boundaries, rate limiter window, SEO/readability maths.

## Likely interview questions

- *Why stream?* Perceived latency; users can stop early.
- *Why fetch the first chunk before responding?* Once headers are sent you can't change the status code or fall back cleanly.
- *Why drop Express/Mongo?* Free, zero-config deploy; trade-off is no cross-device sync, mitigated by the `DraftStore` seam.
- *Limits?* In-memory rate limiting, heuristic SEO score, localStorage only.
