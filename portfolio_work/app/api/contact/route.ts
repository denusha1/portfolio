import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { contactRetryAfter, contactSenderKey } from "@/lib/contact-guard";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  const retryAfter = contactRetryAfter(contactSenderKey(request));
  if (retryAfter) return NextResponse.json({ error: "Too many attempts. Please wait a minute before trying again." }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  let body: ContactPayload;
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32_768) {
        await reader.cancel();
        return NextResponse.json({ error: "Message is too large." }, { status: 413 });
      }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    body = parsed as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ error: "Unable to accept this submission." }, { status: 400 });

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid name and email." }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: "Enter a message under 5000 characters." }, { status: 400 });
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "Contact service is not configured." }, { status: 503 });
  }

  const { error } = await db.from("contact_messages").insert({ name, email, message });
  if (error) {
    if (error.code === "P0001") return NextResponse.json({ error: "A message was already received recently. Please wait a minute." }, { status: 429, headers: { "Retry-After": "60" } });
    console.error("[contact] insert failed", error.message);
    return NextResponse.json({ error: "Message could not be saved." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
