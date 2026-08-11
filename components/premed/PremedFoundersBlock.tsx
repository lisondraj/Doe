import { BlogArticleCarouselDivider } from "@/components/blog/BlogArticleCarouselDivider";
import { HeroLinkedInIcon } from "@/components/home/icons/HeroSocialIcons";
import { dmSans } from "@/lib/home/fonts";
import {
  BROADER_DOE_VISION_BODY_TW,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import { PREMED_FOUNDERS } from "@/lib/premed/premed-copy";

type PremedFoundersBlockProps = {
  heading?: string;
  headingClassName?: string;
  showDividers?: boolean;
  showTopDivider?: boolean;
};

/** /premed + /join — founder bios with highlighted names and LinkedIn links. */
export function PremedFoundersBlock({
  heading,
  headingClassName = "",
  showDividers = true,
  showTopDivider = false,
}: PremedFoundersBlockProps = {}) {
  return (
    <div className="premed-founders-band">
      {showDividers || showTopDivider ? (
        <div className="premed-founders-band__divider">
          <BlogArticleCarouselDivider />
        </div>
      ) : null}
      <section className="premed-founders-block" aria-label={heading ?? "Founders"}>
        {heading ? (
          <h2
            className={`premed-founders-block__heading broader-doe-thesis-headline broader-doe-thesis-headline-gold mb-5 font-medium leading-[1.12] tracking-[-0.02em] iphone-page:mb-6 ${dmSans.className} ${headingClassName}`}
          >
            {heading}
          </h2>
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
