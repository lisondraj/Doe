"use client";

import { DoeDesktopHome } from "@/components/doephone/DoeDesktopHome";
import { DoeHomeTopBanner } from "@/components/doephone/DoeHomeTopBanner";
import { useDesignersStaticNav } from "@/lib/designers/use-designers-static-nav";

export function DoePhoneDesktopView() {
  const staticNav = useDesignersStaticNav();
  return (
    <>
      <DoeHomeTopBanner dismissPastHero />
      <DoeDesktopHome logoLink={!staticNav} navActionLinksEnabled={!staticNav} />
    </>
  );
}
