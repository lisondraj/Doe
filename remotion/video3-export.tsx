import { useContext, useMemo, type ReactNode } from "react";
import { Audio, Composition, Internals, Sequence, registerRoot, staticFile, useCurrentFrame, useVideoConfig, type PlayableMediaTag } from "remotion";

import "./load-fonts";
import { VIDEO1_FPS, VIDEO1_HEIGHT, VIDEO1_WIDTH } from "./video1/theme";
import { BED_CUE_FRAME, BED_VOLUME, VOICE_VOLUME } from "./video3/kit";
import { V3_BRIDGE_FRAMES, Video3Bridge } from "./video3/Video3Bridge";
import { V3_CONNECT_FRAMES, Video3Connect } from "./video3/Video3Connect";
import { V3_MEMBERSHIPS_FRAMES, Video3Memberships } from "./video3/Video3Memberships";

/** 60fps samples the 30fps camera twice as often. 4K is --scale=2 on this 1920×1080 frame. */
const EXPORT_FPS = 60;
const FRAME_FACTOR = EXPORT_FPS / VIDEO1_FPS;
const BED_CUE = BED_CUE_FRAME * FRAME_FACTOR;

type TimelineState = {
  frame: Record<string, number>;
  playing: boolean;
  imperativePlaying: { current: boolean };
  rootId: string;
  audioAndVideoTags: { current: PlayableMediaTag[] };
};

/** Plays the 30fps authoring clock at half speed against a 60fps composition. */
function DenseFrames({ children }: { children: ReactNode }) {
  const actual = useCurrentFrame();
  const { id } = useVideoConfig();
  const timeline = useContext(Internals.TimelineContext) as TimelineState | null;
  const value = useMemo(() => {
    if (!timeline) return null;
    return { ...timeline, frame: { ...timeline.frame, [id]: actual / FRAME_FACTOR } };
  }, [actual, id, timeline]);
  if (!value) return null;
  return <Internals.TimelineContext.Provider value={value}>{children}</Internals.TimelineContext.Provider>;
}

function SectionAudio({ voice }: { voice: string }) {
  return (
    <>
      <Audio src={staticFile(voice)} volume={VOICE_VOLUME} />
      <Audio src={staticFile("video1/BED.m4a")} startFrom={BED_CUE} volume={BED_VOLUME} />
    </>
  );
}

const CONNECT = V3_CONNECT_FRAMES * FRAME_FACTOR;
const MEMBERSHIPS = V3_MEMBERSHIPS_FRAMES * FRAME_FACTOR;
const BRIDGE = V3_BRIDGE_FRAMES * FRAME_FACTOR;

function Video3Film() {
  return (
    <>
      <Sequence durationInFrames={CONNECT} layout="none">
        <SectionAudio voice="video3/CON1.mp3" />
      </Sequence>
      <Sequence from={CONNECT} durationInFrames={MEMBERSHIPS} layout="none">
        <SectionAudio voice="video3/CON2.mp3" />
      </Sequence>
      <Sequence from={CONNECT + MEMBERSHIPS} durationInFrames={BRIDGE} layout="none">
        <SectionAudio voice="video3/CON3.mp3" />
      </Sequence>
      <DenseFrames>
        <Sequence durationInFrames={V3_CONNECT_FRAMES}>
          <Video3Connect audio={false} />
        </Sequence>
        <Sequence from={V3_CONNECT_FRAMES} durationInFrames={V3_MEMBERSHIPS_FRAMES}>
          <Video3Memberships audio={false} />
        </Sequence>
        <Sequence from={V3_CONNECT_FRAMES + V3_MEMBERSHIPS_FRAMES} durationInFrames={V3_BRIDGE_FRAMES}>
          <Video3Bridge audio={false} />
        </Sequence>
      </DenseFrames>
    </>
  );
}

const Video3ExportRoot = () => (
  <Composition id="Video3" component={Video3Film} durationInFrames={CONNECT + MEMBERSHIPS + BRIDGE} fps={EXPORT_FPS} width={VIDEO1_WIDTH} height={VIDEO1_HEIGHT} />
);

registerRoot(Video3ExportRoot);
