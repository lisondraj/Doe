import { DOEPHONE_DISPLAY_WEIGHT_TW } from "@/lib/doephone/section-styles";
import { suisseIntl } from "@/lib/home/fonts";

export type StoryMeetDoeCornerLabelCorner = "top-left" | "bottom-left" | "bottom-right";

/** Big gold corner title — matches Pulse label styling on Meet Doe tiles. */
export function StoryMeetDoeCornerLabel({
  label,
  corner,
  tone = "gold",
}: {
  label: string;
  corner: StoryMeetDoeCornerLabelCorner;
  tone?: "gold" | "brown";
}) {
  return (
    <p
      className={`story-meet-doe-corner-label story-meet-doe-corner-label--${corner}${tone === "brown" ? " story-meet-doe-corner-label--brown" : ""} doehealth-hero-headline ${DOEPHONE_DISPLAY_WEIGHT_TW} ${suisseIntl.className}`}
      aria-hidden="true"
    >
      {label}
    </p>
  );
}
