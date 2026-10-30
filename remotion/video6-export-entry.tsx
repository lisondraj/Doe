import { useContext, useMemo, type ReactNode } from "react";
import { AbsoluteFill, Audio, Composition, Internals, Series, registerRoot, staticFile, useCurrentFrame, useVideoConfig, type PlayableMediaTag } from "remotion";

import "./load-fonts";
import "./video1-player-match.css";
import { VIDEO1_FPS, VIDEO1_HEIGHT, VIDEO1_WIDTH } from "./video1/theme";
import { VIDEO6_BED_START, VIDEO6_BED_VOLUME, Video6SoundContext } from "./video6/kit";
import { VIDEO6_COORDINATE_FRAMES, Video6Coordinate } from "./video6/Video6Coordinate";
import { VIDEO6_GOVERN_FRAMES, Video6Govern } from "./video6/Video6Govern";
import { VIDEO6_NETWORK_FRAMES, Video6Network } from "./video6/Video6Network";

/** 60fps is the sweet spot for these pans: smoother than 30, without 120fps file size. */
const EXPORT_FPS = 60;
const FRAME_FACTOR = EXPORT_FPS / VIDEO1_FPS;
const SECTION_FRAMES = [VIDEO6_NETWORK_FRAMES, VIDEO6_GOVERN_FRAMES, VIDEO6_COORDINATE_FRAMES] as const;
const SECTION_EXPORT_FRAMES = SECTION_FRAMES.map((frames) => frames * FRAME_FACTOR);
const TOTAL_FRAMES = SECTION_EXPORT_FRAMES.reduce((sum, frames) => sum + frames, 0);

type TimelineState = {
  frame: Record<string, number>;
  playing: boolean;
  imperativePlaying: { current: boolean };
  rootId: string;
  audioAndVideoTags: { current: PlayableMediaTag[] };
};

/**
 * The films are authored on a 30fps clock. This plays that clock at half speed
 * against a 60fps composition, and restarts the clock at each section.
 */
function DenseFrames({ section, children }: { section: number; children: ReactNode }) {
  const actual = useCurrentFrame();
  const { id } = useVideoConfig();
  const timeline = useContext(Internals.TimelineContext) as TimelineState | null;
  const value = useMemo(() => {
    if (!timeline) return null;
    const start = SECTION_EXPORT_FRAMES.slice(0, section).reduce((sum, frames) => sum + frames, 0);
    const local = (actual - start) / FRAME_FACTOR;
    return {
      ...timeline,
      frame: { ...timeline.frame, [id]: local },
    };
  }, [actual, id, section, timeline]);
  if (!value) return null;
  return <Internals.TimelineContext.Provider value={value}>{children}</Internals.TimelineContext.Provider>;
}

const PARTS = [Video6Network, Video6Govern, Video6Coordinate] as const;

function Video6All() {
  const frame = useCurrentFrame();
  let section = 0;
  let cursor = 0;
  for (let i = 0; i < SECTION_EXPORT_FRAMES.length; i++) {
    if (frame < cursor + SECTION_EXPORT_FRAMES[i]) {
      section = i;
      break;
    }
    cursor += SECTION_EXPORT_FRAMES[i];
    section = i;
  }
  const Part = PARTS[section];
  return (
    <AbsoluteFill>
      <Series>
        {SECTION_EXPORT_FRAMES.map((duration, index) => (
          <Series.Sequence key={index} durationInFrames={duration}>
            <Audio src={staticFile("video1/BED.m4a")} startFrom={VIDEO6_BED_START * FRAME_FACTOR} volume={VIDEO6_BED_VOLUME} />
          </Series.Sequence>
        ))}
      </Series>
      <Video6SoundContext.Provider value={false}>
        <DenseFrames section={section}>
          <Part />
        </DenseFrames>
      </Video6SoundContext.Provider>
    </AbsoluteFill>
  );
}

const Video6ExportRoot = () => (
  <Composition id="Video6All" component={Video6All} durationInFrames={TOTAL_FRAMES} fps={EXPORT_FPS} width={VIDEO1_WIDTH} height={VIDEO1_HEIGHT} />
);

registerRoot(Video6ExportRoot);
