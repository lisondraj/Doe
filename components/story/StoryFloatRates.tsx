import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_FLOAT_RATES } from "@/lib/story/story-float-visuals";

/** Wide Float tile — three payer shortfalls, dispute on the worst. */
export function StoryFloatRates() {
  return (
    <div className={`story-float-stage story-float-stage--rates ${dmSans.className}`} aria-hidden="true">
      <div className="story-float-rates-grid">
        {STORY_FLOAT_RATES.rows.map((row) => (
          <div
            key={row.id}
            className={`story-float-card story-float-rate${row.dispute ? " story-float-rate--dispute" : ""}`}
          >
            <span className={`story-float-rate__name ${suisseIntl.className}`}>{row.name}</span>
            <span className={`story-float-rate__delta ${dmSans.className}`}>{row.delta}</span>
            <span className={`story-float-rate__paid ${dmSans.className}`}>
              {row.paid}
              <em>{row.of}</em>
            </span>
            {row.dispute ? <span className="story-float-rate__flag">Dispute</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
