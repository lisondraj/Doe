export type ProductEmrRoute = "dashboard" | "patients" | "chart";

export type ProductEmrNavId = "home" | "patients" | "schedule" | "messages";

export type ProductEmrChartTab = "prep" | "snapshot" | "notes" | "results" | "billing";

export type ProductEmrState = {
  route: ProductEmrRoute;
  navExpanded: boolean;
  activeNav: ProductEmrNavId;
  chartTab: ProductEmrChartTab;
  chatOpen: boolean;
  a1cOpen: boolean;
  noteOpen: boolean;
};

export const PRODUCT_EMR_CANVAS_WIDTH = 1920;
export const PRODUCT_EMR_CANVAS_HEIGHT = 1080;
export const PRODUCT_EMR_RAIL_COLLAPSED = 72;
export const PRODUCT_EMR_RAIL_EXPANDED = 228;
