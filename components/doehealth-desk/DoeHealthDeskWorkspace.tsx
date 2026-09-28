"use client";

import { useEffect, useState } from "react";

import { DoeHealthDeskFrontDeskPanel } from "@/components/doehealth-desk/DoeHealthDeskFrontDeskPanel";
import { DoeHealthDeskPaperFrame } from "@/components/doehealth-desk/DoeHealthDeskPaperFrame";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";

/** Paper Workflows frame, scaled to the column. The bottom veil lifts as you scroll. */
export function DoeHealthDeskWorkspace() {
  const [shown, setShown] = useState(false);

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
    const root = document.documentElement;
    const update = () => {
      const range = 200;
      const opacity = Math.max(0, 1 - window.scrollY / range);
      root.style.setProperty("--desk-product-fade", opacity.toFixed(3));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      root.style.removeProperty("--desk-product-fade");
    };
  }, []);

  return (
    <section className={`desk-workspace ${DOEPHONE_DESKTOP_PAGE_INSET_X}${shown ? " is-in" : ""}`} aria-label="Doe clinic workflows">
      <div className="desk-workspace__stage">
        <div className="desk-paper-slot">
          <div className="desk-paper-scale">
            <DoeHealthDeskPaperFrame />
          </div>
        </div>
        <DoeHealthDeskFrontDeskPanel />
      </div>
      <div className="desk-workspace__fade" aria-hidden />
    </section>
  );
}
