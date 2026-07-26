"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";

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

/** doehealth.care landing banner — pinned above nav; desktop dismisses after the hero. */
export function DoeHealthTopBanner({
  dismissPastHero = false,
}: {
  dismissPastHero?: boolean;
} = {}) {
  const [dismissed, setDismissed] = useState(false);

  useLayoutEffect(() => {
    if (!dismissPastHero) return undefined;

    const html = document.documentElement;
    let heroEl: HTMLElement | null = null;

    const sync = () => {
      heroEl ??= document.querySelector<HTMLElement>(".doephone-hero-section");
      const pastHero = heroEl
        ? heroEl.getBoundingClientRect().bottom <= 0
        : window.scrollY >= window.innerHeight;

      setDismissed(pastHero);
      if (pastHero) {
        html.setAttribute("data-home-banner-dismissed", "true");
      } else {
        html.removeAttribute("data-home-banner-dismissed");
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      html.removeAttribute("data-home-banner-dismissed");
    };
  }, [dismissPastHero]);

  return (
    <div
      className={`doe-home-top-banner doehealth-top-banner${dismissed ? " doe-home-top-banner--dismissed" : ""}`}
      role="region"
      aria-label="Learn more about Doe's vision"
    >
      <p className={`doe-home-top-banner__text ${inter.className}`}>
        <span>Learn more about Doe&apos;s vision</span>
        <Link href="#doe-vision" className="doe-home-top-banner__link">
          Read more
          <ReadMoreArrow />
        </Link>
      </p>
    </div>
  );
}
