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

const PROTO_AGENTS_GRADIENT = `linear-gradient(225deg, ${PROTO_RECEPTION_PALETTE.lightYellow} 0%, ${PROTO_RECEPTION_PALETTE.wheat} 15%, ${PROTO_RECEPTION_PALETTE.gold} 30%, ${PROTO_RECEPTION_PALETTE.copper} 45%, ${PROTO_RECEPTION_PALETTE.blue} 60%, ${PROTO_AGENTS_MID_BLUE} 75%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`;

/** Prior auth — all 8 Humira colours; radial from upper-right (not vertical / horizontal). */
const PROTO_HUMIRA_PRIOR_AUTH_GRADIENT = `radial-gradient(ellipse 118% 112% at 78% 16%, ${PROTO_HUMIRA_COLORS.deep} 0%, ${PROTO_HUMIRA_COLORS.bridgeDeep} 13%, ${PROTO_HUMIRA_COLORS.blue} 26%, ${PROTO_HUMIRA_COLORS.bridgeBlue} 39%, ${PROTO_HUMIRA_COLORS.copper} 52%, ${PROTO_HUMIRA_COLORS.amber} 65%, ${PROTO_HUMIRA_COLORS.gold} 78%, ${PROTO_HUMIRA_COLORS.wheat} 100%)`;

/** TELUS EMR — same Humira palette, compressed for shorter horizontal band (cool left → warm right). */
const PROTO_HUMIRA_HORIZONTAL_STOPS = [
  `${PROTO_HUMIRA_COLORS.deep} 0%`,
  `${PROTO_HUMIRA_COLORS.bridgeDeep} 6%`,
  `${PROTO_HUMIRA_COLORS.blue} 18%`,
  `${PROTO_HUMIRA_COLORS.bridgeBlue} 36%`,
  `${PROTO_HUMIRA_COLORS.copper} 52%`,
  `${PROTO_HUMIRA_COLORS.amber} 66%`,
  `${PROTO_HUMIRA_COLORS.gold} 82%`,
  `${PROTO_HUMIRA_COLORS.wheat} 100%`,
].join(", ");

/** Patient chart — Documents palette flipped; warm upper-left → cool edge. */
const PROTO_AMBIENT_RADIAL = `radial-gradient(ellipse 125% 110% at 14% 12%, ${PROTO_RECEPTION_PALETTE.gold} 0%, ${PROTO_RECEPTION_PALETTE.copper} 36%, ${PROTO_RECEPTION_PALETTE.blue} 70%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`;

/** Documents — 135° cool → warm (Documents pile up). */
export const PROTO_DOCUMENTS_GRADIENT = `linear-gradient(135deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_RECEPTION_PALETTE.blue} 24%, ${PROTO_RECEPTION_PALETTE.copper} 58%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`;

/** Hero — Documents palette; light blue anchored to the top-left edge. */
export const PROTO_HERO_GRADIENT = [
  `radial-gradient(ellipse 72% 58% at 0% 0%, ${PROTO_HUMIRA_COLORS.bridgeBlue} 0%, transparent 68%)`,
  `linear-gradient(135deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_RECEPTION_PALETTE.blue} 18%, ${PROTO_RECEPTION_PALETTE.blue} 56%, ${PROTO_RECEPTION_PALETTE.copper} 74%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`,
].join(", ");

/** Reception — warm upper-left ellipse (The phone won't stop). */
const PROTO_FRONT_DESK_GRADIENT = `radial-gradient(ellipse 100% 88% at 22% 18%, ${PROTO_RECEPTION_PALETTE.gold} 0%, ${PROTO_RECEPTION_PALETTE.copper} 45%, ${PROTO_RECEPTION_PALETTE.blue} 72%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`;

/** /proto section 2 — home gradient shapes; Reception colours only. */
export const PROTO_COMMUNICATION_GRADIENTS = {
  agents: PROTO_AMBIENT_RADIAL,
  "front-desk": PROTO_AGENTS_GRADIENT,
  inbox: PROTO_DOCUMENTS_GRADIENT,
  ambient: PROTO_FRONT_DESK_GRADIENT,
  billing: PROTO_HUMIRA_PRIOR_AUTH_GRADIENT,
  integrate: `linear-gradient(90deg, ${PROTO_HUMIRA_HORIZONTAL_STOPS})`,
} as const satisfies Record<string, string>;

export type ProtoCommunicationSlideId = keyof typeof PROTO_COMMUNICATION_GRADIENTS;

/** Integrate matches Humira hex overlay — same as billing screenshot. */
export const PROTO_COMMUNICATION_GRIDS: Partial<Record<ProtoCommunicationSlideId, "hex">> = {
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
