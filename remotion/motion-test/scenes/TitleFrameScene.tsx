import { AbsoluteFill, useCurrentFrame } from "remotion";

import { dmSans } from "@/remotion/fonts";

import {
  MOTION_TEST_DOE_STACK_INVERT_START_FRAME,
  MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME,
  MOTION_TEST_FINALE_TYPE_START_FRAME,
  MOTION_TEST_OPPOSITE_COLOR_FLASH_START_FRAME,
  MOTION_TEST_STACK_HIDE_FRAME,
  MOTION_TEST_TITLE_GRADIENT,
  MOTION_TEST_VERY_BIG_WHITE_FLASH_START_FRAME,
} from "../constants";
import { getMotionTestGradientY } from "../gradient-motion";
import { getMotionTestFinaleIntelligenceFlippedPhase } from "../finale-intelligence-flipped-zoom-motion";
import { getMotionTestGradientTextStyle } from "../gradient-text-style";
import { BigDoeStack } from "./BigDoeStack";
import { VeryBigTypewriter } from "./VeryBigTypewriter";
import { VeryBigWhiteDoe } from "./VeryBigWhiteDoe";
import {
  getMotionTestTextContent,
  getMotionTestTextPhase,
  getMotionTestTextStyle,
  getMotionTestVeryBigWhiteDoeStyle,
} from "./title-text-motion";

export function TitleFrameScene() {
  const frame = useCurrentFrame();
  const { gradientY, layerHeight, whiteOverlayOpacity, gradientScale, gradientOriginX, gradientOriginY } =
    getMotionTestGradientY(frame);

  const phase = getMotionTestTextPhase(frame);
  const textStyle = getMotionTestTextStyle(frame);
  const text = getMotionTestTextContent(frame);
  const veryBigWhiteDoeStyle = getMotionTestVeryBigWhiteDoeStyle(frame);
  const gradientTextStyle = getMotionTestGradientTextStyle();

  const isStackOnWhite =
    phase === "doe" &&
    textStyle.doeBeat === "big" &&
    frame < MOTION_TEST_DOE_STACK_INVERT_START_FRAME;

  const isStackOnGradient =
    frame >= MOTION_TEST_DOE_STACK_INVERT_START_FRAME && frame < MOTION_TEST_STACK_HIDE_FRAME;

  const showVeryBigWhiteOnGradient =
    frame >= MOTION_TEST_VERY_BIG_WHITE_FLASH_START_FRAME &&
    frame < MOTION_TEST_OPPOSITE_COLOR_FLASH_START_FRAME;

  const showVeryBigInverted =
    frame >= MOTION_TEST_OPPOSITE_COLOR_FLASH_START_FRAME &&
    frame < MOTION_TEST_FINALE_TYPE_START_FRAME;

  let foreground: React.ReactNode = null;

  if (frame >= MOTION_TEST_FINALE_TYPE_START_FRAME) {
    foreground = <VeryBigTypewriter />;
  } else if (showVeryBigInverted) {
    foreground = (
      <VeryBigWhiteDoe variant="on-white" transform={veryBigWhiteDoeStyle.transform} />
    );
  } else if (showVeryBigWhiteOnGradient) {
    foreground = (
      <VeryBigWhiteDoe variant="on-gradient" transform={veryBigWhiteDoeStyle.transform} />
    );
  } else if (isStackOnGradient) {
    foreground = (
      <BigDoeStack
        fontSize={textStyle.fontSize}
        transform={textStyle.transform}
        gradientTextStyle={gradientTextStyle}
        variant="white-on-gradient"
      />
    );
  } else if (isStackOnWhite) {
    foreground = (
      <BigDoeStack
        fontSize={textStyle.fontSize}
        transform={textStyle.transform}
        gradientTextStyle={gradientTextStyle}
        variant="gradient-on-white"
      />
    );
  } else if (text) {
    foreground = (
      <div
        key="doe-text"
        className={`motion-test-title__label${phase === "doe" ? " motion-test-title__label--doe" : ""}`}
        style={{
          opacity: textStyle.opacity,
          transform: textStyle.transform,
          fontSize: textStyle.fontSize,
        }}
      >
        {text}
      </div>
    );
  }

  const isFlippedPortal = frame >= MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME;
  const flippedPortalPhase = isFlippedPortal
    ? getMotionTestFinaleIntelligenceFlippedPhase(frame)
    : null;
  const isFlippedHold = flippedPortalPhase === "hold";
  const isFlippedZoom =
    flippedPortalPhase === "zoom" || flippedPortalPhase === "after";
  const showMainGradient =
    frame < MOTION_TEST_FINALE_INTELLIGENCE_FLIPPED_START_FRAME || isFlippedHold;

  return (
    <AbsoluteFill
      className={`motion-test-scene motion-test-title ${isFlippedHold ? "motion-test-title--portal-hold" : ""} ${isFlippedZoom ? "motion-test-title--portal-zoom" : ""} ${dmSans.className}`}
    >
      {showMainGradient ? (
        <AbsoluteFill className="motion-test-title__gradient-wrap">
          <div
            className="motion-test-title__gradient"
            style={{
              height: layerHeight,
              background: MOTION_TEST_TITLE_GRADIENT,
              transform: `translateY(${gradientY}px) scale(${gradientScale})`,
              transformOrigin: `${gradientOriginX}px ${gradientOriginY}px`,
            }}
          />
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill
        className="motion-test-title__white-overlay"
        style={{ opacity: whiteOverlayOpacity }}
      />

      {foreground}
    </AbsoluteFill>
  );
}
