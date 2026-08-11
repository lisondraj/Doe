"use client";

import { CampusAmbassadorDesktopView } from "@/components/join/CampusAmbassadorDesktopView";
import { CampusAmbassadorMobileView } from "@/components/join/CampusAmbassadorMobileView";
import { PremedLearnMoreProvider } from "@/components/premed/PremedLearnMoreProvider";
import { PremedLinkGuard } from "@/components/premed/PremedLinkGuard";
import { useAboutPageVariant } from "@/lib/about/use-about-page-variant";
import {
  joinCampusPageHostAllowed,
  joinCampusPageHostDeniedMessage,
} from "@/lib/join/join-campus-page-path";
import { joinPageUrl } from "@/lib/site-domains";

/** doe.care /join — campus ambassador page (premed-style phone + desktop layouts). */
export function CampusAmbassadorRouter() {
  const variant = useAboutPageVariant();

  if (typeof window !== "undefined" && !joinCampusPageHostAllowed(window.location.hostname)) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[#1b1410] px-6 text-center text-[#F2E8DA]">
        <p className="max-w-md text-[1.05rem] leading-relaxed">
          {joinCampusPageHostDeniedMessage(window.location.hostname)}{" "}
          <a href={joinPageUrl()} className="text-[#E8C08E] underline underline-offset-2">
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
        {variant === "desktop" ? <CampusAmbassadorDesktopView /> : <CampusAmbassadorMobileView />}
      </PremedLinkGuard>
    </PremedLearnMoreProvider>
  );
}
