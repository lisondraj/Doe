"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { DoePhoneScrollRevealContent } from "@/components/doephone/DoePhoneScrollRevealLift";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
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

/** Scroll observer + timing vars for /doehealth iPhone brown bands (not hero/footer). */
export function DoeHealthPhoneBandCluster({
  children,
  skipInitialReveal = false,
  className = "doehealth-intro-band__cluster",
}: {
  children: ReactNode;
  skipInitialReveal?: boolean;
  className?: string;
}) {
  const [isPhone, setIsPhone] = useState(
    () => readBootstrappedDoePhoneVariant() !== "desktop",
  );
  const observer = doephoneHomeSectionRevealObserverOptions("phone");
  const { ref, revealed } = useDoePhoneSectionReveal(observer.threshold, {
    skipInitialReveal: skipInitialReveal && isPhone,
    rootMargin: observer.rootMargin,
  });
  const style = (
    isPhone ? doephoneHomeScrollRevealStyleVars("phone") : undefined
  ) as CSSProperties | undefined;

  useLayoutEffect(() => {
    const sync = () => setIsPhone(resolveDoePhoneVariant() !== "desktop");
    sync();
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      <DoeHealthPhoneBandRevealContext.Provider
        value={{ revealed: isPhone ? revealed : true, enabled: isPhone }}
      >
        {children}
      </DoeHealthPhoneBandRevealContext.Provider>
    </div>
  );
}

/**
 * Segmented unblur + hover lift — phone only.
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
