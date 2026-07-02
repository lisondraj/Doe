/** Reception reference palette — reused across section 2 slide shapes. */
export const PROTO_RECEPTION_PALETTE = {
  lightYellow: "#F7E8A8",
  wheat: "#F2CF7A",
  gold: "#E7A944",
  copper: "#C46848",
  blue: "#5A7888",
  deep: "#2A4558",
} as const;

/** Reception hex grid — same line overlay as the front-desk (The phone won't stop) slide. */
export const PROTO_LINE_GRID = "hex" as const;

/** Humira / TELUS — exact shared colour stops (solid hex). */
export const PROTO_HUMIRA_COLORS = {
  deep: PROTO_RECEPTION_PALETTE.deep,
  bridgeDeep: "#3D6270",
  blue: PROTO_RECEPTION_PALETTE.blue,
  bridgeBlue: "#6A9098",
  copper: PROTO_RECEPTION_PALETTE.copper,
  amber: "#D4893F",
  gold: PROTO_RECEPTION_PALETTE.gold,
  wheat: PROTO_RECEPTION_PALETTE.wheat,
} as const;

/** Agents roster — exact legacy colours; linear 225° (not center radial). */
const PROTO_AGENTS_MID_BLUE = "#4A6878";

/** Every colour in the phone won't stop (front-desk) gradient — shared across billing + integrate. */
const PROTO_RECEPTION_FULL_STOPS = [
  `${PROTO_RECEPTION_PALETTE.lightYellow} 0%`,
  `${PROTO_RECEPTION_PALETTE.wheat} 15%`,
  `${PROTO_RECEPTION_PALETTE.gold} 30%`,
  `${PROTO_RECEPTION_PALETTE.copper} 45%`,
  `${PROTO_RECEPTION_PALETTE.blue} 60%`,
  `${PROTO_AGENTS_MID_BLUE} 75%`,
  `${PROTO_RECEPTION_PALETTE.deep} 100%`,
].join(", ");

const PROTO_AGENTS_GRADIENT = `linear-gradient(225deg, ${PROTO_RECEPTION_FULL_STOPS})`;

/** Prior auth — warm lower-right bloom; full reception sweep (all phone won't stop colours). */
const PROTO_PRIOR_AUTH_GRADIENT = `radial-gradient(ellipse 118% 112% at 72% 88%, ${PROTO_RECEPTION_PALETTE.lightYellow} 0%, ${PROTO_RECEPTION_PALETTE.wheat} 12%, ${PROTO_RECEPTION_PALETTE.gold} 26%, ${PROTO_RECEPTION_PALETTE.copper} 40%, ${PROTO_RECEPTION_PALETTE.blue} 56%, ${PROTO_AGENTS_MID_BLUE} 72%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`;

/** Integrate — horizontal connective band; cool left bloom, warmer center, less yellow on the right. */
const PROTO_INTEGRATE_GRADIENT = `linear-gradient(90deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_HUMIRA_COLORS.bridgeBlue} 18%, ${PROTO_AGENTS_MID_BLUE} 36%, ${PROTO_RECEPTION_PALETTE.blue} 52%, ${PROTO_RECEPTION_PALETTE.copper} 72%, ${PROTO_RECEPTION_PALETTE.gold} 90%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`;

/** Prototype validation — cool upper arc into warm copper/gold. */
const PROTO_PROTOTYPE_GRADIENT = `linear-gradient(160deg, ${PROTO_HUMIRA_COLORS.bridgeBlue} 0%, ${PROTO_RECEPTION_PALETTE.blue} 26%, ${PROTO_RECEPTION_PALETTE.copper} 58%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`;

export const PROTO_PROTOTYPE_BACKDROP = {
  slideIndex: 6,
  label: "Prototype",
  gradient: PROTO_PROTOTYPE_GRADIENT,
  grid: "diagonal" as const,
};

/** Patient chart — Documents palette flipped; warm upper-left → cool edge. */
const PROTO_AMBIENT_RADIAL = `radial-gradient(ellipse 125% 110% at 14% 12%, ${PROTO_RECEPTION_PALETTE.gold} 0%, ${PROTO_RECEPTION_PALETTE.copper} 36%, ${PROTO_RECEPTION_PALETTE.blue} 70%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`;

/** Documents — 135° cool → warm (Documents pile up). */
export const PROTO_DOCUMENTS_GRADIENT = `linear-gradient(135deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_RECEPTION_PALETTE.blue} 24%, ${PROTO_RECEPTION_PALETTE.copper} 58%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`;

/** Hero — Documents palette; light blue anchored to the top-left edge. */
export const PROTO_HERO_GRADIENT = [
  `radial-gradient(ellipse 74% 60% at 0% 0%, ${PROTO_HUMIRA_COLORS.bridgeBlue} 0%, ${PROTO_HUMIRA_COLORS.bridgeBlue} 24%, transparent 70%)`,
  `linear-gradient(135deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_RECEPTION_PALETTE.blue} 22%, ${PROTO_RECEPTION_PALETTE.blue} 48%, ${PROTO_RECEPTION_PALETTE.copper} 78%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`,
].join(", ");

/** Reception — warm upper-left ellipse (The phone won't stop). */
const PROTO_FRONT_DESK_GRADIENT = `radial-gradient(ellipse 100% 88% at 22% 18%, ${PROTO_RECEPTION_PALETTE.gold} 0%, ${PROTO_RECEPTION_PALETTE.copper} 45%, ${PROTO_RECEPTION_PALETTE.blue} 72%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`;

/** /proto section 2 — home gradient shapes; Reception colours only. */
export const PROTO_COMMUNICATION_GRADIENTS = {
  agents: PROTO_AMBIENT_RADIAL,
  "front-desk": PROTO_AGENTS_GRADIENT,
  inbox: PROTO_DOCUMENTS_GRADIENT,
  ambient: PROTO_FRONT_DESK_GRADIENT,
  billing: PROTO_PRIOR_AUTH_GRADIENT,
  prototype: PROTO_PROTOTYPE_GRADIENT,
  integrate: PROTO_INTEGRATE_GRADIENT,
} as const satisfies Record<string, string>;

export type ProtoCommunicationSlideId = keyof typeof PROTO_COMMUNICATION_GRADIENTS;

/** Grid overlays for /proto feature bands. */
export const PROTO_COMMUNICATION_GRIDS: Partial<Record<ProtoCommunicationSlideId, "hex" | "diagonal">> = {
  prototype: "diagonal",
  integrate: "hex",
};

export function protoCommunicationGradient(slideId: string): string | undefined {
  if (slideId in PROTO_COMMUNICATION_GRADIENTS) {
    return PROTO_COMMUNICATION_GRADIENTS[slideId as ProtoCommunicationSlideId];
  }
  return undefined;
}

export function protoCommunicationGrid(slideId: string) {
  if (slideId in PROTO_COMMUNICATION_GRIDS) {
    return PROTO_COMMUNICATION_GRIDS[slideId as ProtoCommunicationSlideId];
  }
  return undefined;
}
