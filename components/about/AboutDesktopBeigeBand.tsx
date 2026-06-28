"use client";

import { BlogLandingHeroGraphic } from "@/components/blog/BlogLandingHeroGraphic";
import {
  ABOUT_DESKTOP_BEIGE_SECTION,
  ABOUT_DESKTOP_BEIGE_SECTION_CONTENT,
  ABOUT_DESKTOP_SECTION_H,
} from "@/lib/about/about-layout-styles";
import type { ReactNode } from "react";

/** Full-viewport /about band — blog landing beige fill with wave line art. */
export function AboutDesktopBeigeBand({ children }: { children: ReactNode }) {
  return (
    <section className={`${ABOUT_DESKTOP_SECTION_H} ${ABOUT_DESKTOP_BEIGE_SECTION}`}>
      <BlogLandingHeroGraphic />
      <div className={ABOUT_DESKTOP_BEIGE_SECTION_CONTENT}>{children}</div>
    </section>
  );
}
