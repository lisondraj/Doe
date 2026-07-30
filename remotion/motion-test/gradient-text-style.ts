import type { CSSProperties } from "react";

import { MOTION_TEST_DOE_STACK_OPENING_GRADIENT_TEXT_FRAME } from "./constants";

/** CSS-only gradient clip — never put background/clip in inline styles (breaks Remotion seeks). */
export const MOTION_TEST_GRADIENT_CLIP_CLASS = "motion-test-gradient-text";
export const MOTION_TEST_GRADIENT_TEXT_BROWN_CLASS = "motion-test-gradient-text--brown";
export const MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS = "motion-test-gradient-text--gold";
export const MOTION_TEST_GRADIENT_TEXT_GOLD_CAROUSEL_CLASS =
  "motion-test-gradient-text--gold-carousel";
export const MOTION_TEST_GRADIENT_TEXT_DISCIPLINE_CAROUSEL_CLASS =
  "motion-test-gradient-text--discipline-carousel";
export const MOTION_TEST_GRADIENT_TEXT_DOE_STACK_CLASS = "motion-test-gradient-text--doe-stack";

/** Layout metrics shared by gradient text — safe to apply inline. */
export const MOTION_TEST_GRADIENT_TEXT_LAYOUT: CSSProperties = {
  display: "inline-block",
  overflow: "visible",
  lineHeight: 1.14,
  paddingBlock: "0.12em",
  paddingInline: "0.02em 0.1em",
};

export function motionTestGradientTextClass(
  variant: "brown" | "gold" | "gold-carousel" | "doe-stack",
): string {
  switch (variant) {
    case "gold":
      return MOTION_TEST_GRADIENT_TEXT_GOLD_CLASS;
    case "gold-carousel":
      return MOTION_TEST_GRADIENT_TEXT_GOLD_CAROUSEL_CLASS;
    case "doe-stack":
      return MOTION_TEST_GRADIENT_TEXT_DOE_STACK_CLASS;
    default:
      return MOTION_TEST_GRADIENT_TEXT_BROWN_CLASS;
  }
}

/** Per-layer vertical offset for Doe stack gradient — CSS var only. */
export function getMotionTestDoeStackLayerStyle(
  stackOffset: number,
  stackRadius: number,
): CSSProperties {
  const span = Math.max(stackRadius * 2, 1);
  const positionY = 12 + ((stackOffset + stackRadius) / span) * 76;

  return {
    "--motion-test-stack-gradient-y": `${positionY}%`,
  } as CSSProperties;
}

export function isMotionTestDoeStackOpeningGradientTextFrame(frame: number): boolean {
  return frame === MOTION_TEST_DOE_STACK_OPENING_GRADIENT_TEXT_FRAME;
}

/** @deprecated Use motionTestGradientTextClass("brown") — layout only */
export function getMotionTestGradientTextStyle(): CSSProperties {
  return MOTION_TEST_GRADIENT_TEXT_LAYOUT;
}

/** @deprecated Use motionTestGradientTextClass("gold") — layout only */
export function getMotionTestGoldTextStyle(): CSSProperties {
  return MOTION_TEST_GRADIENT_TEXT_LAYOUT;
}

/** @deprecated Use motionTestGradientTextClass — layout only */
export function getMotionTestGradientTextVisualStyle(): CSSProperties {
  return MOTION_TEST_GRADIENT_TEXT_LAYOUT;
}

/** @deprecated Use motionTestGradientTextClass("gold") — layout only */
export function getMotionTestGoldTextVisualStyle(): CSSProperties {
  return MOTION_TEST_GRADIENT_TEXT_LAYOUT;
}

/** @deprecated Use motionTestGradientTextClass("gold-carousel") — layout only */
export function getMotionTestGoldCarouselTextVisualStyle(): CSSProperties {
  return MOTION_TEST_GRADIENT_TEXT_LAYOUT;
}

/** @deprecated Use motionTestGradientTextClass("doe-stack") — layout only */
export function getMotionTestDoeStackTextStyle(): CSSProperties {
  return MOTION_TEST_GRADIENT_TEXT_LAYOUT;
}

/** @deprecated Use getMotionTestDoeStackLayerStyle */
export function getMotionTestDoeStackLayerTextStyle(
  stackOffset: number,
  stackRadius: number,
): CSSProperties {
  return {
    ...MOTION_TEST_GRADIENT_TEXT_LAYOUT,
    ...getMotionTestDoeStackLayerStyle(stackOffset, stackRadius),
  };
}

/** @deprecated Use getMotionTestDoeStackLayerStyle */
export function getMotionTestOpeningFrameTextStyle(
  stackOffset: number,
  stackRadius: number,
): CSSProperties {
  return getMotionTestDoeStackLayerTextStyle(stackOffset, stackRadius);
}
