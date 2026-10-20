"use client";

/**
 * Referrals tab — four soft columns from Sent to Seen. Each referral is a rounded card that can be
 * moved on to the next stage.
 */
import { useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";

const STAGES = [
  { id: "sent", label: "Sent", tone: "#EEE6D6", dot: "#C2A987" },
  { id: "accepted", label: "Accepted", tone: "#F6DED0", dot: "#E8A585" },
  { id: "scheduled", label: "Scheduled", tone: "#E3E9D9", dot: "#8DAA7C" },
  { id: "seen", label: "Seen", tone: "#DCE5D0", dot: "#6E9A5B" },
] as const;

type Stage = (typeof STAGES)[number]["id"];

const START: { id: string; who: string; specialty: string; to: string; stage: Stage }[] = [
  { id: "leo", who: "Leo Jacobs", specialty: "ENT", to: "Boston Children’s", stage: "sent" },
  { id: "ava", who: "Ava Brooks", specialty: "Dermatology", to: "Beacon Dermatology", stage: "sent" },
  { id: "noah", who: "Noah Bennett", specialty: "Sleep study", to: "Mass General", stage: "sent" },
  { id: "henry", who: "Henry Walsh", specialty: "Cardiology", to: "Beth Israel", stage: "accepted" },
  { id: "lily", who: "Lily Park", specialty: "Allergy", to: "Brookline Allergy", stage: "accepted" },
  { id: "grace", who: "Grace Kim", specialty: "Orthopedics", to: "Tue, Oct 27", stage: "scheduled" },
  { id: "omar", who: "Omar Haddad", specialty: "Physical therapy", to: "Mon, Oct 26", stage: "scheduled" },
  { id: "priya", who: "Priya Raman", specialty: "Neurology", to: "Notes in chart", stage: "seen" },
];

export function DoeHealthProductReferralsPage() {
  const [stages, setStages] = useState<Record<string, Stage>>(() => Object.fromEntries(START.map((r) => [r.id, r.stage])));
  const advance = (id: string) =>
    setStages((prev) => {
      const i = STAGES.findIndex((s) => s.id === prev[id]);
      return { ...prev, [id]: STAGES[Math.min(STAGES.length - 1, i + 1)]!.id };
    });

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[24px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">

      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Referrals</span>
        <span className={`flex items-center gap-[8px] h-[40px] px-[16px] rounded-[999px] bg-[#EEEADF] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>
          <span className="w-[7px] h-[7px] rounded-[99px] bg-[#6E9A5B]" />
          Synced with Kno2
        </span>
      </div>

      <div className="relative grid grid-cols-4 gap-[12px] grow min-h-[0px]">
        {STAGES.map((stage, si) => {
          const cards = START.filter((r) => stages[r.id] === stage.id);
          return (
            <div key={stage.id} className="flex flex-col min-h-[0px] gap-[10px] p-[10px] rounded-[30px] bg-[#FAF6EC]">
              <div className="flex items-center justify-between px-[10px] pt-[8px] pb-[4px]">
                <span className="flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-[99px]" style={{ backgroundColor: stage.dot }} />
                  <span className={`text-[20px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{stage.label}</span>
                </span>
                <span className={`text-[28px] leading-[32px] ${DISPLAY} text-sub`}>{cards.length}</span>
              </div>
              <div className="flex flex-col gap-[8px] min-h-[0px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {cards.map((r) => (
                  <div key={r.id} className="doe-menu-in flex items-center gap-[12px] p-[16px] rounded-[22px]" style={{ backgroundColor: stage.tone }}>
                    <span className="flex flex-col grow min-w-[0px] gap-[2px]">
                      <span className={`truncate text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>{r.who}</span>
                      <span className={`truncate text-[12px] leading-[16px] ${SANS} font-[500] text-walnut opacity-70`}>
                        {r.specialty} · {r.to}
                      </span>
                    </span>
                    {si < STAGES.length - 1 && (
                      <button
                        type="button"
                        aria-label={`Move ${r.who} to ${STAGES[si + 1]!.label}`}
                        onClick={() => advance(r.id)}
                        className="w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FFFCF1B3] hover:bg-paper text-walnut transition-colors duration-150"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                          <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
