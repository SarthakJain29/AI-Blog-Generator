import { ProviderError, sseData, type LLMProvider } from "./provider";

export function createGroq(apiKey: string, model = "openai/gpt-oss-120b"): LLMProvider {
  return {
    name: "groq",
    async *stream(prompt, signal) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          stream: true,
          temperature: 0.8,
          messages: [
            { role: "system", content: prompt.system },
            { role: "user", content: prompt.user },
          ],
        }),
      });
      if (!res.ok || !res.body) {
        throw new ProviderError(`Groq request failed (${res.status})`, res.status === 429 ? 429 : 502);
      }
      for await (const data of sseData(res.body)) {
        if (data === "[DONE]") return;
        try {
          const text = JSON.parse(data).choices?.[0]?.delta?.content;
          if (text) yield text;
        } catch {
          /* ignore */
        }
      }
    },
  };
}
