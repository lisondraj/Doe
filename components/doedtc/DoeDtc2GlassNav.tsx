"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Glass } from "@samasante/liquid-glass";

import { larkenLight } from "@/lib/home/fonts";
import { DOEDTC2_PATH } from "@/lib/site-domains";

const BAR_OPTICS = {
  frost: 4,
  brightness: 0.06,
  saturate: 1.45,
  strength: 0.48,
  depth: 0.82,
  curvature: 0.58,
  bend: 0.52,
  bendWidth: 0.2,
  dispersion: 0.2,
  sheen: 1,
  sheenWidth: 2.8,
  sheenFalloff: 1.8,
  specular: 1.25,
  glow: 0.18,
};

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.25 6 8 10.75 12.75 6"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavRefract() {
  return <div className="doedtc2-glass-nav__refract" aria-hidden />;
}

export function DoeDtc2GlassNav() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setBox((prev) =>
        prev.w === rect.width && prev.h === rect.height
          ? prev
          : { w: rect.width, h: rect.height },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const syncWebkitFilter = () => {
      root.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const filter = el.style.filter;
        if (filter) el.style.setProperty("-webkit-filter", filter);
      });
    };

    syncWebkitFilter();
    const observer = new MutationObserver(syncWebkitFilter);
    observer.observe(root, {
      attributes: true,
      subtree: true,
      attributeFilter: ["style"],
    });
    return () => observer.disconnect();
  }, [box.w, box.h]);

  const ready = box.w > 0 && box.h > 0;

  return (
    <div className="doedtc2-glass-nav" ref={rootRef}>
      <div className="doedtc2-glass-nav__bar" ref={barRef}>
        {ready ? (
          <Glass
            className="doedtc2-glass-nav__lens"
            width={box.w}
            height={box.h}
            radius={30}
            optics={BAR_OPTICS}
            behind="#1d4ed8"
            pixelUnits
            refract={<NavRefract />}
          />
        ) : null}
        <nav className="doedtc2-glass-nav__inner" aria-label="Primary">
          <Link className="doedtc2-glass-nav__link" href={DOEDTC2_PATH}>
            <span className={`doedtc2-glass-nav__wordmark ${larkenLight.className}`}>Doe</span>
          </Link>
          <button type="button" className="doedtc2-glass-nav__menu" aria-label="Menu">
            <ChevronDownIcon />
          </button>
        </nav>
      </div>
    </div>
  );
}
