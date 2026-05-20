import type { CSSProperties } from "react";

/** Main `page.tsx` canvas — off-white beige. */
export const MAIN_PAGE_BEIGE = "#F7F6F3";

const GREY_GRID_CELL_PX = 80;

/** Square grid from “Only high-quality patient care” (`qualityOrbitSectionGridPattern`). */
const patientCareGreyGridSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${GREY_GRID_CELL_PX}" height="${GREY_GRID_CELL_PX}"><path d="M 0 0 L 80 0 M 0 0 L 0 80" fill="none" stroke="#999999" stroke-width="0.5" opacity="0.28"/><circle cx="0" cy="0" r="1" fill="#999999" opacity="0.35"/><circle cx="80" cy="0" r="1" fill="#999999" opacity="0.35"/><circle cx="0" cy="80" r="1" fill="#999999" opacity="0.35"/><circle cx="80" cy="80" r="1" fill="#999999" opacity="0.35"/></svg>`,
);

export const PATIENT_CARE_GREY_GRID_STYLE: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,${patientCareGreyGridSvg}")`,
  backgroundSize: `${GREY_GRID_CELL_PX}px ${GREY_GRID_CELL_PX}px`,
};
