/**
 * Starts a film from the top for a click. It is safe to call again and again (the click, the effect that follows it and
 * the player's `loadedmetadata` all do): the rewind happens once, so a film that is already playing is never seeked back
 * to 0:00 and left to stutter or pause while it re-buffers.
 */
export type FilmStart = { rewound: boolean };

export function startFilm(video: HTMLVideoElement, state: FilmStart) {
  video.muted = false;
  // From the click on the film should buffer ahead, not just its first bytes.
  video.preload = "auto";
  // Two films decoding at once is what makes both stutter, so any other one stops.
  document.querySelectorAll("video").forEach((other) => {
    if (other !== video && !other.paused) other.pause();
  });
  if (!state.rewound && video.readyState >= 1) {
    // The thumbnail's frame is where the file opens (`#t=`); the film plays from the top.
    try {
      video.currentTime = 0;
      state.rewound = true;
    } catch {
      // Not seekable yet. The next call, from `loadedmetadata`, rewinds.
    }
  }
  if (video.paused) void video.play().catch(() => undefined);
}
