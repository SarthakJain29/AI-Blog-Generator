import { generateRequest } from "@/lib/schema";
import { buildPrompt } from "@/lib/prompts";
import { createMock, getProvider, resolveProviderName } from "@/lib/llm";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const json = (body: unknown, status: number, headers: HeadersInit = {}) =>
  Response.json(body, { status, headers });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return json({ error: `Too many requests. Try again in ${rl.retryAfter}s.` }, 429, { "Retry-After": String(rl.retryAfter) });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }
  const parsed = generateRequest.safeParse(raw);
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, 400);
  }

  const req = parsed.data;
  const prompt = buildPrompt(req);
  let provider = getProvider(req);
  let fallback = false;

  // Pull the first chunk eagerly so a bad key / quota error can fall back to mock before we commit to a 200.
  let iterator = provider.stream(prompt, request.signal)[Symbol.asyncIterator]();
  let first: IteratorResult<string>;
  try {
    first = await iterator.next();
  } catch (err) {
    console.error(`[generate] ${provider.name} failed, falling back to mock:`, (err as Error).message);
    provider = createMock(req);
    iterator = provider.stream(prompt, request.signal)[Symbol.asyncIterator]();
    first = await iterator.next();
    fallback = true;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let step = first;
        while (!step.done) {
          controller.enqueue(encoder.encode(step.value));
          step = await iterator.next();
        }
        controller.close();
      } catch (err) {
        console.error("[generate] stream interrupted:", (err as Error).message);
        controller.error(err);
      }
    },
    cancel() {
      void iterator.return?.(undefined);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Provider": provider.name,
      "X-Fallback": fallback ? "1" : "0",
      "X-Configured-Provider": resolveProviderName(),
    },
  });
}
