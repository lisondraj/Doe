import { AbsoluteFill } from "remotion";

import { dmSans } from "@/remotion/fonts";

import {
  MOTION_TEST_FINALE_AGENT_BUILDER_FONT_SIZE,
  MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
} from "../constants";
import { getMotionTestFinaleAgentBuilderMotion } from "../finale-agent-builder-motion";
import { getMotionTestGradientTextStyle } from "../gradient-text-style";
import { useMotionTestFrame } from "../motion-test-frame";

export function FinaleAgentBuilderTitle() {
  const frame = useMotionTestFrame();
  const { title, titleOpacity, titleScale, useInvertedProductColors } =
    getMotionTestFinaleAgentBuilderMotion(frame);
  const gradientTextStyle = getMotionTestGradientTextStyle();

  if (titleOpacity <= 0) {
    return null;
  }

  return (
    <AbsoluteFill
      className="motion-test-finale-agent-builder"
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`motion-test-finale-agent-builder__title${
          useInvertedProductColors
            ? ""
            : " motion-test-finale-agent-builder__title--gradient motion-test-title__label--gradient"
        } ${dmSans.className}`}
        style={{
          ...(useInvertedProductColors
            ? {
                color: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
                WebkitTextFillColor: MOTION_TEST_FINALE_INVERTED_TEXT_COLOR,
              }
            : gradientTextStyle),
          fontSize: MOTION_TEST_FINALE_AGENT_BUILDER_FONT_SIZE,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
}
