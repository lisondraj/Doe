import { AbsoluteFill } from "remotion";

import {
  MOTION_TEST_GOLD_LINE_STROKE_GRADIENT_HORIZONTAL,
  MOTION_TEST_GRADIENT_LINE_STROKE_GRADIENT_HORIZONTAL,
} from "../constants";
import { getMotionTestFinaleTypewriterBottomLineMotion } from "../finale-typewriter-bottom-line-motion";
import { useMotionTestFrame } from "../motion-test-frame";

export function FinaleTypewriterBottomLine() {
  const frame = useMotionTestFrame();
  const { visible, leftPx, widthPx, useInvertedColors, bottomInsetPx, strokeHeightPx } =
    getMotionTestFinaleTypewriterBottomLineMotion(frame);

  if (!visible || widthPx <= 0) {
    return null;
  }

  const stroke = useInvertedColors
    ? MOTION_TEST_GOLD_LINE_STROKE_GRADIENT_HORIZONTAL
    : MOTION_TEST_GRADIENT_LINE_STROKE_GRADIENT_HORIZONTAL;

  return (
    <AbsoluteFill
      className="motion-test-finale-corner-lines motion-test-finale-typewriter-bottom-line"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="motion-test-finale-corner-lines__stroke motion-test-finale-corner-lines__stroke--horizontal motion-test-finale-corner-lines__stroke--horizontal-left"
        style={{
          left: leftPx,
          bottom: bottomInsetPx,
          width: widthPx,
          height: strokeHeightPx,
          background: stroke,
        }}
      />
    </AbsoluteFill>
  );
}
