/**
 * The four /earlypreview films in the private blob store. The pathname is the object name in doe-blob.
 * The page never fetches these directly. `/api/earlypreview/film/[film]` signs a short-lived playback URL.
 */
export const EARLYPREVIEW_BLOB_FILMS = {
  hero: "sequence 01.mp4",
  hospitals: "video6.mp4",
  concierge: "video3.mp4",
  derm: "video5-4k.mp4",
} as const;

export type EarlyPreviewFilmId = keyof typeof EARLYPREVIEW_BLOB_FILMS;

export function isEarlyPreviewFilmId(value: string): value is EarlyPreviewFilmId {
  return value in EARLYPREVIEW_BLOB_FILMS;
}
