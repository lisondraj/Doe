import Link from "next/link";

import { inter } from "@/lib/home/fonts";

function ReadMoreArrow() {
  return (
    <svg
      className="doe-home-top-banner__arrow"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 6h7M6.75 3.25 9.5 6 6.75 8.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Home announcement strip — pinned above nav for the full page scroll. */
export function DoeHomeTopBanner() {
  return (
    <div className="doe-home-top-banner" role="region" aria-label="Meet Doe">
      <p className={`doe-home-top-banner__text ${inter.className}`}>
        <span>Doe has officially launched!</span>
        <Link href="/blog" className="doe-home-top-banner__link">
          Read more
          <ReadMoreArrow />
        </Link>
      </p>
    </div>
  );
}
