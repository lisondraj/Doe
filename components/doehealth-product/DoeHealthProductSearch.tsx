"use client";

/**
 * Integrations tab — what any connected agent can see and do at this practice. A preset (Open, Balanced, Cautious)
 * sets every permission at once and each can still be changed (Bookable, Request only, or Hidden), which makes the
 * set Custom. The right side puts the settings in plain words, then the safeguards, then the latest decisions.
 */
import { useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type Mode = "bookable" | "request" | "hidden";
type Modes = Record<string, Mode>;

const MODES: { id: Mode; label: string; tone: string }[] = [
  { id: "bookable", label: "Bookable", tone: "#DCE5D0" },
  { id: "request", label: "Request only", tone: "#F3E7C9" },
  { id: "hidden", label: "Hidden", tone: "#E6E0D2" },
];
const OPTION_W = 104;

type Permission = { id: string; name: string; note: string; group: "See" | "Book" | "Handle" };

const PERMISSIONS: Permission[] = [
  { id: "services", name: "Services and prices", note: "24 services listed", group: "See" },
  { id: "availability", name: "Live availability", note: "Synced with ModMed", group: "See" },
  { id: "providers", name: "Provider profiles", note: "Bios, specialties, languages", group: "See" },
  { id: "established", name: "Established patients", note: "Confirmed on its own", group: "Book" },
  { id: "new", name: "New patients", note: "You approve each one", group: "Book" },
  { id: "forms", name: "Intake forms", note: "Patient reviews first", group: "Handle" },
  { id: "desk", name: "Front desk messages", note: "Non-urgent only", group: "Handle" },
];

const GROUPS: Permission["group"][] = ["See", "Book", "Handle"];

type PresetId = "open" | "balanced" | "cautious" | "custom";

const PRESETS: { id: PresetId; label: string; blurb: string; modes?: Modes }[] = [
  {
    id: "open",
    label: "Open",
    blurb: "Agents book everyone on their own",
    modes: { services: "bookable", availability: "bookable", providers: "bookable", established: "bookable", new: "bookable", forms: "bookable", desk: "request" },
  },
  {
    id: "balanced",
    label: "Balanced",
    blurb: "New patients and forms wait for you",
    modes: { services: "bookable", availability: "bookable", providers: "bookable", established: "bookable", new: "request", forms: "request", desk: "hidden" },
  },
  {
    id: "cautious",
    label: "Cautious",
    blurb: "Agents read, you confirm every booking",
    modes: { services: "bookable", availability: "bookable", providers: "bookable", established: "request", new: "request", forms: "request", desk: "hidden" },
  },
  { id: "custom", label: "Custom", blurb: "Your own mix" },
];

/** Which preset the current permissions are, or Custom when they match none. */
function presetOf(modes: Modes): PresetId {
  const match = PRESETS.find((p) => p.modes && Object.entries(p.modes).every(([id, m]) => modes[id] === m));
  return match ? match.id : "custom";
}

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

const SAFEGUARDS = [
  { id: "limit", label: "Daily limit", note: "6 bookings per agent", on: true },
  { id: "network", label: "In-network plans only", note: "18 plans checked live", on: true },
  { id: "charges", label: "Ask before charges over $100", note: "HSA and cards", on: true },
  { id: "grants", label: "Grants end after 7 days", note: "Patient renews in their agent", on: false },
];

const DECISIONS = [
  { when: "2m", verdict: "Allowed", tone: "#3F6431", what: "booked Tue 4:15", why: "Established patient, Harbor Mutual" },
  { when: "14m", verdict: "Held", tone: "#8A6A10", what: "new patient waiting", why: "Needs your approval" },
];

/** What an agent asked for last week, so a change shows what it would have done. */
const WEEK = { established: 31, new: 16, desk: 9 };

const RULE = "border-[rgba(40,25,16,0.1)]";
const CAP = `text-[11.5px] leading-[14px] tracking-[0.07em] uppercase ${SANS} font-[500] text-[rgba(40,25,16,0.42)]`;

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

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative w-[44px] h-[26px] shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-ink" : "bg-[#E1D9C8]"}`}
    >
      <span
        className="absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-[999px] bg-paper"
        style={{ transform: `translateX(${on ? 18 : 0}px)`, transition: `transform 260ms ${EASE}` }}
      />
    </button>
  );
}

