import {
  MAIN_PAGE_BEIGE,
  PATIENT_CARE_GREY_GRID_STYLE,
} from "@/lib/main-page-design-backdrop";

export function MainPageDesignBackdrop() {
  return (
    <main
      className="fixed inset-0 min-h-[100dvh] min-w-full overflow-hidden"
      style={{ backgroundColor: MAIN_PAGE_BEIGE }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={PATIENT_CARE_GREY_GRID_STYLE}
        aria-hidden
      />
    </main>
  );
}
