import { AbsoluteFill } from "remotion";

import {
  MOTION_TEST_VERY_BIG_DOE_FONT_SIZE,
  MOTION_TEST_VERY_BIG_DOE_LINE_HEIGHT,
} from "../constants";
import { getMotionTestGradientTextStyle } from "../gradient-text-style";

type VeryBigWhiteDoeProps = {
  /** Solid white for orange gradient bg; gradient fill on white. */
  variant?: "on-gradient" | "on-white";
  transform?: string;
};

function getVeryBigDoeGradientPaint() {
  const style = getMotionTestGradientTextStyle();

  return {
    background: style.background,
    backgroundSize: style.backgroundSize,
    backgroundPosition: style.backgroundPosition,
    backgroundRepeat: style.backgroundRepeat,
    WebkitBackgroundClip: style.WebkitBackgroundClip,
    backgroundClip: style.backgroundClip,
    color: "transparent" as const,
    WebkitTextFillColor: "transparent" as const,
  };
}

export function VeryBigWhiteDoe({ variant = "on-white", transform }: VeryBigWhiteDoeProps) {
  return (
    <AbsoluteFill className="motion-test-very-big-doe">
      <span
        className={`motion-test-title__label motion-test-title__label--doe motion-test-very-big-doe__word${
          variant === "on-white" ? " motion-test-title__label--gradient" : ""
        }`}
        style={{
          fontSize: MOTION_TEST_VERY_BIG_DOE_FONT_SIZE,
          lineHeight: MOTION_TEST_VERY_BIG_DOE_LINE_HEIGHT,
          ...(variant === "on-gradient" ? { color: "#ffffff" } : getVeryBigDoeGradientPaint()),
          transform,
        }}
      >
        Doe
      </span>
    </AbsoluteFill>
  );
}
