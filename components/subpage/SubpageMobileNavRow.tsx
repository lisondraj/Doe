"use client";

import Link from "next/link";
import { Fragment } from "react";

import {
  DOEPHONE_NAV_JOIN_ROW_DOT_CLASS,
  DOEPHONE_NAV_JOIN_ROW_LINK_CLASS,
  DOEPHONE_NAV_WAITLIST_CLASS,
} from "@/lib/doephone/waitlist-button";
import { scrollToJoinApplySection } from "@/lib/join/join-apply-scroll";
import {
  type SubpageNavVariant,
  subpageNavButton,
  subpageNavLinks,
} from "@/lib/subpage/subpage-nav";

export function SubpageMobileNavRow({
  variant,
  interactive = true,
}: {
  variant: SubpageNavVariant;
  interactive?: boolean;
}) {
  const links = subpageNavLinks(variant);
  const button = subpageNavButton(variant);

  return (
    <>
      {links.map((item, index) => (
        <Fragment key={item.href}>
          {index > 0 ? (
            <span className={DOEPHONE_NAV_JOIN_ROW_DOT_CLASS} aria-hidden>
              ·
            </span>
          ) : null}
          {interactive ? (
            <Link href={item.href} className={DOEPHONE_NAV_JOIN_ROW_LINK_CLASS}>
              {item.label}
            </Link>
          ) : (
            <span className={DOEPHONE_NAV_JOIN_ROW_LINK_CLASS}>{item.label}</span>
          )}
        </Fragment>
      ))}
      {button ? (
        <>
          {links.length > 0 ? (
            <span className={DOEPHONE_NAV_JOIN_ROW_DOT_CLASS} aria-hidden>
              ·
            </span>
          ) : null}
          {interactive ? (
            button.kind === "scroll-apply" ? (
              <button type="button" onClick={scrollToJoinApplySection} className={DOEPHONE_NAV_WAITLIST_CLASS}>
                {button.label}
              </button>
            ) : (
              <a href={button.href} className={DOEPHONE_NAV_WAITLIST_CLASS}>
                {button.label}
              </a>
            )
          ) : (
            <span className={DOEPHONE_NAV_WAITLIST_CLASS}>{button.label}</span>
          )}
        </>
      ) : null}
    </>
  );
}

export function subpageVariantFromCtaLayout(
  ctaLayout: string,
): SubpageNavVariant | null {
  switch (ctaLayout) {
    case "join-waitlist":
      return "main";
    case "subpage-join":
      return "join";
    case "subpage-investors":
      return "investors";
    case "subpage-waitlist":
      return "waitlist";
    default:
      return null;
  }
}

export function subpageNavHasButton(variant: SubpageNavVariant): boolean {
  return variant === "join" || variant === "investors" || variant === "waitlist";
}
