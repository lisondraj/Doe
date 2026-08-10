import { BlogArticleCarouselDivider } from "@/components/blog/BlogArticleCarouselDivider";
import { HeroLinkedInIcon } from "@/components/home/icons/HeroSocialIcons";
import { BROADER_DOE_VISION_BODY_TW } from "@/lib/blog/broader-doe-vision-layout-styles";
import { PREMED_FOUNDERS } from "@/lib/premed/premed-copy";

/** /premed only — offset founder bios with highlighted names and LinkedIn links. */
export function PremedFoundersBlock() {
  return (
    <div className="premed-founders-band">
      <div className="premed-founders-band__divider">
        <BlogArticleCarouselDivider />
      </div>
      <section className="premed-founders-block" aria-label="Founders">
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
      <div className="premed-founders-band__divider">
        <BlogArticleCarouselDivider />
      </div>
    </div>
  );
}
