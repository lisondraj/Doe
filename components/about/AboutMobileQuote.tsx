import {
  ABOUT_MOBILE_ARTICLE_QUOTE_ATTRIBUTION_TW,
  ABOUT_MOBILE_ARTICLE_QUOTE_TW,
} from "@/lib/about/about-layout-styles";

/** iPhone /about — pull quote matching former full-article styling. */
export function AboutMobileQuote({
  text,
  attribution,
}: {
  text: string;
  attribution?: string;
}) {
  const parts = text.split(/\.\s+/);
  const [firstSentence, ...rest] = parts;
  const restText = rest.join(". ");

  return (
    <figure>
      <blockquote className={ABOUT_MOBILE_ARTICLE_QUOTE_TW}>
        <span className="block">&ldquo;{firstSentence}.</span>
        {restText ? <span className="block">{restText}&rdquo;</span> : null}
      </blockquote>
      {attribution ? (
        <figcaption className={ABOUT_MOBILE_ARTICLE_QUOTE_ATTRIBUTION_TW}>{attribution}</figcaption>
      ) : null}
    </figure>
  );
}