type Piece = { text: string; em?: boolean };

/** The permissions as a sentence: what any agent can read, what it books on its own, and what waits for the practice. */
function plainWords(modes: Modes): Piece[] {
  const open = (id: string) => modes[id] !== "hidden";
  const read = [open("services") && "services, prices", open("availability") && "live openings", open("providers") && "provider profiles"].filter(Boolean) as string[];
  const reads =
    read.length === 0
      ? [{ text: "It cannot read anything about the practice" }]
      : [{ text: "Any agent can read your " }, { text: read.length > 1 ? `${read.slice(0, -1).join(", ")} and ${read[read.length - 1]}` : read[0]!, em: true }];
  const desk = modes.desk === "hidden" ? "It cannot message the front desk." : modes.desk === "request" ? "Messages to the front desk wait for you." : "It can message the front desk.";
  const lead: Piece[] = [{ text: ". It books " }];
  return [
    ...reads,
    ...lead,
    ...(modes.established === "bookable" ? [{ text: "established patients", em: true }, { text: " on its own" }] : modes.established === "request" ? [{ text: "established patients", em: true }, { text: " only after you confirm" }] : [{ text: "no established patients", em: true }]),
    { text: "; " },
    ...(modes.new === "bookable" ? [{ text: "new patients", em: true }, { text: " too" }] : modes.new === "request" ? [{ text: "new patients wait for you", em: true }] : [{ text: "no new patients", em: true }]),
    { text: `. ${desk}` },
  ];
}

/** What these settings would have done with last week's requests. */
function impact(modes: Modes) {
  const sum = (ids: (keyof typeof WEEK)[], mode: Mode) => ids.filter((id) => modes[id] === mode).reduce((s, id) => s + WEEK[id], 0);
  return { auto: sum(["established", "new"], "bookable"), asked: sum(["established", "new"], "request"), blocked: sum(["established", "new", "desk"], "hidden") };
}

