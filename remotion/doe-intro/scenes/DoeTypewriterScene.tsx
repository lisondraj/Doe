import type { CSSProperties } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { DOE_SARAH_HANDOFF_FRAMES } from "../constants";
import { DOE_PREMIUM_EASE, handoffMotionStyle, useIntroDoeSarahHandoff } from "../intro-transitions";
import { IntroDoeLetterType } from "../shared/IntroDoeLetterType";

export function DoeTypewriterScene() {
  const frame = useCurrentFrame();
  const handoff = useIntroDoeSarahHandoff("exit", DOE_SARAH_HANDOFF_FRAMES);

  const sceneOpacity = interpolate(frame, [0, DOE_SARAH_HANDOFF_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DOE_PREMIUM_EASE,
  });

  return (
    <AbsoluteFill className="motion4-scene motion4-scene--doe-type" style={{ opacity: sceneOpacity }}>
      <div className="motion4-doe-type-viewport" style={handoffMotionStyle(handoff) as CSSProperties | undefined}>
        <IntroDoeLetterType />
      </div>
    </AbsoluteFill>
  );
}
