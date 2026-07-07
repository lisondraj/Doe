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

/** Thin home announcement strip — darkened overflow field, Doe teal copy. */
export function DoeHomeTopBanner() {
  return (
    <div className="doe-home-top-banner" role="region" aria-label="Company news">
      <p className={`doe-home-top-banner__text ${inter.className}`}>
        <span>We raised a $5M pre-seed round</span>
        <Link href="/blog" className="doe-home-top-banner__link">
          Read more
          <ReadMoreArrow />
        </Link>
      </p>
    </div>
  );
}
