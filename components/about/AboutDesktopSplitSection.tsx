"use client";

import { AboutDesktopBeigePanel } from "@/components/about/AboutDesktopBeigePanel";
import {
  ABOUT_DESKTOP_SECTION_H,
  ABOUT_DESKTOP_SPLIT_BOX_COLUMN,
  ABOUT_DESKTOP_SPLIT_SECTION_GRID,
  ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_LEFT,
  ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_RIGHT,
} from "@/lib/about/about-layout-styles";
import type { ReactNode } from "react";

/** Full-height /about band — text column plus margined beige square with line graphic. */
export function AboutDesktopSplitSection({
  boxSide,
  graphic,
  children,
}: {
  boxSide: "left" | "right";
  graphic: 0 | 1 | 2 | 3;
  children: ReactNode;
}) {
  const textColumn = (
    <div className={boxSide === "right" ? ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_LEFT : ABOUT_DESKTOP_SPLIT_TEXT_COLUMN_RIGHT}>
      {children}
    </div>
  );
  const boxColumn = (
    <div className={boxSide === "left" ? ABOUT_DESKTOP_SPLIT_BOX_COLUMN_LEFT : ABOUT_DESKTOP_SPLIT_BOX_COLUMN_RIGHT}>
      <AboutDesktopBeigePanel graphic={graphic} />
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
