function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Whole-word tangent tilt — bends with the portal edge without per-char layout breaks. */
export function getMotionTestFinaleAudienceCarouselRowTiltDeg(
  wordY: number,
  circleRadius: number,
  circleCenterY: number,
): number {
  const dy = wordY - circleCenterY;
  return Math.asin(clamp(dy / circleRadius, -0.9, 0.9)) * (180 / Math.PI) * 0.45;
}
