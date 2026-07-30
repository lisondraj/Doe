import { AbsoluteFill } from "remotion";

import {
  MOTION_TEST_VERY_BIG_DOE_FONT_SIZE,
  MOTION_TEST_VERY_BIG_DOE_LINE_HEIGHT,
} from "../constants";
import {
  MOTION_TEST_GRADIENT_TEXT_BROWN_CLASS,
  MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS,
} from "../gradient-text-style";

type VeryBigWhiteDoeProps = {
  /** Gold gradient on brown bg; brown gradient on gold bg. */
  variant?: "on-gradient" | "on-white";
  transform?: string;
};

export function VeryBigWhiteDoe({ variant = "on-white", transform }: VeryBigWhiteDoeProps) {
  const gradientClass =
    variant === "on-gradient"
      ? MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS
      : MOTION_TEST_GRADIENT_TEXT_BROWN_CLASS;

  return (
    <AbsoluteFill className="motion-test-very-big-doe">
      <span
        className={`motion-test-title__label motion-test-title__label--doe motion-test-very-big-doe__word ${gradientClass}`}
        style={{
          fontSize: MOTION_TEST_VERY_BIG_DOE_FONT_SIZE,
          lineHeight: MOTION_TEST_VERY_BIG_DOE_LINE_HEIGHT,
          transform,
        }}
      >
        Doe
      </span>
    </AbsoluteFill>
  );
}
