"use client";

import { DesktopHome } from "@/components/home/DesktopHome";

/** Designers landing — desktop home with non-linked nav chrome. */
export function DesignersDesktopView() {
  return <DesktopHome logoLink={false} navActionLinksEnabled={false} />;
}
