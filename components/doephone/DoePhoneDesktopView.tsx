"use client";

import { DesktopHome } from "@/components/home/DesktopHome";

export function DoePhoneDesktopView({ staticNav = false }: { staticNav?: boolean } = {}) {
  return (
    <DesktopHome logoLink={!staticNav} navActionLinksEnabled={!staticNav} />
  );
}
