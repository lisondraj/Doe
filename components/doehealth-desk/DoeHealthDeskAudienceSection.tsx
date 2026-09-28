"use client";

import { useEffect, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { DOEHEALTH_DESK_AUDIENCES } from "@/lib/doehealth/doehealth-desk-audiences";
import { inter, p22Mackinac } from "@/lib/home/fonts";

export function DoeHealthDeskAudienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    const node = narrow ? sectionRef.current : gridRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      narrow
        ? { threshold: 0.22, rootMargin: "0px 0px -12% 0px" }
        : { threshold: 0.55, rootMargin: "-18% 0px -22% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`doehealth-desk-audiences ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}`}
      aria-label="Built for practices, providers, patients, and students"
    >
      <div ref={gridRef} className="doehealth-desk-audiences__grid">
        {DOEHEALTH_DESK_AUDIENCES.map((audience, index) => {
          const low = index % 2 === 1;
          return (
            <article key={audience.id} className={`doehealth-desk-audiences__card${low ? " is-low" : " is-high"}`}>
              <div className="doehealth-desk-audiences__copy">
                <h2 className={`doehealth-desk-audiences__title ${p22Mackinac.className}`}>{audience.title}</h2>
                <p className={`doehealth-desk-audiences__dek ${inter.className}`}>
                  {audience.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
