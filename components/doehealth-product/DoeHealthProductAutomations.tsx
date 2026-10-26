"use client";

/**
 * Automations tab — workflows that run when something happens (an agent books, a claim is denied, a link goes
 * unopened). The list shows each workflow's health and a switch; opening one shows its steps on a canvas, with the
 * selected step's settings beside it.
 */
import { useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const PATH = {
  bolt: "M13 3.5L5.5 13H12l-1 7.5L18.5 11H12z",
  cal: "M4 7h16v13H4zM4 11h16M9 4v3M15 4v3",
  doc: "M8 4h8l3 3v13H5V4z",
  cr: "M3.5 6h17v12.5h-17zM3.5 10.5h17",
  usr: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c1-4 4-6 8-6s7 2 8 6",
  msg: "M5 6h14v10H11l-4.5 3.5V16H5z",
  ph: "M5 4.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.4 6.4l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 6.1A1.5 1.5 0 0 1 5 4.5z",
  shield: "M12 3.8l6.8 2.6v5.1c0 4.2-2.8 7.4-6.8 8.8-4-1.4-6.8-4.6-6.8-8.8V6.4z",
  plus: "M12 5v14M5 12h14",
  down: "M6 9l6 6 6-6",
  search: "M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM16 16l4 4",
};
type IconName = keyof typeof PATH;

function Icon({ name, size = 15 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <path d={PATH[name]} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative w-[46px] h-[28px] shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-ink" : "bg-[#E1D9C8]"}`}
    >
      <span className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-[999px] bg-paper" style={{ transform: `translateX(${on ? 18 : 0}px)`, transition: `transform 260ms ${EASE}` }} />
    </button>
  );
}

type Status = "Live" | "Paused" | "Needs attention";

const WORKFLOWS: { id: string; name: string; steps: number; starts: string; icon: IconName; rate: number; runs: number[]; on: boolean; attention?: boolean }[] = [
  { id: "booked", name: "New patient booked", steps: 5, starts: "Agent books a visit", icon: "cal", rate: 97, runs: [2, 4, 3, 6, 5, 7, 9], on: true },
  { id: "denied", name: "Claim denied", steps: 4, starts: "Payer sends a denial", icon: "doc", rate: 88, runs: [1, 0, 2, 1, 3, 1, 1], on: true },
  { id: "referral", name: "Referral accepted", steps: 3, starts: "Clinic accepts", icon: "msg", rate: 100, runs: [0, 2, 1, 3, 2, 2, 4], on: true },
  { id: "link", name: "Payment link unopened", steps: 4, starts: "2 days pass", icon: "cr", rate: 92, runs: [1, 1, 0, 2, 1, 0, 1], on: true },
  { id: "intake", name: "Intake incomplete", steps: 4, starts: "1 day passes", icon: "doc", rate: 95, runs: [1, 3, 2, 4, 3, 5, 4], on: true },
  { id: "after", name: "After-hours call", steps: 4, starts: "Call after 6 pm", icon: "ph", rate: 0, runs: [0, 0, 0, 0, 0, 0, 0], on: false },
  { id: "onboard", name: "New provider onboarding", steps: 6, starts: "Added by hand", icon: "usr", rate: 64, runs: [0, 1, 0, 0, 1, 0, 2], on: true, attention: true },
];

const RUNS = [
  { time: "2:48 pm", flow: "New patient booked", who: "Leo Jacobs", result: "Completed" },
  { time: "2:31 pm", flow: "Intake incomplete", who: "Mia Thompson", result: "Completed" },
  { time: "1:54 pm", flow: "New patient booked", who: "Noah Kim", result: "Held for you" },
];

type Step = { id: string; kind: "Starts when" | "If" | "Then" | "Else"; icon: IconName; title: string; chips: string[]; x: number; y: number; fields: { label: string; value: string }[]; note: string };

const STEPS: Step[] = [
  { id: "start", kind: "Starts when", icon: "bolt", title: "Agent books a visit", chips: ["Any agent", "Neurology"], x: 14, y: 190, note: "Starts when", fields: [{ label: "Event", value: "An agent books a visit" }, { label: "Agents", value: "Any agent" }, { label: "Service", value: "Neurology" }] },
  { id: "network", kind: "If", icon: "shield", title: "In network", chips: ["18 plans", "Live check"], x: 244, y: 60, note: "Check · step 2 of 7", fields: [{ label: "Check", value: "Insurance plan is accepted" }, { label: "Source", value: "Live check" }, { label: "If it does not match", value: "Hold for front desk" }, { label: "Timeout", value: "5 seconds" }] },
  { id: "limit", kind: "If", icon: "cr", title: "Under $100", chips: ["HSA or card"], x: 244, y: 270, note: "Check · step 3 of 7", fields: [{ label: "Check", value: "Visit total is under" }, { label: "Amount", value: "$100" }, { label: "Methods", value: "HSA or card" }] },
  { id: "hold", kind: "Else", icon: "usr", title: "Hold for front desk", chips: ["Ruby", "30 min"], x: 244, y: 470, note: "Action · step 7 of 7", fields: [{ label: "Assign to", value: "Ruby" }, { label: "Respond within", value: "30 minutes" }] },
  { id: "confirm", kind: "Then", icon: "cal", title: "Confirm the slot", chips: ["Auto"], x: 474, y: 24, note: "Action · step 4 of 7", fields: [{ label: "Confirm", value: "Automatically" }, { label: "Notify", value: "Patient and agent" }] },
  { id: "forms", kind: "Then", icon: "doc", title: "Send intake forms", chips: ["7 fields", "Patient reviews"], x: 474, y: 180, note: "Action · step 5 of 7", fields: [{ label: "Form", value: "New patient intake" }, { label: "Fields", value: "7" }, { label: "Review", value: "Patient reviews first" }] },
  { id: "charge", kind: "Then", icon: "cr", title: "Charge copay", chips: ["InstaMed"], x: 474, y: 388, note: "Action · step 6 of 7", fields: [{ label: "Charge", value: "Visit copay" }, { label: "Processor", value: "InstaMed" }, { label: "When", value: "At booking" }] },
];

const NODE_W = 204;
const EDGES: [string, string, boolean?][] = [["start", "network"], ["start", "limit"], ["start", "hold", true], ["network", "confirm"], ["network", "forms"], ["limit", "forms"], ["limit", "charge"]];

const byId = (id: string) => STEPS.find((s) => s.id === id)!;

function Spark({ values }: { values: number[] }) {
  const w = 90;
  const h = 26;
  const max = Math.max(...values) || 1;
  const pts = values.map((v, i) => `${((i * (w - 6)) / (values.length - 1) + 3).toFixed(0)},${(h - 4 - (v / max) * (h - 8)).toFixed(0)}`);
  return (
    <svg width={w} height={h} aria-hidden="true" style={{ display: "block" }}>
      <path d={`M${pts.join(" L")}`} fill="none" stroke="#C9704B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STATUS_STYLE: Record<Status, string> = {
  Live: "bg-[#D6DEC6] text-[#2F3B2A]",
  Paused: "bg-[#28191014] text-walnut",
  "Needs attention": "bg-[#FCCFB8] text-[#7A3E26]",
};

const COLS = "grid-cols-[2.2fr_1.2fr_1.1fr_1.3fr_1fr_0.5fr_54px]";

function Editor({ name, onBack }: { name: string; onBack: () => void }) {
  const [selected, setSelected] = useState("network");
  const step = byId(selected);
  const [values, setValues] = useState<Record<string, string>>({});
  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[10px] pt-[30px] px-[40px] pb-[26px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-center justify-between">
        <span className={`text-[44px] leading-[48px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>{name}</span>
        <span className="flex items-center gap-[10px]">
          <span className={`flex items-center gap-[7px] mr-[4px] text-[13px] ${SANS} font-[500] text-walnut`}>
            <span className="w-[8px] h-[8px] rounded-[999px] bg-[#6E9A5B]" />Live
          </span>
          {["History", "Test run"].map((t) => (
            <span key={t} className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-[#28191014] text-[14px] ${SANS} font-[500] text-walnut`}>{t}</span>
          ))}
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink text-[14px] ${SANS} font-[500] [color:#FFFCF1]`}>Publish v5</span>
        </span>
      </div>
      <div className={`flex items-center gap-[10px] text-[13px] ${SANS} font-[500] text-[rgba(40,25,16,0.5)]`}>
        <button type="button" onClick={onBack} className="hover:text-walnut transition-colors duration-150">Automations</button>
        <span>/</span>
        <span className="text-walnut">{name}</span>
        <span className="flex items-center h-[24px] px-[11px] rounded-[999px] shadow-[inset_0_0_0_1px_rgba(40,25,16,0.2)] text-walnut">Draft changes</span>
      </div>

      <div className="relative grid grow min-h-[0px] gap-[12px]" style={{ gridTemplateColumns: "230px 1fr 310px" }}>
        <div className="flex flex-col p-[14px_12px] rounded-[28px] bg-[#FAF6EC] overflow-hidden">
          <span className={`px-[8px] pb-[6px] text-[24px] leading-[28px] ${DISPLAY} text-walnut`}>Steps</span>
          {(["Starts when", "If", "Then", "Else"] as const).map((kind) => (
            <div key={kind} className="flex flex-col">
              <span className={`px-[10px] pt-[10px] pb-[4px] text-[12px] ${SANS} font-[500] text-[rgba(40,25,16,0.5)]`}>{kind === "If" ? "Checks" : kind === "Then" ? "Actions" : kind === "Else" ? "Otherwise" : kind}</span>
              {STEPS.filter((s) => s.kind === kind).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelected(s.id)}
                  className={`flex items-center gap-[10px] h-[44px] px-[10px] rounded-[16px] text-left text-[14px] ${SANS} font-[500] text-walnut transition-colors duration-150 ${selected === s.id ? "bg-paper" : "hover:bg-[#F4EEDF]"}`}
                >
                  <span className="w-[30px] h-[30px] shrink-0 flex items-center justify-center rounded-[10px] bg-[#EFE8D9]"><Icon name={s.icon} /></span>
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>
          ))}
          <span className={`flex items-center gap-[10px] h-[44px] px-[10px] mt-[6px] text-[14px] ${SANS} font-[500] text-[rgba(40,25,16,0.5)]`}>
            <span className="w-[30px] h-[30px] flex items-center justify-center rounded-[10px] shadow-[inset_0_0_0_1px_rgba(40,25,16,0.2)]"><Icon name="plus" /></span>
            Add step
          </span>
        </div>

        <div
          className="relative rounded-[28px] bg-[#F4EEDF] overflow-hidden"
          style={{ backgroundImage: "radial-gradient(rgba(40,25,16,0.14) 1px, transparent 1.3px)", backgroundSize: "20px 20px" }}
        >
          <span className="absolute left-[14px] top-[14px] flex gap-[6px]">
            <span className="w-[38px] h-[34px] flex items-center justify-center rounded-[999px] bg-paper"><Icon name="plus" /></span>
            <span className={`flex items-center h-[34px] px-[16px] rounded-[999px] bg-paper text-[13px] ${SANS} font-[500]`}>Auto-layout</span>
          </span>
          <svg className="absolute left-0 top-0" width="720" height="700" fill="none" stroke="#281910" strokeWidth="1.6" strokeOpacity="0.5" aria-hidden="true">
            {EDGES.map(([from, to, dashed]) => {
              const a = byId(from);
              const b = byId(to);
              const x1 = a.x + NODE_W;
              const y1 = a.y + 55;
              const x2 = b.x;
              const y2 = b.y + 55;
              return <path key={from + to} d={`M${x1} ${y1} C${x1 + 22} ${y1} ${x2 - 22} ${y2} ${x2} ${y2}`} strokeDasharray={dashed ? "5 5" : undefined} />;
            })}
          </svg>
          {STEPS.map((s) => {
            const dark = s.kind === "Starts when";
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s.id)}
                className={`absolute flex flex-col gap-[8px] p-[12px] rounded-[22px] text-left transition-shadow duration-150 ${dark ? "bg-ink [color:#FFFCF1]" : "bg-paper text-walnut"} ${selected === s.id ? "shadow-[inset_0_0_0_2px_#140C04]" : ""}`}
                style={{ left: s.x, top: s.y, width: NODE_W }}
              >
                <span className={`flex items-center h-[24px] px-[12px] w-fit rounded-[999px] text-[12px] ${SANS} font-[500] ${dark ? "bg-[#FFFCF124]" : "bg-[#F4EEDF]"}`}>{s.kind === "Starts when" ? "When" : s.kind}</span>
                <span className={`flex items-center gap-[10px] text-[19px] leading-[21px] tracking-[-0.01em] ${DISPLAY}`}>
                  <span className={`w-[30px] h-[30px] shrink-0 flex items-center justify-center rounded-[10px] ${dark ? "bg-[#FFFCF126]" : s.kind === "Then" ? "bg-[#D6DEC6]" : s.kind === "Else" ? "bg-[#FCCFB8]" : "bg-[#EFE8D9]"}`}><Icon name={s.icon} /></span>
                  {s.title}
                </span>
                <span className="flex flex-wrap gap-[6px]">
                  {s.chips.map((c) => (
                    <span key={c} className={`flex items-center h-[24px] px-[12px] rounded-[999px] text-[12px] ${SANS} font-[500] ${dark ? "bg-[#FFFCF124]" : "bg-[#F4EEDF]"}`}>{c}</span>
                  ))}
                </span>
              </button>
            );
          })}
          <span className="absolute right-[14px] bottom-[14px] flex gap-[6px]">
            {["−", "100%", "+"].map((t) => (
              <span key={t} className={`flex items-center justify-center min-w-[38px] h-[34px] px-[12px] rounded-[999px] bg-paper text-[13px] ${SANS} font-[500]`}>{t}</span>
            ))}
          </span>
        </div>

        <div className="flex flex-col p-[20px_20px_16px] rounded-[28px] bg-[#F4EEDF] overflow-hidden">
          <span className="flex items-start justify-between">
            <span className="flex flex-col">
              <span className={`text-[24px] leading-[28px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{step.title}</span>
              <span className={`mt-[3px] text-[12.5px] ${SANS} font-[500] text-[rgba(40,25,16,0.55)]`}>{step.note}</span>
            </span>
            <span className={`flex items-center h-[26px] px-[12px] rounded-[999px] bg-[#FFFCF1BF] text-[12px] ${SANS} font-[500]`}>v4</span>
          </span>
          <div className="flex flex-col gap-[12px] mt-[14px] grow overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {step.fields.map((f) => (
              <label key={f.label} className="flex flex-col gap-[6px]">
                <span className={`text-[12.5px] ${SANS} font-[500] text-[rgba(40,25,16,0.55)]`}>{f.label}</span>
                <input
                  value={values[step.id + f.label] ?? f.value}
                  onChange={(e) => setValues((prev) => ({ ...prev, [step.id + f.label]: e.target.value }))}
                  className={`h-[42px] px-[16px] rounded-[999px] bg-paper text-[14px] ${SANS} font-[500] text-walnut outline-none focus:shadow-[inset_0_0_0_1.5px_#140C04]`}
                />
              </label>
            ))}
          </div>
          <span className="flex items-center justify-between pt-[12px]">
            <span className={`flex items-center gap-[7px] text-[13px] ${SANS} font-[500] text-walnut`}><span className="w-[8px] h-[8px] rounded-[999px] bg-[#6E9A5B]" />Saved</span>
            <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-paper text-[14px] ${SANS} font-[500]`}>Test step</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function DoeHealthProductAutomationsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(WORKFLOWS.map((w) => [w.id, w.on])));
  const [tab, setTab] = useState("Workflows");

  if (open) return <Editor name={WORKFLOWS.find((w) => w.id === open)!.name} onBack={() => setOpen(null)} />;

  const statusOf = (w: (typeof WORKFLOWS)[number]): Status => (!on[w.id] ? "Paused" : w.attention ? "Needs attention" : "Live");

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[12px] pt-[34px] px-[40px] pb-[24px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-center justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Automations</span>
        <span className="flex gap-[10px]">
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-[#28191014] text-[14px] ${SANS} font-[500] text-walnut`}>Templates</span>
          <span className={`flex items-center gap-[8px] h-[40px] px-[18px] rounded-[999px] bg-ink text-[14px] ${SANS} font-[500] [color:#FFFCF1]`}>
            <Icon name="plus" />
            New workflow
          </span>
        </span>
      </div>

      <div className="relative flex items-center gap-[10px]">
        <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]" role="tablist">
          {[["Workflows", String(WORKFLOWS.length)], ["Runs", "78"], ["Templates", ""]].map(([t, n]) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t!)}
              className={`flex items-center gap-[7px] h-[32px] px-[16px] rounded-[999px] text-[13px] ${SANS} font-[500] transition-colors duration-150 ${tab === t ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
            >
              {t}
              {n ? <span className="text-[12px] opacity-50">{n}</span> : null}
            </button>
          ))}
        </span>
        <span className="grow" />
        <span className={`flex items-center gap-[8px] w-[230px] h-[38px] px-[16px] rounded-[999px] bg-[#F4EEDF] text-[14px] ${SANS} text-[rgba(40,25,16,0.55)]`}><Icon name="search" />Search</span>
        {[["Status", "All"], ["Owner", "Anyone"]].map(([k, v]) => (
          <span key={k} className={`flex items-center gap-[8px] h-[38px] px-[16px] rounded-[999px] bg-[#28191014] text-[14px] ${SANS} font-[500] text-walnut`}>
            <span className="text-[rgba(40,25,16,0.55)]">{k}</span>{v}<Icon name="down" size={14} />
          </span>
        ))}
      </div>

      <div className="relative flex flex-col p-[8px_8px_4px] rounded-[22px] bg-[#F4EEDF] shrink-0">
        <div className={`grid ${COLS} items-center gap-[14px] h-[36px] px-[16px] text-[13px] ${SANS} font-[500] text-[rgba(40,25,16,0.6)]`}>
          <span>Workflow</span><span>Starts when</span><span>Status</span><span>Success rate</span><span>Runs, 7 days</span><span className="text-right">Total</span><span />
        </div>
        {WORKFLOWS.map((w) => {
          const st = statusOf(w);
          const rate = on[w.id] ? w.rate : 0;
          return (
            <div
              key={w.id}
              role="button"
              tabIndex={0}
              onClick={() => setOpen(w.id)}
              onKeyDown={(e) => e.key === "Enter" && setOpen(w.id)}
              className={`grid ${COLS} items-center gap-[14px] h-[54px] shrink-0 px-[16px] mb-[4px] rounded-[16px] bg-paper cursor-pointer hover:bg-[#FFFEF8] transition-colors duration-150`}
            >
              <span className="flex items-center gap-[14px] min-w-[0px]">
                <span className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-[11px] bg-[#EFE8D9]"><Icon name={w.icon} /></span>
                <span className="flex flex-col min-w-[0px]">
                  <span className={`truncate text-[20px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{w.name}</span>
                  <span className={`text-[12.5px] leading-[15px] ${SANS} font-[500] text-[rgba(40,25,16,0.5)]`}>{w.steps} steps</span>
                </span>
              </span>
              <span className={`flex items-center h-[26px] px-[12px] w-fit rounded-[999px] shadow-[inset_0_0_0_1px_rgba(40,25,16,0.2)] text-[12px] ${SANS} font-[500] text-walnut whitespace-nowrap`}>{w.starts}</span>
              <span className={`flex items-center h-[28px] px-[12px] w-fit rounded-[999px] text-[13px] ${SANS} font-[500] whitespace-nowrap ${STATUS_STYLE[st]}`}>{st}</span>
              <span className="flex items-center gap-[10px]">
                <span className="grow h-[10px] rounded-[999px] bg-[#EFE8D9] overflow-hidden"><span className="block h-full rounded-[999px] bg-[#E8A585]" style={{ width: `${rate}%`, transition: `width 300ms ${EASE}` }} /></span>
                <span className={`w-[36px] text-right text-[13px] ${SANS} font-[500]`}>{rate}%</span>
              </span>
              <Spark values={on[w.id] ? w.runs : w.runs.map(() => 0)} />
              <span className={`text-right text-[13.5px] ${SANS} font-[500] [font-variant-numeric:tabular-nums]`}>{on[w.id] ? w.runs.reduce((a, b) => a + b, 0) : 0}</span>
              <Toggle on={!!on[w.id]} label={`${w.name} on`} onChange={() => setOn((prev) => ({ ...prev, [w.id]: !prev[w.id] }))} />
            </div>
          );
        })}
      </div>

      <div className="relative flex flex-col grow min-h-[0px] p-[14px_8px_4px] rounded-[22px] bg-[#FAF6EC] overflow-hidden">
        <span className="flex items-center justify-between px-[12px] pb-[8px]">
          <span className={`text-[24px] leading-[26px] ${DISPLAY} text-walnut`}>Recent runs</span>
          <span className={`flex items-center h-[26px] px-[12px] rounded-[999px] shadow-[inset_0_0_0_1px_rgba(40,25,16,0.2)] text-[12px] ${SANS} font-[500]`}>View all</span>
        </span>
        {RUNS.map((r) => (
          <div key={r.time} className="grid grid-cols-[80px_1fr_1fr_130px] items-center gap-[12px] h-[42px] shrink-0 px-[14px] mb-[4px] rounded-[14px] bg-paper text-[14px]">
            <span className={`${SANS} font-[500] text-[rgba(40,25,16,0.55)]`}>{r.time}</span>
            <span className={`${SANS} font-[500] text-walnut`}>{r.flow}</span>
            <span className={`${SANS} text-walnut`}>{r.who}</span>
            <span className={`flex items-center h-[26px] px-[12px] w-fit rounded-[999px] text-[13px] ${SANS} font-[500] ${r.result === "Completed" ? "bg-[#D6DEC6] text-[#2F3B2A]" : "bg-[#28191014] text-walnut"}`}>{r.result}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
