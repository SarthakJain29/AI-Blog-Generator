import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center text-center">
      <div>
        <h1 className="text-gradient text-7xl" style={{ fontFamily: "var(--font-display)" }}>404</h1>
        <p className="mt-2 text-mute">That page wandered off.</p>
        <Link href="/" className="btn-glow mt-6 inline-block rounded-full px-5 py-2.5">Back home</Link>
      </div>
    </div>
  );
}
