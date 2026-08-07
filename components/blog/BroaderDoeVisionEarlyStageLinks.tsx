import Link from "next/link";

import {
  BROADER_DOE_VISION_EARLY_STAGE_ENTRIES,
  BROADER_DOE_VISION_EARLY_STAGE_INTRO,
} from "@/lib/blog/broader-doe-vision-early-stage-links";

/** Founder's Memo — linked index of early-stage product and Labs articles. */
export function BroaderDoeVisionEarlyStageLinks() {
  return (
    <div className="broader-doe-early-stage-links mt-8 iphone-page:mt-9">
      <p className="broader-doe-early-stage-links__intro">{BROADER_DOE_VISION_EARLY_STAGE_INTRO}</p>

      <ul className="broader-doe-early-stage-links__list m-0 list-none p-0">
        {BROADER_DOE_VISION_EARLY_STAGE_ENTRIES.map((entry) => {
          if (entry.kind === "note") {
            return (
              <li key={entry.id} className="broader-doe-early-stage-links__item broader-doe-early-stage-links__item--note">
                <p className="broader-doe-early-stage-links__note">{entry.text}</p>
              </li>
            );
          }

          const { link } = entry;

          return (
            <li
              key={entry.id}
              className={`broader-doe-early-stage-links__item${link.nested ? " broader-doe-early-stage-links__item--nested" : ""}`}
            >
              <p className="broader-doe-early-stage-links__entry">
                <Link href={link.href} className="broader-doe-early-stage-links__label">
                  {link.label}
                </Link>
                <span className="broader-doe-early-stage-links__separator" aria-hidden>
                  :
                </span>{" "}
                <span className="broader-doe-early-stage-links__description">{link.description}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
