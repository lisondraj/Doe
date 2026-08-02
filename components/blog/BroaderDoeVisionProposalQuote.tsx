import { lora } from "@/lib/home/fonts";
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
    <figure className="ml-[clamp(1.35rem,1.05rem+1.35vmin,2.15rem)] max-w-[calc(100%-clamp(1.35rem,1.05rem+1.35vmin,2.15rem))]">
      <blockquote
        className={`about-page-quote text-left font-normal leading-[1.32] tracking-[-0.02em] text-[clamp(1.28rem,1.08rem+0.95vmin,1.55rem)] iphone-page:text-[clamp(1.42rem,1.18rem+1.1vmin,1.72rem)] ${lora.className}`}
      >
        <span className="block">&ldquo;{lead}.</span>
        <span className="block mt-3 iphone-page:mt-3.5">
          {BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_CONTINUATION}&rdquo;
        </span>
      </blockquote>
    </figure>
  );
}
