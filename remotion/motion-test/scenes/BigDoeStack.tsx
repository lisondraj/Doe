import { AbsoluteFill } from "remotion";

import {
  MOTION_TEST_DOE_STACK_LINE_HEIGHT,
  MOTION_TEST_DOE_STACK_MIN_OPACITY,
  MOTION_TEST_DOE_STACK_OPACITY_FALLOFF,
  MOTION_TEST_DOE_STACK_RADIUS,
  MOTION_TEST_DOE_STACK_START_FRAME,
} from "../constants";
import {
  getMotionTestDoeStackLayerStyle,
  MOTION_TEST_GRADIENT_TEXT_DOE_STACK_CLASS,
  MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS,
  isMotionTestDoeStackOpeningGradientTextFrame,
} from "../gradient-text-style";
import { useMotionTestFrame } from "../motion-test-frame";

type BigDoeStackVariant = "gradient-on-white" | "white-on-gradient";

type BigDoeStackProps = {
  fontSize: number;
  transform: string;
  variant?: BigDoeStackVariant;
};

export function BigDoeStack({
  fontSize,
  transform,
  variant = "gradient-on-white",
}: BigDoeStackProps) {
  const frame = useMotionTestFrame();
  const showColumn = frame >= MOTION_TEST_DOE_STACK_START_FRAME;
  const useOpeningGradientText = isMotionTestDoeStackOpeningGradientTextFrame(frame);
  const lineStep = fontSize * MOTION_TEST_DOE_STACK_LINE_HEIGHT;
  const isWhiteOnGradient = variant === "white-on-gradient";

  const layers = showColumn
    ? Array.from({ length: MOTION_TEST_DOE_STACK_RADIUS * 2 + 1 }, (_, index) => {
        const offset = index - MOTION_TEST_DOE_STACK_RADIUS;
        const distance = Math.abs(offset);
        const baseOpacity =
          distance === 0
            ? 1
            : Math.max(
                MOTION_TEST_DOE_STACK_MIN_OPACITY,
                1 - distance * MOTION_TEST_DOE_STACK_OPACITY_FALLOFF,
              );

        return { offset, opacity: baseOpacity, key: offset };
      })
    : [{ offset: 0, opacity: 1, key: 0 }];

  return (
    <AbsoluteFill className="motion-test-doe-stack">
      <div className="motion-test-doe-stack__motion" style={{ transform }}>
        {layers.map(({ offset, opacity, key }) => {
          const gradientClass =
            useOpeningGradientText || !isWhiteOnGradient
              ? MOTION_TEST_GRADIENT_TEXT_DOE_STACK_CLASS
              : MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS;
          const layerStyle =
            useOpeningGradientText || !isWhiteOnGradient
              ? getMotionTestDoeStackLayerStyle(offset, MOTION_TEST_DOE_STACK_RADIUS)
              : undefined;

          return (
            <span
              key={showColumn ? key : "solo"}
              className={`motion-test-title__label motion-test-title__label--doe motion-test-doe-stack__layer ${gradientClass}`}
              style={{
                fontSize,
                opacity: offset === 0 ? 1 : opacity,
                transform: `translate(-50%, calc(-50% + ${offset * lineStep}px))`,
                ...layerStyle,
              }}
              aria-hidden={offset !== 0}
            >
              Doe
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
