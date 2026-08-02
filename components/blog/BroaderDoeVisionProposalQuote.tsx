import {
  BROADER_DOE_VISION_PROPOSAL_QUOTE_TW,
  BROADER_DOE_VISION_PROPOSAL_QUOTE_WRAP,
} from "@/lib/blog/broader-doe-vision-layout-styles";
import {
  BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_CONTINUATION,
  BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_LEAD,
} from "@/lib/blog/broader-doe-vision-article";

/** Indented pull quote — opens before lead, closes after continuation. */
export function BroaderDoeVisionProposalQuote() {
  const lead = BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_LEAD.endsWith(".")
    ? BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_LEAD.slice(0, -1)
    : BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_LEAD;

  return (
    <figure className={BROADER_DOE_VISION_PROPOSAL_QUOTE_WRAP}>
      <blockquote className={BROADER_DOE_VISION_PROPOSAL_QUOTE_TW}>
        <span className="block">&ldquo;{lead}.</span>
        <span className="block mt-3 iphone-page:mt-3.5">
          {BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_CONTINUATION}&rdquo;
        </span>
      </blockquote>
    </figure>
  );
}
