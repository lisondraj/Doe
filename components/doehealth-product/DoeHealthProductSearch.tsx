"use client";

/**
 * Integrations tab — what any connected agent can see and do at this practice. A preset (Open, Balanced, Cautious)
 * sets every permission at once and each can still be changed (Bookable, Request only, or Hidden), which makes the
 * set Custom. Three tiles show what the settings would have done with last week's requests. The side column lists
 * the connected agents, the safeguards, and the latest decisions.
 */
import { type ReactNode, useState } from "react";

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

type Permission = { id: string; name: string; group: "See" | "Book" | "Handle" };

const PERMISSIONS: Permission[] = [
  { id: "services", name: "Services and prices", group: "See" },
  { id: "availability", name: "Live availability", group: "See" },
  { id: "providers", name: "Provider profiles", group: "See" },
  { id: "established", name: "Established patients", group: "Book" },
  { id: "new", name: "New patients", group: "Book" },
  { id: "forms", name: "Intake forms", group: "Handle" },
  { id: "desk", name: "Front desk messages", group: "Handle" },
];

const GROUPS: Permission["group"][] = ["See", "Book", "Handle"];

type PresetId = "open" | "balanced" | "cautious" | "custom";

const PRESETS: { id: PresetId; label: string; modes?: Modes }[] = [
  {
    id: "open",
    label: "Open",
    modes: { services: "bookable", availability: "bookable", providers: "bookable", established: "bookable", new: "bookable", forms: "bookable", desk: "request" },
  },
  {
    id: "balanced",
    label: "Balanced",
    modes: { services: "bookable", availability: "bookable", providers: "bookable", established: "bookable", new: "request", forms: "request", desk: "hidden" },
  },
  {
    id: "cautious",
    label: "Cautious",
    modes: { services: "bookable", availability: "bookable", providers: "bookable", established: "request", new: "request", forms: "request", desk: "hidden" },
  },
  { id: "custom", label: "Custom" },
];

/** Which preset the current permissions are, or Custom when they match none. */
function presetOf(modes: Modes): PresetId {
  const match = PRESETS.find((p) => p.modes && Object.entries(p.modes).every(([id, m]) => modes[id] === m));
  return match ? match.id : "custom";
}

const GROUP_LABEL: Record<Permission["group"], string> = { See: "What agents can see", Book: "What agents can book", Handle: "What agents can handle" };

const AGENTS = [
  { name: "Iris", patients: 212, booked: 14, bg: "#F6B99C", fg: "#5B2A17" },
  { name: "Maple", patients: 168, booked: 9, bg: "#C9D8BB", fg: "#2F4A22" },
  { name: "Cardinal", patients: 141, booked: 11, bg: "#281910", fg: "#FFFCF1" },
  { name: "Cove", patients: 96, booked: 4, bg: "#EBC8A8", fg: "#5B3517" },
  { name: "Gale", patients: 73, booked: 3, bg: "#D5D9EA", fg: "#2A3260" },
];

const SAFEGUARDS = [
  { id: "limit", label: "Daily limit per agent", value: "6 bookings", on: true },
  { id: "network", label: "In-network plans only", value: "18 plans", on: true },
  { id: "charges", label: "Ask before charges over", value: "$100", on: true },
  { id: "grants", label: "Patient grants expire after", value: "7 days", on: false },
];

const DECISIONS = [
  { when: "2m", verdict: "Allowed", tone: "#DCE5D0", what: "Tue 4:15, established patient", agent: "Iris" },
  { when: "14m", verdict: "Held", tone: "#F3E7C9", what: "New patient, waiting on you", agent: "Maple" },
  { when: "1h", verdict: "Declined", tone: "#E6E0D2", what: "Front desk message", agent: "Cove" },
];

/** What an agent asked for last week, so a change shows what it would have done. */
const WEEK = { established: 31, new: 16, desk: 9 };

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const index = MODES.findIndex((m) => m.id === mode);
  return (
    <div className="relative flex h-[38px] p-[4px] shrink-0 rounded-[999px] bg-[#F4EEDF]">
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
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={`relative w-[42px] h-[24px] shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-ink" : "bg-[#28191026]"}`}>
      <span className="absolute top-[3px] w-[18px] h-[18px] rounded-[999px] bg-paper transition-[left] duration-200" style={{ left: on ? 21 : 3 }} />
    </button>
  );
}

