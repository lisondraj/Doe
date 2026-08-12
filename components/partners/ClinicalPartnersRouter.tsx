"use client";

import { ClinicalPartnersDesktopView } from "@/components/partners/ClinicalPartnersDesktopView";
import { ClinicalPartnersMobileView } from "@/components/partners/ClinicalPartnersMobileView";
import { PremedLearnMoreProvider } from "@/components/premed/PremedLearnMoreProvider";
import { PremedLinkGuard } from "@/components/premed/PremedLinkGuard";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";
import {
  partnersPageHostAllowed,
  partnersPageHostDeniedMessage,
} from "@/lib/partners/partners-page-path";
import { partnersPageUrl } from "@/lib/site-domains";

/** doe.care /partners — clinical partners page (premed-style phone + desktop layouts). */
export function ClinicalPartnersRouter() {
  const variant = useAboutPageVariant();

  if (typeof window !== "undefined" && !partnersPageHostAllowed(window.location.hostname)) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[#1b1410] px-6 text-center text-[#F2E8DA]">
        <p className="max-w-md text-[1.05rem] leading-relaxed">
          {partnersPageHostDeniedMessage(window.location.hostname)}{" "}
          <a href={partnersPageUrl()} className="text-[#E8C08E] underline underline-offset-2">
            Open on doe.care
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <PremedLearnMoreProvider>
      <PremedLinkGuard>
        {variant === "desktop" ? <ClinicalPartnersDesktopView /> : <ClinicalPartnersMobileView />}
      </PremedLinkGuard>
    </PremedLearnMoreProvider>
  );
}
