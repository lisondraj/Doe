import Link from "next/link";

import { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO } from "@/lib/about/about-contact";
import { DOEHEALTH_DESK_NAV_CENTER_LINKS } from "@/lib/doehealth/doehealth-desk-nav-copy";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";

/** Brown footer — Lora wordmark, nav links + company in one column. */
export function DoeHealthDeskFooter() {
  return (
    <footer className="doehealth-desk-footer doehealth-desk-nav-wash-surface" aria-label="Footer">
      <div className={`doehealth-desk-footer__row ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <p className={`doehealth-desk-footer__mark ${lora.className}`}>Doe</p>
        <div className={`doehealth-desk-footer__side ${inter.className}`}>
          <nav className="doehealth-desk-footer__links" aria-label="Page">
            {DOEHEALTH_DESK_NAV_CENTER_LINKS.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="doehealth-desk-footer__company">
            <p>Doe Intelligence Inc.</p>
            <a href={ABOUT_CONTACT_MAILTO}>{ABOUT_CONTACT_EMAIL}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
