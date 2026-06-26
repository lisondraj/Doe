"use client";

import { WaitlistDesktopView } from "@/components/waitlist/WaitlistDesktopView";
import { WaitlistMobileView } from "@/components/waitlist/WaitlistMobileView";
import { useJoinPageVariant, type JoinPageVariant } from "@/lib/join/use-join-page-variant";

export function WaitlistRouter({ initialVariant }: { initialVariant: JoinPageVariant }) {
  const variant = useJoinPageVariant(initialVariant);

  return variant === "desktop" ? <WaitlistDesktopView /> : <WaitlistMobileView />;
}
