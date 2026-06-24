import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { JoinInternTrackCopy } from "@/components/join/JoinInternTrackCopy";
import { JOIN_INTERN_TRACKS } from "@/components/join/join-intern-tracks";
import { BLOG_CARD_STACK } from "@/lib/blog/blog-layout-styles";
import { JOIN_AGENTS_GRADIENT } from "@/lib/join/join-agents-gradient";
import {
  JOIN_DESKTOP_CARD_HEIGHT,
  JOIN_DESKTOP_TRACK_GAP,
  JOIN_MOBILE_CARD_HEIGHT,
  JOIN_MOBILE_TRACK_SECTION,
} from "@/lib/join/join-layout";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_MENU_DESCRIPTION_HEADING_TW,
  DOEPHONE_SECTION_MENU_DESCRIPTION_TW,
} from "@/lib/doephone/section-styles";
import { inter, suisseIntl } from "@/lib/home/fonts";

const JOIN_MOBILE_TRACK_TITLE_TW = `font-normal leading-[1.08] tracking-[-0.028em] text-[#1E343A] text-[clamp(2rem,1.65rem+1.55vmin,2.55rem)] iphone-page:text-[clamp(2.35rem,1.92rem+2.1vmin,3.05rem)] ${suisseIntl.className}`;

const JOIN_MOBILE_TRACK_DESC_TW = `mt-[clamp(0.75rem,0.55rem+0.75vmin,1.1rem)] text-[clamp(1.32rem,1.1rem+0.95vmin,1.62rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.18vmin,1.95rem)] font-normal leading-[1.46] tracking-[-0.012em] text-[#1E343A]/72 ${inter.className}`;

const JOIN_MOBILE_CARD_STACK = "space-y-5 iphone-page:space-y-[clamp(1.35rem,1.05rem+1.1vmin,2rem)]";

export function JoinInternTracks({ variant }: { variant: "mobile" | "desktop" }) {
  const cardHeight = variant === "mobile" ? JOIN_MOBILE_CARD_HEIGHT : JOIN_DESKTOP_CARD_HEIGHT;
  const sectionGap = variant === "mobile" ? DOEPHONE_SECTION_CAROUSEL_MENU_GAP : JOIN_DESKTOP_TRACK_GAP;
  const stackGap = variant === "mobile" ? sectionGap : JOIN_DESKTOP_TRACK_GAP;
  const cardStackClass = variant === "mobile" ? JOIN_MOBILE_CARD_STACK : BLOG_CARD_STACK;
  const titleClass =
    variant === "mobile" ? JOIN_MOBILE_TRACK_TITLE_TW : DOEPHONE_SECTION_MENU_DESCRIPTION_HEADING_TW;
  const descClass =
    variant === "mobile" ? JOIN_MOBILE_TRACK_DESC_TW : DOEPHONE_SECTION_MENU_DESCRIPTION_TW;

  return (
    <div className={`flex flex-col ${sectionGap}`} aria-label="Internship tracks">
      {JOIN_INTERN_TRACKS.map((track, index) => {
        const isAgentsFill = track.cardFill === "agents";

        return (
          <article
            key={track.title}
            className={`${index > 0 ? stackGap : ""} ${variant === "mobile" ? `${JOIN_MOBILE_TRACK_SECTION} flex flex-col` : ""}`.trim()}
          >
            <div className={`${cardStackClass} ${variant === "mobile" ? "flex min-h-0 flex-1 flex-col" : ""}`}>
              <div
                className={`relative w-full overflow-hidden ${cardHeight} ${DOEPHONE_SECTION_CAROUSEL_RADIUS} ${
                  variant === "mobile" ? "shrink-0" : ""
                } ${isAgentsFill ? "" : "border border-[#D9D4CC] bg-[#EBE7E0]"}`}
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

              <JoinInternTrackCopy
                variant={variant}
                title={track.title}
                description={track.description}
                titleClass={titleClass}
                descClass={descClass}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
