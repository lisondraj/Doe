"use client";

import { useState } from "react";

function ordinal(n: number) {
  const suffix = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]}`;
}

/** Today's weekday and date, e.g. "Monday, October 19th". */
function todayHeading() {
  const d = new Date();
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${weekday}, ${month} ${ordinal(d.getDate())}`;
}

/**
 * Schedule tab — exported from Paper artboard "Triage 01 Clinic schedule"
 * (file "Tender mountain", page "Doe App v2"). Markup is kept as exported.
 *
 * Rendered as a shell-level layer (the root fills the inner shell), so it replaces the
 * integrations content panel while the Schedule tab is active.
 */
export function DoeHealthProductSchedulePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  return (
    <div className="[font-synthesis:none] wrap-anywhere text-[12px] leading-[16px] flex grow h-full p-[12px] rounded-[24px] overflow-clip gap-[12px] [background:radial-gradient(rgba(40,25,16,0.13)_0.9px,transparent_1.1px)_0%_0%/16px_16px,none_0%_0%_rgb(255,252,241)] antialiased">
      <div className="flex flex-col h-full min-w-[0px] gap-[28px] grow pt-[28px] pl-[28px] pr-[28px] pb-[0px]">
        <div className="flex items-start [width:100%] gap-[24px]">
          <div className="flex flex-col gap-[12px] [width:100%]">
            <div className="text-[46px] leading-[50px] tracking-[-0.025em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
              {todayHeading()}
            </div>
            <div className="flex flex-wrap items-center gap-[10px]">
              <div className="flex items-center shrink-0 gap-[8px]">
                <div className="w-[8px] h-[8px] shrink-0 rounded-[999px] bg-[#D6DEC6]" />
                <div className="flex items-center h-[28px] shrink-0 px-[12px] rounded-[999px] gap-[6px] bg-[#EEEADF]">
                  <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                    8
                  </div>
                  <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                    Ready for review
                  </div>
                </div>
              </div>
              <div className="flex items-center shrink-0 gap-[8px]">
                <div className="w-[8px] h-[8px] shrink-0 rounded-[999px] bg-salmon" />
                <div className="flex items-center h-[28px] shrink-0 px-[12px] rounded-[999px] gap-[6px] bg-[#EEEADF]">
                  <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                    4
                  </div>
                  <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                    With the patient
                  </div>
                </div>
              </div>
              <div className="flex items-center shrink-0 gap-[8px]">
                <div className="w-[8px] h-[8px] shrink-0 rounded-[999px] bg-[#28191052]" />
                <div className="flex items-center h-[28px] shrink-0 px-[12px] rounded-[999px] gap-[6px] bg-[#EEEADF]">
                  <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                    2
                  </div>
                  <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                    Not opened yet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col min-h-[0px] [width:100%] gap-[8px] grow">
          <div className="flex items-center gap-[8px] [align-self:end] shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
              <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" fill="none" stroke="#2819109E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="inline-block text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
              Last Sync 2 mins ago
            </div>
          </div>
          <div onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)} className="flex flex-col [width:100%] grow min-h-[0px] overflow-y-auto [scrollbar-width:none] rounded-[18px] relative px-[8px] bg-sand">
            <div className="sticky top-[0px] z-10 flex items-center [width:100%] pt-[20px] pb-[10px] gap-[16px] shrink-0 px-[16px] bg-sand">
              <div className="w-[64px] shrink-0 text-label leading-[18px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                Time
              </div>
              <div className="w-[190px] shrink-0 text-label leading-[18px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                Patient
              </div>
              <div className="grow min-w-[0px] text-label leading-[18px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                Reason for visit
              </div>
              <div className="w-[96px] shrink-0 text-label leading-[18px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                Clinician
              </div>
              <div className="w-[168px] shrink-0 text-label leading-[18px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                Intake
              </div>
            </div>
            {scrolled && (
              <div aria-hidden className="sticky top-[48px] z-[5] h-[36px] -mb-[36px] shrink-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(180deg, var(--color-sand) 0%, transparent 100%)' }} />
            )}
            <div
                className="flex flex-col [width:100%] gap-[4px] shrink-0 pb-[100px]"
                onClick={(e) => {
                  const id = (e.target as HTMLElement).closest<HTMLElement>("[data-appt]")?.dataset.appt;
                  if (id) setSelected((cur) => (cur === id ? null : id));
                }}
              >
              <div className="flex items-center [width:100%] h-[62px] px-[16px] rounded-[12px] gap-[16px] shrink-0 [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  8:30
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Maya Chen
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Right knee pain, three weeks
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                  Dr. Patel
                </div>
                <div className="w-[168px] shrink-0 flex">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#D6DEC6]">
                    <div className="flex text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2F3B2A]">
                      Ready for review
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] px-[16px] rounded-[12px] gap-[16px] shrink-0 [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  9:00
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Priya Raman
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  New patient, migraines
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                  Dr. Lin
                </div>
                <div className="w-[168px] shrink-0 flex">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-salmon">
                    <div className="flex text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-ink">
                      Paused at imaging
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] px-[16px] rounded-[12px] gap-[16px] shrink-0 [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  9:15
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Daniel Okafor
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Annual physical
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                  Dr. Patel
                </div>
                <div className="w-[168px] shrink-0 flex flex-col gap-[6px]">
                  <div className="text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                    In progress, 6 of 9
                  </div>
                  <div className="flex w-[120px] h-[4px] rounded-[999px] shrink-0 bg-[#2819101A]">
                    <div className="w-[80px] h-[4px] rounded-[999px] shrink-0 bg-[#4E5E46]" />
                  </div>
                </div>
              </div>
              <div data-appt="leo" data-selected={selected === "leo" ? "" : undefined} className="flex items-center cursor-pointer [width:100%] h-[62px] px-[16px] rounded-[12px] gap-[16px] shrink-0 [background-color:var(--color-paper)] [&[data-selected]]:[background-color:#F7F2E8]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  9:45
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  Leo Edwards
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Ear infection follow-up
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                  Dr. Roberts
                </div>
                <div className="w-[168px] shrink-0 flex">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#D6DEC6]">
                    <div className="flex text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2F3B2A]">
                      Ready for review
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] px-[16px] rounded-[12px] gap-[16px] shrink-0 [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  10:30
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Tom Halvorsen
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Blood pressure meds review
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                  Dr. Patel
                </div>
                <div className="w-[168px] shrink-0 flex">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#28191014]">
                    <div className="flex text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                      Opened, not started
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] px-[16px] rounded-[12px] gap-[16px] shrink-0 [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  11:00
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Grace Kim
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Rash on left forearm
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                  Dr. Roberts
                </div>
                <div className="w-[168px] shrink-0 flex">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] [box-shadow:#2819102E_0px_0px_0px_1px_inset]">
                    <div className="flex text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                      Link sent 7:02 AM
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] px-[16px] rounded-[12px] gap-[16px] shrink-0 [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  11:30
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Samuel Ortiz
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Type 2 diabetes check-in
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                  Dr. Lin
                </div>
                <div className="w-[168px] shrink-0 flex">
                  <div className="h-[28px] text-label leading-[18px] content-center font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                    Sends today at 2:00 PM
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] px-[16px] rounded-[12px] gap-[16px] shrink-0 [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  1:15
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Ana Ribeiro
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Prenatal visit, 20 weeks
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                  Dr. Lin
                </div>
                <div className="w-[168px] shrink-0 flex">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#D6DEC6]">
                    <div className="flex text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2F3B2A]">
                      Ready for review
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] shrink-0 px-[16px] rounded-[12px] gap-[16px] [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  2:00
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] inline-block font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Marcus Webb
                </div>
                <div className="w-[222px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Follow-up labs
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Dr. Patel
                </div>
                <div className="w-[168px] shrink-0 flex items-center">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#28191014]">
                    <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                      Link queued
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] shrink-0 px-[16px] rounded-[12px] gap-[16px] [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  2:30
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] inline-block font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Elena Cho
                </div>
                <div className="w-[222px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Skin check
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Dr. Roberts
                </div>
                <div className="w-[168px] shrink-0 flex items-center">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#28191014]">
                    <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                      Link queued
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] shrink-0 px-[16px] rounded-[12px] gap-[16px] [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  3:00
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] inline-block font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Hannah Brooks
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Post-op check, day 7
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Dr. Patel
                </div>
                <div className="w-[168px] shrink-0 flex items-center">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#D6DEC6]">
                    <div className="flex text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2F3B2A]">
                      Ready for review
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] shrink-0 px-[16px] rounded-[12px] gap-[16px] [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  3:15
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] inline-block font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Kenji Mori
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Migraine follow-up
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Dr. Lin
                </div>
                <div className="w-[168px] shrink-0 flex items-center">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#28191014]">
                    <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                      Link queued
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] shrink-0 px-[16px] rounded-[12px] gap-[16px] [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  3:30
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] inline-block font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Rosa Delgado
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Medication refill review
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Dr. Roberts
                </div>
                <div className="w-[168px] shrink-0 flex items-center">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#D6DEC6]">
                    <div className="flex text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2F3B2A]">
                      Ready for review
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] shrink-0 px-[16px] rounded-[12px] gap-[16px] [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  3:45
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] inline-block font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Owen Park
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Lab results, thyroid
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Dr. Patel
                </div>
                <div className="w-[168px] shrink-0 flex items-center">
                  <div className="h-[28px] text-label leading-[18px] content-center font-['Inter-Regular','Inter',system-ui,sans-serif] text-sub">
                    Sends today at 1:00 PM
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] shrink-0 px-[16px] rounded-[12px] gap-[16px] [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  4:00
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] inline-block font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Nadia Haddad
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Allergy consult
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Dr. Lin
                </div>
                <div className="w-[168px] shrink-0 flex items-center">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#28191014]">
                    <div className="text-label leading-[18px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">
                      Link queued
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center [width:100%] h-[62px] shrink-0 px-[16px] rounded-[12px] gap-[16px] [background-color:var(--color-paper)]">
                <div className="w-[64px] shrink-0 text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] text-walnut">
                  4:30
                </div>
                <div className="w-[190px] shrink-0 text-[17px] leading-[22px] tracking-[-0.02em] inline-block font-['DM_Sans',system-ui,sans-serif] text-ink">
                  Theo Lindqvist
                </div>
                <div className="grow min-w-[0px] text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Well-child visit
                </div>
                <div className="w-[96px] shrink-0 text-[15px] leading-gutter inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910C7]">
                  Dr. Roberts
                </div>
                <div className="w-[168px] shrink-0 flex items-center">
                  <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#D6DEC6]">
                    <div className="flex text-label leading-[18px] font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-[#2F3B2A]">
                      Ready for review
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-[0px] -mt-[124px] h-[124px] shrink-0 pointer-events-none rounded-br-[18px] rounded-bl-[18px]" style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(99% -0.001 0.015 / 0%) 0%, oklab(99% -0.001 0.015 / 55%) 40%, oklab(99% -0.001 0.015 / 92%) 75%, oklab(99% -0.001 0.015) 100%)' }} />
          </div>
        </div>
      </div>
      {selected ? (
      <div className="flex flex-col w-[420px] h-full pt-[24px] pb-[22px] rounded-[20px] gap-[14px] shrink-0 px-[22px] [box-shadow:#FFFCF10F_0px_1px_0px_inset,#00000029_0px_4px_14px] bg-ink border border-solid border-[#FFFCF11F]">
        <div className="flex items-center justify-between shrink-0 gap-[12px]">
          <div className="flex items-center min-w-[0px] gap-[12px]">
            <div className="text-[28px] leading-[34px] tracking-[-0.02em] inline-block font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">
              Leo Edwards
            </div>
          </div>
          <div className="flex items-center justify-center w-[34px] h-[34px] shrink-0 rounded-[10px] bg-[#FFFCF10F]">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
              <circle cx="3.5" cy="8" r="1.3" fill="#FFFCF1B3" />
              <circle cx="8" cy="8" r="1.3" fill="#FFFCF1B3" />
              <circle cx="12.5" cy="8" r="1.3" fill="#FFFCF1B3" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-center [width:100%] h-[212px] shrink-0 rounded-[14px] overflow-clip relative bg-origin-border border border-solid border-[#FFFCF114]" style={{ backgroundImage: 'linear-gradient(in oklab 160deg, oklab(29.8% 0.020 0.023) 0%, oklab(21.8% 0.015 0.011) 100%)' }}>
          <div className="flex items-center justify-center w-[52px] h-[52px] rounded-[999px] shrink-0 bg-[#FFFCF1E6]">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
              <path d="M6 4.2v9.6c0 .5.6.8 1 .5l7.2-4.8c.4-.3.4-.8 0-1.1L7 3.7c-.4-.3-1 0-1 .5Z" fill="#140C04" />
            </svg>
          </div>
          <div className="absolute left-[12px] bottom-[12px] flex items-center h-[28px] px-[10px] rounded-[8px] gap-[8px] bg-[#140C04B3]">
            <div className="text-[12px] leading-[16px] inline-block font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">
              Intake call
            </div>
            <div className="text-[12px] leading-[16px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF199]">
              6:02
            </div>
          </div>
        </div>
        <div className="flex [width:100%] shrink-0 gap-[8px]">
          <div className="flex flex-col grow basis-[0px] min-w-[0px] py-[12px] px-[14px] rounded-[12px] gap-[4px] bg-[#FFFCF10F]">
            <div className="text-[12px] leading-[16px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF180]">
              Appointment
            </div>
            <div className="text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">
              9:45 AM
            </div>
          </div>
          <div className="flex flex-col grow basis-[0px] min-w-[0px] py-[12px] px-[14px] rounded-[12px] gap-[4px] bg-[#FFFCF10F]">
            <div className="text-[12px] leading-[16px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF180]">
              Clinician
            </div>
            <div className="text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">
              Dr. Roberts
            </div>
          </div>
          <div className="flex flex-col grow basis-[0px] min-w-[0px] py-[12px] px-[14px] rounded-[12px] gap-[4px] bg-[#FFFCF10F]">
            <div className="text-[12px] leading-[16px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF180]">
              Filled by
            </div>
            <div className="text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">
              Mia (Mom)
            </div>
          </div>
        </div>
        <div className="flex flex-col grow basis-[0px] min-h-[0px] [width:100%] rounded-[14px] overflow-clip bg-[#FFFCF10A] border border-solid border-[#FFFCF114]">
          <div className="flex items-center justify-between shrink-0 py-[12px] px-[14px] border-b border-b-solid border-b-[#FFFCF114]">
            <div className="text-[15px] leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">
              Intake answers
            </div>
          </div>
          <div className="flex flex-col grow basis-[0px] min-h-[0px]">
            <div className="flex items-center grow basis-[0px] min-h-[44px] px-[14px] gap-[12px] border-b border-b-solid border-b-[#FFFCF10F]">
              <div className="w-[92px] shrink-0 text-label leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF180]">
                Ear pain
              </div>
              <div className="grow basis-[0px] min-w-[0px] text-[14px] leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF1E6]">
                Right ear, since Sunday
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
                <path d="M5 3l4 4-4 4" fill="none" stroke="#FFFCF166" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex items-center grow basis-[0px] min-h-[44px] px-[14px] gap-[12px] border-b border-b-solid border-b-[#FFFCF10F]">
              <div className="w-[92px] shrink-0 text-label leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF180]">
                Fever
              </div>
              <div className="grow basis-[0px] min-w-[0px] text-[14px] leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF1E6]">
                38.2° Tuesday, none since
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
                <path d="M5 3l4 4-4 4" fill="none" stroke="#FFFCF166" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex items-center grow basis-[0px] min-h-[44px] px-[14px] gap-[12px] border-b border-b-solid border-b-[#FFFCF10F]">
              <div className="w-[92px] shrink-0 text-label leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF180]">
                Antibiotics
              </div>
              <div className="grow basis-[0px] min-w-[0px] text-[14px] leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF1E6]">
                Amoxicillin, done Oct 5
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
                <path d="M5 3l4 4-4 4" fill="none" stroke="#FFFCF166" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex items-center grow basis-[0px] min-h-[44px] px-[14px] gap-[12px] border-b border-b-solid border-b-[#FFFCF10F]">
              <div className="w-[92px] shrink-0 text-label leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF180]">
                Allergies
              </div>
              <div className="grow basis-[0px] min-w-[0px] text-[14px] leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF1E6]">
                None reported
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
                <path d="M5 3l4 4-4 4" fill="none" stroke="#FFFCF166" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex items-center grow basis-[0px] min-h-[44px] px-[14px] gap-[12px]">
              <div className="w-[92px] shrink-0 text-label leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF180]">
                Mia&apos;s note
              </div>
              <div className="grow basis-[0px] min-w-[0px] text-[14px] leading-[18px] inline-block font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#FFFCF1E6]">
                Feels full, worse lying down
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
                <path d="M5 3l4 4-4 4" fill="none" stroke="#FFFCF166" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex [width:100%] shrink-0 gap-[8px]">
          <div className="flex items-center justify-center grow basis-[0px] h-[46px] rounded-[12px] bg-salmon">
            <div className="text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] text-ink">
              See Details
            </div>
          </div>
          <div className="flex items-center justify-center h-[46px] shrink-0 px-[16px] rounded-[12px] gap-[8px] border border-solid border-[#FFFCF12E]">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: '0' }}>
              <path d="M2.5 4.5A1.5 1.5 0 0 1 4 3h8a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 12 11H6.5L3.5 13.5V11H4a1.5 1.5 0 0 1-1.5-1.5v-5Z" fill="none" stroke="#FFFCF1" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            <div className="text-msg leading-gutter inline-block font-['DM_Sans',system-ui,sans-serif] font-[500] [color:var(--color-paper)]">
              Message Mia
            </div>
          </div>
        </div>
      </div>
      ) : (
        <UnopenedPanel />
      )}
    </div>
  );
}

