import { NextResponse } from "next/server";

import { signedReadUrl } from "@/lib/earlypreview/earlypreview-blob-sign";
import { isEarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";
import { hlsFolder, isPlaylistName, rewritePlaylist } from "@/lib/earlypreview/hls-playlist";

/** Playlists do not change once uploaded; a fresh read every few minutes picks up a re-encode. */
const TEXT_MAX_AGE_MS = 5 * 60 * 1000;
const texts = new Map<string, { at: number; text: string }>();

async function playlistText(pathname: string): Promise<string | null> {
  const hit = texts.get(pathname);
  if (hit && Date.now() - hit.at < TEXT_MAX_AGE_MS) return hit.text;
  const response = await fetch(await signedReadUrl(pathname), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Playlist read failed: ${response.status}`);
  const text = await response.text();
  texts.set(pathname, { at: Date.now(), text });
  return text;
}

type RouteContext = {
  params: { film: string; file: string };
};

/**
 * One playlist of a film's HLS ladder, with each segment signed so the player can fetch it straight from the store.
 * The ladder lets the player pick the quality that fits the connection and the size of the frame, and change it as
 * either changes.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  if (!isEarlyPreviewFilmId(params.film) || !isPlaylistName(params.file)) {
    return NextResponse.json({ error: "Unknown playlist." }, { status: 404 });
  }
  const folder = hlsFolder(params.film);
  try {
    const text = await playlistText(folder + params.file);
    if (text === null) return NextResponse.json({ error: "Unknown playlist." }, { status: 404 });
    const body = await rewritePlaylist(text, folder, signedReadUrl);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        // The signed links inside last hours; a player rereads the playlist far sooner than that.
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not open the playlist." }, { status: 502 });
  }
}
