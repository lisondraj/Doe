"use client";

/**
 * Integrations tab — how patients' agents find and work with the practice. A sample agent question shows the
 * answer Doe gives back, the agents that visited this week, and a checklist of everything that keeps the
 * practice reachable.
 */
import { useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const QUERIES = [
  {
    q: "Pediatric ENT near Brookline that takes Harbor Mutual",
    answer: "Ear check with Dr. Shah",
    detail: "Today 4:15 · $25 copay",
    used: ["Services", "Insurance", "Availability"],
    result: "Booked by agent",
  },
  {
    q: "Flu shot this week before 9 am",
    answer: "Flu shot",
    detail: "Thu 8:15 · Covered",
    used: ["Services", "Availability", "Prices"],
    result: "Booked by agent",
  },
  {
    q: "Annual physical with a female doctor",
    answer: "Annual physical with Dr. Patel",
    detail: "Wed 10:00 · $0 with Aetna",
    used: ["Providers", "Insurance", "Availability"],
    result: "Booked by agent",
  },
  {
    q: "Hearing aid fitting near me",
    answer: "Not offered to agents",
    detail: "The agent is asked to call the front desk",
    used: ["Permissions"],
    result: "Sent to front desk",
  },
];

const AGENTS = [
  { name: "ChatGPT", visits: 14 },
  { name: "Gemini", visits: 8 },
  { name: "Claude", visits: 5 },
  { name: "Perplexity", visits: 3 },
  { name: "Siri", visits: 1 },
];

const CHECKS = [
  { label: "Practice index", note: "Published, machine-readable", ok: true },
  { label: "Services and prices", note: "24 listed", ok: true },
  { label: "Live availability", note: "Synced with ModMed", ok: true },
  { label: "Insurance plans", note: "18 plans", ok: true },
  { label: "Provider profiles", note: "5 providers", ok: true },
  { label: "Direct booking", note: "Agents can book", ok: true },
  { label: "Intake forms", note: "Agent-fillable through Phreesia", ok: true },
  { label: "Payment at booking", note: "InstaMed", ok: true },
  { label: "Phone agent", note: "Voice answers 24/7", ok: true },
  { label: "Hours and location", note: "Brookline, open until 6", ok: true },
  { label: "Eligibility checks", note: "Paused, Waystar offline", ok: false },
];

function Ring({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <circle cx="64" cy="64" r={r} fill="none" stroke="#FFFCF199" strokeWidth="12" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="#140C04"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${c * value} ${c}`}
        transform="rotate(-90 64 64)"
      />
    </svg>
  );
}

export function DoeHealthProductSearchPage() {
  const [picked, setPicked] = useState(0);
  const query = QUERIES[picked]!;
  const ready = CHECKS.filter((c) => c.ok).length;
  const most = Math.max(...AGENTS.map((a) => a.visits));

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[24px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">

      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Integrations</span>
      </div>

      <div className="relative flex grow min-h-[0px] gap-[12px]">
        <div className="grow min-w-[0px] flex flex-col gap-[12px]">
          <div className="flex flex-col gap-[16px] p-[24px] rounded-[30px] bg-sand">
            <div className="flex items-center gap-[12px] h-[60px] px-[22px] rounded-[999px] bg-paper">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
                <circle cx="11" cy="11" r="6.5" fill="none" stroke="#281910" strokeWidth="2" />
                <path d="M16 16l4 4" stroke="#281910" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span key={query.q} className={`doe-menu-in truncate text-[17px] leading-[22px] ${SANS} font-[500] text-walnut`}>
                {query.q}
              </span>
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {QUERIES.map((item, i) => (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setPicked(i)}
                  className={`h-[32px] px-[14px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${picked === i ? "bg-ink [color:#FFFCF1]" : "bg-[#FFFCF1B3] text-walnut hover:bg-paper"}`}
                >
                  {item.q.split(" ").slice(0, 3).join(" ")}
                </button>
              ))}
            </div>
            <div key={picked} className="doe-menu-in flex items-center gap-[18px] p-[20px] rounded-[24px] bg-paper">
              <span className={`w-[56px] h-[56px] shrink-0 flex items-center justify-center rounded-[18px] bg-salmon text-[22px] leading-[24px] ${DISPLAY} text-walnut`}>R</span>
              <span className="flex flex-col grow min-w-[0px] gap-[4px]">
                <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>Roberts Family Medicine</span>
                <span className={`truncate text-[24px] leading-[28px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{query.answer}</span>
                <span className={`text-[13px] leading-[18px] ${SANS} font-[500] text-sub`}>{query.detail}</span>
              </span>
              <span className="flex flex-col items-end gap-[8px] shrink-0">
                <span
                  className={`flex items-center h-[28px] px-[12px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[600] text-walnut`}
                  style={{ backgroundColor: query.result === "Booked by agent" ? "#DCE5D0" : "#F3E7C9" }}
                >
                  {query.result}
                </span>
                <span className="flex gap-[4px]">
                  {query.used.map((u) => (
                    <span key={u} className={`h-[22px] flex items-center px-[8px] rounded-[999px] bg-sand text-[11px] leading-[14px] ${SANS} font-[500] text-sub`}>
                      {u}
                    </span>
                  ))}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col grow min-h-[0px] gap-[14px] p-[24px] rounded-[30px] bg-[#FAF6EC]">
            <span className="flex items-baseline justify-between">
              <span className={`text-[22px] leading-[26px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>Found by</span>
              <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{AGENTS.reduce((s, a) => s + a.visits, 0)} agents this week</span>
            </span>
            <div className="grid grid-cols-5 gap-[10px] grow min-h-[0px]">
              {AGENTS.map((a) => (
                <div key={a.name} className="flex flex-col justify-end gap-[10px] min-h-[0px]">
                  <div className="relative grow min-h-[0px] rounded-[20px] bg-[#EFE8D9] overflow-hidden">
                    <span
                      className="absolute bottom-0 left-0 right-0 rounded-[20px] bg-[#E8A585]"
                      style={{ height: `${(a.visits / most) * 100}%`, transition: `height 400ms ${EASE}` }}
                    />
                    <span className={`absolute top-[12px] left-[14px] text-[26px] leading-[30px] ${DISPLAY} text-walnut`}>{a.visits}</span>
                  </div>
                  <span className={`text-center text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}>{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[420px] shrink-0 flex flex-col gap-[12px] min-h-[0px]">
          <div className="flex items-center gap-[20px] p-[20px] rounded-[30px] bg-[#DCE5D0]">
            <Ring value={ready / CHECKS.length} />
            <span className="flex flex-col gap-[4px]">
              <span className={`text-[44px] leading-[48px] tracking-[-0.02em] ${DISPLAY} text-ink`}>
                {ready}/{CHECKS.length}
              </span>
              <span className={`text-[13px] leading-[18px] ${SANS} font-[500] text-walnut opacity-70`}>Ready for agents</span>
            </span>
          </div>
          <div className="flex flex-col grow min-h-[0px] p-[8px] rounded-[30px] bg-[#FAF6EC] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CHECKS.map((c) => (
              <div key={c.label} className="flex items-center gap-[12px] h-[52px] shrink-0 px-[12px] rounded-[18px] hover:bg-sand transition-colors duration-150">
                <span className={`w-[24px] h-[24px] shrink-0 flex items-center justify-center rounded-[999px] ${c.ok ? "bg-[#DCE5D0]" : "bg-salmon"}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                    <path
                      d={c.ok ? "M5 12.5l4.5 4.5L19 7.5" : "M12 7v6M12 17h.01"}
                      fill="none"
                      stroke="#281910"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="flex flex-col grow min-w-[0px]">
                  <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{c.label}</span>
                  <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>{c.note}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