/** The state with no appointment open: a plain paper card in place of the dark visit panel. */
function UnopenedPanel() {
  return (
    <div className="flex flex-col items-center justify-center w-[420px] h-full shrink-0 gap-[12px] px-[32px] text-center rounded-[20px] bg-[#FFFCF1] border border-solid border-[#28191024] [box-shadow:0px_1px_2px_#2819100F]">
      <div className="flex items-center justify-center w-[44px] h-[44px] rounded-[999px] bg-[#EEEADF]">
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block", flexShrink: "0" }}>
          <path d="M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="text-[26px] leading-[30px] tracking-[-0.02em] font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500] text-walnut">
        No appointment open
      </div>
      <div className="max-w-[280px] text-[14px] leading-[20px] font-['Inter-Regular','Inter',system-ui,sans-serif] text-[#281910A8]">
        Select a visit to see its intake call, answers, and what still needs review.
      </div>
      <div className="flex flex-wrap justify-center gap-[8px] mt-[8px]">
        <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#EEEADF] text-label font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">8 ready for review</div>
        <div className="flex items-center h-[28px] px-[12px] rounded-[999px] bg-[#EEEADF] text-label font-['Inter-Regular_Medium','Inter',system-ui,sans-serif] font-[500] text-walnut">2 not opened yet</div>
      </div>
    </div>
  );
}
