/** Doe beige, the same tone as the icon and banner exports. */
export const MARKETING_BLANK_BACKGROUND = "#F4EEDF";

/** Full-viewport plain beige page with nothing else on it. */
export function MarketingBlankPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: MARKETING_BLANK_BACKGROUND,
      }}
    />
  );
}
