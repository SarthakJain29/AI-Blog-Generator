import type { Metadata } from "next";
import { Studio } from "@/components/studio";

export const metadata: Metadata = { title: "Studio — ScribeAI" };

export default function StudioPage() {
  return <Studio />;
}
