import { NextResponse } from "next/server";

import { DemoError } from "@/lib/demo/demo-engine";
import { clientIp, rateLimit } from "@/lib/demo/demo-guard";
import { clinicUpload } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** One form or file passed between an agent and the clinic: ?session_id=…&upload_id=…, served as the file itself. */
export async function GET(request: Request) {
  try {
    rateLimit("read", clientIp(request));
    const url = new URL(request.url);
    const up = await clinicUpload(url.searchParams.get("session_id"), url.searchParams.get("upload_id"));
    const body = up.dataUrl ? Buffer.from(up.dataUrl.slice(up.dataUrl.indexOf(",") + 1), "base64") : Buffer.from(up.text ?? "", "utf8");
    const type = up.dataUrl ? up.mime : "text/plain; charset=utf-8";
    const disposition = url.searchParams.get("download") ? "attachment" : "inline";
    return new NextResponse(body, {
      headers: {
        "content-type": type,
        "content-disposition": `${disposition}; filename="${up.fileName.replace(/"/g, "")}"`,
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
        "content-security-policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch (error) {
    const status = error instanceof DemoError ? error.status : 500;
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed" }, { status });
  }
}
