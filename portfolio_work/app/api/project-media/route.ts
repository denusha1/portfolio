import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
const MAX_FILE = 50 * 1024 * 1024;

// Raw uploads allow a hard streaming limit before buffering the whole file.
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Not available" }, { status: 404 });
  if (!isValidSession((await cookies()).get(ADMIN_COOKIE)?.value)) return NextResponse.json({ error: "Sign in again to upload media." }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const mime = request.headers.get("content-type");
  const formats: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "video/mp4": "mp4", "video/webm": "webm" };
  const extension = mime ? formats[mime] : undefined;
  if (!extension) return NextResponse.json({ error: "Use a PNG, JPG, WebP, MP4 or WebM file." }, { status: 400 });
  const limit = mime!.startsWith("image/") ? 15 * 1024 * 1024 : MAX_FILE;
  if (Number(request.headers.get("content-length")) > limit) return NextResponse.json({ error: "File too large. Images: 15 MB; videos: 50 MB." }, { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: "No file received." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); return NextResponse.json({ error: "File too large. Images: 15 MB; videos: 50 MB." }, { status: 413 }); }
    chunks.push(value);
  }
  const buffer = Buffer.concat(chunks);
  const valid = size >= 12 && (
    (extension === "png" && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (extension === "jpg" && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) ||
    (extension === "webp" && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") ||
    (extension === "mp4" && buffer.toString("ascii", 4, 8) === "ftyp") ||
    (extension === "webm" && buffer.subarray(0, 4).equals(Buffer.from([26, 69, 223, 163])))
  );
  if (!valid) return NextResponse.json({ error: "The file contents do not match its format." }, { status: 400 });
  const name = `${randomUUID()}.${extension}`;
  const directory = path.join(process.cwd(), "public", "projects");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), buffer, { flag: "wx" });
  return NextResponse.json({ src: `/projects/${name}`, kind: mime!.startsWith("image/") ? "image" : "video", caption: "" });
}
