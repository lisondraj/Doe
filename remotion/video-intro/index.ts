import type { Video1Entry } from "../video1";
import { CHAPTERS, FILM_FRAMES, VideoIntroFilm, withBed } from "./Film";

/** The full film first, then each chapter on its own. */
export const VIDEO_INTRO_LIST: Video1Entry[] = [
  { id: "VideoIntroFilm", title: "Full film", component: VideoIntroFilm, durationInFrames: FILM_FRAMES },
  ...CHAPTERS.map((c) => ({ id: `VideoIntro${c.id}`, title: c.title, component: withBed(c), durationInFrames: c.frames })),
];
