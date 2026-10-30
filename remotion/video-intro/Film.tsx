import type { ComponentType } from "react";
import { AbsoluteFill, Sequence } from "remotion";

import { Bed, OVERLAP } from "./kit";
import { S1_FRAMES, S1Intro } from "./S1Intro";
import { S2_FRAMES, S2Agents } from "./S2Agents";
import { S3_FRAMES, S3Product } from "./S3Product";
import { S4_FRAMES, S4Founders } from "./S4Founders";
import { S5_FRAMES, S5Market } from "./S5Market";
import { S6_FRAMES, S6Funds } from "./S6Funds";
import { S7_FRAMES, S7Targets } from "./S7Targets";
import { S8_FRAMES, S8Contact } from "./S8Contact";

export type Chapter = { id: string; title: string; component: ComponentType; frames: number };

export const CHAPTERS: Chapter[] = [
  { id: "Doe", title: "What Doe is", component: S1Intro, frames: S1_FRAMES },
  { id: "Agents", title: "Agents in 2027", component: S2Agents, frames: S2_FRAMES },
  { id: "Product", title: "Product", component: S3Product, frames: S3_FRAMES },
  { id: "Founders", title: "Founders", component: S4Founders, frames: S4_FRAMES },
  { id: "Market", title: "Go-to-market", component: S5Market, frames: S5_FRAMES },
  { id: "Funds", title: "Use of funds", component: S6Funds, frames: S6_FRAMES },
  { id: "Targets", title: "Seed targets", component: S7Targets, frames: S7_FRAMES },
  { id: "Contact", title: "Contact", component: S8Contact, frames: S8_FRAMES },
];

/** Where each chapter starts in the film; each overlaps the one before so it fades in over it. */
export const CHAPTER_STARTS = CHAPTERS.reduce<number[]>((starts, c, i) => [...starts, i === 0 ? 0 : starts[i - 1] + CHAPTERS[i - 1].frames - OVERLAP], []);

export const FILM_FRAMES = CHAPTER_STARTS[CHAPTERS.length - 1] + CHAPTERS[CHAPTERS.length - 1].frames;

/** The whole intro on one timeline, about 3:28, with the bed under it. */
export function VideoIntroFilm() {
  return (
    <AbsoluteFill>
      <Bed frames={FILM_FRAMES} />
      {CHAPTERS.map((c, i) => (
        <Sequence key={c.id} from={CHAPTER_STARTS[i]} durationInFrames={c.frames} name={c.title}>
          <c.component />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

/** A single chapter with the bed under it, for watching one part on its own. */
export function withBed(c: Chapter): ComponentType {
  function ChapterWithBed() {
    return (
      <AbsoluteFill>
        <Bed frames={c.frames} />
        <c.component />
      </AbsoluteFill>
    );
  }
  ChapterWithBed.displayName = `VideoIntro${c.id}`;
  return ChapterWithBed;
}
