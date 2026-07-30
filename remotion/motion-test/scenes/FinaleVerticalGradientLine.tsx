import { AbsoluteFill } from "remotion";

import {
  MOTION_TEST_FINALE_CORNER_LINE_BOTTOM_INSET_PX,
  MOTION_TEST_FINALE_CORNER_LINE_EDGE_INSET_PX,
  MOTION_TEST_FINALE_CORNER_LINE_TOP_INSET_PX,
  MOTION_TEST_FINALE_VERTICAL_LINE_WIDTH_PX,
  MOTION_TEST_GOLD_LINE_STROKE_GRADIENT,
  MOTION_TEST_GOLD_LINE_STROKE_GRADIENT_HORIZONTAL,
  MOTION_TEST_GRADIENT_LINE_STROKE_GRADIENT,
  MOTION_TEST_GRADIENT_LINE_STROKE_GRADIENT_HORIZONTAL,
} from "../constants";
import { isMotionTestFinaleProductTitleColorsInverted } from "../finale-agent-builder-motion";
import { getMotionTestFinaleVerticalLineMotion } from "../finale-vertical-line-motion";
import { useMotionTestFrame } from "../motion-test-frame";

export function FinaleVerticalGradientLine() {
  const frame = useMotionTestFrame();
  const {
    visible,
    primaryHorizontalWidthPx,
    primaryVerticalHeightPx,
    mirrorHorizontalWidthPx,
    mirrorVerticalHeightPx,
  } = getMotionTestFinaleVerticalLineMotion(frame);

  if (
    !visible ||
    (primaryHorizontalWidthPx <= 0 &&
      primaryVerticalHeightPx <= 0 &&
      mirrorHorizontalWidthPx <= 0 &&
      mirrorVerticalHeightPx <= 0)
  ) {
    return null;
  }

  const strokeHeight = MOTION_TEST_FINALE_VERTICAL_LINE_WIDTH_PX;
  const useInvertedProductColors = isMotionTestFinaleProductTitleColorsInverted(frame);
  const horizontalStroke = useInvertedProductColors
    ? MOTION_TEST_GOLD_LINE_STROKE_GRADIENT_HORIZONTAL
    : MOTION_TEST_GRADIENT_LINE_STROKE_GRADIENT_HORIZONTAL;
  const verticalStroke = useInvertedProductColors
    ? MOTION_TEST_GOLD_LINE_STROKE_GRADIENT
    : MOTION_TEST_GRADIENT_LINE_STROKE_GRADIENT;

  return (
    <AbsoluteFill
      className="motion-test-finale-corner-lines"
      style={{ pointerEvents: "none" }}
    >
      {primaryHorizontalWidthPx > 0 ? (
        <div
          className="motion-test-finale-corner-lines__stroke motion-test-finale-corner-lines__stroke--horizontal motion-test-finale-corner-lines__stroke--horizontal-left"
          style={{
            bottom: MOTION_TEST_FINALE_CORNER_LINE_BOTTOM_INSET_PX,
            width: primaryHorizontalWidthPx,
            height: strokeHeight,
            background: horizontalStroke,
          }}
        />
      ) : null}
      {mirrorHorizontalWidthPx > 0 ? (
        <div
          className="motion-test-finale-corner-lines__stroke motion-test-finale-corner-lines__stroke--horizontal motion-test-finale-corner-lines__stroke--horizontal-top-right"
          style={{
            top: MOTION_TEST_FINALE_CORNER_LINE_TOP_INSET_PX,
            width: mirrorHorizontalWidthPx,
            height: strokeHeight,
            background: horizontalStroke,
          }}
        />
      ) : null}
      {primaryVerticalHeightPx > 0 ? (
        <div
          className="motion-test-finale-corner-lines__stroke motion-test-finale-corner-lines__stroke--vertical motion-test-finale-corner-lines__stroke--vertical-right"
          style={{
            right: MOTION_TEST_FINALE_CORNER_LINE_EDGE_INSET_PX,
            height: primaryVerticalHeightPx,
            width: strokeHeight,
            background: verticalStroke,
          }}
        />
      ) : null}
      {mirrorVerticalHeightPx > 0 ? (
        <div
          className="motion-test-finale-corner-lines__stroke motion-test-finale-corner-lines__stroke--vertical motion-test-finale-corner-lines__stroke--vertical-left"
          style={{
            left: MOTION_TEST_FINALE_CORNER_LINE_EDGE_INSET_PX,
            height: mirrorVerticalHeightPx,
            width: strokeHeight,
            background: verticalStroke,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
}
