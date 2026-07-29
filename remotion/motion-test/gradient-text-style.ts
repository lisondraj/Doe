import type { CSSProperties } from "react";

import { MOTION_TEST_GRADIENT_TEXT_GRADIENT } from "./constants";

/** Visual-only gradient clip — layout metrics live on phrase CSS classes. */
export const MOTION_TEST_GRADIENT_TEXT_VISUAL_STYLE: CSSProperties = {
  background: MOTION_TEST_GRADIENT_TEXT_GRADIENT,
  backgroundSize: "100% 145%",
  backgroundPosition: "50% 18%",
  backgroundRepeat: "no-repeat",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

/** Text-local clip gradient — radial orange spotlight flowing into red. */
export const MOTION_TEST_GRADIENT_TEXT_STYLE: CSSProperties = {
  ...MOTION_TEST_GRADIENT_TEXT_VISUAL_STYLE,
  display: "inline-block",
  overflow: "visible",
  lineHeight: 1.14,
  paddingBlock: "0.12em",
  paddingInline: "0.02em 0.1em",
};

export function getMotionTestGradientTextVisualStyle(): CSSProperties {
  return MOTION_TEST_GRADIENT_TEXT_VISUAL_STYLE;
}

/** Text-local clip gradient — radial orange spotlight flowing into red. */
export function getMotionTestGradientTextStyle(): CSSProperties {
  return MOTION_TEST_GRADIENT_TEXT_STYLE;
}
