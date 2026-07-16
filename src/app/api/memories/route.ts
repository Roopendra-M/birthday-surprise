/**
 * POST /api/memories
 *
 * Accepts: { message: string }
 * On Vercel → sends email to mardalaroopendra@gmail.com via Resend
 * Locally   → also writes to data/memories.json as a backup
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

/* ── Config ── */
const RECIPIENT_EMAIL = "mardalaroopendra@gmail.com";
const FROM_EMAIL      = "Birthday Surprise ❤️ <onboarding@resend.dev>";
const DATA_FILE       = path.join(process.cwd(), "data", "memories.json");

/* ── Types ── */
interface MemoryEntry {
  id: string;
  message: string;
  createdAt: string;
}

/* ── Local JSON helpers (dev fallback, gracefully skipped on Vercel) ── */
async function readEntries(): Promise<MemoryEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MemoryEntry[]) : [];
  } catch {
    return [];
  }
}

async function appendEntry(entry: MemoryEntry): Promise<void> {
  try {
    const entries = await readEntries();
    entries.push(entry);
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
  } catch {
    /* Silently skip — filesystem is read-only on Vercel */
  }
}

/* ── Email HTML template ── */
function buildEmailHtml(message: string, id: string, createdAt: string): string {
  const dateStr = new Date(createdAt).toLocaleString("en-IN", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>A Special Message For You 💕</title>
</head>
<body style="margin:0;padding:0;background:#fff5f9;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:20px;
    overflow:hidden;box-shadow:0 8px 40px rgba(249,85,142,0.18);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#f97bb8,#e91e78,#a98eff);
      padding:36px 32px;text-align:center;">
      <div style="font-size:3rem;margin-bottom:8px;">💌</div>
      <h1 style="margin:0;color:white;font-size:1.6rem;letter-spacing:-0.02em;">
        She Shared Her Feelings!
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:0.9rem;">
        A message from the birthday surprise website
      </p>
    </div>

    <!-- Message body -->
    <div style="padding:32px;">
      <p style="margin:0 0 16px;color:#9a4060;font-size:0.85rem;
        letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">
        Her message to you ❤️
      </p>

      <!-- The paper letter look -->
      <div style="background:#fffcf6;border:1.5px solid rgba(200,160,140,0.30);
        border-radius:12px;padding:24px 28px;position:relative;
        font-family:Georgia,serif;font-size:1.05rem;line-height:1.9;color:#4a2535;">
        <div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);
          font-size:1.3rem;">🎀</div>
        ${message.replace(/\n/g, "<br>")}
      </div>

      <!-- Timestamp -->
      <p style="margin:20px 0 0;color:#c4909d;font-size:0.78rem;
        text-align:right;font-family:Arial,sans-serif;">
        ⏰ ${dateStr}
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#fff0f5;padding:20px 32px;text-align:center;
      border-top:1px solid rgba(255,180,210,0.30);">
      <p style="margin:0;color:#b5607a;font-size:0.82rem;font-family:Arial,sans-serif;">
        Sent from your birthday surprise website 🎁<br>
        <span style="opacity:0.6;font-size:0.75rem;">Message ID: ${id}</span>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/* ── POST handler ── */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    /* Validate body */
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      typeof (body as Record<string, unknown>).message !== "string"
    ) {
      return NextResponse.json(
        { ok: false, error: "Expected { message: string }" },
        { status: 400 }
      );
    }

    const message = ((body as Record<string, unknown>).message as string).trim();
    if (!message)     return NextResponse.json({ ok: false, error: "Message is empty." }, { status: 400 });
    if (message.length > 5000) return NextResponse.json({ ok: false, error: "Message too long." }, { status: 400 });

    /* Build entry */
    const entry: MemoryEntry = {
      id: randomUUID(),
      message,
      createdAt: new Date().toISOString(),
    };

    /* ── Send email via Resend ── */
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey !== "re_PASTE_YOUR_KEY_HERE") {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from:    FROM_EMAIL,
        to:      RECIPIENT_EMAIL,
        subject: "💌 She shared her feelings with you! ❤️",
        html:    buildEmailHtml(message, entry.id, entry.createdAt),
      });
      if (error) {
        console.error("[/api/memories] Resend error:", error);
        /* Still continue — save locally and return success to user */
      }
    } else {
      console.warn("[/api/memories] RESEND_API_KEY not set — email skipped (local dev mode).");
    }

    /* ── Save locally as backup (works in dev, silently skipped on Vercel) ── */
    await appendEntry(entry);

    return NextResponse.json({ ok: true, id: entry.id }, { status: 201 });

  } catch (err) {
    console.error("[/api/memories] POST error:", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}

/* ── GET — just returns count, never exposes messages ── */
export async function GET(): Promise<NextResponse> {
  try {
    const entries = await readEntries();
    return NextResponse.json({ ok: true, count: entries.length });
  } catch {
    return NextResponse.json({ ok: true, count: 0 });
  }
}
