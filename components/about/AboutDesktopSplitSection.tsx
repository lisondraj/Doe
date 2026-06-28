"use client";

import { AboutDesktopBeigePanel } from "@/components/about/AboutDesktopBeigePanel";
import {
  ABOUT_DESKTOP_SECTION_GRID,
  ABOUT_DESKTOP_SECTION_H,
  ABOUT_DESKTOP_SECTION_LAYOUT,
} from "@/lib/about/about-layout-styles";
import type { WorkflowCarouselGridKind } from "@/lib/workflow-carousel-design-backdrops";
import type { ReactNode } from "react";

/** Full-height /about band — text column plus alternating beige line-art square. */
export function AboutDesktopSplitSection({
  boxSide,
  grid,
  children,
}: {
  boxSide: "left" | "right";
  grid: WorkflowCarouselGridKind;
  children: ReactNode;
}) {
  const textColumn = <div className="flex min-w-0 flex-col justify-center">{children}</div>;
  const boxColumn = (
    <div className="flex min-w-0 items-center justify-center">
      <AboutDesktopBeigePanel grid={grid} />
    </div>
  );

  return (
    <section className={`${ABOUT_DESKTOP_SECTION_H} ${ABOUT_DESKTOP_SECTION_LAYOUT}`}>
      <div className={ABOUT_DESKTOP_SECTION_GRID}>
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
