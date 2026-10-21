import Link from "next/link";

import type { EarlyPreviewVideo } from "@/lib/earlypreview/earlypreview-videos";
import { p22Mackinac } from "@/lib/home/fonts";

/**
 * The hover card on an /earlypreview video: a soft brown veil with the film's title bottom-left, a link right under
 * the title where the film has an article, and a small play button bottom-right in place of the big centred one.
 * `compact` is for the half-width tiles.
 */
export function EarlyPreviewVideoOverlay({ video, compact = false }: { video: EarlyPreviewVideo; compact?: boolean }) {
  return (
    <div className={`earlypreview-overlay${compact ? " earlypreview-overlay--compact" : ""}`}>
      <div className="earlypreview-overlay__copy">
        <h3 className={`earlypreview-overlay__title ${p22Mackinac.className}`}>
          {video.title.map((line) => (
            <span key={line} className="earlypreview-overlay__line">
              {line}
            </span>
          ))}
        </h3>
        {video.link ? (
          <Link href={video.link.href} className="earlypreview-overlay__link">
            <span className="earlypreview-overlay__label">{video.link.label}</span>
            <span className="earlypreview-overlay__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ) : null}
      </div>
      <span className="earlypreview-overlay__play" aria-hidden="true">
        <svg viewBox="1.35 0 24 24" fill="currentColor">
          <path d="M7.5 4.8v14.4a.9.9 0 0 0 1.37.77l11.3-7.2a.9.9 0 0 0 0-1.54L8.87 4.03A.9.9 0 0 0 7.5 4.8Z" />
        </svg>
      </span>
    </div>
  );
}
