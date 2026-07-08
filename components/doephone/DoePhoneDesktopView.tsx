"use client";

import { DoeDesktopHome } from "@/components/doephone/DoeDesktopHome";
import { useDesignersStaticNav } from "@/lib/designers/use-designers-static-nav";

export function DoePhoneDesktopView() {
  const staticNav = useDesignersStaticNav();
  return (
    <DoeDesktopHome logoLink={!staticNav} navActionLinksEnabled={!staticNav} />
  );
}
