"use client";

/**
 * Agent Access tab — what patients' agents may do with each service. A matrix of services against actions (find
 * care, booking, forms, records); every cell is Allowed, Review (the practice confirms first), Restricted or Off,
 * and a click moves it to the next. The selected service opens in the dark panel, which lists its actions and the
 * sites it applies to. A master switch pauses agents entirely.
 */
import { useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type Level = "allowed" | "review" | "restricted" | "off";

const LEVELS: Level[] = ["allowed", "review", "restricted", "off"];

const PILL: Record<Level, { label: string; className: string }> = {
  allowed: { label: "Allowed", className: "bg-[#D6DEC6] text-[#2F3B2A]" },
  review: { label: "Review", className: "bg-[#F6C9B2] text-[#7A3E26]" },
  restricted: { label: "Restricted", className: "bg-[#28191014] text-[rgba(40,25,16,0.65)]" },
  off: { label: "Off", className: "bg-transparent text-[rgba(40,25,16,0.55)] shadow-[inset_0_0_0_1.5px_rgba(40,25,16,0.2)]" },
};

const ICON = {
  find: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c1-4 4-6 8-6s7 2 8 6",
  book: "M4 7h16v13H4zM4 11h16M9 4v3M15 4v3",
  forms: "M8 4h8l3 3v13H5V4z",
  records: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
};

const ACTIONS = [
  { id: "find", label: "Find care", icon: ICON.find },
  { id: "book", label: "Booking", icon: ICON.book },
  { id: "forms", label: "Forms", icon: ICON.forms },
  { id: "records", label: "Records", icon: ICON.records },
] as const;

type ActionId = (typeof ACTIONS)[number]["id"];

const SERVICES: { id: string; name: string; group: string; tile: string; levels: Record<ActionId, Level>; providers: number }[] = [
  { id: "follow-up", name: "Follow-up visit", group: "General neurology", tile: "#E9DCC7", levels: { find: "allowed", book: "allowed", forms: "allowed", records: "review" }, providers: 5 },
  { id: "urgent", name: "Urgent headache visit", group: "Same day", tile: "#F7DCCB", levels: { find: "allowed", book: "allowed", forms: "allowed", records: "off" }, providers: 3 },
  { id: "migraine", name: "Migraine follow-up", group: "Headache", tile: "#E3E9D9", levels: { find: "allowed", book: "allowed", forms: "allowed", records: "restricted" }, providers: 2 },
  { id: "botox", name: "Botox for migraine", group: "Procedures", tile: "#DCE5D0", levels: { find: "allowed", book: "off", forms: "off", records: "allowed" }, providers: 2 },
  { id: "eeg", name: "Routine EEG", group: "Diagnostics", tile: "#EEEADF", levels: { find: "review", book: "allowed", forms: "allowed", records: "restricted" }, providers: 2 },
  { id: "new", name: "New patient consult", group: "General neurology", tile: "#FCCFB8", levels: { find: "review", book: "review", forms: "allowed", records: "review" }, providers: 6 },
  { id: "emg", name: "EMG and nerve study", group: "Neuromuscular", tile: "#EEEADF", levels: { find: "allowed", book: "review", forms: "allowed", records: "allowed" }, providers: 1 },
  { id: "memory", name: "Memory screening", group: "Cognitive", tile: "#F7DCCB", levels: { find: "restricted", book: "review", forms: "off", records: "allowed" }, providers: 2 },
  { id: "nerve-block", name: "Nerve block", group: "In office", tile: "#E3E9D9", levels: { find: "restricted", book: "restricted", forms: "allowed", records: "restricted" }, providers: 2 },
];

const VIEWS = ["Hospital", "Department", "Service", "Action"];
const SITES = ["Brookline", "Newton"];

const next = (level: Level): Level => LEVELS[(LEVELS.indexOf(level) + 1) % LEVELS.length]!;

function LevelPill({ level, onClick, label }: { level: Level; onClick: () => void; label: string }) {
  const p = PILL[level];
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex items-center gap-[6px] h-[30px] px-[12px] rounded-[999px] text-[12.5px] leading-[16px] ${SANS} font-[500] transition-colors duration-200 ${p.className}`}
    >
      {level === "allowed" ? (
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : level === "restricted" ? (
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
          <path d={ICON.records} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {p.label}
    </button>
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
      className={`relative w-[46px] h-[28px] shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-ink" : "bg-[#E1D9C8]"}`}
    >
      <span
        className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-[999px] bg-paper"
        style={{ transform: `translateX(${on ? 18 : 0}px)`, transition: `transform 260ms ${EASE}` }}
      />
    </button>
  );
}

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoeHealthProductPermissionsPage() {
  const [accepting, setAccepting] = useState(true);
  const [view, setView] = useState("Service");
  const [selected, setSelected] = useState("new");
  const [levels, setLevels] = useState<Record<string, Record<ActionId, Level>>>(() => Object.fromEntries(SERVICES.map((s) => [s.id, { ...s.levels }])));
  const [sites, setSites] = useState<Record<string, boolean>>({ Brookline: true, Newton: true });

  const cycle = (id: string, action: ActionId) => setLevels((prev) => ({ ...prev, [id]: { ...prev[id]!, [action]: next(prev[id]![action]) } }));
  const service = SERVICES.find((s) => s.id === selected)!;
  const selectedLevels = levels[selected]!;
  const counts = LEVELS.map((l) => SERVICES.reduce((n, s) => n + ACTIONS.filter((a) => levels[s.id]![a.id] === l).length, 0));

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[16px] pt-[34px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-center justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Agent Access</span>
        <span className="flex items-center gap-[10px]">
          <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]" role="tablist" aria-label="Group by">
            {VIEWS.map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={`h-[32px] px-[15px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${view === v ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
              >
                {v}
              </button>
            ))}
          </span>
          <span className={`flex items-center gap-[8px] h-[40px] px-[18px] rounded-[999px] bg-ink text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
            <Icon d="M12 3.8l6.8 2.6v5.1c0 4.2-2.8 7.4-6.8 8.8-4-1.4-6.8-4.6-6.8-8.8V6.4z" />
            Policy log
          </span>
        </span>
      </div>

      <div className="relative flex items-center gap-[10px] shrink-0">
        <span className={`flex items-center gap-[10px] h-[38px] px-[16px] rounded-[999px] bg-[#F4EEDF] text-[14px] leading-[18px] ${SANS} text-sub`}>
          <Icon d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM16 16l4 4" />
          Services, actions
        </span>
        <span className="flex items-center gap-[10px] h-[38px] pl-[16px] pr-[8px] rounded-[999px] bg-[#28191014]">
          <span className={`text-[13.5px] leading-[18px] ${SANS} font-[500] text-walnut`}>{accepting ? "Accepting agents" : "Agents paused"}</span>
          <Toggle on={accepting} onChange={() => setAccepting((v) => !v)} label="Accept agents" />
        </span>
        <span className="grow" />
        {LEVELS.map((l, i) => (
          <span key={l} className={`flex items-center gap-[6px] h-[26px] px-[11px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] ${PILL[l].className}`}>
            {PILL[l].label}
            <span className="opacity-60 [font-variant-numeric:tabular-nums]">{counts[i]}</span>
          </span>
        ))}
      </div>

      <div className="relative flex grow min-h-[0px] gap-[14px]">
        <div
          className="grow min-w-[0px] flex flex-col pt-[8px] px-[10px] rounded-[28px] bg-[#FAF6EC] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ opacity: accepting ? 1 : 0.5, transition: `opacity 300ms ${EASE}` }}
        >
          <div className={`grid grid-cols-[1.5fr_repeat(4,1fr)] items-center gap-[8px] h-[36px] shrink-0 px-[14px] text-[12.5px] leading-[16px] ${SANS} font-[500] text-[rgba(40,25,16,0.55)]`}>
            <span>Service</span>
            {ACTIONS.map((a) => (
              <span key={a.id} className="flex items-center gap-[7px]">
                <Icon d={a.icon} size={14} />
                {a.label}
              </span>
            ))}
          </div>
          {SERVICES.map((s, i) => {
            const on = selected === s.id;
            return (
              <div
                key={s.id}
                role="row"
                onClick={() => setSelected(s.id)}
                className={`grid grid-cols-[1.5fr_repeat(4,1fr)] items-center gap-[8px] h-[56px] shrink-0 px-[14px] rounded-[18px] mb-[3px] cursor-pointer transition-colors duration-150 ${
                  on ? "bg-paper shadow-[inset_0_0_0_1.5px_#140C04]" : i % 2 === 0 ? "bg-[rgba(244,238,223,0.6)] hover:bg-[#F4EEDF]" : "hover:bg-[#F4EEDF]"
                }`}
              >
                <span className="flex items-center gap-[12px] min-w-[0px]">
                  <span className="w-[34px] h-[34px] shrink-0 rounded-[11px]" style={{ backgroundColor: s.tile }} />
                  <span className="flex flex-col min-w-[0px]">
                    <span className={`truncate text-[19px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{s.name}</span>
                    <span className={`truncate text-[11.5px] leading-[15px] ${SANS} text-[rgba(40,25,16,0.5)]`}>{s.group}</span>
                  </span>
                </span>
                {ACTIONS.map((a) => (
                  <span key={a.id} onClick={(e) => e.stopPropagation()} className="flex">
                    <LevelPill level={levels[s.id]![a.id]} label={`${s.name}, ${a.label}`} onClick={() => cycle(s.id, a.id)} />
                  </span>
                ))}
              </div>
            );
          })}
        </div>

        <div className="w-[370px] shrink-0 flex flex-col gap-[10px] p-[20px] rounded-[28px] bg-ink [color:#FFFCF1] overflow-hidden">
          <span className="flex items-center gap-[12px]">
            <span className="w-[40px] h-[40px] shrink-0 rounded-[12px]" style={{ backgroundColor: service.tile }} />
            <span className={`grow min-w-[0px] text-[28px] leading-[30px] tracking-[-0.01em] ${DISPLAY}`}>{service.name}</span>
          </span>
          <span className="flex gap-[6px]">
            {[service.group, `${service.providers} providers`].map((c) => (
              <span key={c} className={`flex items-center h-[26px] px-[11px] rounded-[999px] bg-[#FFFCF11F] text-[12px] leading-[16px] ${SANS} font-[500]`}>
                {c}
              </span>
            ))}
          </span>

          <span className={`mt-[8px] text-[11.5px] leading-[14px] tracking-[0.07em] uppercase ${SANS} font-[500] text-[#FFFCF180]`}>Actions</span>
          {ACTIONS.map((a) => {
            const level = selectedLevels[a.id];
            const lit = level === "allowed";
            return (
              <div
                key={a.id}
                className={`flex items-center gap-[12px] h-[52px] shrink-0 px-[14px] rounded-[16px] ${SANS} text-[14px] leading-[18px] font-[500] transition-colors duration-200 ${lit ? "bg-paper text-walnut" : "bg-[#FFFCF114]"}`}
              >
                <span className="opacity-70">
                  <Icon d={a.icon} />
                </span>
                <span className="grow">{a.label}</span>
                <LevelPill level={level} label={`${service.name}, ${a.label}`} onClick={() => cycle(selected, a.id)} />
              </div>
            );
          })}

          <span className={`mt-[8px] text-[11.5px] leading-[14px] tracking-[0.07em] uppercase ${SANS} font-[500] text-[#FFFCF180]`}>Applies to</span>
          <span className="flex flex-wrap gap-[6px]">
            {SITES.map((site) => {
              const on = sites[site];
              return (
                <button
                  key={site}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSites((prev) => ({ ...prev, [site]: !prev[site] }))}
                  className={`flex items-center h-[30px] px-[13px] rounded-[999px] text-[12.5px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${on ? "bg-[#FFFCF11F]" : "bg-transparent shadow-[inset_0_0_0_1.5px_#FFFCF14D] text-[#FFFCF199]"}`}
                >
                  {site}
                </button>
              );
            })}
            <span className={`flex items-center gap-[6px] h-[30px] px-[13px] rounded-[999px] text-[12.5px] leading-[16px] ${SANS} font-[500] shadow-[inset_0_0_0_1.5px_#FFFCF14D]`}>
              <Icon d="M12 5v14M5 12h14" size={13} />
              Add site
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
