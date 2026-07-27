"use client";

import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";

import { DoePhoneScrollRevealContent } from "@/components/doephone/DoePhoneScrollRevealLift";
import {
  doephoneHomeScrollRevealStyleVars,
  doephoneHomeSectionRevealObserverOptions,
} from "@/lib/doephone/section-reveal-timing";
import { useDoePhoneSectionReveal } from "@/lib/doephone/use-doe-phone-section-reveal";

type DoeHealthPhoneBandRevealContextValue = {
  revealed: boolean;
  enabled: boolean;
};

const DoeHealthPhoneBandRevealContext = createContext<DoeHealthPhoneBandRevealContextValue>({
  revealed: true,
  enabled: false,
});

export function useDoeHealthPhoneBandReveal() {
  return useContext(DoeHealthPhoneBandRevealContext);
}

/** Scroll observer + timing vars for /doehealth brown bands below hero (phone + desktop). */
export function DoeHealthPhoneBandCluster({
  children,
  skipInitialReveal = false,
  className = "doehealth-intro-band__cluster",
}: {
  children: ReactNode;
  skipInitialReveal?: boolean;
  className?: string;
}) {
  /** Phone cadence on both layouts — segmented unblur + hover lift match iPhone. */
  const observer = doephoneHomeSectionRevealObserverOptions("phone");
  const { ref, revealed } = useDoePhoneSectionReveal(observer.threshold, {
    skipInitialReveal,
    rootMargin: observer.rootMargin,
  });
  const style = doephoneHomeScrollRevealStyleVars("phone") as CSSProperties;

  return (
    <div ref={ref} className={className} style={style}>
      <DoeHealthPhoneBandRevealContext.Provider value={{ revealed, enabled: true }}>
        {children}
      </DoeHealthPhoneBandRevealContext.Provider>
    </div>
  );
}

/**
 * Segmented unblur + hover lift for /doehealth bands.
 * `title` = UI (earlier); `carousel` = section title (later).
 */
export function DoeHealthPhoneReveal({
  children,
  segment,
  className = "",
}: {
  children: ReactNode;
  segment: "title" | "carousel";
  className?: string;
}) {
  const { revealed, enabled } = useDoeHealthPhoneBandReveal();

  if (!enabled) {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  return (
    <DoePhoneScrollRevealContent revealed={revealed} segment={segment} className={className}>
      {children}
    </DoePhoneScrollRevealContent>
  );
}
