/** Reception reference palette — reused across section 2 slide shapes. */
export const PROTO_RECEPTION_PALETTE = {
  gold: "#E7A944",
  copper: "#C46848",
  blue: "#5A7888",
  deep: "#2A4558",
} as const;

/** Documents crosshatch — shared line overlay for /proto hero + section 2. */
export const PROTO_LINE_GRID = "crosshatch" as const;

/** /proto section 2 — home gradient shapes; Reception colours only. */
export const PROTO_COMMUNICATION_GRADIENTS = {
  agents: `radial-gradient(circle at center, ${PROTO_RECEPTION_PALETTE.gold} 0%, ${PROTO_RECEPTION_PALETTE.copper} 58%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`,
  "front-desk": `radial-gradient(ellipse 100% 88% at 22% 18%, ${PROTO_RECEPTION_PALETTE.gold} 0%, ${PROTO_RECEPTION_PALETTE.copper} 45%, ${PROTO_RECEPTION_PALETTE.blue} 72%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`,
  inbox: `linear-gradient(135deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_RECEPTION_PALETTE.blue} 24%, ${PROTO_RECEPTION_PALETTE.copper} 58%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`,
  ambient: `radial-gradient(circle at center, ${PROTO_RECEPTION_PALETTE.gold} 0%, ${PROTO_RECEPTION_PALETTE.copper} 42%, ${PROTO_RECEPTION_PALETTE.deep} 100%)`,
  billing: `linear-gradient(180deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_RECEPTION_PALETTE.blue} 20%, ${PROTO_RECEPTION_PALETTE.copper} 55%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`,
  integrate: `linear-gradient(90deg, ${PROTO_RECEPTION_PALETTE.deep} 0%, ${PROTO_RECEPTION_PALETTE.blue} 42%, ${PROTO_RECEPTION_PALETTE.gold} 100%)`,
} as const satisfies Record<string, string>;

export type ProtoCommunicationSlideId = keyof typeof PROTO_COMMUNICATION_GRADIENTS;

export function protoCommunicationGradient(slideId: string): string | undefined {
  if (slideId in PROTO_COMMUNICATION_GRADIENTS) {
    return PROTO_COMMUNICATION_GRADIENTS[slideId as ProtoCommunicationSlideId];
  }
  return undefined;
}
