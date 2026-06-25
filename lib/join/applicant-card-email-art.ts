/** Beige converging lines — full bleed inside the apply card (matches JoinInternLineGraphic variant 2). */
const LINE_SOFT = "#C9C0B4";
const LINE = "#B5AA9C";
const LINE_STRONG = "#9A8F82";
const ACCENT = "#C47A5A";

function convergingLinePath(
  offset: number,
  index: number,
  edgeX: number,
  farX: number,
  cpNear: number,
  cpFar: number,
  cy: number,
): string {
  const yAtEdge = cy + offset;
  const yAtCenter = cy + (offset > 0 ? 5 : offset < 0 ? -5 : 0) * (Math.abs(offset) / 52);
  return `M ${edgeX},${yAtEdge} C ${cpNear},${yAtEdge} 168,${yAtCenter} 200,${yAtCenter} C 232,${yAtCenter} ${cpFar},${yAtEdge} ${farX},${yAtEdge}`;
}

function convergingLineStyle(offset: number, index: number): { stroke: string; strokeWidth: string } {
  const isCenter = index === 6;
  const stroke = isCenter
    ? ACCENT
    : Math.abs(offset) > 36
      ? LINE_SOFT
      : index % 3 === 0
        ? LINE_STRONG
        : LINE;
  const strokeWidth = isCenter ? "1.35" : Math.abs(offset) > 40 ? "0.58" : "0.72";
  return { stroke, strokeWidth };
}

export function buildApplicantCardEmailLineArt(width = 560, height = 240): string {
  const cy = 200;
  const offsets = [-52, -40, -28, -18, -9, -3, 0, 3, 9, 18, 28, 40, 52];
  const edgeX = 0;
  const farX = 400;
  const cpNear = 96;
  const cpFar = 304;

  const paths = offsets
    .map((offset, index) => {
      const { stroke, strokeWidth } = convergingLineStyle(offset, index);
      return `<path d="${convergingLinePath(offset, index, edgeX, farX, cpNear, cpFar, cy)}" stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" />`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true" style="display:block;width:100%;max-width:${width}px;height:${height}px;">${paths}</svg>`;
}

export const APPLICANT_CARD_EMAIL_FONTS = {
  lora: "'Lora', Georgia, 'Times New Roman', Times, serif",
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
} as const;

export const APPLICANT_CARD_FROM_EMAIL = "James <james@doe.care>";
