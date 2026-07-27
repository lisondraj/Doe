import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

import { DOE_PREMIUM_EASE } from "../intro-transitions";
import { useIntroSceneCrossfade } from "../intro-transitions";
import { IntroCurvyMotionLines } from "../shared/IntroCurvyMotionLines";
import { getScrollLastLineStartFrame, IntroKineticStack } from "../shared/IntroKineticStack";
import { f } from "../constants";

const OPENING_CROSSFADE_FRAMES = f(28);
const ZOOM_FRAMES = f(20);

const OPENING_LINES = [
  "Phones ringing.",
  "Patients waiting.",
  "Tasks piling up.",
  "Not enough hands.",
] as const;

const KINETIC_START = f(6);
const KINETIC_HOLD = f(30);
const KINETIC_SWIPE = f(16);
const ZOOM_HOLD = f(6);

const LAST_LINE_FRAME = getScrollLastLineStartFrame(
  OPENING_LINES.length,
  KINETIC_START,
  KINETIC_HOLD,
  KINETIC_SWIPE,
);
const ZOOM_START = LAST_LINE_FRAME + ZOOM_HOLD;
const ZOOM_END = ZOOM_START + ZOOM_FRAMES;

export function OpeningScene() {
  const frame = useCurrentFrame();
  const sceneOpacity = useIntroSceneCrossfade(OPENING_CROSSFADE_FRAMES);
  const linesOpacity = interpolate(frame, [0, f(18)], [0, 1], {
    extrapolateRight: "clamp",
    easing: DOE_PREMIUM_EASE,
  });

  const zoomProgress = interpolate(frame, [ZOOM_START, ZOOM_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DOE_PREMIUM_EASE,
  });

  const openingExit = interpolate(frame, [ZOOM_START, ZOOM_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const signalDrift = interpolate(zoomProgress, [0, 1], [0, -18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const signalFocus = interpolate(zoomProgress, [0, 1], [1, 0.62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="motion4-scene motion4-scene--hero motion4-scene--opening"
      style={{ opacity: sceneOpacity * openingExit }}
    >
      <IntroCurvyMotionLines
        opacity={linesOpacity * 0.62 * (1 - zoomProgress * 0.78)}
        driftY={signalDrift}
        focus={signalFocus}
      />
      <IntroKineticStack
        lines={OPENING_LINES}
        startFrame={KINETIC_START}
        holdFrames={KINETIC_HOLD}
        swipeFrames={KINETIC_SWIPE}
        mode="scroll"
        showCursor={false}
        zoomProgress={zoomProgress}
      />
    </AbsoluteFill>
  );
}
