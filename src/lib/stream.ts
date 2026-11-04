import type { GenerateRequest } from "./schema";

export class ApiError extends Error {}

export interface StreamResult {
  text: string;
  provider: string;
  fallback: boolean;
}

/** POSTs to /api/generate and feeds decoded text chunks to onChunk. Rejects with ApiError on HTTP errors. */
export async function streamGenerate(
  body: GenerateRequestInput,
  onChunk: (acc: string) => void,
  signal?: AbortSignal,
): Promise<StreamResult> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    throw new ApiError(data?.error ?? `Request failed (${res.status})`);
  }
  const provider = res.headers.get("X-Provider") ?? "unknown";
  const fallback = res.headers.get("X-Fallback") === "1";
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      onChunk(text);
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") return { text, provider, fallback };
    throw new ApiError("The stream was interrupted. Your partial draft was kept.");
  }
  return { text, provider, fallback };
}

export type GenerateRequestInput = Omit<GenerateRequest, never>;
