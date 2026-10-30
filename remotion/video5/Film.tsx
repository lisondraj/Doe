import { AbsoluteFill, Sequence } from "remotion";

import { SECTION1_FRAMES, Section1Reach } from "./Section1Reach";
import { SECTION2_FRAMES, Section2Packages } from "./Section2Packages";
import { SECTION3_FRAMES, Section3Capacity } from "./Section3Capacity";

export const VIDEO5_FILM_FRAMES = SECTION1_FRAMES + SECTION2_FRAMES + SECTION3_FRAMES;

/** Reach, packages, and capacity on one timeline. */
export function Video5Film() {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SECTION1_FRAMES} name="Reach">
        <Section1Reach />
      </Sequence>
      <Sequence from={SECTION1_FRAMES} durationInFrames={SECTION2_FRAMES} name="Packages">
        <Section2Packages />
      </Sequence>
      <Sequence from={SECTION1_FRAMES + SECTION2_FRAMES} durationInFrames={SECTION3_FRAMES} name="Capacity">
        <Section3Capacity />
      </Sequence>
    </AbsoluteFill>
  );
}
