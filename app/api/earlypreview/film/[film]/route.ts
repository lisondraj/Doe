import { issueSignedToken, list, presignUrl } from "@vercel/blob";
import { NextResponse } from "next/server";

import { EARLYPREVIEW_BLOB_FILMS, type EarlyPreviewFilmId, isEarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";

/** Long enough to watch, short enough that a leaked link dies. */
const PLAYBACK_MS = 6 * 60 * 60 * 1000;

/** Resolved pathnames for this server process. A miss is not cached, so an upload shows up on the next request. */
const resolved = new Map<EarlyPreviewFilmId, string>();

/** The filename as uploaded, then the same name inside a folder or with the store's random suffix. */
async function resolvePathname(id: EarlyPreviewFilmId): Promise<string | null> {
  const cached = resolved.get(id);
  if (cached) return cached;
  const name = EARLYPREVIEW_BLOB_FILMS[id];
  const stem = name.replace(/\.mp4$/i, "");
  const { blobs } = await list({ prefix: stem, limit: 50 });
  const hit =
    blobs.find((blob) => blob.pathname === name || blob.pathname.endsWith(`/${name}`)) ??
    blobs.find((blob) => {
      const file = blob.pathname.split("/").pop() ?? "";
      return file.startsWith(stem) && file.toLowerCase().endsWith(".mp4");
    });
  if (!hit) return null;
  resolved.set(id, hit.pathname);
  return hit.pathname;
}

type RouteContext = {
  params: { film: string };
};

/**
 * A private blob has no public URL. This signs one the player can fetch directly, including the byte
 * ranges it asks for when someone seeks. The read-write token stays on the server.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  if (!isEarlyPreviewFilmId(params.film)) {
    return NextResponse.json({ error: "Unknown film." }, { status: 404 });
  }

  const validUntil = Date.now() + PLAYBACK_MS;

  try {
    const pathname = await resolvePathname(params.film);
    if (!pathname) {
      return NextResponse.json({ error: "Film not found." }, { status: 404 });
    }
    const issued = await issueSignedToken({
      pathname,
      operations: ["get", "head"],
      validUntil,
    });
    const { presignedUrl } = await presignUrl(
      {
        clientSigningToken: issued.clientSigningToken,
        delegationToken: issued.delegationToken,
      },
      { access: "private", operation: "get", pathname, validUntil },
    );
    return NextResponse.json(
      { url: presignedUrl },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not open the film.";
    const missing = /token|not configured|BLOB_READ_WRITE_TOKEN/i.test(message);
    return NextResponse.json(
      { error: missing ? "Film storage is not configured." : "Could not open the film." },
      { status: missing ? 503 : 502 },
    );
  }
}
