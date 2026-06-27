import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT } from "@/lib/doephone/closing-section-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";

/** Join intern track line art — beige fill, sized for closing section cards. */
export function DoePhoneClosingBandVisual({ graphic }: { graphic: 0 | 1 | 2 | 3 }) {
  return (
    <div
      className={`relative w-full overflow-hidden border border-[#D9D4CC] bg-[#EBE7E0] ${DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-hidden
    >
      <JoinInternLineGraphic variant={graphic} />
    </div>
  );
}
