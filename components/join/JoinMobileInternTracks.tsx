import { JoinInternLineGraphic } from "@/components/join/JoinInternLineGraphic";
import { JOIN_INTERN_TRACKS } from "@/components/join/join-intern-tracks";
import { BLOG_CARD_STACK } from "@/lib/blog/blog-layout-styles";
import { JOIN_MOBILE_CARD_HEIGHT } from "@/lib/join/join-mobile-layout";
import {
  DOEPHONE_SECTION_CAROUSEL_MENU_GAP,
  DOEPHONE_SECTION_CAROUSEL_RADIUS,
  DOEPHONE_SECTION_MENU_DESCRIPTION_HEADING_TW,
  DOEPHONE_SECTION_MENU_DESCRIPTION_TW,
} from "@/lib/doephone/section-styles";

export function JoinMobileInternTracks() {
  return (
    <div
      className={`flex flex-col ${DOEPHONE_SECTION_CAROUSEL_MENU_GAP}`}
      aria-label="Internship tracks"
    >
      {JOIN_INTERN_TRACKS.map((track, index) => (
        <article key={track.title} className={index > 0 ? DOEPHONE_SECTION_CAROUSEL_MENU_GAP : undefined}>
          <div className={BLOG_CARD_STACK}>
            <div
              className={`relative w-full overflow-hidden ${JOIN_MOBILE_CARD_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS} border border-[#D9D4CC] bg-[#EBE7E0]`}
            >
              <JoinInternLineGraphic variant={track.graphic} />
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
      ))}
    </div>
  );
}
