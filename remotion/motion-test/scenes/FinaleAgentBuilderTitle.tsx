import { AbsoluteFill } from "remotion";

import { sfPro } from "@/remotion/fonts";

import { MOTION_TEST_FINALE_AGENT_BUILDER_FONT_SIZE } from "../constants";
import { getMotionTestFinaleAgentBuilderMotion } from "../finale-agent-builder-motion";
import {
  MOTION_TEST_GRADIENT_TEXT_BROWN_CLASS,
  MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS,
} from "../gradient-text-style";
import { useMotionTestFrame } from "../motion-test-frame";

export function FinaleAgentBuilderTitle() {
  const frame = useMotionTestFrame();
  const { title, titleOpacity, titleScale, titleFontScale, useInvertedProductColors } =
    getMotionTestFinaleAgentBuilderMotion(frame);
  const gradientClass = useInvertedProductColors
    ? MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS
    : MOTION_TEST_GRADIENT_TEXT_BROWN_CLASS;

  if (titleOpacity <= 0) {
    return null;
  }

  return (
    <AbsoluteFill
      className="motion-test-finale-agent-builder"
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`motion-test-finale-agent-builder__title motion-test-finale-agent-builder__title--gradient ${gradientClass} ${sfPro.className}`}
        style={{
          fontSize: MOTION_TEST_FINALE_AGENT_BUILDER_FONT_SIZE * titleFontScale,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
}
