"use client";

import { AboutDesktopBeigePanel } from "@/components/about/AboutDesktopBeigePanel";
import {
  ABOUT_DESKTOP_SECTION_H,
  ABOUT_DESKTOP_SPLIT_SECTION_GRID,
  ABOUT_DESKTOP_SPLIT_TEXT_INSET_LEFT,
  ABOUT_DESKTOP_SPLIT_TEXT_INSET_RIGHT,
} from "@/lib/about/about-layout-styles";
import type { WorkflowCarouselGridKind } from "@/lib/workflow-carousel-design-backdrops";
import type { ReactNode } from "react";

/** Full-height /about band — text column plus full-bleed beige line-art panel. */
export function AboutDesktopSplitSection({
  boxSide,
  grid,
  children,
}: {
  boxSide: "left" | "right";
  grid: WorkflowCarouselGridKind;
  children: ReactNode;
}) {
  const textColumn = (
    <div className={boxSide === "right" ? ABOUT_DESKTOP_SPLIT_TEXT_INSET_LEFT : ABOUT_DESKTOP_SPLIT_TEXT_INSET_RIGHT}>
      {children}
    </div>
  );
  const boxColumn = (
    <div className="relative min-h-0 min-w-0 h-full">
      <AboutDesktopBeigePanel grid={grid} boxSide={boxSide} />
    </div>
  );

  return (
    <section className={ABOUT_DESKTOP_SECTION_H}>
      <div className={ABOUT_DESKTOP_SPLIT_SECTION_GRID}>
        {boxSide === "left" ? (
          <>
            {boxColumn}
            {textColumn}
          </>
        ) : (
          <>
            {textColumn}
            {boxColumn}
          </>
        )}
      </div>
    </section>
  );
}
