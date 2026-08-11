import { BlogArticleCarouselDivider } from "@/components/blog/BlogArticleCarouselDivider";
import { HeroLinkedInIcon } from "@/components/home/icons/HeroSocialIcons";
import {
  BROADER_DOE_VISION_BODY_TW,
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW,
  BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { PREMED_FOUNDERS } from "@/lib/premed/premed-copy";

type PremedFoundersBlockProps = {
  heading?: string;
  showDividers?: boolean;
};

/** /premed + /join — founder bios with highlighted names and LinkedIn links. */
export function PremedFoundersBlock({ heading, showDividers = true }: PremedFoundersBlockProps = {}) {
  return (
    <div className="premed-founders-band">
      {showDividers ? (
        <div className="premed-founders-band__divider">
          <BlogArticleCarouselDivider />
        </div>
      ) : null}
      <section className="premed-founders-block" aria-label={heading ?? "Founders"}>
        {heading ? (
          <p
            className={`premed-founders-block__heading mb-5 iphone-page:mb-6 ${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_TW} ${BROADER_DOE_VISION_THESIS_SECTION_HEADLINE_GOLD_TW}`}
          >
            {heading}
          </p>
        ) : null}
        <div className="premed-founders-block__list">
          {PREMED_FOUNDERS.map((founder) => (
            <p key={founder.name} className={`premed-founders-block__bio ${BROADER_DOE_VISION_BODY_TW}`}>
              <span className="premed-founders-block__name-row">
                <span className="premed-founders-block__name broader-doe-thesis-text">{founder.name}</span>
                <a
                  href={founder.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${founder.name} on LinkedIn`}
                  className="premed-founders-block__linkedin"
                  data-premed-allow-link
                >
                  <HeroLinkedInIcon />
                </a>
              </span>{" "}
              {founder.bio}
            </p>
          ))}
        </div>
      </section>
      {showDividers ? (
        <div className="premed-founders-band__divider">
          <BlogArticleCarouselDivider />
        </div>
      ) : null}
    </div>
  );
}
