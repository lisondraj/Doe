import Link from "next/link";

import { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO } from "@/lib/about/about-contact";
import { DOE_FALL26_DESK_NAV_CENTER_LINKS } from "@/lib/doefall26/doefall26-desk-nav-copy";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";

/** Brown footer — /doehealth wordmark placement; desk nav + company copy. */
export function DoeFall26DeskFooter() {
  return (
    <footer className="doefall26-desk-footer doefall26-desk-nav-wash-surface" aria-label="Footer">
      <div className="doefall26-desk-footer__inner">
        <div className={`doefall26-desk-footer__meta ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${inter.className}`}>
          <div className="doefall26-desk-footer__company">
            <p className="doefall26-desk-footer__company-name">Doe Intelligence Inc</p>
            <p className="doefall26-desk-footer__incorporation">
              Delaware
              <br />
              C-Corporation
              <span className="doefall26-desk-footer__incorporation-pending">(Pending)</span>
            </p>
            <a className="doefall26-desk-footer__email" href={ABOUT_CONTACT_MAILTO}>
              {ABOUT_CONTACT_EMAIL}
            </a>
          </div>

          <nav className="doefall26-desk-footer__links" aria-label="Page">
            {DOE_FALL26_DESK_NAV_CENTER_LINKS.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="doefall26-desk-footer__wordmark-shell">
          <Link
            href="/doefall26"
            className={`doefall26-desk-footer__mark ${lora.className}`}
          >
            Doe
          </Link>
        </div>
      </div>
    </footer>
  );
}
