import { expect, it } from "vitest";
import { rateLimit } from "./rate-limit";

it("blocks after the limit and recovers after the window", () => {
  const t = 1_000_000;
  for (let i = 0; i < 3; i++) expect(rateLimit("a", 3, 1000, t + i).ok).toBe(true);
  expect(rateLimit("a", 3, 1000, t + 10).ok).toBe(false);
  expect(rateLimit("a", 3, 1000, t + 2000).ok).toBe(true);
  expect(rateLimit("b", 3, 1000, t).ok).toBe(true);
});
