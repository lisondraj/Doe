"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

import { DOEPHONE_FOOTER_CONTENT_INSET } from "@/lib/doephone/section-styles";
import { PROTO_NAV_LOGO_FONT_CLASS } from "@/lib/proto/proto-font";

const WORDMARK = "Proto";

/** Footer wordmark — scales to fill the same horizontal gutters as footer copy. */
export function ProtoFooterWordmark() {
  const fitRef = useRef<HTMLDivElement>(null);
  const [fontSizePx, setFontSizePx] = useState<number | null>(null);

  useLayoutEffect(() => {
    const container = fitRef.current;
    if (!container) return;

    const measure = document.createElement("span");
    measure.setAttribute("aria-hidden", "true");
    measure.textContent = WORDMARK;
    measure.className = `proto-footer-wordmark proto-footer-wordmark--measure pointer-events-none absolute left-0 top-0 whitespace-nowrap opacity-0 ${PROTO_NAV_LOGO_FONT_CLASS}`;
    container.appendChild(measure);

    let rafId = 0;

    const fit = () => {
      const available = container.clientWidth;
      if (available <= 0) return;

      let lo = 8;
      let hi = Math.floor(available);
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        measure.style.fontSize = `${mid}px`;
        if (measure.scrollWidth <= available) lo = mid;
        else hi = mid - 1;
      }

      setFontSizePx((prev) => (prev === lo ? prev : lo));
    };

    const scheduleFit = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(fit);
    };

    scheduleFit();
    const observer = new ResizeObserver(scheduleFit);
    observer.observe(container);
    void document.fonts?.ready.then(scheduleFit);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      measure.remove();
    };
  }, []);

  return (
    <div className={`proto-footer-wordmark-wrap relative z-[11] w-full pb-0 ${DOEPHONE_FOOTER_CONTENT_INSET}`}>
      <div ref={fitRef} className="proto-footer-wordmark-fit relative w-full">
        <Link
          href="/proto"
          className={`proto-footer-wordmark pointer-events-auto block w-full font-normal no-underline transition-opacity hover:opacity-90 ${PROTO_NAV_LOGO_FONT_CLASS}`}
          style={fontSizePx != null ? { fontSize: `${fontSizePx}px` } : undefined}
        >
          {WORDMARK}
        </Link>
      </div>
    </div>
  );
}
