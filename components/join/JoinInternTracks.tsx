import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { JoinInternTrackCopy } from "@/components/join/JoinInternTrackCopy";
import { JoinInternTrackReveal } from "@/components/join/JoinInternTrackReveal";
import { JOIN_INTERN_TRACKS } from "@/components/join/join-intern-tracks";
import { BLOG_CARD_STACK } from "@/lib/blog/blog-layout-styles";
import { JOIN_AGENTS_GRADIENT } from "@/lib/join/join-agents-gradient";
import {
  JOIN_DESKTOP_TRACK_ROW_CARD_HEIGHT,
  JOIN_DESKTOP_TRACK_ROW_COL_GAP,
  JOIN_DESKTOP_TRACK_ROW_GAP,
  JOIN_MOBILE_CARD_HEIGHT,
  JOIN_MOBILE_TRACK_SECTION,
} from "@/lib/join/join-layout";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
} from "@/lib/doephone/section-styles";
import { inter, suisseIntl } from "@/lib/home/fonts";

const JOIN_MOBILE_TRACK_TITLE_TW = `font-normal leading-[1.08] tracking-[-0.028em] text-[#1E343A] text-[clamp(2rem,1.65rem+1.55vmin,2.55rem)] iphone-page:text-[clamp(2.35rem,1.92rem+2.1vmin,3.05rem)] ${suisseIntl.className}`;

const JOIN_MOBILE_TRACK_DESC_TW = `mt-[clamp(0.75rem,0.55rem+0.75vmin,1.1rem)] text-[clamp(1.32rem,1.1rem+0.95vmin,1.62rem)] iphone-page:text-[clamp(1.55rem,1.28rem+1.18vmin,1.95rem)] font-normal leading-[1.46] tracking-[-0.012em] text-[#1E343A]/72 ${inter.className}`;

const JOIN_DESKTOP_TRACK_TITLE_TW = `font-normal leading-[1.1] tracking-[-0.025em] text-[#1E343A] text-[1.125rem] ${suisseIntl.className}`;

const JOIN_DESKTOP_TRACK_DESC_TW = `mt-2 text-[0.875rem] font-normal leading-[1.44] tracking-[-0.01em] text-[#1E343A]/72 ${inter.className}`;

const JOIN_MOBILE_CARD_STACK = "space-y-5 iphone-page:space-y-[clamp(1.35rem,1.05rem+1.1vmin,2rem)]";

const JOIN_DESKTOP_CARD_STACK = "space-y-3";

export function JoinInternTracks({ variant }: { variant: "mobile" | "desktop" }) {
  const cardHeight = variant === "mobile" ? JOIN_MOBILE_CARD_HEIGHT : JOIN_DESKTOP_TRACK_ROW_CARD_HEIGHT;
  const stackGap = variant === "mobile" ? DOEPHONE_SECTION_CAROUSEL_MENU_GAP : JOIN_DESKTOP_TRACK_ROW_GAP;
  const cardStackClass = variant === "mobile" ? JOIN_MOBILE_CARD_STACK : JOIN_DESKTOP_CARD_STACK;
  const titleClass = variant === "mobile" ? JOIN_MOBILE_TRACK_TITLE_TW : JOIN_DESKTOP_TRACK_TITLE_TW;
  const descClass = variant === "mobile" ? JOIN_MOBILE_TRACK_DESC_TW : JOIN_DESKTOP_TRACK_DESC_TW;

  if (variant === "desktop") {
    return (
      <div
        className={`grid grid-cols-4 ${JOIN_DESKTOP_TRACK_ROW_COL_GAP} ${stackGap}`}
        aria-label="Internship tracks"
      >
        {JOIN_INTERN_TRACKS.map((track) => {
          const isAgentsFill = track.cardFill === "agents";

          return (
            <article key={track.title} className="min-w-0">
              <div className={cardStackClass}>
                <JoinInternTrackReveal
                  variant={variant}
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
                </JoinInternTrackReveal>

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

  return (
    <div className="flex flex-col" aria-label="Internship tracks">
      {JOIN_INTERN_TRACKS.map((track) => {
        const isAgentsFill = track.cardFill === "agents";

        return (
          <article
            key={track.title}
            className={`${stackGap} ${JOIN_MOBILE_TRACK_SECTION} flex flex-col`.trim()}
          >
            <div className={`${cardStackClass} flex min-h-0 flex-1 flex-col`}>
              <JoinInternTrackReveal
                variant={variant}
                className={`relative w-full shrink-0 overflow-hidden ${cardHeight} ${DOEPHONE_SECTION_CAROUSEL_RADIUS} ${
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
              </JoinInternTrackReveal>

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
