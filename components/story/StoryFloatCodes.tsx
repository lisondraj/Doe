import type { CSSProperties } from "react";

import { dmSans } from "@/lib/home/fonts";
import { STORY_FLOAT_CODES } from "@/lib/story/story-float-visuals";

/** Wide Float tile — three charge cards from this visit, one flagged to confirm. */
export function StoryFloatCodes() {
  return (
    <div className={`story-float-stage story-float-stage--codes ${dmSans.className}`} aria-hidden="true">
      <div className="story-float-codes-grid">
        {STORY_FLOAT_CODES.rows.map((row) => (
          <div
            key={row.id}
            className={`story-float-card story-float-code${row.confirm ? " story-float-code--confirm" : ""}`}
          >
            <span className={`story-float-code__hint ${dmSans.className}`}>{row.hint}</span>
            <p className={`story-float-code__code m-0 ${dmSans.className}`}>{row.code}</p>
            <span className={`story-float-code__label ${dmSans.className}`}>{row.label}</span>
            <span
              className="story-float-code__bar"
              style={{ "--story-float-code-bar": `${row.bar}%` } as CSSProperties & { "--story-float-code-bar": string }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
