"use client";

import { Thumbnail } from "@remotion/player";

import { dmSans } from "@/lib/home/fonts";
import { VIDEO1_FPS, VIDEO1_HEIGHT, VIDEO1_LIST, VIDEO1_WIDTH } from "@/remotion/video1";
import { VIDEO2_LIST } from "@/remotion/video2";

const FILMS = {
  communication: VIDEO1_LIST[1],
  network: VIDEO2_LIST[0],
  permissions: VIDEO2_LIST[1],
  coordinate: VIDEO2_LIST[2],
} as const;

export type EarlyPreviewProductFilm = keyof typeof FILMS;

/** One still frame of a /video1 or /video2 film, at the films' own 1920×1080. */
export function EarlyPreviewProductFilmFrame({ film, frame }: { film: EarlyPreviewProductFilm; frame: number }) {
  const entry = FILMS[film];
  return (
    <div className={dmSans.variable} style={{ width: VIDEO1_WIDTH, height: VIDEO1_HEIGHT }}>
      <Thumbnail
        component={entry.component}
        compositionWidth={VIDEO1_WIDTH}
        compositionHeight={VIDEO1_HEIGHT}
        durationInFrames={entry.durationInFrames}
        fps={VIDEO1_FPS}
        frameToDisplay={frame}
        style={{ width: VIDEO1_WIDTH, height: VIDEO1_HEIGHT }}
      />
    </div>
  );
}
