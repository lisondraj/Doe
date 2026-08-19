import { dmSans } from "@/lib/home/fonts";
import { STORY_FLOAT_CODES } from "@/lib/story/story-float-visuals";

/** Wide Float tile — three charge tickets, one flagged to confirm. */
export function StoryFloatCodes() {
  return (
    <div className={`story-float-stage story-float-stage--codes ${dmSans.className}`} aria-hidden="true">
      <div className="story-float-codes-grid">
        {STORY_FLOAT_CODES.rows.map((row) => (
          <div
            key={row.id}
            className={`story-float-card story-float-code${row.confirm ? " story-float-code--confirm" : ""}`}
          >
            <span className={`story-float-code__code ${dmSans.className}`}>{row.code}</span>
            <span className="story-float-code__meta">
              <em className={dmSans.className}>{row.hint}</em>
              {row.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
