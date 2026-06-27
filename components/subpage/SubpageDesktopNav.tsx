"use client";

import Link from "next/link";
import { Fragment } from "react";

import { JOIN_DESKTOP_CONTENT } from "@/lib/join/join-layout";
import { scrollToJoinApplySection } from "@/lib/join/join-apply-scroll";
import { lora } from "@/lib/home/fonts";
import {
  SUBPAGE_NAV_DOT_CLASS,
  SUBPAGE_NAV_LINK_CLASS,
  type SubpageNavVariant,
  subpageNavButton,
  subpageNavLinks,
} from "@/lib/subpage/subpage-nav";

const DESKTOP_CTA_CLASS =
  "rounded-lg bg-black px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98]";

/** Beige desktop nav — Doe left; subpage links + optional CTA on the right. */
export function SubpageDesktopNav({ variant }: { variant: SubpageNavVariant }) {
  const links = subpageNavLinks(variant);
  const button = subpageNavButton(variant);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#E6E6E6]"
      style={{ backgroundColor: "#F7F6F3" }}
      aria-label="Site"
    >
      <div className={`${JOIN_DESKTOP_CONTENT} flex items-center justify-between py-6`}>
        <h1 className={`text-4xl font-normal text-black ${lora.className}`}>Doe</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {links.map((item, index) => (
              <Fragment key={item.href}>
                {index > 0 ? (
                  <span className={SUBPAGE_NAV_DOT_CLASS} aria-hidden>
                    ·
                  </span>
                ) : null}
                <Link href={item.href} className={SUBPAGE_NAV_LINK_CLASS}>
                  {item.label}
                </Link>
              </Fragment>
            ))}
          </div>

          {button ? (
            button.kind === "scroll-apply" ? (
              <button type="button" onClick={scrollToJoinApplySection} className={DESKTOP_CTA_CLASS}>
                {button.label}
              </button>
            ) : (
              <a href={button.href} className={DESKTOP_CTA_CLASS}>
                {button.label}
              </a>
            )
          ) : null}
        </div>
      </div>
    </nav>
  );
}
