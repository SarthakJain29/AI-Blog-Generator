import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  title: "ScribeAI — Blog posts, drafted in seconds",
  description: "Turn a topic into an SEO-aware blog post. Stream, edit, score and export, all in one studio.",
};
export const viewport: Viewport = { themeColor: "#0a0a10" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
