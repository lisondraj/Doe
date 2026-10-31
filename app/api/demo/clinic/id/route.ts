import { NextResponse } from "next/server";

import { DemoError } from "@/lib/demo/demo-engine";
import { clientIp, rateLimit } from "@/lib/demo/demo-guard";
import { clinicIdFile } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** The driver's licence a patient attached when confirming it's them: ?session_id=…, served as the image itself. */
export async function GET(request: Request) {
  try {
    rateLimit("read", clientIp(request));
    const f = await clinicIdFile(new URL(request.url).searchParams.get("session_id"));
    const body = Buffer.from(f.dataUrl.slice(f.dataUrl.indexOf(",") + 1), "base64");
    return new NextResponse(body, {
      headers: {
        "content-type": f.mime,
        "content-disposition": `inline; filename="${f.fileName.replace(/"/g, "")}"`,
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
        "content-security-policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed" }, { status: error instanceof DemoError ? error.status : 500 });
  }
}
