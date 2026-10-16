"use client";

import { DoeHealthDesk2Footer } from "@/components/doehealth-desk2/DoeHealthDesk2Footer";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import {
  DoeHealthDesk2BlankSection,
  DoeHealthDesk2InviteSection,
} from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** The desk2 site: its nav links, logo, and section anchors all live here. */
const DESK2_PATH = "/doehealthdesk2";

/**
 * /security — the desk2 brown theme as the default: the whole page is the brown section colour, the nav runs its
 * salmon-over-brown state through the shared nav wash, and a blank full-height brown hero leads into the teach box
 * and footer. Linked from the nav's Security item.
 */
export function DoeHealthSecurityPage({ initialVariant }: { initialVariant: DoeHealthDesk2Variant }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");

  return (
    <div
      className={`doehealth-desk2-page doehealth-security-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <>
          <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
          <DoeHealthDesk2NavWash />
        </>
      ) : (
        <>
          <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
          <DoeHealthDesk2NavWash />
        </>
      )}
      <main className="doehealth-desk2-main min-h-[100dvh]" aria-label="Security">
        <h1 className="sr-only">Security</h1>
        <DoeHealthDesk2BlankSection tone="brown" />
        <DoeHealthDesk2InviteSection />
        <DoeHealthDesk2Footer sectionHrefBase={DESK2_PATH} />
      </main>
    </div>
  );
}
