"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DoePhoneHeroSection } from "@/components/doephone/DoePhoneHeroSection";
import { ProtoDesktopFeatureStack } from "@/components/proto/ProtoDesktopFeatureStack";
import { ProtoDesktopNavActionRow } from "@/components/proto/ProtoDesktopNavActionRow";
import { ProtoFooter } from "@/components/proto/ProtoFooter";
import {
  PROTO_DESKTOP_NAV_LOGO_TW,
  PROTO_DESKTOP_PAGE_INSET_X,
} from "@/lib/proto/proto-desktop-layout-styles";
import { PROTO_FONT_CLASS, PROTO_NAV_LOGO_FONT_CLASS } from "@/lib/proto/proto-font";

/** Desktop /proto — dark home layout aligned with the iPhone proto review. */
export function ProtoDesktopHome() {
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setNavSolid(window.scrollY > window.innerHeight * 0.72);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={`proto-desktop-root relative overflow-x-hidden bg-[#121819] ${PROTO_FONT_CLASS}`}>
      <div className="relative z-[40] overflow-x-clip overflow-y-visible">
        <DoePhoneHeroSection variant="desktop" proto />

        <nav
          className="fixed top-0 left-0 right-0 z-[50] transition-[background-color,border-color] duration-300 ease-out"
          style={{
            backgroundColor: navSolid ? "#121819" : "transparent",
            borderBottom: navSolid ? "1px solid #2A3538" : "1px solid transparent",
          }}
          aria-label="Primary"
        >
          <div className={`flex items-center justify-between py-6 ${PROTO_DESKTOP_PAGE_INSET_X}`}>
            <Link href="/proto" className={`proto-nav-logo ${PROTO_NAV_LOGO_FONT_CLASS} ${PROTO_DESKTOP_NAV_LOGO_TW}`}>
              Proto
            </Link>

            <ProtoDesktopNavActionRow />
          </div>
        </nav>
      </div>

      <div className="w-full border-t border-[#2A3538]" aria-hidden />

      <ProtoDesktopFeatureStack />

      <ProtoFooter />
    </div>
  );
}
