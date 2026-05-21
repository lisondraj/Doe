/** Quality orbit diagram constants (between workflow carousel and vertical bento). */

/** Six rounded tiles around the quality headline (percent positions; viewBox 400×400). */
export const QUALITY_ORBIT_ANCHORS_PCT: ReadonlyArray<{ leftPct: number; topPct: number }> = [
  { leftPct: 50, topPct: 9 },
  { leftPct: 81, topPct: 28.75 },
  { leftPct: 81, topPct: 71.25 },
  { leftPct: 50, topPct: 91 },
  { leftPct: 19, topPct: 71.25 },
  { leftPct: 19, topPct: 28.75 },
];
/** Ovular connector (ellipse in 400×400 viewBox) — hugs the wider tile ring. */
export const QUALITY_ORBIT_CONNECTOR_RX = 134;
export const QUALITY_ORBIT_CONNECTOR_RY = 162;
/** Gradient fill applied to each orbit tile (lighter original palette). */
export const QUALITY_ORBIT_TILE_FILL =
  "linear-gradient(135deg, #E7A944 0%, #D49D4F 28%, #D2774C 62%, #b84e2e 100%)";

/** Ovular connector split into arcs (SVG 400² viewBox) — drawn from apex down both sides simultaneously. */
export const QUALITY_ORBIT_ARC_TOP_Y = 200 - QUALITY_ORBIT_CONNECTOR_RY;
export const QUALITY_ORBIT_ARC_BOTTOM_Y = 200 + QUALITY_ORBIT_CONNECTOR_RY;
export const QUALITY_ORBIT_ARC_RIGHT_D = `M 200 ${QUALITY_ORBIT_ARC_TOP_Y} A ${QUALITY_ORBIT_CONNECTOR_RX} ${QUALITY_ORBIT_CONNECTOR_RY} 0 0 1 200 ${QUALITY_ORBIT_ARC_BOTTOM_Y}`;
export const QUALITY_ORBIT_ARC_LEFT_D = `M 200 ${QUALITY_ORBIT_ARC_TOP_Y} A ${QUALITY_ORBIT_CONNECTOR_RX} ${QUALITY_ORBIT_CONNECTOR_RY} 0 0 0 200 ${QUALITY_ORBIT_ARC_BOTTOM_Y}`;

/** Short captions inside each orbit tile (clockwise from top). */
export const QUALITY_ORBIT_TILE_LABELS = [
  ["AI Inbox"],
  ["Receptionist"],
  ["Appointment", "Assist"],
  ["Auto-Billing"],
  ["Multi-Specialty"],
  ["Patient Facing"],
] as const;

export const QUALITY_ORBIT_CHOREO_HEADLINE_DELAY_MS = 120;
export const QUALITY_ORBIT_CHOREO_DIAGRAM_DELAY_MS = 920;
/** Grey connector stroke-dash animation duration — keep in sync with SVG transition below */
export const QUALITY_ORBIT_GREY_ARC_DRAW_MS = 3200;
export const QUALITY_ORBIT_CHOREO_ACCENT_AFTER_GREY_MS = 180;
/** Brief hold after the section enters view before headline / diagram animations begin. */
export const QUALITY_ORBIT_CHOREO_ENTER_PAUSE_MS = 650;
/** Tiles appear clockwise from top (index 0); gap between each tile reveal. */
export const QUALITY_ORBIT_TILE_FIRST_MS = 360;
export const QUALITY_ORBIT_TILE_STEP_MS = 600;

/** Orbit choreography IO: require this much of the section vertically visible (px), capped for tall viewports */
export function qualityOrbitIntersectionMinVisiblePx(viewportHeight: number): number {
  return Math.min(200, Math.max(120, viewportHeight * 0.17));
}
