import { issueSignedToken, list, presignUrl } from "@vercel/blob";
import { NextResponse } from "next/server";

import { vercelBlobCommand } from "@/lib/blob/vercel-blob";
import { EARLYPREVIEW_BLOB_FILMS, type EarlyPreviewFilmId, isEarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";

/** Long enough to watch, short enough that a leaked link dies. */
const PLAYBACK_MS = 6 * 60 * 60 * 1000;

/** Resolved pathnames for this server process. A miss is not cached, so an upload shows up on the next request. */
const resolved = new Map<EarlyPreviewFilmId, string>();

/** Letters and digits only, so "sequence 01" matches "Sequence 01" or "sequence-01". */
function compactName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function fileBase(pathname: string) {
  return (pathname.split("/").pop() ?? "").replace(/\.mp4$/i, "");
}

/** The three films whose object names are already exact. Whatever mp4 is left is the hero. */
const NAMED_FILMS = ["video3.mp4", "video5-4k.mp4", "video6.mp4"] as const;

function choosePathname(pathnames: readonly string[], id: EarlyPreviewFilmId): string | null {
  const name = EARLYPREVIEW_BLOB_FILMS[id];
  const wanted = compactName(name.replace(/\.mp4$/i, ""));
  const exact = pathnames.find((pathname) => pathname === name || pathname.endsWith(`/${name}`));
  if (exact) return exact;
  const loose = pathnames.find((pathname) => {
    const base = compactName(fileBase(pathname));
    return base === wanted || base.startsWith(wanted);
  });
  if (loose) return loose;
  if (id !== "hero") return null;
  const taken = new Set(NAMED_FILMS.map((file) => compactName(file.replace(/\.mp4$/i, ""))));
  const rest = pathnames.filter(
    (pathname) => pathname.toLowerCase().endsWith(".mp4") && !taken.has(compactName(fileBase(pathname))),
  );
  return rest.length === 1 ? rest[0] : null;
}

/** One listing for every film. A failure is not cached. */
let catalog: Promise<string[]> | null = null;

function listPathnames() {
  if (!catalog) {
    catalog = list({ ...vercelBlobCommand(), limit: 100 })
      .then(({ blobs }) => blobs.map((blob) => blob.pathname))
      .catch((error: unknown) => {
        catalog = null;
        throw error;
      });
  }
  return catalog;
}

/**
 * The object in the store: the uploaded name, the same name in a folder, or — for the hero — the one
 * mp4 that is not hospitals, concierge, or derm. The configured name is signed when the store cannot be listed.
 */
async function resolvePathname(id: EarlyPreviewFilmId): Promise<string> {
  const cached = resolved.get(id);
  if (cached) return cached;
  try {
    const hit = choosePathname(await listPathnames(), id);
    if (hit) {
      resolved.set(id, hit);
      return hit;
    }
  } catch {
    // The store could not be listed. Sign the name we were given so the player still attempts it.
  }
  return EARLYPREVIEW_BLOB_FILMS[id];
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
    const issued = await issueSignedToken({
      ...vercelBlobCommand(),
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
