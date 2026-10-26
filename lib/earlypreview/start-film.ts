/**
 * Starts a film from the top for a click. It is safe to call again and again (the click, the effect that follows it and
 * the player's `loadedmetadata` all do): the rewind happens once, so a film that is already playing is never seeked back
 * to 0:00 and left to stutter or pause while it re-buffers.
 */
export type FilmStart = { rewound: boolean };

/** Set on <html> while any film is playing, so the page's animated dot canvases hold still instead of competing for frames. */
export const FILM_PLAYING_ATTR = "data-film-playing";

const watched = new WeakSet<HTMLVideoElement>();

/** Keeps `FILM_PLAYING_ATTR` in step with whether this film is playing. Attached once per video. */
function watchPlaying(video: HTMLVideoElement) {
  if (watched.has(video)) return;
  watched.add(video);
  const root = document.documentElement;
  const on = () => root.setAttribute(FILM_PLAYING_ATTR, "");
  const off = () => {
    if (!Array.from(document.querySelectorAll("video")).some((v) => !v.paused && !v.ended)) root.removeAttribute(FILM_PLAYING_ATTR);
  };
  video.addEventListener("playing", on);
  video.addEventListener("pause", off);
  video.addEventListener("ended", off);
  video.addEventListener("emptied", off);
}

export function startFilm(video: HTMLVideoElement, state: FilmStart) {
  video.muted = false;
  // From the click on the film should buffer ahead, not just its first bytes.
  video.preload = "auto";
  watchPlaying(video);
  // Two films decoding at once is what makes both stutter, so any other one stops.
  document.querySelectorAll("video").forEach((other) => {
    if (other !== video && !other.paused) other.pause();
  });
  if (!state.rewound && video.readyState >= 1) {
    // The thumbnail's frame is where the file opens (`#t=`); the film plays from the top. A file that opened within
    // half a second of the top is already there: seeking back would only throw away its buffer and start it over.
    try {
      if (video.currentTime >= 0.5) video.currentTime = 0;
      state.rewound = true;
    } catch {
      // Not seekable yet. The next call, from `loadedmetadata`, rewinds.
    }
  }
  if (video.paused) void video.play().catch(() => undefined);
}
