import Link from "next/link";

import { ABOUT_CONTACT_EMAIL, ABOUT_CONTACT_MAILTO } from "@/lib/about/about-contact";
import { doehealthDesk2NavCenterLinks } from "@/lib/doehealthdesk2/doehealthdesk2-nav-copy";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, lora } from "@/lib/home/fonts";

/** Footer — /doehealth wordmark placement; desk nav + company copy. Brown by default, salmon on /doehealthdesk2. */
export function DoeHealthDesk2Footer({
  sectionHrefBase = "",
  tone = "brown",
}: {
  /** Prefix for `#section` links when the sections live on another page. */
  sectionHrefBase?: string;
  tone?: "brown" | "salmon";
} = {}) {
  // A salmon footer is a light surface, so it skips the nav wash: the nav stays cream-state over it.
  const toneClass =
    tone === "salmon" ? " doehealth-desk2-footer--salmon" : " doehealth-desk2-nav-wash-surface";
  return (
    <footer className={`doehealth-desk2-footer${toneClass}`} aria-label="Footer">
      <div className="doehealth-desk2-footer__inner">
        <div className={`doehealth-desk2-footer__meta ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${inter.className}`}>
          <div className="doehealth-desk2-footer__company">
            <p className="doehealth-desk2-footer__company-name">Doe Intelligence Inc</p>
            <p className="doehealth-desk2-footer__incorporation">
              Delaware
              <br />
              C-Corporation
              <span className="doehealth-desk2-footer__incorporation-pending">(Pending)</span>
            </p>
            <a className="doehealth-desk2-footer__email" href={ABOUT_CONTACT_MAILTO}>
              {ABOUT_CONTACT_EMAIL}
            </a>
          </div>

          <nav className="doehealth-desk2-footer__links" aria-label="Page">
            {doehealthDesk2NavCenterLinks(sectionHrefBase).map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="doehealth-desk2-footer__wordmark-shell">
          <Link
            href="/doehealthdesk"
            className={`doehealth-desk2-footer__mark ${lora.className}`}
          >
            Doe
          </Link>
        </div>
      </div>
    </footer>
  );
}
