"use client";

import { type RefObject, useEffect } from "react";

/**
 * Adds `is-in` to the element the first time its top edge reaches the bottom of the site nav bar. The CSS on that
 * element runs its fade from there, so the fade starts as the section comes up under the nav. With reduced motion
 * the class is added straight away. With `early` it starts as the section's top comes up past the bottom 15% of the
 * screen instead, so a tall section is already fading in as it scrolls into view, not blank until it reaches the nav.
 */
export function useNavReveal(ref: RefObject<HTMLElement | null>, options: { early?: boolean } = {}) {
  const early = options.early === true;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return undefined;
    }

    // The observer's root is the strip of screen above the nav's bottom edge, so the element counts as in once it
    // touches that edge.
    const chrome = document.querySelector<HTMLElement>(".doehealth-desk2-chrome");
    const navBottom = chrome ? chrome.getBoundingClientRect().bottom : 0;
    const bottomInset = early ? window.innerHeight * 0.15 : Math.max(0, window.innerHeight - navBottom);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: `0px 0px -${bottomInset}px 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, early]);
}
