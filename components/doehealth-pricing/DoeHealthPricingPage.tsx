"use client";

import { useState } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { articleBoxColors } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
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
 * Questions, one open at a time, as Doe's boxes: white rows in a beige box. An answer slides open by growing its row
 * from nothing to its height (a grid row animates where `height: auto` can't), its text easing down into place, and
 * the plus turns into a minus.
 */
function Faq({ phone }: { phone: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className={`grid gap-[24px] ${phone ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-[56px]"}`} aria-label="Questions">
      <h2 className={`m-0 text-[clamp(34px,4vw,52px)] leading-[1.02] tracking-[-0.035em] font-[400] text-[#281910] ${p22Mackinac.className}`}>Questions</h2>
      <div className="flex flex-col gap-[6px] p-[6px] rounded-[26px] bg-[#F4EEDF]">
        {PRICING_FAQ.map((f, i) => {
          const on = open === i;
          const id = `pricing-faq-${i}`;
          return (
            <div key={f.q} className="flex flex-col rounded-[20px] bg-white">
              <button
                type="button"
                aria-expanded={on}
                aria-controls={id}
                onClick={() => setOpen(on ? null : i)}
                className={`flex items-center justify-between gap-[16px] text-left ${phone ? "p-[18px]" : "px-[22px] py-[20px]"}`}
              >
                <span className={`font-[600] text-[#140C04] ${phone ? "text-[16px] leading-[22px]" : "text-[17px] leading-[23px]"}`}>{f.q}</span>
                <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 text-[#281910]" style={{ display: "block" }}>
                  <path d="M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path
                    d="M6 1v10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className={`origin-center transition-transform duration-[420ms] ${EASE} motion-reduce:transition-none ${on ? "scale-y-0 rotate-90" : ""}`}
                    style={{ transformBox: "fill-box" }}
                  />
                </svg>
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
                    className={`m-0 max-w-[60ch] text-[16px] leading-[24px] text-[rgba(20,12,4,0.64)] transition-[opacity,transform] duration-[460ms] ${EASE} motion-reduce:transition-none ${phone ? "px-[18px] pb-[18px]" : "px-[22px] pb-[22px]"} ${on ? "opacity-100 translate-y-[0px]" : "opacity-0 -translate-y-[8px]"}`}
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

/** The tan ink /news sets its boxed copy in. The title is set at the questions' title size. */
const NEWS_INK = "#8A6A3F";

/**
 * The banner on top: one of the /news boxes (warm beige, the dot wave along the bottom) with the page's title and,
 * under it, a small pill for founding pricing and when it ends. Everything sits to the left.
 */
function FoundingBanner({ phone }: { phone: boolean }) {
  const box = articleBoxColors("sand");
  return (
    <section aria-label="Founding pricing" className="mx-auto w-full max-w-[1120px]">
      {/* The /news box markup, built here rather than with its placeholder so the title isn't hidden from screen readers. */}
      <div className="doehealth-blog-placeholder doehealth-blog-placeholder--pattern doe-pricing-banner" style={{ background: box.bg }}>
        <DoeHealthBlogDotWave color={box.dot} top={phone ? 0.66 : 0.72} amp={70} phase={2.2} scale={1.05} slant={-0.3} flip />
        <div className="doehealth-blog-placeholder__content">
          <div className={`flex flex-col items-start text-left w-full ${phone ? "gap-[18px]" : "gap-[24px]"}`}>
            <h1
              className={`m-0 font-[400] tracking-[-0.035em] [text-wrap:balance] ${phone ? "text-[34px] leading-[37px]" : "max-w-[22ch] text-[48px] leading-[51px]"} ${p22Mackinac.className}`}
              style={{ color: NEWS_INK }}
            >
              Teach personal agents about your clinic before it&apos;s too late.
            </h1>
            <span className="inline-flex items-center gap-[10px] h-[34px] px-[14px] rounded-[999px] bg-white text-[14px] leading-[18px] whitespace-nowrap">
              <span className="font-[500] text-[#281910]">Founding Pricing</span>
              <span className="w-[1px] h-[14px] bg-[rgba(20,12,4,0.12)]" aria-hidden="true" />
              <span style={{ color: NEWS_INK }}>Until {FOUNDING_UNTIL}</span>
            </span>
          </div>
        </div>
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
        <div className={`mx-auto w-full max-w-[1320px] flex flex-col ${phone ? "px-[26px] gap-[28px] pt-[8px] pb-[48px]" : "px-[56px] gap-[40px] pt-[24px] pb-[96px]"}`}>
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
