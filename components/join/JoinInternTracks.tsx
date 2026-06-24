import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { JOIN_INTERN_TRACKS } from "@/components/join/join-intern-tracks";
import { BLOG_CARD_STACK } from "@/lib/blog/blog-layout-styles";
import { JOIN_AGENTS_GRADIENT } from "@/lib/join/join-agents-gradient";
import {
  JOIN_DESKTOP_CARD_HEIGHT,
  JOIN_DESKTOP_TRACK_GAP,
  JOIN_MOBILE_CARD_HEIGHT,
} from "@/lib/join/join-layout";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_MENU_DESCRIPTION_HEADING_TW,
  DOEPHONE_SECTION_MENU_DESCRIPTION_TW,
} from "@/lib/doephone/section-styles";

export function JoinInternTracks({ variant }: { variant: "mobile" | "desktop" }) {
  const cardHeight = variant === "mobile" ? JOIN_MOBILE_CARD_HEIGHT : JOIN_DESKTOP_CARD_HEIGHT;
  const sectionGap = variant === "mobile" ? DOEPHONE_SECTION_CAROUSEL_MENU_GAP : JOIN_DESKTOP_TRACK_GAP;
  const stackGap = variant === "mobile" ? sectionGap : JOIN_DESKTOP_TRACK_GAP;

  return (
    <div className={`flex flex-col ${sectionGap}`} aria-label="Internship tracks">
      {JOIN_INTERN_TRACKS.map((track, index) => {
        const isAgentsFill = track.cardFill === "agents";

        return (
          <article key={track.title} className={index > 0 ? stackGap : undefined}>
            <div className={BLOG_CARD_STACK}>
              <div
                className={`relative w-full overflow-hidden ${cardHeight} ${DOEPHONE_SECTION_CAROUSEL_RADIUS} ${
                  isAgentsFill ? "" : "border border-[#D9D4CC] bg-[#EBE7E0]"
                }`}
              >
                {isAgentsFill ? (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: JOIN_AGENTS_GRADIENT }}
                    aria-hidden
                  />
                ) : null}
                <JoinInternLineGraphic variant={track.graphic} onOrange={isAgentsFill} />
              </div>

              <div>
                <h3 className={DOEPHONE_SECTION_MENU_DESCRIPTION_HEADING_TW}>{track.title}</h3>
                <p className={DOEPHONE_SECTION_MENU_DESCRIPTION_TW}>
                  {track.description.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
