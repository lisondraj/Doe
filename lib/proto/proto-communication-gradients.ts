/** Reception reference palette — reused across section 2 slide shapes. */
export const PROTO_RECEPTION_PALETTE = {
  lightYellow: "#F7E8A8",
  wheat: "#F2CF7A",
  gold: "#E7A944",
  copper: "#C46848",
  blue: "#5A7888",
  deep: "#2A4558",
} as const;

/** Documents crosshatch — shared line overlay for /proto hero + section 2. */
export const PROTO_LINE_GRID = "crosshatch" as const;

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

/** Humira billing — vertical band, full-height stop spacing (cool top → warm bottom). */
const PROTO_HUMIRA_VERTICAL_STOPS = [
  `${PROTO_HUMIRA_COLORS.deep} 0%`,
  `${PROTO_HUMIRA_COLORS.bridgeDeep} 15%`,
  `${PROTO_HUMIRA_COLORS.blue} 32%`,
  `${PROTO_HUMIRA_COLORS.bridgeBlue} 48%`,
  `${PROTO_HUMIRA_COLORS.copper} 62%`,
  `${PROTO_HUMIRA_COLORS.amber} 76%`,
  `${PROTO_HUMIRA_COLORS.gold} 88%`,
  `${PROTO_HUMIRA_COLORS.wheat} 100%`,
].join(", ");

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

/** Patient chart — warm center with expanded light-blue outer ring. */
const PROTO_AMBIENT_RADIAL_STOPS = [
  `${PROTO_RECEPTION_PALETTE.lightYellow} 0%`,
  `${PROTO_HUMIRA_COLORS.bridgeBlue} 20%`,
  `${PROTO_RECEPTION_PALETTE.blue} 38%`,
  `#D2774C 52%`,
  `${PROTO_HUMIRA_COLORS.bridgeBlue} 70%`,
  `${PROTO_RECEPTION_PALETTE.blue} 86%`,
  `${PROTO_RECEPTION_PALETTE.deep} 100%`,
].join(", ");

/** /proto section 2 — home gradient shapes; Reception colours only. */
export const PROTO_COMMUNICATION_GRADIENTS = {
  agents: `radial-gradient(circle at center, ${PROTO_RECEPTION_PALETTE.lightYellow} 0%, ${PROTO_RECEPTION_PALETTE.wheat} 12%, ${PROTO_RECEPTION_PALETTE.gold} 24%, ${PROTO_RECEPTION_PALETTE.copper} 40%, ${PROTO_RECEPTION_PALETTE.blue} 58%, ${PROTO_RECEPTION_PALETTE.blue} 74%, #4A6878 88%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`,
  "front-desk": `radial-gradient(ellipse 100% 88% at 22% 18%, ${PROTO_RECEPTION_PALETTE.gold} 0%, ${PROTO_RECEPTION_PALETTE.copper} 45%, ${PROTO_RECEPTION_PALETTE.blue} 72%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`,
  inbox: `linear-gradient(135deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_RECEPTION_PALETTE.blue} 24%, ${PROTO_RECEPTION_PALETTE.copper} 58%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`,
  ambient: `radial-gradient(circle at center, ${PROTO_AMBIENT_RADIAL_STOPS})`,
  billing: `linear-gradient(180deg, ${PROTO_HUMIRA_VERTICAL_STOPS})`,
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
