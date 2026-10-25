"use client";

/**
 * Integrations tab — what any connected agent can see and do at this practice. The permissions sit in the
 * middle (each is Bookable, Request only, or Hidden); on the right, what an agent sees today follows those
 * choices, then the latest decisions made for agents, then the same settings in plain words.
 */
import { useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type Mode = "bookable" | "request" | "hidden";

const MODES: { id: Mode; label: string; tone: string }[] = [
  { id: "bookable", label: "Bookable", tone: "#DCE5D0" },
  { id: "request", label: "Request only", tone: "#F3E7C9" },
  { id: "hidden", label: "Hidden", tone: "#E6E0D2" },
];
const OPTION_W = 104;

type Permission = { id: string; name: string; note: string; group: "See" | "Book" | "Handle"; mode: Mode };

const PERMISSIONS: Permission[] = [
  { id: "services", name: "Services and prices", note: "24 services listed", group: "See", mode: "bookable" },
  { id: "availability", name: "Live availability", note: "Synced with ModMed", group: "See", mode: "bookable" },
  { id: "providers", name: "Provider profiles", note: "Bios, specialties, languages", group: "See", mode: "bookable" },
  { id: "established", name: "Established patients", note: "Confirmed on its own", group: "Book", mode: "bookable" },
  { id: "new", name: "New patients", note: "You approve each one", group: "Book", mode: "request" },
  { id: "forms", name: "Intake forms", note: "Patient reviews first", group: "Handle", mode: "request" },
  { id: "desk", name: "Front desk messages", note: "Non-urgent only", group: "Handle", mode: "hidden" },
];

const GROUPS: Permission["group"][] = ["See", "Book", "Handle"];

const NAV = [
  { label: "Permissions", on: true, icon: "M12 3.8l6.8 2.6v5.1c0 4.2-2.8 7.4-6.8 8.8-4-1.4-6.8-4.6-6.8-8.8V6.4z" },
  { label: "Rules", on: false, icon: "M4 7h16M7 12h10M10 17h4" },
  { label: "Exceptions", on: false, icon: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1", count: "2" },
  { label: "Activity", on: false, icon: "M13 3.5L5.5 13H12l-1 7.5L18.5 11H12z" },
  { label: "Test a request", on: false, icon: "M8 5.5v13l10-6.5z" },
];

const AGENT_MARKS = [
  { letter: "I", bg: "#F6B99C", fg: "#5B2A17" },
  { letter: "M", bg: "#C9D8BB", fg: "#2F4A22" },
  { letter: "C", bg: "#281910", fg: "#FFFCF1" },
  { letter: "C", bg: "#EBC8A8", fg: "#5B3517" },
  { letter: "G", bg: "#D5D9EA", fg: "#2A3260" },
];

const DECISIONS = [
  { when: "2m", verdict: "Allowed", tone: "#3F6431", what: "booked Tue 4:15", why: "Established patient, Harbor Mutual" },
  { when: "14m", verdict: "Held", tone: "#8A6A10", what: "new patient waiting", why: "Needs your approval" },
  { when: "1h", verdict: "Blocked", tone: "#A4452B", what: "message the front desk", why: "Hidden for every agent" },
];

const RULE = "border-[rgba(40,25,16,0.1)]";

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const index = MODES.findIndex((m) => m.id === mode);
  return (
    <div className="relative flex h-[38px] p-[4px] shrink-0 rounded-[999px] bg-[#EEEADF]">
      <span
        className="absolute top-[4px] bottom-[4px] rounded-[999px]"
        style={{
          width: OPTION_W,
          left: 4 + index * OPTION_W,
          backgroundColor: MODES[index]!.tone,
          transition: `left 300ms ${EASE}, background-color 300ms ${EASE}`,
        }}
      />
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={`relative rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${mode === m.id ? "text-walnut" : "text-sub hover:text-walnut"}`}
          style={{ width: OPTION_W }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

/** The permissions as a sentence: what any agent can read, what it books on its own, and what waits for the practice. */
function plainWords(modes: Record<string, Mode>) {
  const open = (id: string) => modes[id] !== "hidden";
  const read = [open("services") && "your services and prices", open("availability") && "live openings", open("providers") && "provider profiles"].filter(Boolean) as string[];
  const reads = read.length === 0 ? "It cannot read anything about the practice" : `Any agent can read ${read.length > 1 ? `${read.slice(0, -1).join(", ")} and ${read[read.length - 1]}` : read[0]}`;
  const book = (id: string, who: string) =>
    modes[id] === "bookable" ? `books ${who} on its own` : modes[id] === "request" ? `asks you first for ${who}` : `does not book ${who}`;
  const booking = `It ${book("established", "established patients")}, and ${book("new", "new patients")}`;
  const desk = modes.desk === "hidden" ? "It cannot message the front desk." : modes.desk === "request" ? "Messages to the front desk wait for you." : "It can message the front desk.";
  return `${reads}. ${booking}. ${desk}`;
}

function Check({ tone, kind }: { tone: string; kind: "ok" | "wait" | "off" }) {
  return (
    <span className="w-[18px] h-[18px] shrink-0 flex items-center justify-center rounded-[999px]" style={{ backgroundColor: tone }}>
      {kind === "ok" ? (
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFCF1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

export function DoeHealthProductSearchPage() {
  const [modes, setModes] = useState<Record<string, Mode>>(() => Object.fromEntries(PERMISSIONS.map((p) => [p.id, p.mode])));

  const sees = [
    { label: "Services and prices", id: "services", on: "24", ask: "on request" },
    { label: "Live availability", id: "availability", on: "12 openings", ask: "on request" },
    { label: "Providers", id: "providers", on: "5", ask: "on request" },
    { label: "Booking, established", id: "established", on: "on its own", ask: "needs you" },
    { label: "Booking, new patients", id: "new", on: "on its own", ask: "needs you" },
    { label: "Front desk messages", id: "desk", on: "on its own", ask: "needs you" },
  ];

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[22px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Integrations</span>
        <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>Connect an agent</span>
      </div>

      <div className="relative flex grow min-h-[0px] gap-[32px]">
        <div className="w-[176px] shrink-0 flex flex-col pt-[4px]">
          {NAV.map((item) => (
            <span
              key={item.label}
              aria-current={item.on ? "page" : undefined}
              className={`relative flex items-center gap-[10px] h-[42px] pl-[14px] text-[15px] leading-[18px] ${SANS} ${item.on ? "font-[500] text-walnut" : "text-sub"}`}
            >
              {item.on ? <span className="absolute left-0 top-[10px] bottom-[10px] w-[2.5px] rounded-[2px] bg-ink" /> : null}
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
                <path d={item.icon} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item.label}
              {item.count ? <span className={`ml-auto text-[12px] ${SANS} text-[rgba(40,25,16,0.42)]`}>{item.count}</span> : null}
            </span>
          ))}
          <div className={`flex flex-col gap-[10px] mt-[24px] pt-[16px] border-t ${RULE}`}>
            <span className="flex">
              {AGENT_MARKS.map((a, i) => (
                <span
                  key={i}
                  className={`w-[30px] h-[30px] flex items-center justify-center rounded-[999px] text-[14px] leading-[16px] ${DISPLAY} ${i ? "-ml-[8px]" : ""}`}
                  style={{ backgroundColor: a.bg, color: a.fg, boxShadow: "0 0 0 2px #FFFCF1" }}
                >
                  {a.letter}
                </span>
              ))}
            </span>
            <span className={`text-[13px] leading-[19px] ${SANS} text-sub`}>Applies to the 6 agents connected today. New agents start from this.</span>
          </div>
        </div>

        <div className="grow min-w-[0px] flex flex-col px-[28px] pt-[22px] pb-[10px] rounded-[28px] bg-[#FAF6EC] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="flex items-baseline justify-between">
            <span className={`text-[30px] leading-[34px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>Permissions</span>
            <span className={`text-[13px] leading-[16px] ${SANS} text-sub`}>Saved automatically</span>
          </span>
          {GROUPS.map((group) => (
            <div key={group} className="flex flex-col">
              <span className={`pt-[18px] pb-[8px] text-[11.5px] leading-[14px] tracking-[0.07em] uppercase ${SANS} font-[500] text-[rgba(40,25,16,0.42)]`}>{group}</span>
              {PERMISSIONS.filter((p) => p.group === group).map((p) => (
                <div key={p.id} className={`flex items-center justify-between gap-[16px] h-[70px] shrink-0 border-t ${RULE}`}>
                  <span className="flex flex-col min-w-[0px]">
                    <span className={`truncate text-[15px] leading-[19px] ${SANS} font-[500] text-walnut`}>{p.name}</span>
                    <span className={`truncate text-[12.5px] leading-[17px] ${SANS} text-sub`}>{p.note}</span>
                  </span>
                  <ModeSwitch mode={modes[p.id]!} onChange={(m) => setModes((prev) => ({ ...prev, [p.id]: m }))} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="w-[320px] shrink-0 flex flex-col min-h-[0px] pt-[4px]">
          <span className={`pb-[8px] text-[11.5px] leading-[14px] tracking-[0.07em] uppercase ${SANS} font-[500] text-[rgba(40,25,16,0.42)]`}>What an agent sees today</span>
          {sees.map((s) => {
            const mode = modes[s.id]!;
            return (
              <div key={s.label} className={`flex items-center gap-[11px] h-[36px] shrink-0 border-b ${RULE}`}>
                <Check kind={mode === "bookable" ? "ok" : mode === "request" ? "wait" : "off"} tone={mode === "bookable" ? "#6E9A5B" : mode === "request" ? "#D9A227" : "#E1D9C8"} />
                <span
                  className={`text-[14px] leading-[18px] ${SANS} ${mode === "hidden" ? "text-[rgba(40,25,16,0.42)] line-through decoration-[rgba(40,25,16,0.3)]" : "text-walnut"}`}
                >
                  {s.label}
                </span>
                {mode !== "hidden" ? (
                  <span className={`ml-auto text-[12.5px] ${SANS} text-[rgba(40,25,16,0.42)]`}>{mode === "request" ? s.ask : s.on}</span>
                ) : null}
              </div>
            );
          })}

          <span className={`mt-[22px] pb-[2px] text-[11.5px] leading-[14px] tracking-[0.07em] uppercase ${SANS} font-[500] text-[rgba(40,25,16,0.42)]`}>Recent decisions</span>
          {DECISIONS.map((d) => (
            <div key={d.when} className="grid grid-cols-[40px_1fr] gap-[6px] py-[8px] border-b border-dotted border-[rgba(40,25,16,0.2)]">
              <span className={`text-[12px] leading-[18px] ${SANS} text-[rgba(40,25,16,0.42)]`}>{d.when}</span>
              <span className="flex flex-col">
                <span className={`text-[13.5px] leading-[18px] ${SANS} text-walnut`}>
                  <span className="font-[500]" style={{ color: d.tone }}>
                    {d.verdict}
                  </span>{" "}
                  · {d.what}
                </span>
                <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{d.why}</span>
              </span>
            </div>
          ))}

          <div className="flex flex-col grow justify-end gap-[8px] pt-[18px] min-h-[0px]">
            <span className={`text-[11.5px] leading-[14px] tracking-[0.07em] uppercase ${SANS} font-[500] text-[rgba(40,25,16,0.42)]`}>In plain words</span>
            <p className={`text-[17px] leading-[25px] tracking-[-0.005em] ${DISPLAY} text-walnut`}>{plainWords(modes)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
