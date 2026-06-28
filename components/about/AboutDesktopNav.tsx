"use client";

import Link from "next/link";

import { DesktopMainNavCta } from "@/components/home/DesktopMainNavCta";
import { ABOUT_DESKTOP_PAGE_INSET } from "@/lib/about/about-layout-styles";
import { lora } from "@/lib/home/fonts";

/** Desktop /about nav — home logo + Investors split-button CTA. */
export function AboutDesktopNav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#E6E6E6] bg-[#F7F6F3]"
      aria-label="Site"
    >
      <div className={`flex items-center justify-between py-6 ${ABOUT_DESKTOP_PAGE_INSET}`}>
        <Link href="/" className={`text-4xl font-normal text-black no-underline ${lora.className}`}>
          Doe
        </Link>

        <DesktopMainNavCta
          bg="#000000"
          fg="#ffffff"
          shadow="none"
          divider="rgba(255, 255, 255, 0.22)"
        />
      </div>
    </nav>
  );
}
