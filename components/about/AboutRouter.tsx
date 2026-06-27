"use client";

import { AboutDesktopView } from "@/components/about/AboutDesktopView";
import { AboutMobileView } from "@/components/about/AboutMobileView";
import { useJoinPageVariant, type JoinPageVariant } from "@/lib/join/use-join-page-variant";

export function AboutRouter({ initialVariant }: { initialVariant: JoinPageVariant }) {
  const variant = useJoinPageVariant(initialVariant);

  return variant === "desktop" ? <AboutDesktopView /> : <AboutMobileView />;
}
