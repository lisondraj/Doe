import {
  PROTO_INVEST_QUOTE_ATTRIBUTION_TW,
  PROTO_INVEST_QUOTE_TW,
} from "@/lib/proto-invest/proto-invest-layout-styles";

/** /proto-invest — pull quote with proto typography. */
export function ProtoInvestMobileQuote({
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
      <blockquote className={PROTO_INVEST_QUOTE_TW}>
        <span className="block">&ldquo;{firstSentence}.</span>
        {restText ? <span className="block">{restText}&rdquo;</span> : null}
      </blockquote>
      {attribution ? (
        <figcaption className={PROTO_INVEST_QUOTE_ATTRIBUTION_TW}>{attribution}</figcaption>
      ) : null}
    </figure>
  );
}
