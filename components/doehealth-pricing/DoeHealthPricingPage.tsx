"use client";

import { useState } from "react";

import { DoeHealthDesk2Footer } from "@/components/doehealth-desk2/DoeHealthDesk2Footer";
import { DoeHealthDesk2NavWash } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";
import { DoeHealthDesk2DesktopNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2DesktopNavBar";
import { DoeHealthDesk2PhoneNavBar } from "@/components/doehealth-desk2/DoeHealthDesk2PhoneNavBar";
import { DoeHealthPricingBuilder } from "@/components/doehealth-pricing/DoeHealthPricingBuilder";
import { DOEHEALTH_DESK2_PAGE_BACKGROUND } from "@/lib/doehealthdesk2/doehealthdesk2-colors";
import { PRICING_FAQ } from "@/lib/doehealthdesk2/doehealthdesk2-pricing";
import { useDoeHealthDesk2PhoneOverflowChrome } from "@/lib/doehealthdesk2/use-doehealthdesk2-phone-overflow-chrome";
import {
  type DoeHealthDesk2Variant,
  useDoeHealthDesk2Variant,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-variant";
import { inter, p22Mackinac } from "@/lib/home/fonts";

/** The desk2 site: its nav links, logo, and section anchors all live here. */
const DESK2_PATH = "/doehealthdesk2";

function Faq({ phone }: { phone: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className={`grid gap-[28px] ${phone ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-[56px]"}`} aria-label="Questions">
      <h2 className={`m-0 text-[clamp(34px,4vw,52px)] leading-[1.02] tracking-[-0.035em] font-[400] text-[#281910] ${p22Mackinac.className}`}>Questions</h2>
      <div className="flex flex-col gap-[8px]">
        {PRICING_FAQ.map((f, i) => {
          const on = open === i;
          return (
            <div key={f.q} className="flex flex-col rounded-[11px] bg-[#F4EEDF]">
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : i)} className="flex items-center justify-between gap-[16px] p-[20px] text-left">
                <span className="text-[17px] leading-[23px] font-[600] text-[#140C04]">{f.q}</span>
                <span className="w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FFFCF1] text-[#281910] text-[18px] leading-[18px]">{on ? "−" : "+"}</span>
              </button>
              {on && <p className="m-0 px-[20px] pb-[20px] max-w-[60ch] text-[16px] leading-[24px] text-[rgba(20,12,4,0.68)]">{f.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * /pricing — desk2 chrome around a pricing builder: a short centered hero, the one-question-at-a-time builder
 * (practice, providers, plan, contact), then questions and the footer. Desktop and iPhone layouts follow the desk2
 * variant.
 */
export function DoeHealthPricingPage({ initialVariant }: { initialVariant: DoeHealthDesk2Variant }) {
  const variant = useDoeHealthDesk2Variant(initialVariant);
  const phone = variant === "phone";
  useDoeHealthDesk2PhoneOverflowChrome(phone);

  return (
    <div
      className={`doehealth-desk2-page relative min-h-[100dvh] overflow-x-clip ${inter.className} ${p22Mackinac.variable}`}
      style={{ backgroundColor: DOEHEALTH_DESK2_PAGE_BACKGROUND }}
      data-doeforvc-view={phone ? "iphone" : "desktop"}
    >
      {phone ? (
        <>
          <DoeHealthDesk2PhoneNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
          <DoeHealthDesk2NavWash />
        </>
      ) : (
        <>
          <DoeHealthDesk2DesktopNavBar logoHref={DESK2_PATH} sectionHrefBase={DESK2_PATH} />
          <DoeHealthDesk2NavWash />
        </>
      )}
      <main className="doehealth-desk2-main min-h-[100dvh]" aria-label="Pricing">
        <div className={`mx-auto w-full max-w-[1320px] flex flex-col ${phone ? "px-[16px] gap-[40px] pt-[12px] pb-[48px]" : "px-[56px] gap-[48px] pt-[48px] pb-[96px]"}`}>
          <section className={`flex flex-col items-center text-center ${phone ? "gap-[14px]" : "gap-[18px]"}`}>
            <h1 className={`m-0 text-[clamp(44px,6vw,84px)] leading-[0.98] tracking-[-0.042em] font-[400] text-[#281910] ${p22Mackinac.className}`}>Pricing that fits your practice.</h1>
            <p className="m-0 max-w-[34ch] text-[clamp(17px,1.4vw,21px)] leading-[1.4] tracking-[-0.02em] text-[#140C04]">A few questions about your practice, and your price builds as you go.</p>
          </section>

          <DoeHealthPricingBuilder phone={phone} />

          <Faq phone={phone} />
        </div>
        <DoeHealthDesk2Footer sectionHrefBase={DESK2_PATH} />
      </main>
    </div>
  );
}
