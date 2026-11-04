import type { PromptPair } from "../prompts";

export type ProviderName = "gemini" | "groq" | "mock";

export interface LLMProvider {
  name: ProviderName;
  /** Streams text chunks. Throws ProviderError on failure. */
  stream(prompt: PromptPair, signal?: AbortSignal): AsyncGenerator<string>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

/** Parses a Server-Sent-Events byte stream into `data:` payload strings. */
export async function* sseData(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buf.search(/\r?\n\r?\n/)) !== -1) {
        const event = buf.slice(0, idx);
        buf = buf.slice(idx).replace(/^\r?\n\r?\n/, "");
        const data = event
          .split(/\r?\n/)
          .filter((l) => l.startsWith("data:"))
          .map((l) => l.slice(5).trimStart())
          .join("\n");
        if (data) yield data;
      }
    }
    const tail = buf.trim();
    if (tail.startsWith("data:")) yield tail.slice(5).trimStart();
  } finally {
    reader.releaseLock();
  }
}
