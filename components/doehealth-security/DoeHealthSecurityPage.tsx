"use client";

import { DoeHealthDeskFooter } from "@/components/doehealth-desk/DoeHealthDeskFooter";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** The desk2 site: its nav links, logo, and section anchors all live here. */
const DESK2_PATH = "/doehealthdesk2";
/** The footer still uses the legacy desk section anchors. */
const DESK_PATH = "/doehealthdesk";

/** The salmon strip across the middle of the page. */
const STRIP_ITEMS = ["Encrypted calls", "Clinic-controlled access", "Your clinic, your rules"];

/** The two principles, as stated on the product. */
const PRINCIPLES = [
  {
    title: "Encrypted calls",
    body: "Doe encrypts calls, so the conversations your patients have with it stay protected.",
  },
  {
    title: "Clinic-controlled access",
    body: "Your clinic decides who on its team can see patient information, and changes that access whenever it needs to.",
  },
];

/** /security — a dark Doe brown page with a salmon strip, on the desk2 chrome. Linked from the nav's Security item. */
export function DoeHealthSecurityPage({ initialVariant }: { initialVariant: DoeHealthDesk2Variant }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");

  return (
    <div
      className={`doehealth-desk2-page doehealth-desk-page doehealth-security-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      ) : (
        <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      )}
      <main className="doehealth-desk-main min-h-[100dvh]" aria-label="Security">
        <section className={`doehealth-security ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          <h1 className={`doehealth-security__title ${p22Mackinac.className}`}>Security</h1>
          <p className="doehealth-security__lede">
            How Doe protects the calls, records, and access your clinic depends on.
          </p>
        </section>

        <div className="doehealth-security-strip" role="presentation">
          <ul className={`doehealth-security-strip__inner ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
            {STRIP_ITEMS.map((item) => (
              <li key={item} className="doehealth-security-strip__item">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <section className={`doehealth-security__principles ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
          {PRINCIPLES.map((principle) => (
            <article key={principle.title} className="doehealth-security__card">
              <h2 className={`doehealth-security__card-title ${p22Mackinac.className}`}>{principle.title}</h2>
              <p className="doehealth-security__card-body">{principle.body}</p>
            </article>
          ))}
        </section>

        <DoeHealthDesk2InviteSection />
        <DoeHealthDeskFooter sectionHrefBase={DESK_PATH} />
      </main>
    </div>
  );
}
