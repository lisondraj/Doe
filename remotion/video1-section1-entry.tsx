import { useContext, useMemo, type ReactNode } from "react";
import { Composition, Internals, registerRoot, useCurrentFrame, useVideoConfig } from "remotion";

import "./load-fonts";
import "./video1-player-match.css";
import { VIDEO1_FPS, VIDEO1_HEIGHT, VIDEO1_WIDTH } from "./video1/theme";
import { VIDEO1_STRUCTURED_FRAMES, Video1Structured } from "./video1/Video1Structured";
import { VIDEO2_COMMUNICATION_FRAMES, Video2Communication } from "./video1/Video2Communication";
import { VIDEO3_PAYMENTS_FRAMES, Video3Payments } from "./video1/Video3Payments";

/** 60fps is the sweet spot for these pans: smoother than 30, without 120fps file size. */
const EXPORT_FPS = 60;
const FRAME_FACTOR = EXPORT_FPS / VIDEO1_FPS;

type TimelineState = {
  frame: Record<string, number>;
  playing: boolean;
  imperativePlaying: { current: boolean };
  rootId: string;
  audioAndVideoTags: { current: unknown[] };
};

/**
 * The films are authored on a 30fps clock. This plays that clock at half speed
 * against a 60fps composition, so every pan, fade, and zoom is sampled twice
 * as often and the wall-clock cut points stay put.
 */
function DenseFrames({ children }: { children: ReactNode }) {
  const actual = useCurrentFrame();
  const { id } = useVideoConfig();
  const timeline = useContext(Internals.TimelineContext) as TimelineState | null;
  const value = useMemo(() => {
    if (!timeline) return null;
    return {
      ...timeline,
      frame: { ...timeline.frame, [id]: actual / FRAME_FACTOR },
    };
  }, [actual, id, timeline]);
  if (!value) return null;
  return <Internals.TimelineContext.Provider value={value}>{children}</Internals.TimelineContext.Provider>;
}

function Section1Export() {
  return (
    <DenseFrames>
      <Video1Structured />
    </DenseFrames>
  );
}

function Section2Export() {
  return (
    <DenseFrames>
      <Video2Communication />
    </DenseFrames>
  );
}

function Section3Export() {
  return (
    <DenseFrames>
      <Video3Payments />
    </DenseFrames>
  );
}

const Video1ExportRoot = () => (
  <>
    <Composition
      id="Video1Section1"
      component={Section1Export}
      durationInFrames={VIDEO1_STRUCTURED_FRAMES * FRAME_FACTOR}
      fps={EXPORT_FPS}
      width={VIDEO1_WIDTH}
      height={VIDEO1_HEIGHT}
    />
    <Composition
      id="Video1Section2"
      component={Section2Export}
      durationInFrames={VIDEO2_COMMUNICATION_FRAMES * FRAME_FACTOR}
      fps={EXPORT_FPS}
      width={VIDEO1_WIDTH}
      height={VIDEO1_HEIGHT}
    />
    <Composition
      id="Video1Section3"
      component={Section3Export}
      durationInFrames={VIDEO3_PAYMENTS_FRAMES * FRAME_FACTOR}
      fps={EXPORT_FPS}
      width={VIDEO1_WIDTH}
      height={VIDEO1_HEIGHT}
    />
  </>
);

registerRoot(Video1ExportRoot);
