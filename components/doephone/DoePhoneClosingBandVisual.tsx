import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT } from "@/lib/doephone/closing-section-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { inter } from "@/lib/home/fonts";

/** Join intern track line art — beige card with optional bottom-left caption. */
export function DoePhoneClosingBandVisual({
  graphic,
  title,
  fillHeight = false,
}: {
  graphic: 0 | 1 | 2 | 3;
  title?: string;
  /** Fill parent carousel slide height instead of fixed band height. */
  fillHeight?: boolean;
}) {
  const cardBox = (
    <div
      className={`home-closing-section__card-box relative w-full overflow-hidden border border-[#D9D4CC] bg-[#EBE7E0] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}${
        fillHeight
          ? " home-closing-section__card-box--carousel min-h-0"
          : ` ${DOEPHONE_SECTION_CLOSING_FEATURE_HEIGHT}`
      }`}
    >
      <div className="home-closing-section__card-art pointer-events-none absolute inset-0" aria-hidden>
        <JoinInternLineGraphic variant={graphic} brandAccent />
      </div>
      {!fillHeight && title ? (
        <p className={`home-closing-section__card-caption ${inter.className}`}>{title}</p>
      ) : null}
    </div>
  );

  if (fillHeight) {
    return (
      <div className="home-closing-section__card-shell relative h-full min-h-0 w-full">
        {cardBox}
        {title ? <p className={`home-closing-section__card-caption ${inter.className}`}>{title}</p> : null}
      </div>
    );
  }

  return cardBox;
}
