import { AbsoluteFill } from "remotion";

import { lora } from "@/remotion/fonts";

import {
  MOTION_TEST_FINALE_OUTRO_DOE_FONT_SIZE,
  MOTION_TEST_FINALE_OUTRO_DOE_LINE_HEIGHT,
  MOTION_TEST_TITLE_GRADIENT,
} from "../constants";
import { getMotionTestGradientY } from "../gradient-motion";
import { getMotionTestFinaleOutroLogoScale } from "../finale-outro-motion";
import { MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS } from "../gradient-text-style";
import { useMotionTestFrame } from "../motion-test-frame";

export function FinaleOutro() {
  const frame = useMotionTestFrame();
  const { gradientY, layerHeight } = getMotionTestGradientY(frame);
  const logoScale = getMotionTestFinaleOutroLogoScale(frame);

  return (
    <AbsoluteFill className="motion-test-finale-outro" style={{ pointerEvents: "none" }}>
      <AbsoluteFill className="motion-test-title__gradient-wrap">
        <div
          className="motion-test-title__gradient motion-test-finale-outro__gradient"
          style={{
            height: layerHeight,
            background: MOTION_TEST_TITLE_GRADIENT,
            transform: `translateY(${gradientY}px)`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill className="motion-test-finale-outro__lockup">
        <span
          className={`motion-test-finale-outro__logo motion-test-title__label--doe ${MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS} ${lora.className}`}
          style={{
            fontSize: MOTION_TEST_FINALE_OUTRO_DOE_FONT_SIZE,
            lineHeight: MOTION_TEST_FINALE_OUTRO_DOE_LINE_HEIGHT,
            transform: `translate(-50%, -50%) scale(${logoScale})`,
          }}
        >
          Doe
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
