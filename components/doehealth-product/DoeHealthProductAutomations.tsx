"use client";

/**
 * Automations tab — workflows that run when something happens (an agent books, a claim is denied, a link goes
 * unopened). The landing leads with the week's numbers, shows each workflow as a card with its last seven days and a
 * switch, and keeps what needs attention and the latest runs in a column beside them. Opening a workflow shows its
 * steps as a left-to-right flow with straight connectors, and the selected step's settings in a panel.
 */
import { type ReactNode, useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const btnGrey = `flex items-center gap-[6px] h-[40px] px-[18px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`;
const btnInk = `flex items-center gap-[6px] h-[40px] px-[18px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`;
const scroll = "overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function Plus({ color = "#FFFCF1" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style={{ display: "block" }}>
      <path d="M7 2.5v9M2.5 7h9" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** A plain circle in a light Doe colour; workflows and steps are told apart by colour, not icons. */
function Dot({ tone, size = 34 }: { tone: string; size?: number }) {
  return <span className="shrink-0 rounded-[50%]" style={{ width: size, height: size, backgroundColor: tone }} />;
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
      className={`relative w-[42px] h-[24px] shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-ink" : "bg-[#28191026]"}`}
    >
      <span className="absolute top-[3px] w-[18px] h-[18px] rounded-[999px] bg-paper transition-[left] duration-200" style={{ left: on ? 21 : 3 }} />
    </button>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: readonly { id: T; label: string; count?: number }[]; onChange: (v: T) => void }) {
  return (
    <span className="flex w-full p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]" role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`grow flex items-center justify-center gap-[6px] h-[32px] px-[14px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] whitespace-nowrap transition-colors duration-150 ${value === o.id ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
        >
          {o.label}
          {o.count !== undefined && <span className="text-[12px] opacity-50">{o.count}</span>}
        </button>
      ))}
    </span>
  );
}

type Status = "Live" | "Paused" | "Needs Attention";

const STATUS_STYLE: Record<Status, string> = {
  Live: "bg-[#D6DEC6] text-[#2F3B2A]",
  Paused: "bg-[#28191014] text-walnut",
  "Needs Attention": "bg-[#FCCFB8] text-[#7A3E26]",
};

function StatusPill({ status }: { status: Status }) {
  return <span className={`flex items-center h-[26px] px-[11px] w-fit shrink-0 rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] whitespace-nowrap ${STATUS_STYLE[status]}`}>{status}</span>;
}

type Workflow = { id: string; name: string; steps: number; starts: string; tone: string; rate: number; runs: number[]; on: boolean; attention?: string };

const WORKFLOWS: Workflow[] = [
  { id: "booked", name: "New Patient Booked", steps: 7, starts: "An agent books a visit", tone: "#F7DCCB", rate: 97, runs: [2, 4, 3, 6, 5, 7, 9], on: true },
  { id: "denied", name: "Claim Denied", steps: 4, starts: "A payer sends a denial", tone: "#FCCFB8", rate: 88, runs: [1, 0, 2, 1, 3, 1, 1], on: true },
  { id: "referral", name: "Referral Accepted", steps: 3, starts: "A clinic accepts", tone: "#DCE5D0", rate: 100, runs: [0, 2, 1, 3, 2, 2, 4], on: true },
  { id: "link", name: "Payment Link Unopened", steps: 4, starts: "2 days pass", tone: "#F3E7C9", rate: 92, runs: [1, 1, 0, 2, 1, 0, 1], on: true },
  { id: "intake", name: "Intake Incomplete", steps: 4, starts: "1 day passes", tone: "#E9DCC7", rate: 95, runs: [1, 3, 2, 4, 3, 5, 4], on: true },
  { id: "after", name: "After-Hours Call", steps: 4, starts: "A call comes in after 6 pm", tone: "#DCE6F5", rate: 0, runs: [0, 0, 0, 0, 0, 0, 0], on: false },
  {
    id: "onboard",
    name: "New Provider Onboarding",
    steps: 6,
    starts: "Someone adds a provider",
    tone: "#E3E9D9",
    rate: 64,
    runs: [0, 1, 0, 0, 1, 0, 2],
    on: true,
    attention: "Credentialing step fails for Dr. Jun Lee. The payer portal wants a new NPI form.",
  },
];

const RUNS = [
  { time: "2:48 pm", flow: "New Patient Booked", who: "James Lisondra", result: "Completed" },
  { time: "2:31 pm", flow: "Intake Incomplete", who: "Mia Thompson", result: "Completed" },
  { time: "1:54 pm", flow: "New Patient Booked", who: "Noah Kim", result: "Held for You" },
  { time: "1:12 pm", flow: "Payment Link Unopened", who: "Henry Walsh", result: "Completed" },
  { time: "12:40 pm", flow: "Claim Denied", who: "Elena Cho", result: "Completed" },
  { time: "11:58 am", flow: "Referral Accepted", who: "Ava Morales", result: "Completed" },
  { time: "10:22 am", flow: "New Provider Onboarding", who: "Dr. Jun Lee", result: "Held for You" },
];

const TEMPLATES = [
  { name: "No-Show Follow-Up", about: "Rebook through the patient’s agent the same day", tone: "#F7DCCB" },
  { name: "Prior Auth Expiring", about: "Refile two weeks before an approval runs out", tone: "#DCE5D0" },
  { name: "Refill Request", about: "Draft the refill for the doctor to sign", tone: "#F3E7C9" },
  { name: "Results Ready", about: "Hold abnormal results for the doctor, release the rest", tone: "#DCE6F5" },
  { name: "Waitlist Opening", about: "Offer a freed slot to the next patient’s agent", tone: "#E9DCC7" },
];

/** Seven days of runs as small bars; quieter when the workflow is off. */
function Bars({ values, on }: { values: number[]; on: boolean }) {
  const max = Math.max(...values) || 1;
  return (
    <span className="flex items-end gap-[3px] h-[28px]" aria-hidden="true">
      {values.map((v, i) => (
        <span key={i} className="w-[6px] rounded-[2px]" style={{ height: `${Math.max(12, (v / max) * 100)}%`, backgroundColor: on && v ? "#E8A585" : "#2819101A" }} />
      ))}
    </span>
  );
}

/* ——— Editor ——— */

type Kind = "Starts when" | "If" | "Then" | "Else";

const KIND: Record<Kind, { label: string; tone: string }> = {
  "Starts when": { label: "When", tone: "#F7DCCB" },
  If: { label: "If", tone: "#F3E7C9" },
  Then: { label: "Then", tone: "#DCE5D0" },
  Else: { label: "Otherwise", tone: "#FCCFB8" },
};

type Step = { id: string; kind: Kind; title: string; chips: string[]; col: number; row: number; fields: { label: string; value: string }[]; note: string };

const STEPS: Step[] = [
  { id: "start", kind: "Starts when", title: "Agent books a visit", chips: ["Any agent", "Neurology"], col: 0, row: 1, note: "Trigger · Step 1 of 7", fields: [{ label: "Event", value: "An agent books a visit" }, { label: "Agents", value: "Any agent" }, { label: "Service", value: "Neurology" }] },
  { id: "network", kind: "If", title: "In network", chips: ["18 plans", "Live check"], col: 1, row: 0, note: "Check · Step 2 of 7", fields: [{ label: "Check", value: "Insurance plan is accepted" }, { label: "Source", value: "Live check" }, { label: "If it doesn’t match", value: "Hold for front desk" }, { label: "Timeout", value: "5 seconds" }] },
  { id: "limit", kind: "If", title: "Under $100", chips: ["HSA or card"], col: 1, row: 1, note: "Check · Step 3 of 7", fields: [{ label: "Check", value: "Visit total is under" }, { label: "Amount", value: "$100" }, { label: "Methods", value: "HSA or card" }] },
  { id: "hold", kind: "Else", title: "Hold for front desk", chips: ["Ruby", "30 min"], col: 1, row: 2, note: "Action · Step 7 of 7", fields: [{ label: "Assign to", value: "Ruby" }, { label: "Respond within", value: "30 minutes" }] },
  { id: "confirm", kind: "Then", title: "Confirm the slot", chips: ["Auto"], col: 2, row: 0, note: "Action · Step 4 of 7", fields: [{ label: "Confirm", value: "Automatically" }, { label: "Notify", value: "Patient and agent" }] },
  { id: "forms", kind: "Then", title: "Send intake forms", chips: ["7 fields", "Patient reviews"], col: 2, row: 1, note: "Action · Step 5 of 7", fields: [{ label: "Form", value: "New patient intake" }, { label: "Fields", value: "7" }, { label: "Review", value: "Patient reviews first" }] },
  { id: "charge", kind: "Then", title: "Charge copay", chips: ["InstaMed"], col: 2, row: 2, note: "Action · Step 6 of 7", fields: [{ label: "Charge", value: "Visit copay" }, { label: "Processor", value: "InstaMed" }, { label: "When", value: "At booking" }] },
];

const EDGES: [string, string, boolean?][] = [["start", "network"], ["start", "limit"], ["start", "hold", true], ["network", "confirm"], ["network", "forms"], ["limit", "forms"], ["limit", "charge"]];

/** The flow sits on a fixed grid so every connector is straight lines with right-angle turns. */
const NODE_W = 210;
const NODE_H = 104;
const COL_GAP = 80;
const ROW_GAP = 32;
const PAD = 40;
const CANVAS_W = PAD * 2 + NODE_W * 3 + COL_GAP * 2;
const CANVAS_H = PAD * 2 + NODE_H * 3 + ROW_GAP * 2;

const byId = (id: string) => STEPS.find((s) => s.id === id)!;
const posOf = (s: Step) => ({ x: PAD + s.col * (NODE_W + COL_GAP), y: PAD + s.row * (NODE_H + ROW_GAP) });

/** Right, down or up, then right again, with small rounded corners where it turns. */
function connector(from: Step, to: Step) {
  const a = posOf(from);
  const b = posOf(to);
  const x1 = a.x + NODE_W;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y + NODE_H / 2;
  const mid = x1 + COL_GAP / 2;
  if (y1 === y2) return `M${x1} ${y1} H${x2}`;
  const r = 8;
  const dir = y2 > y1 ? 1 : -1;
  return `M${x1} ${y1} H${mid - r} Q${mid} ${y1} ${mid} ${y1 + r * dir} V${y2 - r * dir} Q${mid} ${y2} ${mid + r} ${y2} H${x2}`;
}

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-[6px] shrink-0 px-[16px] py-[12px] rounded-[16px] bg-paper">
      <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{label}</span>
      {children}
    </label>
  );
}

function Editor({ workflow, live, onToggle, onBack }: { workflow: Workflow; live: boolean; onToggle: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState("network");
  const [values, setValues] = useState<Record<string, string>>({});
  const [zoom, setZoom] = useState(1);
  const step = byId(selected);
  const changed = Object.keys(values).length > 0;
  const status: Status = !live ? "Paused" : workflow.attention ? "Needs Attention" : "Live";

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[28px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="flex flex-col gap-[4px]">
        <button type="button" onClick={onBack} className={`flex items-center gap-[4px] w-fit text-[14px] leading-[18px] ${SANS} font-[500] text-sub hover:text-walnut transition-colors duration-150`}>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Automations
        </button>
        <div className="flex items-end justify-between gap-[16px]">
          <span className="flex items-center gap-[14px] min-w-[0px]">
            <span className={`truncate text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>{workflow.name}</span>
            <StatusPill status={status} />
          </span>
          <span className="flex items-center gap-[10px] shrink-0">
            <span className={`flex items-center gap-[8px] mr-[6px] text-[13px] ${SANS} font-[500] text-sub`}>
              {live ? "On" : "Off"}
              <Toggle on={live} onChange={onToggle} label={`${workflow.name} on`} />
            </span>
            <button type="button" className={btnGrey}>
              History
            </button>
            <button type="button" className={btnGrey}>
              Test Run
            </button>
            <button type="button" disabled={!changed} onClick={() => setValues({})} className={`${btnInk} disabled:opacity-40 disabled:cursor-default`}>
              {changed ? "Publish Changes" : "Published"}
            </button>
          </span>
        </div>
      </div>

      <div className="grid grow min-h-[0px] gap-[16px]" style={{ gridTemplateColumns: "1fr 340px" }}>
        <div className="relative rounded-[28px] bg-[#FAF6EC] overflow-hidden" style={{ backgroundImage: "radial-gradient(rgba(40,25,16,0.1) 1px, transparent 1.3px)", backgroundSize: "20px 20px" }}>
          <div className={`absolute inset-0 flex items-center justify-center ${scroll}`}>
            <div className="relative shrink-0" style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${zoom})`, transition: `transform 320ms ${EASE}` }}>
              <svg className="absolute inset-0" width={CANVAS_W} height={CANVAS_H} fill="none" aria-hidden="true">
                {EDGES.map(([from, to, dashed]) => {
                  const lit = selected === from || selected === to;
                  return (
                    <path
                      key={from + to}
                      d={connector(byId(from), byId(to))}
                      stroke={lit ? "#281910" : "#28191040"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={dashed ? "4 5" : undefined}
                      style={{ transition: "stroke 200ms ease" }}
                    />
                  );
                })}
              </svg>
              {STEPS.map((s) => {
                const { x, y } = posOf(s);
                const on = selected === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelected(s.id)}
                    className={`absolute flex flex-col justify-between p-[14px] rounded-[18px] bg-paper text-left border border-solid border-[#2819101A] outline outline-[1.5px] -outline-offset-[1px] transition-[outline-color,transform] duration-200 ${on ? "outline-ink" : "outline-transparent hover:outline-[#28191033]"}`}
                    style={{ left: x, top: y, width: NODE_W, height: NODE_H }}
                  >
                    <span className="flex items-center gap-[8px]">
                      <Dot tone={KIND[s.kind].tone} size={10} />
                      <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>{KIND[s.kind].label}</span>
                    </span>
                    <span className={`truncate text-[18px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{s.title}</span>
                    <span className="flex gap-[6px] overflow-hidden">
                      {s.chips.map((c) => (
                        <span key={c} className={`flex items-center h-[22px] px-[9px] shrink-0 rounded-[999px] bg-[#F4EEDF] text-[12px] ${SANS} font-[500] text-walnut`}>
                          {c}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <span className="absolute left-[14px] top-[14px] flex gap-[6px]">
            <button type="button" className={`flex items-center gap-[6px] h-[34px] pr-[14px] pl-[11px] rounded-[999px] bg-paper hover:bg-[#FFFEF8] border border-solid border-[#2819101A] transition-colors duration-150 text-[13px] ${SANS} font-[500] text-walnut`}>
              <Plus color="#281910" />
              Add Step
            </button>
          </span>
          <span className="absolute right-[14px] bottom-[14px] flex items-center p-[3px] gap-[2px] rounded-[999px] bg-paper border border-solid border-[#2819101A]">
            {[
              { label: "−", aria: "Zoom out", run: () => setZoom((z) => Math.max(0.7, +(z - 0.1).toFixed(1))) },
              { label: `${Math.round(zoom * 100)}%`, aria: "Reset zoom", run: () => setZoom(1) },
              { label: "+", aria: "Zoom in", run: () => setZoom((z) => Math.min(1.3, +(z + 0.1).toFixed(1))) },
            ].map((b) => (
              <button key={b.aria} type="button" aria-label={b.aria} onClick={b.run} className={`min-w-[32px] h-[28px] px-[8px] rounded-[999px] hover:bg-[#F4EEDF] transition-colors duration-150 text-[13px] ${SANS} font-[500] text-walnut [font-variant-numeric:tabular-nums]`}>
                {b.label}
              </button>
            ))}
          </span>
        </div>

        <div className="flex flex-col gap-[12px] min-h-[0px] p-[20px] rounded-[28px] bg-[#FAF6EC]">
          <span className="flex items-center gap-[12px]">
            <Dot tone={KIND[step.kind].tone} size={44} />
            <span className="flex flex-col min-w-[0px]">
              <span className={`truncate text-[24px] leading-[28px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{step.title}</span>
              <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{step.note}</span>
            </span>
          </span>
          <div className={`flex flex-col gap-[6px] grow min-h-[0px] ${scroll}`}>
            {step.fields.map((f) => (
              <SettingRow key={f.label} label={f.label}>
                <input
                  value={values[step.id + f.label] ?? f.value}
                  onChange={(e) => setValues((prev) => ({ ...prev, [step.id + f.label]: e.target.value }))}
                  className={`h-[38px] px-[12px] rounded-[12px] bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus:border-ink outline-none text-[14px] ${SANS} font-[500] text-walnut`}
                />
              </SettingRow>
            ))}
          </div>
          <span className="flex items-center justify-between">
            <span className={`flex items-center gap-[7px] text-[13px] ${SANS} font-[500] text-walnut`}>
              <span className={`w-[8px] h-[8px] rounded-[999px] ${changed ? "bg-[#D9B860]" : "bg-[#6E9A5B]"}`} />
              {changed ? "Unpublished Changes" : "Saved"}
            </span>
            <button type="button" className={btnGrey.replace("h-[40px]", "h-[38px]")}>
              Test Step
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ——— Landing ——— */

const TABS = [
  { id: "workflows", label: "Workflows", count: WORKFLOWS.length },
  { id: "runs", label: "Runs", count: RUNS.length },
  { id: "templates", label: "Templates", count: TEMPLATES.length },
] as const;

function RunItem({ r, flat = false }: { r: (typeof RUNS)[number]; flat?: boolean }) {
  const held = r.result !== "Completed";
  return (
    <div className={`flex items-center gap-[12px] shrink-0 px-[14px] py-[12px] rounded-[14px] ${flat ? "hover:bg-[#FAF6EC] transition-colors duration-150" : "bg-paper"}`}>
      <span className="w-[8px] h-[8px] shrink-0 rounded-[50%]" style={{ backgroundColor: held ? "#E8A585" : "#6E9A5B" }} />
      <span className="flex flex-col grow min-w-[0px]">
        <span className={`truncate text-[14px] leading-[18px] ${SANS} font-[600] text-walnut`}>{r.who}</span>
        <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>
          {r.flow} · {held ? "Held for You" : "Completed"}
        </span>
      </span>
      <span className={`shrink-0 text-[12px] leading-[16px] ${SANS} text-sub [font-variant-numeric:tabular-nums]`}>{r.time}</span>
    </div>
  );
}

export function DoeHealthProductAutomationsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(WORKFLOWS.map((w) => [w.id, w.on])));
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("workflows");
  const [query, setQuery] = useState("");
  const flip = (id: string) => setOn((prev) => ({ ...prev, [id]: !prev[id] }));

  const opened = WORKFLOWS.find((w) => w.id === open);
  if (opened) return <Editor workflow={opened} live={!!on[opened.id]} onToggle={() => flip(opened.id)} onBack={() => setOpen(null)} />;

  const statusOf = (w: Workflow): Status => (!on[w.id] ? "Paused" : w.attention ? "Needs Attention" : "Live");
  const q = query.trim().toLowerCase();
  const shown = WORKFLOWS.filter((w) => !q || w.name.toLowerCase().includes(q) || w.starts.toLowerCase().includes(q));
  const live = WORKFLOWS.filter((w) => on[w.id]);
  const attention = live.filter((w) => w.attention);
  const runsThisWeek = live.reduce((n, w) => n + w.runs.reduce((a, b) => a + b, 0), 0);
  const success = live.length ? Math.round(live.reduce((n, w) => n + w.rate, 0) / live.length) : 0;
  const held = RUNS.filter((r) => r.result !== "Completed").length;
  const daily = Array.from({ length: 7 }, (_, d) => live.reduce((n, w) => n + w.runs[d]!, 0));
  const peak = Math.max(...daily) || 1;
  const ticks = 24;
  /** One shared language for the strip: rounded vertical marks standing on a common baseline. */
  const Mark = ({ h, color }: { h: number | string; color: string }) => <span className="grow basis-[0%] rounded-[3px]" style={{ height: h, backgroundColor: color }} />;
  const stats: { label: string; value: string; note: string; tone: string; strip: ReactNode }[] = [
    {
      label: "Runs this week",
      value: String(runsThisWeek),
      note: "Last 7 days",
      tone: "#FAF6EC",
      strip: (
        <span className="flex gap-[6px] items-end">
          {daily.map((v, i) => (
            <span key={i} className="flex flex-col items-stretch grow basis-[0%] gap-[4px]">
              <span className="flex items-end h-[32px]">
                <Mark h={`${Math.max(14, (v / peak) * 100)}%`} color={i === daily.length - 1 ? "#281910" : "#28191033"} />
              </span>
              <span className={`text-center text-[10px] leading-[12px] ${SANS} font-[500] text-sub`}>{"SMTWTFS"[(i + 1) % 7]}</span>
            </span>
          ))}
        </span>
      ),
    },
    {
      label: "Success rate",
      value: `${success}%`,
      note: "Runs that finished",
      tone: "#F4EEDF",
      strip: (
        <span className="flex items-end gap-[2px] h-[48px] pb-[16px]">
          {Array.from({ length: ticks }, (_, i) => (
            <Mark key={i} h="100%" color={i < Math.round((success / 100) * ticks) ? "#281910" : "#2819101F"} />
          ))}
        </span>
      ),
    },
    {
      label: "Held for you",
      value: String(held),
      note: `Of ${RUNS.length} runs today`,
      tone: "#EEE6D6",
      strip: (
        <span className="flex items-end gap-[3px] h-[48px] pb-[16px]">
          {RUNS.map((r) => (
            <Mark key={r.time} h="100%" color={r.result === "Completed" ? "#2819101F" : "#E8A585"} />
          ))}
        </span>
      ),
    },
    {
      label: "Live workflows",
      value: `${live.length} of ${WORKFLOWS.length}`,
      note: "Switched on",
      tone: "#E6DDCB",
      strip: (
        <span className="flex items-end gap-[3px] h-[48px] pb-[16px]">
          {WORKFLOWS.map((w) => (
            <Mark key={w.id} h="100%" color={on[w.id] ? "#281910" : "#2819101F"} />
          ))}
        </span>
      ),
    },
  ];

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[22px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Automations</span>
        <span className="flex items-center gap-[8px]">
          <label className="flex items-center gap-[8px] w-[260px] h-[40px] px-[14px] rounded-[999px] bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus-within:border-ink text-sub transition-colors duration-150">
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
              <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setTab("workflows");
              }}
              placeholder="Search workflows"
              className={`grow min-w-[0px] bg-transparent outline-none text-[14px] ${SANS} font-[500] text-walnut placeholder:text-sub`}
            />
          </label>
          <button type="button" onClick={() => setTab("templates")} className={btnGrey.replace("px-[18px]", "pr-[18px] pl-[14px]")}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
              <rect x="4" y="4" width="7" height="7" rx="2" fill="none" stroke="#281910" strokeWidth="1.8" />
              <rect x="13" y="4" width="7" height="7" rx="2" fill="none" stroke="#281910" strokeWidth="1.8" />
              <rect x="4" y="13" width="7" height="7" rx="2" fill="none" stroke="#281910" strokeWidth="1.8" />
              <path d="M16.5 13.5v6M13.5 16.5h6" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Templates
          </button>
          <button type="button" className={btnInk.replace("px-[18px]", "pr-[18px] pl-[14px]")}>
            <Plus />
            New Workflow
          </button>
        </span>
      </div>

      <div className="grid grid-cols-4 gap-[10px] shrink-0">
        {stats.map((s, i) => (
          <span
            key={s.label}
            className={`flex flex-col gap-[12px] h-[156px] min-w-[0px] p-[18px_20px] ${i === 0 ? "rounded-l-[24px] rounded-r-[4px]" : i === stats.length - 1 ? "rounded-l-[4px] rounded-r-[24px]" : "rounded-[4px]"}`}
            style={{ backgroundColor: s.tone }}
          >
            <span className="flex items-center justify-between gap-[8px]">
              <span className={`truncate text-[13px] leading-[16px] ${SANS} font-[500] text-[rgba(40,25,16,0.7)]`}>{s.label}</span>
              <span className={`shrink-0 text-[12px] leading-[16px] ${SANS} text-sub`}>{s.note}</span>
            </span>
            <span className={`truncate text-[40px] leading-[42px] tracking-[-0.03em] ${DISPLAY} text-ink [font-variant-numeric:tabular-nums]`}>{s.value}</span>
            <span className="mt-auto">{s.strip}</span>
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-[12px] shrink-0">
        <span className="w-[360px] shrink-0">
          <Segmented value={tab} options={TABS} onChange={setTab} />
        </span>
      </div>

      {tab === "workflows" && (
        <div className="grid grid-cols-[1fr_320px] gap-[16px] grow min-h-[0px]">
          <div className={`grid grid-cols-2 auto-rows-min gap-[8px] p-[8px] rounded-[18px] bg-[#F4EEDF] ${scroll}`}>
            {shown.map((w) => {
              const isOn = !!on[w.id];
              const total = w.runs.reduce((a, b) => a + b, 0);
              return (
                <div
                  key={w.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpen(w.id)}
                  onKeyDown={(e) => e.key === "Enter" && setOpen(w.id)}
                  className={`flex flex-col gap-[14px] p-[16px] rounded-[14px] bg-paper cursor-pointer outline outline-[1.5px] -outline-offset-[1.5px] outline-transparent hover:outline-[#28191026] transition-[outline-color,opacity] duration-150 ${isOn ? "" : "opacity-70"}`}
                >
                  <span className="flex items-center justify-between">
                    <Dot tone={w.tone} size={36} />
                    <Toggle on={isOn} label={`${w.name} on`} onChange={() => flip(w.id)} />
                  </span>
                  <span className="flex flex-col gap-[2px] min-w-[0px]">
                    <span className={`truncate text-[20px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{w.name}</span>
                    <span className={`truncate text-[13px] leading-[17px] ${SANS} text-sub`}>
                      When {w.starts.charAt(0).toLowerCase() + w.starts.slice(1)} · {w.steps} steps
                    </span>
                  </span>
                  <span className="flex items-end justify-between gap-[12px] pt-[12px] border-t border-solid border-[#2819100F]">
                    <span className="flex flex-col gap-[8px]">
                      <StatusPill status={statusOf(w)} />
                      <span className={`text-[12px] leading-[16px] ${SANS} text-sub [font-variant-numeric:tabular-nums]`}>
                        {isOn ? `${total} runs · ${w.rate}% success` : "Off this week"}
                      </span>
                    </span>
                    <Bars values={w.runs} on={isOn} />
                  </span>
                </div>
              );
            })}
            {shown.length === 0 && <span className={`col-span-2 px-[12px] py-[18px] text-[14px] ${SANS} text-sub`}>No workflows match “{query}”.</span>}
          </div>

          <div className={`flex flex-col gap-[8px] min-h-[0px] p-[8px] rounded-[18px] bg-[#FAF6EC] ${scroll}`}>
            {attention.map((w) => (
              <div key={w.id} className="flex flex-col gap-[10px] shrink-0 p-[16px] rounded-[14px] bg-paper">
                <span className="flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-[50%] bg-[#E8A585]" />
                  <span className={`text-[13px] leading-[16px] ${SANS} font-[600] text-[#7A3E26]`}>Needs Attention</span>
                </span>
                <span className={`text-[18px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{w.name}</span>
                <span className={`text-[13px] leading-[19px] ${SANS} text-walnut`}>{w.attention}</span>
                <button type="button" onClick={() => setOpen(w.id)} className={`self-start h-[34px] px-[14px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[13px] ${SANS} font-[500] [color:#FFFCF1]`}>
                  Review Workflow
                </button>
              </div>
            ))}
            <div className="flex flex-col grow gap-[2px] p-[8px] rounded-[14px] bg-paper">
              <span className="flex items-center justify-between px-[8px] pt-[6px] pb-[6px]">
                <span className={`text-[18px] leading-[22px] ${DISPLAY} text-walnut`}>Latest Runs</span>
                <button type="button" onClick={() => setTab("runs")} className={`text-[13px] ${SANS} font-[500] text-sub hover:text-walnut transition-colors duration-150`}>
                  See All
                </button>
              </span>
              {RUNS.map((r) => (
                <RunItem key={r.time} r={r} flat />
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "runs" && (
        <div className={`flex flex-col gap-[4px] grow min-h-[0px] p-[8px] rounded-[18px] bg-[#F4EEDF] ${scroll}`}>
          <span className={`px-[8px] pt-[6px] pb-[4px] text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>Today</span>
          {RUNS.map((r) => (
            <RunItem key={r.time} r={r} />
          ))}
        </div>
      )}

      {tab === "templates" && (
        <div className={`grid grid-cols-3 auto-rows-min gap-[8px] grow min-h-[0px] p-[8px] rounded-[18px] bg-[#F4EEDF] ${scroll}`}>
          {TEMPLATES.map((t) => (
            <div key={t.name} className="flex flex-col gap-[14px] p-[18px] rounded-[14px] bg-paper">
              <Dot tone={t.tone} size={36} />
              <span className="flex flex-col gap-[4px]">
                <span className={`text-[20px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{t.name}</span>
                <span className={`text-[14px] leading-[19px] ${SANS} text-sub`}>{t.about}</span>
              </span>
              <button type="button" className={`self-start flex items-center gap-[6px] h-[34px] pr-[14px] pl-[11px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[13px] ${SANS} font-[500] text-walnut`}>
                <Plus color="#281910" />
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
