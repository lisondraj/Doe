import { dmSans, inter, suisseIntl } from "@/lib/home/fonts";

const FUNDRAISE_DESCRIPTION =
  "We are meeting with US and Canadian backers who share our vision for provider-built clinical AI.";

/** Bottom-left closing note — open typographic stack, no frame. */
export function DoePhoneClosingFundraiseCallout() {
  return (
    <aside className="home-closing-section__fundraise" aria-label="Fundraising">
      <div className={`home-closing-section__fundraise-status ${dmSans.className}`}>
        <span className="home-closing-section__fundraise-dot" aria-hidden />
        <span className="home-closing-section__fundraise-label">Pre-seed round open</span>
      </div>
      <p className={`home-closing-section__fundraise-headline ${suisseIntl.className}`}>
        <span className="home-closing-section__fundraise-headline-line">We are actively raising</span>
        <span className="home-closing-section__fundraise-headline-line home-closing-section__fundraise-headline-line--accent">
          a pre-seed round.
        </span>
      </p>
      <p className={`home-closing-section__fundraise-description ${inter.className}`}>
        {FUNDRAISE_DESCRIPTION}
      </p>
    </aside>
  );
}
