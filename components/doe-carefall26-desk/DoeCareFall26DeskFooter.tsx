"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

import { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO } from "@/lib/about/about-contact";
import { usePremedLearnMoreModal } from "@/components/premed/PremedLearnMoreProvider";
import { DOECAREFALL26_DESK_NAV_CENTER_LINKS } from "@/lib/doecarefall26/doecarefall26-desk-nav-copy";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";

/** Brown footer — /doecarefall26 wordmark, desk nav, and company copy. */
export function DoeCareFall26DeskFooter() {
  const { openLearnMoreModal } = usePremedLearnMoreModal();

  function onPageLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    openLearnMoreModal();
  }

  return (
    <footer className="doecarefall26-desk-footer doecarefall26-desk-nav-wash-surface" aria-label="Footer">
      <div className="doecarefall26-desk-footer__inner">
        <div className={`doecarefall26-desk-footer__meta ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${inter.className}`}>
          <div className="doecarefall26-desk-footer__company">
            <p className="doecarefall26-desk-footer__company-name">Doe Intelligence Inc</p>
            <p className="doecarefall26-desk-footer__incorporation">
              Delaware
              <br />
              C-Corporation
              <span className="doecarefall26-desk-footer__incorporation-pending">(Pending)</span>
            </p>
            <a className="doecarefall26-desk-footer__email" href={ABOUT_CONTACT_MAILTO}>
              {ABOUT_CONTACT_EMAIL}
            </a>
          </div>

          <nav className="doecarefall26-desk-footer__links" aria-label="Page">
            {DOECAREFALL26_DESK_NAV_CENTER_LINKS.map((item) => (
              <a key={item.label} href="#contact" onClick={onPageLinkClick}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="doecarefall26-desk-footer__wordmark-shell">
          <Link href="/doecarefall26" className={`doecarefall26-desk-footer__mark ${lora.className}`}>
            Doe
          </Link>
        </div>
      </div>
    </footer>
  );
}
