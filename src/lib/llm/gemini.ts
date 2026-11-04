import { ProviderError, sseData, type LLMProvider } from "./provider";

export function createGemini(apiKey: string, model = "gemini-2.0-flash"): LLMProvider {
  return {
    name: "gemini",
    async *stream(prompt, signal) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
      const res = await fetch(url, {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: prompt.system }] },
          contents: [{ role: "user", parts: [{ text: prompt.user }] }],
          generationConfig: { temperature: 0.8 },
        }),
      });
      if (!res.ok || !res.body) {
        throw new ProviderError(`Gemini request failed (${res.status})`, res.status === 429 ? 429 : 502);
      }
      for await (const data of sseData(res.body)) {
        try {
          const json = JSON.parse(data);
          const text = json.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
          if (text) yield text;
        } catch {
          /* ignore malformed keep-alive chunk */
        }
      }
    },
  };
}
