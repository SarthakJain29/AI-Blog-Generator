import { resolveProviderName } from "@/lib/llm";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ provider: resolveProviderName() });
}
