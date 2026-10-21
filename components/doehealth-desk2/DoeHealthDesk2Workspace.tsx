"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/**
 * Lounge photo (2500 × 1667), rounded to the page's corner radius, with the two founder names on it. The bottom veil
 * lifts as you scroll. `overlay` is laid over the photo (the hover card on /earlypreview).
 */
export function DoeHealthDesk2Workspace({ overlay, className = "" }: { overlay?: ReactNode; className?: string } = {}) {
  const [shown, setShown] = useState(false);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setShown(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const fade = fadeRef.current;
    if (!fade) return;
    let raf = 0;
    let lastOpacity = -1;
    const update = () => {
      raf = 0;
      const range = 200;
      const opacity = Math.max(0, 1 - window.scrollY / range);
      const rounded = Math.round(opacity * 100) / 100;
      if (rounded === lastOpacity) return;
      lastOpacity = rounded;
      fade.style.setProperty("--desk2-product-fade", rounded.toFixed(2));
      // Once it has lifted it stays gone, and display: none also stops its drifting mask animation.
      if (rounded === 0) {
        fade.style.display = "none";
        window.removeEventListener("scroll", onScroll);
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    if (lastOpacity > 0) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className={`desk2-workspace ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}${className ? ` ${className}` : ""}`} aria-label="Doe clinic">
      <div className="desk2-workspace__stage">
        <figure className="desk2-workspace__photo">
          <Image
            src="/doehealthdesk2/newhero.jpg"
            alt="A bright, minimal lounge with a cream curved sofa, a sculpted coffee table and a grey lounge chair by a sunlit window"
            width={2500}
            height={1445}
            sizes="(min-width: 1024px) 80vw, 100vw"
            priority
          />
          <div className={`desk2-workspace__person desk2-workspace__person--james ${p22Mackinac.className}`}>
            <p className="desk2-workspace__name">James Lisondra</p>
            <p className={`desk2-workspace__role ${inter.className}`}>Founder, Medicine</p>
          </div>
          <div className={`desk2-workspace__person desk2-workspace__person--matthew ${p22Mackinac.className}`}>
            <p className="desk2-workspace__name">Matthew Lisondra</p>
            <p className={`desk2-workspace__role ${inter.className}`}>Founder, Engineering</p>
          </div>
          <span className="desk2-workspace__play" aria-hidden="true">
            <svg viewBox="1.35 0 24 24" fill="currentColor">
              <path d="M7.5 4.8v14.4a.9.9 0 0 0 1.37.77l11.3-7.2a.9.9 0 0 0 0-1.54L8.87 4.03A.9.9 0 0 0 7.5 4.8Z" />
            </svg>
          </span>
          {overlay}
        </figure>
      </div>
      <div ref={fadeRef} className="desk2-workspace__fade" aria-hidden />
    </section>
  );
}
