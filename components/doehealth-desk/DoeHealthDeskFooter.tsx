import Link from "next/link";

import { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO } from "@/lib/about/about-contact";
import { DOEHEALTH_DESK_NAV_CENTER_LINKS } from "@/lib/doehealth/doehealth-desk-nav-copy";
import { DOEPHONE_FOOTER_CONTENT_INSET } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";

/** Brown footer — /doehealth wordmark placement; desk nav + company copy. */
export function DoeHealthDeskFooter() {
  return (
    <footer className="doehealth-desk-footer doehealth-desk-nav-wash-surface" aria-label="Footer">
      <div className="doehealth-desk-footer__inner">
        <div className={`doehealth-desk-footer__meta ${DOEPHONE_FOOTER_CONTENT_INSET}`}>
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

        <div className="doehealth-desk-footer__wordmark-shell">
          <Link
            href="/doehealthdesk"
            className={`doehealth-desk-footer__mark ${lora.className}`}
          >
            Doe
          </Link>
        </div>
      </div>
    </footer>
  );
}
