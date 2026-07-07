"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { inter } from "@/lib/home/fonts";

const BANNER_DISMISSED_ATTR = "data-home-banner-dismissed";
const HERO_DISMISS_EXIT_PX = 4;
const HERO_DISMISS_ENTER_PX = 48;

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

/** Home announcement strip — raised overflow sand behind, base sand strip. */
export function DoeHomeTopBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let heroEl: HTMLElement | null = null;
    let raf = 0;

    const sync = () => {
      heroEl ??= document.querySelector<HTMLElement>(".doephone-hero-section");
      if (!heroEl) return;

      const bottom = heroEl.getBoundingClientRect().bottom;
      setDismissed((prev) => {
        if (bottom <= HERO_DISMISS_EXIT_PX) return true;
        if (bottom >= HERO_DISMISS_ENTER_PX) return false;
        return prev;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("orientationchange", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("orientationchange", onScroll);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (dismissed) {
      html.setAttribute(BANNER_DISMISSED_ATTR, "true");
    } else {
      html.removeAttribute(BANNER_DISMISSED_ATTR);
    }

    return () => {
      html.removeAttribute(BANNER_DISMISSED_ATTR);
    };
  }, [dismissed]);

  return (
    <div
      className={`doe-home-top-banner${dismissed ? " doe-home-top-banner--dismissed" : ""}`}
      role="region"
      aria-label="Company news"
      aria-hidden={dismissed}
    >
      <p className={`doe-home-top-banner__text ${inter.className}`}>
        <span>We raised a $5M pre-seed round!</span>
        <Link href="/blog" className="doe-home-top-banner__link">
          Read more
          <ReadMoreArrow />
        </Link>
      </p>
    </div>
  );
}
