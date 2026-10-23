"use client";

/**
 * Agent permissions tab — what patients' personal agents can do with this practice. Each service is
 * Bookable, Request only, or Hidden; a master switch pauses agents entirely, and a few toggles decide
 * what agents can see.
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
const OPTION_W = 116;

const SERVICES: { id: string; name: string; group: string; tile: string; mode: Mode }[] = [
  { id: "physical", name: "Annual physical", group: "Primary care", tile: "#E9DCC7", mode: "bookable" },
  { id: "sick", name: "Sick visit", group: "Same day", tile: "#F7DCCB", mode: "bookable" },
  { id: "ear", name: "Ear check", group: "Pediatrics", tile: "#E3E9D9", mode: "bookable" },
  { id: "flu", name: "Flu shot", group: "Vaccines", tile: "#DCE5D0", mode: "bookable" },
  { id: "labs", name: "Lab work", group: "Diagnostics", tile: "#EEEADF", mode: "bookable" },
  { id: "tele", name: "Telehealth follow-up", group: "Virtual", tile: "#E9DCC7", mode: "bookable" },
  { id: "new", name: "New patient visit", group: "Primary care", tile: "#FCCFB8", mode: "request" },
  { id: "hearing", name: "Hearing test", group: "Audiology", tile: "#EEEADF", mode: "request" },
  { id: "aid", name: "Hearing aid fitting", group: "Audiology", tile: "#F7DCCB", mode: "hidden" },
  { id: "procedure", name: "Minor procedure", group: "In office", tile: "#E3E9D9", mode: "hidden" },
];

const VISIBLE = [
  { id: "prices", label: "Prices", on: true },
  { id: "availability", label: "Live availability", on: true },
  { id: "insurance", label: "Insurance accepted", on: true },
  { id: "bios", label: "Provider bios", on: true },
  { id: "waits", label: "Wait times", on: false },
];

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

function ModeSwitch({ mode, onChange, disabled }: { mode: Mode; onChange: (m: Mode) => void; disabled: boolean }) {
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
          disabled={disabled}
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

export function DoeHealthProductPermissionsPage() {
  const [accepting, setAccepting] = useState(true);
  const [modes, setModes] = useState<Record<string, Mode>>(() => Object.fromEntries(SERVICES.map((s) => [s.id, s.mode])));
  const [visible, setVisible] = useState<Record<string, boolean>>(() => Object.fromEntries(VISIBLE.map((v) => [v.id, v.on])));
  const count = (m: Mode) => SERVICES.filter((s) => modes[s.id] === m).length;

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[24px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">

      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Agent Permissions</span>
      </div>

      <div className="relative flex grow min-h-[0px] gap-[12px]">
        <div
          className="grow min-w-[0px] flex flex-col p-[8px] rounded-[28px] bg-[#FAF6EC] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ opacity: accepting ? 1 : 0.5, transition: `opacity 300ms ${EASE}` }}
        >
          {SERVICES.map((s) => (
            <div key={s.id} className="flex items-center gap-[16px] h-[68px] shrink-0 pl-[12px] pr-[12px] rounded-[22px] hover:bg-sand transition-colors duration-150">
              <span className="w-[44px] h-[44px] shrink-0 rounded-[14px]" style={{ backgroundColor: s.tile }} />
              <span className="flex flex-col grow min-w-[0px]">
                <span className={`truncate text-[20px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{s.name}</span>
                <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>{s.group}</span>
              </span>
              <ModeSwitch mode={modes[s.id]!} disabled={!accepting} onChange={(m) => setModes((prev) => ({ ...prev, [s.id]: m }))} />
            </div>
          ))}
        </div>

        <div className="w-[400px] shrink-0 flex flex-col gap-[12px]">
          <div
            className="flex items-center justify-between gap-[16px] p-[20px] rounded-[28px]"
            style={{ backgroundColor: accepting ? "#DCE5D0" : "#EEEADF", transition: `background-color 300ms ${EASE}` }}
          >
            <span className="flex flex-col gap-[2px]">
              <span className={`text-[22px] leading-[26px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{accepting ? "Accepting agents" : "Agents paused"}</span>
              <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-walnut opacity-70`}>
                {accepting ? "31 visited today" : "Agents are asked to call instead"}
              </span>
            </span>
            <Toggle on={accepting} onChange={() => setAccepting((v) => !v)} label="Accept agents" />
          </div>

          <div className="grid grid-cols-3 gap-[8px]">
            {MODES.map((m) => (
              <div key={m.id} className="flex flex-col gap-[4px] p-[16px] rounded-[24px]" style={{ backgroundColor: m.tone }}>
                <span className={`text-[34px] leading-[38px] tracking-[-0.02em] ${DISPLAY} text-ink`}>{count(m.id)}</span>
                <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-walnut opacity-70`}>{m.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col grow min-h-[0px] p-[8px] rounded-[28px] bg-[#FAF6EC]">
            <span className={`px-[12px] pt-[12px] pb-[6px] text-[22px] leading-[26px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>Agents can see</span>
            {VISIBLE.map((v) => (
              <div key={v.id} className="flex items-center justify-between h-[52px] px-[12px] rounded-[18px] hover:bg-sand transition-colors duration-150">
                <span className={`text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>{v.label}</span>
                <Toggle on={!!visible[v.id]} label={v.label} onChange={() => setVisible((prev) => ({ ...prev, [v.id]: !prev[v.id] }))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