/** A soft panel in the side column with a plain heading. */
function Panel({ title, aside, children }: { title: string; aside?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[10px] p-[18px] rounded-[24px] bg-[#FAF6EC]">
      <span className="flex items-baseline justify-between gap-[12px] px-[2px]">
        <span className={`text-[20px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{title}</span>
        {aside && <span className={`text-[13px] leading-[16px] ${SANS} text-sub`}>{aside}</span>}
      </span>
      <div className="flex flex-col gap-[4px]">{children}</div>
    </div>
  );
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

  const tiles = [
    { label: "Booked by agents", value: result.auto, tone: "#E3E9D9" },
    { label: "Sent to you", value: result.asked, tone: "#F8F0DA" },
    { label: "Turned away", value: result.blocked, tone: "#F4EEDF" },
  ];

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Integrations</span>
        <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>Connect an agent</span>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-[16px] grow min-h-[0px]">
        <div className="flex flex-col min-w-[0px] min-h-[0px] gap-[16px] p-[24px] rounded-[28px] bg-[#FAF6EC]">
          <div className="flex items-center justify-between gap-[16px]">
            <span className={`text-[32px] leading-[38px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>Permissions</span>
            <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]" role="radiogroup" aria-label="Preset">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={shown === p.id}
                  onClick={() => choose(p.id)}
                  className={`h-[32px] px-[16px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${shown === p.id ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
                >
                  {p.label}
                </button>
              ))}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-[8px] shrink-0">
            {tiles.map((t) => (
              <div key={t.label} className="flex flex-col gap-[4px] px-[18px] py-[14px] rounded-[18px]" style={{ backgroundColor: t.tone }}>
                <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{t.label}, last week</span>
                <span className={`text-[28px] leading-[32px] tracking-[-0.02em] ${DISPLAY} text-walnut [font-variant-numeric:tabular-nums]`}>{t.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col grow min-h-[0px] gap-[16px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {GROUPS.map((group) => (
              <div key={group} className="flex flex-col gap-[6px]">
                <span className={`px-[4px] text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>{GROUP_LABEL[group]}</span>
                {PERMISSIONS.filter((p) => p.group === group).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-[16px] h-[60px] shrink-0 px-[20px] rounded-[18px] bg-paper">
                    <span className={`truncate text-[15px] leading-[20px] ${SANS} font-[500] text-walnut`}>{p.name}</span>
                    <ModeSwitch mode={modes[p.id]!} onChange={(m) => change(p.id, m)} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col min-h-[0px] gap-[12px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Panel title="Connected agents" aside={`${AGENTS.length} today`}>
            {AGENTS.map((a) => (
              <div key={a.name} className="flex items-center gap-[12px] h-[52px] px-[12px] rounded-[16px] bg-paper">
                <span className={`w-[30px] h-[30px] shrink-0 flex items-center justify-center rounded-[999px] text-[14px] leading-[16px] ${DISPLAY}`} style={{ backgroundColor: a.bg, color: a.fg }}>
                  {a.name[0]}
                </span>
                <span className="flex flex-col grow min-w-[0px]">
                  <span className={`text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{a.name}</span>
                  <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{a.patients} of your patients</span>
                </span>
                <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}>{a.booked} booked</span>
              </div>
            ))}
          </Panel>

          <Panel title="Safeguards">
            {SAFEGUARDS.map((s) => (
              <div key={s.id} className="flex items-center gap-[12px] h-[52px] px-[14px] rounded-[16px] bg-paper">
                <span className={`grow min-w-[0px] truncate text-[14px] leading-[18px] ${SANS} text-walnut`}>{s.label}</span>
                <span className={`text-[13px] leading-[16px] ${SANS} font-[600] text-walnut`}>{s.value}</span>
                <Toggle on={!!safeguards[s.id]} label={s.label} onChange={() => setSafeguards((prev) => ({ ...prev, [s.id]: !prev[s.id] }))} />
              </div>
            ))}
          </Panel>

          <Panel title="Recent decisions">
            {DECISIONS.map((d) => (
              <div key={d.when} className="flex items-center gap-[12px] h-[52px] px-[14px] rounded-[16px] bg-paper">
                <span className={`flex items-center h-[24px] px-[10px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`} style={{ backgroundColor: d.tone }}>
                  {d.verdict}
                </span>
                <span className="flex flex-col grow min-w-[0px]">
                  <span className={`truncate text-[14px] leading-[18px] ${SANS} text-walnut`}>{d.what}</span>
                  <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{d.agent}</span>
                </span>
                <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{d.when}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
