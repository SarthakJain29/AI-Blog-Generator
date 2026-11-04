import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="ScribeAI home">
      <span className="grid size-8 place-items-center rounded-xl btn-glow text-lg" style={{ fontFamily: "var(--font-display)" }}>
        S
      </span>
      <span className="text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        ScribeAI
      </span>
    </Link>
  );
}
