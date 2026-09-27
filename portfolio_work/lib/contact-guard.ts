import { createHash } from "node:crypto";

// A bounded, per-process first line of defence. The database migration provides
// the durable limit across workers and direct database inserts.
const attempts = new Map<string, { count: number; expires: number }>();
const WINDOW_MS = 60_000;
export function contactRetryAfter(key: string, now = Date.now()): number {
  for (const [id, entry] of attempts) if (entry.expires <= now) attempts.delete(id);
  const entry = attempts.get(key);
  if (entry && entry.count >= 5) return Math.ceil((entry.expires - now) / 1000);
  if (entry) entry.count++;
  else {
    if (attempts.size >= 10_000) return 60;
    attempts.set(key, { count: 1, expires: now + WINDOW_MS });
  }
  return 0;
}

export function contactSenderKey(request: Request): string {
  // Only trust Vercel's overwritten forwarding header on Vercel. Arbitrary
  // client-supplied X-Forwarded-For must not bypass the local limit.
  const address = process.env.VERCEL === "1"
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    : "local-contact";
  return createHash("sha256").update(address || "unknown").digest("hex");
}
