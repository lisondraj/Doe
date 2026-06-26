"use client";

import { JoinDesktopView } from "@/components/join/JoinDesktopView";
import { JoinMobileView } from "@/components/join/JoinMobileView";
import { useJoinPageVariant, type JoinPageVariant } from "@/lib/join/use-join-page-variant";

export function JoinRouter({ initialVariant }: { initialVariant: JoinPageVariant }) {
  const variant = useJoinPageVariant(initialVariant);

  return variant === "desktop" ? <JoinDesktopView /> : <JoinMobileView />;
}
