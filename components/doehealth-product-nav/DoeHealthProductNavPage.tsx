"use client";

import { DoeHealthDesk2Footer } from "@/components/doehealth-desk2/DoeHealthDesk2Footer";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2InviteSection } from "@/components/doehealth-desk2/DoeHealthDesk2StorySections";
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
 * /product-nav — the beige theme of the /doehealthdesk2 title carousel as the whole page: beige surface, deep brown
 * ink, and the nav in its beige state (the main is one nav-wash surface with `data-nav-beige` at 1, which also gives
 * iPhone Safari's overscroll the beige). A blank full-height hero leads into the teach box and footer. Linked from
 * the nav's Product item.
 */
export function DoeHealthProductNavPage({ initialVariant }: { initialVariant: DoeHealthDesk2Variant }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  useDoeHealthDesk2PhoneOverflowChrome(variant === "phone");

  return (
    <div
      className={`doehealth-desk2-page doehealth-product-nav-page relative min-h-[100dvh] ${inter.className} ${p22Mackinac.variable}`}
      data-doeforvc-view={variant === "desktop" ? "desktop" : "iphone"}
    >
      {variant === "desktop" ? (
        <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      ) : (
        <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
      )}
      <DoeHealthDesk2NavWash />
      <main className="doehealth-desk2-main doehealth-desk2-nav-wash-surface min-h-[100dvh]" data-nav-beige="1" aria-label="Product">
        <section className="doehealth-desk2-blank doehealth-product-nav-hero" aria-hidden />
        <DoeHealthDesk2InviteSection />
        <DoeHealthDesk2Footer sectionHrefBase={DESK2_PATH} />
      </main>
    </div>
  );
}
