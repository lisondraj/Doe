import Link from "next/link";

import {
  BROADER_DOE_VISION_EARLY_STAGE_INTRO,
  BROADER_DOE_VISION_EARLY_STAGE_LINKS,
} from "@/lib/blog/broader-doe-vision-early-stage-links";
import { BROADER_DOE_VISION_BODY_TW } from "@/lib/blog/broader-doe-vision-layout-styles";

/** Founder's Memo — linked index of early-stage product and Labs articles. */
export function BroaderDoeVisionEarlyStageLinks() {
  return (
    <div className="broader-doe-early-stage-links mt-8 iphone-page:mt-9 space-y-4 iphone-page:space-y-5">
      <p className={BROADER_DOE_VISION_BODY_TW}>{BROADER_DOE_VISION_EARLY_STAGE_INTRO}</p>

      <ul className="broader-doe-early-stage-links__list m-0 list-none space-y-4 iphone-page:space-y-5 p-0">
        {BROADER_DOE_VISION_EARLY_STAGE_LINKS.map((entry) => (
          <li
            key={entry.href}
            className={`broader-doe-early-stage-links__item${entry.indent ? " broader-doe-early-stage-links__item--indent" : ""}`}
          >
            <p className={`${BROADER_DOE_VISION_BODY_TW} !mt-0`}>
              <Link href={entry.href} className="broader-doe-early-stage-links__label">
                {entry.label}
              </Link>
              <span aria-hidden>: </span>
              {entry.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
