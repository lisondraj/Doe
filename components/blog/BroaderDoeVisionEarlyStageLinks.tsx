import Link from "next/link";

import {
  BROADER_DOE_VISION_EARLY_STAGE_INTRO,
  BROADER_DOE_VISION_EARLY_STAGE_LINKS,
} from "@/lib/blog/broader-doe-vision-early-stage-links";

/** Founder's Memo — linked index of early-stage product and Labs articles. */
export function BroaderDoeVisionEarlyStageLinks() {
  return (
    <div className="broader-doe-early-stage-links mt-8 iphone-page:mt-9">
      <p className="broader-doe-early-stage-links__intro">{BROADER_DOE_VISION_EARLY_STAGE_INTRO}</p>

      <ul className="broader-doe-early-stage-links__list m-0 list-none p-0">
        {BROADER_DOE_VISION_EARLY_STAGE_LINKS.map((entry) => (
          <li
            key={entry.href}
            className={`broader-doe-early-stage-links__item${entry.nested ? " broader-doe-early-stage-links__item--nested" : ""}`}
          >
            <p className="broader-doe-early-stage-links__entry">
              <Link href={entry.href} className="broader-doe-early-stage-links__label">
                {entry.label}
              </Link>
              <span className="broader-doe-early-stage-links__separator" aria-hidden>
                :
              </span>{" "}
              <span className="broader-doe-early-stage-links__description">{entry.description}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
