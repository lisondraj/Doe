import Link from "next/link";

import type { CinemaCaption } from "@/lib/earlypreview/use-film-cinema";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/**
 * The playing film's title and article link, on the black above it in cinema mode (shown by earlypreview-cinema.css while
 * the page has `data-cinema`). The same words the film's hover card shows.
 */
export function EarlyPreviewCinemaCaption({ caption }: { caption: CinemaCaption | null }) {
  return (
    <div className={`earlypreview-cinema-caption ${inter.className}`} data-cinema-keep aria-hidden={caption ? undefined : true}>
      {caption ? (
        <>
          <h3 className={`earlypreview-cinema-caption__title ${p22Mackinac.className}`}>
            {caption.title.map((line) => (
              <span key={line} className="earlypreview-cinema-caption__line">
                {line}
              </span>
            ))}
          </h3>
          {caption.href ? (
            <Link href={caption.href} className="earlypreview-cinema-caption__link">
              <span className="earlypreview-cinema-caption__label">{caption.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
