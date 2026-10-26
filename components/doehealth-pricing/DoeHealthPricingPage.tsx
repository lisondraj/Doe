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

/** The open and close curve shared by the questions: quick to start, soft to settle. */
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

/**
 * Questions, one open at a time. An answer slides open by growing its row from nothing to its height (a grid row
 * animates where `height: auto` can't), its text easing down into place, and the plus turns into a minus.
 */
function Faq({ phone }: { phone: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className={`grid gap-[24px] ${phone ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-[56px]"}`} aria-label="Questions">
      <h2 className={`m-0 text-[clamp(34px,4vw,52px)] leading-[1.02] tracking-[-0.035em] font-[400] text-[#281910] ${p22Mackinac.className}`}>Questions</h2>
      <div className="flex flex-col gap-[8px]">
        {PRICING_FAQ.map((f, i) => {
          const on = open === i;
          const id = `pricing-faq-${i}`;
          return (
            <div
              key={f.q}
              className={`flex flex-col rounded-[16px] transition-[background-color,box-shadow] duration-300 ${on ? "bg-[#F4EEDF] shadow-[0_10px_28px_-22px_rgba(40,25,16,0.5)]" : "bg-[rgba(244,238,223,0.6)] [@media(hover:hover)]:hover:bg-[#F4EEDF]"}`}
            >
              <button
                type="button"
                aria-expanded={on}
                aria-controls={id}
                onClick={() => setOpen(on ? null : i)}
                className={`flex items-center justify-between gap-[16px] text-left ${phone ? "p-[18px]" : "p-[20px] pl-[22px]"}`}
              >
                <span className={`font-[600] text-[#140C04] ${phone ? "text-[16px] leading-[22px]" : "text-[17px] leading-[23px]"}`}>{f.q}</span>
                <span
                  className={`w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] transition-colors duration-300 ${on ? "bg-[#281910] text-[#FFFCF1]" : "bg-[#FFFCF1] text-[#281910]"}`}
                  aria-hidden="true"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" style={{ display: "block" }}>
                    <path d="M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path
                      d="M6 1v10"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      className={`origin-center transition-transform duration-[420ms] ${EASE} motion-reduce:transition-none ${on ? "scale-y-0 rotate-90" : ""}`}
                      style={{ transformBox: "fill-box" }}
                    />
                  </svg>
                </span>
              </button>
              <div
                id={id}
                role="region"
                aria-hidden={!on}
                className={`grid transition-[grid-template-rows] duration-[460ms] ${EASE} motion-reduce:transition-none`}
                style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden min-h-[0px]">
                  <p
                    className={`m-0 max-w-[60ch] text-[16px] leading-[24px] text-[rgba(20,12,4,0.68)] transition-[opacity,transform] duration-[460ms] ${EASE} motion-reduce:transition-none ${phone ? "px-[18px] pb-[18px]" : "px-[22px] pb-[22px]"} ${on ? "opacity-100 translate-y-[0px]" : "opacity-0 -translate-y-[8px]"}`}
                  >
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** When founding pricing closes, as the banner shows it. */
const FOUNDING_UNTIL = "March 2027";

/**
 * The banner on top: a brown Doe box with the page's title, what founding pricing is, and when it ends in a tile of
 * its own (beside the title on desktop, under it on iPhone).
 */
function FoundingBanner({ phone }: { phone: boolean }) {
  return (
    <section
      aria-label="Founding pricing"
      className={`relative z-[1] mx-auto w-full max-w-[1120px] bg-[#281910] text-[#FFFCF1] ${phone ? "flex flex-col gap-[22px] px-[22px] pt-[24px] pb-[22px] rounded-[28px]" : "flex items-center justify-between gap-[48px] px-[56px] py-[52px] rounded-[32px]"}`}
    >
      <div className={`flex flex-col items-start ${phone ? "gap-[14px]" : "gap-[18px] max-w-[660px]"}`}>
        <span className="h-[28px] px-[12px] flex items-center gap-[7px] rounded-[999px] bg-[#FCCFB8] text-[12px] leading-[14px] font-[700] text-[#140C04] whitespace-nowrap">
          <span className="w-[6px] h-[6px] rounded-[999px] bg-[#A0522D]" aria-hidden="true" />
          Founding pricing
        </span>
        <h1 className={`m-0 font-[400] tracking-[-0.035em] [text-wrap:balance] ${phone ? "text-[30px] leading-[33px]" : "text-[46px] leading-[50px]"} ${p22Mackinac.className}`}>
          Teach personal agents about your clinic before it&apos;s too late.
        </h1>
        <p className={`m-0 [text-wrap:pretty] text-[rgba(255,252,241,0.7)] ${phone ? "text-[15px] leading-[22px]" : "text-[17px] leading-[25px]"}`}>
          Founding prices are open to practices that join before {FOUNDING_UNTIL}.
        </p>
      </div>
      <div
        className={`flex flex-col shrink-0 border-[1.5px] border-solid border-[rgba(252,207,184,0.35)] ${phone ? "flex-row items-baseline justify-between gap-[12px] px-[18px] py-[14px] rounded-[20px]" : "items-start gap-[6px] px-[28px] py-[26px] rounded-[24px] min-w-[240px]"}`}
      >
        <span className="text-[13px] leading-[17px] font-[600] text-[rgba(255,252,241,0.62)]">Founding pricing ends</span>
        <span className={`tracking-[-0.03em] text-[#FCCFB8] ${phone ? "text-[24px] leading-[28px]" : "text-[40px] leading-[44px]"} ${p22Mackinac.className}`}>{FOUNDING_UNTIL}</span>
      </div>
    </section>
  );
}

/**
 * /pricing — desk2 chrome around a pricing builder: the founding-pricing banner on top, the one-question-at-a-time
 * builder (practice, team, plan, contact), then questions and the footer. Desktop and iPhone layouts follow the desk2
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
        <div className={`mx-auto w-full max-w-[1320px] flex flex-col ${phone ? "px-[16px] gap-[28px] pt-[8px] pb-[48px]" : "px-[56px] gap-[40px] pt-[24px] pb-[96px]"}`}>
          <FoundingBanner phone={phone} />

          <DoeHealthPricingBuilder phone={phone} />

          <div className={phone ? "pt-[12px]" : "pt-[24px]"}>
            <Faq phone={phone} />
          </div>
        </div>
        <DoeHealthDesk2Footer sectionHrefBase={DESK2_PATH} />
      </main>
    </div>
  );
}
