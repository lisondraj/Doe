/**
 * The /earlypreview films' HLS ladders sit in the private blob store under `hls/<film>/`: `master.m3u8`, one playlist per
 * quality (`1080p.m3u8`, …) and their segments. A private object has no public URL, so the route that serves a playlist
 * rewrites every segment to a signed link. Playlists stay relative, so the player asks the same route for them.
 *
 * Pure, so it can be tested without the store.
 */

/** Where one film's ladder lives in the store. */
export function hlsFolder(film: string) {
  return `hls/${film}/`;
}

export const HLS_MASTER = "master.m3u8";

/** A playlist name the route will serve: one plain file name, no folders, no traversal. */
export function isPlaylistName(name: string) {
  return /^[a-z0-9][a-z0-9_-]*\.m3u8$/i.test(name);
}

function isPlaylistRef(uri: string) {
  return /\.m3u8(?:$|[?#])/i.test(uri);
}

function isAbsolute(uri: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(uri) || uri.startsWith("/");
}

/**
 * Rewrites a playlist from `folder`. Each segment (and any `URI="…"` that is not a playlist, such as an fMP4 init
 * segment) becomes `sign(folder + name)`. Playlist references and absolute URLs are left as they are.
 */
export async function rewritePlaylist(
  text: string,
  folder: string,
  sign: (pathname: string) => Promise<string> | string,
): Promise<string> {
  const lines = text.split(/\r?\n/);
  const out: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      out.push(line);
      continue;
    }
    if (trimmed.startsWith("#")) {
      const match = /URI="([^"]+)"/.exec(trimmed);
      if (match && !isPlaylistRef(match[1]) && !isAbsolute(match[1])) {
        const signed = await sign(folder + match[1]);
        out.push(trimmed.replace(match[0], `URI="${signed}"`));
      } else {
        out.push(trimmed);
      }
      continue;
    }
    if (isPlaylistRef(trimmed) || isAbsolute(trimmed)) {
      out.push(trimmed);
      continue;
    }
    out.push(await sign(folder + trimmed));
  }
  return out.join("\n");
}
