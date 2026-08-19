import type { CSSProperties } from "react";

import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { STORY_GENOME_KNOWS } from "@/lib/story/story-genome-visuals";

/** Wide Genome tile — clinic agents running on Harbor Genome. */
export function StoryGenomeAgentCanvas() {
  return (
    <div className={`story-genome-stage story-genome-stage--knows ${dmSans.className}`} aria-hidden="true">
      <div className="story-genome-card story-genome-knows">
        <span className={`story-genome-knows__clinic ${suisseIntl.className}`}>{STORY_GENOME_KNOWS.clinic}</span>

        <ul className="story-genome-knows__layers m-0 list-none p-0">
          {STORY_GENOME_KNOWS.layers.map((layer, index) => (
            <li
              key={layer.id}
              className={`story-genome-knows__layer story-genome-knows__layer--${index + 1}`}
              style={{ "--story-genome-share": `${layer.share}%` } as CSSProperties & { "--story-genome-share": string }}
            >
              <span className={`story-genome-knows__label ${suisseIntl.className}`}>{layer.label}</span>
              <span className={`story-genome-knows__years ${dmSans.className}`}>{layer.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
