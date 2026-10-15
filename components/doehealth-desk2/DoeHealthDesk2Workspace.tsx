"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";

/** Sunlit lounge photo (1672 × 941), rounded to the page's corner radius. The bottom veil lifts as you scroll. */
export function DoeHealthDesk2Workspace() {
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
    <section className={`desk2-workspace ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}`} aria-label="Doe clinic">
      <div className="desk2-workspace__stage">
        <figure className="desk2-workspace__photo">
          <Image
            src="/doehealthdesk2/sunlit-minimalist-wooden-stools.jpg"
            alt="A sunlit lounge with two wooden stools on a polished floor"
            width={1672}
            height={941}
            sizes="(min-width: 1024px) 80vw, 100vw"
            priority
          />
        </figure>
      </div>
      <div ref={fadeRef} className="desk2-workspace__fade" aria-hidden />
    </section>
  );
}
