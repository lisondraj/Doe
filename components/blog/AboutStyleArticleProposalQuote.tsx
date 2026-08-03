import {
  BROADER_DOE_VISION_PROPOSAL_QUOTE_TW,
  BROADER_DOE_VISION_PROPOSAL_QUOTE_WRAP,
} from "@/lib/blog/broader-doe-vision-layout-styles";

type AboutStyleArticleProposalQuoteProps = {
  lead: string;
  continuation: string;
};

/** Indented pull quote — opens before lead, closes after continuation. */
export function AboutStyleArticleProposalQuote({ lead, continuation }: AboutStyleArticleProposalQuoteProps) {
  const trimmedLead = lead.endsWith(".") ? lead.slice(0, -1) : lead;

  return (
    <figure className={BROADER_DOE_VISION_PROPOSAL_QUOTE_WRAP}>
      <blockquote className={BROADER_DOE_VISION_PROPOSAL_QUOTE_TW}>
        <span className="block">&ldquo;{trimmedLead}.</span>
        <span className="block mt-3 iphone-page:mt-3.5">{continuation}&rdquo;</span>
      </blockquote>
    </figure>
  );
}
