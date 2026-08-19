"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DoeLinkArrow } from "@/components/shared/DoeLinkArrow";
import { inter } from "@/lib/home/fonts";

/** Home announcement strip — pinned above nav; desktop dismisses after the hero. */
export function DoeHomeTopBanner({
  dismissPastHero = false,
}: {
  /** Desktop home — slide away once the hero scrolls out of view. */
  dismissPastHero?: boolean;
} = {}) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
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
      className={`doe-home-top-banner${dismissed ? " doe-home-top-banner--dismissed" : ""}`}
      role="region"
      aria-label="Meet Doe"
    >
      <p className={`doe-home-top-banner__text ${inter.className}`}>
        <span>Doe has officially launched!</span>
        <Link href="/blog" className="doe-home-top-banner__link">
          Read more
          <DoeLinkArrow className="doe-home-top-banner__arrow" width={12} height={12} />
        </Link>
      </p>
    </div>
  );
}