export function DoeHealthProductSearchPage() {
  const [modes, setModes] = useState<Modes>(() => ({ ...PRESETS.find((p) => p.id === "balanced")!.modes! }));
  const [safeguards, setSafeguards] = useState<Record<string, boolean>>(() => Object.fromEntries(SAFEGUARDS.map((s) => [s.id, s.on])));
  const [picked, setPicked] = useState<PresetId>("balanced");

  const active = presetOf(modes);
  const shown = picked === "custom" ? "custom" : active;
  const result = impact(modes);

  const choose = (id: PresetId) => {
    const preset = PRESETS.find((p) => p.id === id)!;
    setPicked(id);
    if (preset.modes) setModes({ ...preset.modes });
  };
  const change = (id: string, m: Mode) => {
    const next = { ...modes, [id]: m };
    setModes(next);
    setPicked(presetOf(next));
  };

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

        <div className="grow min-w-[0px] flex flex-col px-[28px] pt-[22px] pb-[8px] rounded-[28px] bg-[#FAF6EC] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="flex items-baseline justify-between">
            <span className={`text-[30px] leading-[34px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>Permissions</span>
            <span className={`text-[13px] leading-[16px] ${SANS} text-sub`}>Saved automatically</span>
          </span>

          <div className={`grid grid-cols-4 mt-[16px] border-b ${RULE}`} role="radiogroup" aria-label="Preset">
            {PRESETS.map((p) => {
              const on = shown === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => choose(p.id)}
                  className="relative flex flex-col items-start gap-[3px] pt-[6px] pb-[14px] pr-[14px] text-left"
                >
                  <span className={`flex items-center gap-[8px] text-[15px] leading-[20px] ${SANS} font-[500] ${on ? "text-walnut" : "text-[rgba(40,25,16,0.7)]"}`}>
                    {on ? <span className="w-[8px] h-[8px] rounded-[999px] bg-ink" /> : null}
                    {p.label}
                  </span>
                  <span className={`text-[12.5px] leading-[17px] ${SANS} text-sub`}>{p.blurb}</span>
                  <span className="absolute left-0 right-[14px] -bottom-[1px] h-[2px]" style={{ backgroundColor: on ? "#140C04" : "transparent" }} />
                </button>
              );
            })}
          </div>

          {GROUPS.map((group) => (
            <div key={group} className="flex flex-col">
              <span className={`pt-[14px] pb-[6px] ${CAP}`}>{group}</span>
              {PERMISSIONS.filter((p) => p.group === group).map((p) => (
                <div key={p.id} className={`flex items-center justify-between gap-[16px] h-[56px] shrink-0 border-t ${RULE}`}>
                  <span className="flex flex-col min-w-[0px]">
                    <span className={`truncate text-[15px] leading-[19px] ${SANS} font-[500] text-walnut`}>{p.name}</span>
                    <span className={`truncate text-[12.5px] leading-[17px] ${SANS} text-sub`}>{p.note}</span>
                  </span>
                  <ModeSwitch mode={modes[p.id]!} onChange={(m) => change(p.id, m)} />
                </div>
              ))}
            </div>
          ))}

          <div className={`flex items-start gap-[10px] mt-auto pt-[12px] border-t ${RULE} text-[13.5px] leading-[20px] ${SANS} text-sub`}>
            <span className="w-[22px] h-[22px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#EBDDB6] text-[#6B5320]" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" style={{ display: "block" }}>
                <path d="M13 3.5L5.5 13H12l-1 7.5L18.5 11H12z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              With these settings, last week agents would have booked <b className="font-[500] text-walnut">{result.auto}</b> visits on their own, sent{" "}
              <b className="font-[500] text-walnut">{result.asked}</b> to you to confirm, and been turned away{" "}
              <b className="font-[500] text-walnut">{result.blocked}</b> {result.blocked === 1 ? "time" : "times"}.
            </span>
          </div>
        </div>

        <div className="w-[320px] shrink-0 flex flex-col min-h-[0px] pt-[4px]">
          <span className={`pb-[8px] ${CAP}`}>In plain words</span>
          <p className={`text-[20px] leading-[29px] tracking-[-0.005em] ${DISPLAY} text-walnut`}>
            {plainWords(modes).map((piece, i) =>
              piece.em ? (
                <span key={i} className="bg-[linear-gradient(transparent_64%,rgba(252,207,184,0.85)_64%)]">
                  {piece.text}
                </span>
              ) : (
                <span key={i}>{piece.text}</span>
              ),
            )}
          </p>

          <span className={`mt-[22px] pb-[2px] ${CAP}`}>Safeguards</span>
          {SAFEGUARDS.map((s) => (
            <div key={s.id} className={`flex items-center justify-between gap-[12px] py-[9px] border-b ${RULE}`}>
              <span className="flex flex-col min-w-[0px]">
                <span className={`text-[14px] leading-[18px] ${SANS} text-walnut`}>{s.label}</span>
                <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{s.note}</span>
              </span>
              <Toggle on={!!safeguards[s.id]} label={s.label} onChange={() => setSafeguards((prev) => ({ ...prev, [s.id]: !prev[s.id] }))} />
            </div>
          ))}

          <span className={`mt-[20px] pb-[2px] ${CAP}`}>Recent decisions</span>
          {DECISIONS.map((d) => (
            <div key={d.when} className="grid grid-cols-[38px_1fr] gap-[6px] py-[8px] border-b border-dotted border-[rgba(40,25,16,0.2)]">
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
        </div>
      </div>
    </div>
  );
}
