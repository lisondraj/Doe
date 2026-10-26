"use client";

/**
 * Payments tab — one path for the money behind every visit: prior auth with the payer when a service needs it, then
 * invoiced, sent to the patient's agent, approved and collected. The stage row doubles as the table's filter, each
 * row says what covers it, and clicking a row opens its whole journey in a panel on the right.
 */
import { useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const MOVE = `520ms ${EASE}`;
const PANEL_W = 400;

type Auth = "drafting" | "submitted" | "review" | "info" | "appeal" | "approved";
type Stage = "auth" | "sent" | "waiting" | "paid";

type Row = {
  id: string;
  date: string;
  name: string;
  service: string;
  payer: string;
  amount: string;
  /** Prior auth state, or null when the service doesn't need one. */
  auth: Auth | null;
  stage: Stage;
  method: string;
  note: string;
};

const ROWS: Row[] = [
  { id: "leo-tubes", date: "Oct 14", name: "Leo Jacobs", service: "Ear Tube Surgery", payer: "Harbor Mutual", amount: "$1,840", auth: "info", stage: "auth", method: "—", note: "Harbor Mutual asked for the audiogram. Doe found the Oct 2 one and it’s ready to attach." },
  { id: "grace-ait", date: "Oct 14", name: "Grace Patel", service: "Allergy Immunotherapy", payer: "Cigna", amount: "$640", auth: "drafting", stage: "auth", method: "—", note: "Pulling the allergy panel and visit note into Cigna’s form." },
  { id: "priya-mri", date: "Oct 13", name: "Priya Raman", service: "MRI, Inner Ear", payer: "UnitedHealthcare", amount: "$410", auth: "submitted", stage: "auth", method: "—", note: "Filed on UnitedHealthcare’s portal. Doe checks it tomorrow morning." },
  { id: "omar-dise", date: "Oct 11", name: "Omar Haddad", service: "Sleep Endoscopy", payer: "Harbor Mutual", amount: "$980", auth: "appeal", stage: "auth", method: "—", note: "Denied for a missing sleep study. Appeal sent Oct 13 with the study attached." },
  { id: "leo-consult", date: "Oct 14", name: "Leo Jacobs", service: "Ear Tube Consult", payer: "Harbor Mutual", amount: "$40.00", auth: null, stage: "sent", method: "HSA •••• 4417", note: "Mia’s agent has the bill and pays from Leo’s HSA on Fridays." },
  { id: "henry-ct", date: "Oct 12", name: "Henry Walsh", service: "Sinus CT", payer: "Aetna", amount: "$310.00", auth: "approved", stage: "waiting", method: "—", note: "Henry’s agent asked him to approve $310 after Aetna’s share. A reminder goes out tonight." },
  { id: "maya-fit", date: "Oct 11", name: "Maya Chen", service: "Hearing Aid Fitting", payer: "Blue Cross", amount: "$85.00", auth: "approved", stage: "sent", method: "—", note: "Maya’s agent has the link and is checking her FSA balance." },
  { id: "ava-test", date: "Oct 13", name: "Ava Thompson", service: "Hearing Test", payer: "Blue Cross", amount: "$65.00", auth: null, stage: "paid", method: "Visa •••• 2290", note: "Paid by Ava’s agent four minutes after the visit." },
  { id: "noah-balance", date: "Oct 13", name: "Noah Kim", service: "Balance Testing", payer: "Aetna", amount: "$25.00", auth: "approved", stage: "paid", method: "HSA •••• 0912", note: "Aetna approved in a day, and Noah’s agent paid the copay at checkout." },
  { id: "grace-panel", date: "Oct 12", name: "Grace Patel", service: "Allergy Panel", payer: "Cigna", amount: "$120.00", auth: null, stage: "paid", method: "Amex •••• 3005", note: "Paid by Grace’s agent." },
  { id: "daniel-clean", date: "Oct 11", name: "Daniel Okafor", service: "Ear Cleaning", payer: "Aetna", amount: "$30.00", auth: null, stage: "paid", method: "Visa •••• 7731", note: "Paid by Daniel’s agent." },
  { id: "tom-follow", date: "Oct 10", name: "Tom Halvorsen", service: "Follow-Up Visit", payer: "Blue Cross", amount: "$25.00", auth: null, stage: "paid", method: "Visa •••• 1184", note: "Paid at the front desk." },
];

const AUTH: Record<Auth, { label: string; background: string; color: string }> = {
  drafting: { label: "Agent drafting", background: "#28191014", color: "#281910" },
  submitted: { label: "With payer", background: "#ECE6DA", color: "#281910" },
  review: { label: "Payer review", background: "#F3E2B4", color: "#281910" },
  info: { label: "Needs you", background: "#FCCFB8", color: "#140C04" },
  appeal: { label: "Appealing", background: "#F6D2C4", color: "#140C04" },
  approved: { label: "Approved", background: "#D6DEC6", color: "#2F3B2A" },
};

const PAY: Record<Exclude<Stage, "auth">, { label: string; background: string; color: string }> = {
  sent: { label: "Sent to agent", background: "#FCCFB8", color: "#140C04" },
  waiting: { label: "Awaiting approval", background: "#28191014", color: "#281910" },
  paid: { label: "Paid by agent", background: "#D6DEC6", color: "#2F3B2A" },
};

const pillFor = (r: Row) => (r.stage === "auth" ? AUTH[r.auth!] : PAY[r.stage]);

type Filter = "all" | "auth" | "invoiced" | "sent" | "waiting" | "paid";

const matches = (r: Row, f: Filter) => f === "all" || (f === "invoiced" ? r.stage !== "auth" : r.stage === f);

/** Left to right: what's still with the payer, then the charge's path to collected. */
const TILES: { id: Filter; label: string; value: string; note: string; tone: string }[] = [
  { id: "auth", label: "Prior auth", value: "$3,870", note: "With payers before the visit", tone: "#FAF6EC" },
  { id: "invoiced", label: "Invoiced", value: "$1,860", note: "Charged after the visit", tone: "#F4EEDF" },
  { id: "sent", label: "Sent to agent", value: "$510", note: "Patient’s agent has the link", tone: "#F8D9C6" },
  { id: "waiting", label: "Awaiting approval", value: "$310", note: "Patient approves in the agent", tone: "#ECE6DA" },
];

const COLS = { date: 56, name: 140, coverage: 170, amount: 84, status: 148 };

function Pill({ label, background, color }: { label: string; background: string; color: string }) {
  return (
    <span className={`flex items-center h-[28px] px-[12px] rounded-[999px] text-[13px] leading-[18px] ${SANS} font-[500] whitespace-nowrap`} style={{ backgroundColor: background, color }}>
      {label}
    </span>
  );
}

function Shield({ color = "currentColor", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <path d="M12 3.5l7 2.6v5.4c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6.1l7-2.6z" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2.2 2.2L15.5 10" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron() {
  return (
    <span className="absolute z-[2] top-1/2 -right-[22px] -mt-[17px] w-[34px] h-[34px] flex items-center justify-center rounded-[999px] bg-paper" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: "block" }}>
        <path d="M9 6l6 6-6 6" fill="none" stroke="#281910" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function StageRow({ filter, onFilter }: { filter: Filter; onFilter: (f: Filter) => void }) {
  const count = (f: Filter) => ROWS.filter((r) => matches(r, f)).length;
  const needYou = ROWS.filter((r) => r.auth === "info").length;
  const ring = (f: Filter) => (filter === f ? "shadow-[inset_0_0_0_1.5px_#140C04]" : "");

  return (
    <div className="relative grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] gap-[10px] h-[164px] shrink-0">
      {TILES.map((t, i) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onFilter(filter === t.id ? "all" : t.id)}
          className={`relative flex flex-col p-[18px_20px] text-left transition-shadow duration-150 ${i === 0 ? "rounded-l-[24px] rounded-r-[4px] border-[1.5px] border-dashed border-[#2819102E]" : "rounded-[4px]"} ${ring(t.id)}`}
          style={{ backgroundColor: t.tone }}
        >
          <span className={`flex items-center justify-between w-full text-[13px] leading-[16px] ${SANS} font-[500] text-[rgba(40,25,16,0.7)]`}>
            <span className="flex items-center gap-[6px]">
              {t.id === "auth" && <Shield />}
              {t.label}
            </span>
            {t.id === "auth" && needYou > 0 ? (
              <span className="flex items-center h-[22px] px-[8px] whitespace-nowrap rounded-[999px] bg-[#FCCFB8] text-[12px] text-ink">{needYou} needs you</span>
            ) : (
              <span className="text-sub">{count(t.id)}</span>
            )}
          </span>
          <span className={`mt-[14px] text-[40px] leading-[42px] tracking-[-0.03em] ${DISPLAY} text-ink`}>{t.value}</span>
          <span className={`mt-[6px] text-[13px] leading-[18px] ${SANS} text-sub`}>{t.note}</span>
          {t.id === "auth" && <span className={`mt-auto text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}>{count("auth")} open · 1.8 days avg to approve</span>}
          <Chevron />
        </button>
      ))}
      <button
        type="button"
        onClick={() => onFilter(filter === "paid" ? "all" : "paid")}
        className={`relative flex flex-col p-[18px_20px] rounded-l-[4px] rounded-r-[24px] bg-[#D6DEC6] text-left transition-shadow duration-150 ${ring("paid")}`}
      >
        <span className={`flex items-center justify-between w-full text-[13px] leading-[16px] ${SANS} font-[500] text-[#2F3B2A]`}>
          Collected
          <span className="flex items-center h-[24px] px-[10px] rounded-[999px] bg-[#FFFCF1A6] text-[12px]">+18% this week</span>
        </span>
        <span className={`mt-[8px] text-[52px] leading-[54px] tracking-[-0.03em] ${DISPLAY} text-ink`}>$1,240</span>
        <span className={`mt-[6px] flex gap-[14px] text-[12.5px] leading-[16px] ${SANS} text-[#2F3B2A]`}>
          <span><b className="font-[600]">72%</b> paid by agent</span>
          <span><b className="font-[600]">18%</b> card on file</span>
        </span>
        <span className="mt-auto flex gap-[3px] w-full h-[6px] rounded-[99px] overflow-hidden bg-[#FFFCF18C]">
          <span className="h-full bg-[#2F3B2A]" style={{ width: "72%" }} />
          <span className="h-full bg-[#6E9A5B]" style={{ width: "18%" }} />
          <span className="h-full bg-[#9DB387]" style={{ width: "10%" }} />
        </span>
      </button>
    </div>
  );
}

type Step = { label: string; detail: string; state: "done" | "now" | "next"; auth?: boolean };

/** The visit's full path: prior auth when it needs one, then the charge. */
function journey(r: Row): Step[] {
  const first = r.name.split(" ")[0];
  const steps: Step[] = [];
  if (r.auth) {
    const approved = r.auth === "approved";
    const stuck = r.auth === "info" || r.auth === "appeal";
    steps.push({ label: "Packet drafted", detail: `From the chart, for ${r.payer}`, state: r.auth === "drafting" ? "now" : "done", auth: true });
    steps.push({ label: "Filed with payer", detail: `On ${r.payer}’s portal`, state: r.auth === "drafting" ? "next" : r.auth === "submitted" ? "now" : "done", auth: true });
    steps.push({
      label: approved ? "Approved" : r.auth === "info" ? "Payer asked for more" : r.auth === "appeal" ? "Appealing a denial" : "Decision",
      detail: approved ? "Valid for 90 days" : r.auth === "info" ? "Audiogram from the last 90 days" : r.auth === "appeal" ? "Sleep study attached" : "Doe checks daily",
      state: approved ? "done" : stuck ? "now" : "next",
      auth: true,
    });
  }
  const after = r.stage !== "auth";
  steps.push({ label: "Visit", detail: after ? r.date : "Books once approved", state: after ? "done" : "next" });
  steps.push({ label: "Invoiced", detail: after ? `${r.amount} after ${r.payer}’s share` : `About ${r.amount} after ${r.payer}’s share`, state: after ? "done" : "next" });
  steps.push({ label: `Sent to ${first}’s agent`, detail: "Link and itemized bill", state: r.stage === "sent" ? "now" : r.stage === "waiting" || r.stage === "paid" ? "done" : "next" });
  steps.push({ label: `${first} approves`, detail: "In their agent", state: r.stage === "waiting" ? "now" : r.stage === "paid" ? "done" : "next" });
  steps.push({ label: "Collected", detail: r.stage === "paid" ? r.method : "Lands in your account", state: r.stage === "paid" ? "done" : "next" });
  return steps;
}

const ACTION: Record<string, [string, string]> = {
  info: ["Attach audiogram", "Call payer"],
  drafting: ["Review packet", "Pause"],
  submitted: ["View packet", "Check now"],
  review: ["View packet", "Check now"],
  appeal: ["View appeal", "Peer-to-peer"],
  approved: ["View approval", "Book visit"],
  sent: ["Nudge agent", "Card on file"],
  waiting: ["Send reminder", "Payment plan"],
  paid: ["View receipt", "Refund"],
};

/** Pills sit on ink in the panel, so the see-through tones get a solid one. */
const onInk = (p: { label: string; background: string; color: string }) => (p.background.length === 9 ? { ...p, background: "#EEEADF" } : p);

function JourneyPanel({ row, onClose }: { row: Row; onClose: () => void }) {
  const steps = journey(row);
  const [primary, secondary] = ACTION[row.stage === "auth" ? row.auth! : row.stage]!;

  return (
    <div key={row.id} className="doe-menu-in flex flex-col h-full gap-[16px] pt-[20px] pb-[18px] px-[20px] rounded-[18px] bg-ink">
      <div className="flex items-start justify-between gap-[12px]">
        <span className="flex flex-col min-w-[0px] gap-[2px]">
          <span className={`truncate text-[12px] leading-[16px] ${SANS} [color:#FFFCF180]`}>
            {row.service} · {row.payer}
          </span>
          <span className={`truncate text-[26px] leading-[32px] tracking-[-0.02em] ${DISPLAY} [color:#FFFCF1]`}>{row.name}</span>
        </span>
        <button type="button" aria-label="Close" onClick={onClose} className="w-[34px] h-[34px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FFFCF114] hover:bg-[#FFFCF124] transition-colors duration-150">
          <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#FFFCF1" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between gap-[12px] pb-[14px] border-b border-solid border-[#FFFCF114]">
        <span className="flex items-baseline gap-[8px]">
          <span className={`text-[32px] leading-[36px] tracking-[-0.03em] ${DISPLAY} [color:#FFFCF1]`}>{row.amount}</span>
          <span className={`text-[12px] leading-[16px] ${SANS} [color:#FFFCF180]`}>{row.stage === "auth" ? "est. after insurance" : "patient owes"}</span>
        </span>
        <Pill {...onInk(pillFor(row))} />
      </div>

      <div className="flex flex-col grow min-h-[0px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {steps.map((s, i) => (
          <div key={s.label} className="flex gap-[12px]">
            <span className="flex flex-col items-center w-[14px] shrink-0">
              <span
                className="mt-[4px] w-[12px] h-[12px] shrink-0 rounded-[999px] border-2 border-solid"
                style={{
                  borderColor: s.state === "next" ? "#FFFCF12E" : s.state === "now" ? "#F8C2A8" : "#FFFCF1",
                  backgroundColor: s.state === "done" ? "#FFFCF1" : s.state === "now" ? "#F8C2A8" : "transparent",
                  boxShadow: s.state === "now" ? "0 0 0 4px #F8C2A833" : undefined,
                }}
              />
              {i < steps.length - 1 && <span className="grow w-[2px] my-[2px] rounded-[99px]" style={{ backgroundColor: s.state === "done" ? "#FFFCF1" : "#FFFCF11F" }} />}
            </span>
            <span className="flex flex-col grow min-w-[0px] pb-[8px]">
              <span className={`flex items-center gap-[8px] text-[14px] leading-[20px] ${SANS} font-[500] ${s.state === "next" ? "[color:#FFFCF166]" : "[color:#FFFCF1]"}`}>
                {s.label}
                {s.auth && i === 0 && (
                  <span className="flex items-center gap-[4px] h-[20px] px-[8px] rounded-[999px] bg-[#FFFCF114] text-[11px] leading-[14px] [color:#FFFCF1B3]">
                    <Shield size={11} />
                    Prior auth
                  </span>
                )}
              </span>
              {s.state === "now" && <span className={`text-[13px] leading-[18px] ${SANS} [color:#F8C2A8]`}>{s.detail}</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-[10px] p-[14px] rounded-[14px] bg-[#FFFCF10F]">
        <span className="mt-[6px] w-[6px] h-[6px] shrink-0 rounded-[99px] bg-salmon" />
        <span className={`text-[13px] leading-[19px] ${SANS} [color:#FFFCF1E6]`}>{row.note}</span>
      </div>

      <div className="flex gap-[8px] shrink-0">
        <button type="button" className={`grow h-[44px] rounded-[999px] bg-salmon hover:bg-[#F8C2A8] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-ink`}>
          {primary}
        </button>
        <button type="button" className={`h-[44px] px-[16px] rounded-[999px] border border-solid border-[#FFFCF12E] hover:bg-[#FFFCF10F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
          {secondary}
        </button>
      </div>
    </div>
  );
}

const FILTER_LABEL: Record<Filter, string> = {
  all: "All visits",
  auth: "Prior auth",
  invoiced: "Invoiced",
  sent: "Sent to agent",
  waiting: "Awaiting approval",
  paid: "Collected",
};

export function DoeHealthProductPaymentsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>(ROWS[0]!.id);
  const [shown, setShown] = useState(ROWS[0]!.id);

  const rows = ROWS.filter((r) => matches(r, filter));
  const row = ROWS.find((r) => r.id === shown)!;
  const select = (id: string) => {
    setShown(id);
    setOpen((cur) => (cur === id ? null : id));
  };

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Payments</span>
        <span className="flex gap-[10px]">
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-[#28191014] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>Export</span>
          <span className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>New charge</span>
        </span>
      </div>

      <StageRow filter={filter} onFilter={setFilter} />

      <div className="grid grow min-h-[0px]" style={{ gridTemplateColumns: open ? `1fr ${PANEL_W}px` : "1fr 0px", columnGap: open ? 12 : 0, transition: `grid-template-columns ${MOVE}, column-gap ${MOVE}` }}>
        <div className="flex flex-col min-w-[0px] min-h-[0px] rounded-[18px] bg-[#F4EEDF] overflow-hidden">
          <div className="flex items-center justify-between h-[48px] shrink-0 px-[24px] pt-[12px]">
            <span className="flex items-baseline gap-[10px]">
              <span className={`text-[20px] leading-[24px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>{FILTER_LABEL[filter]}</span>
              <span className={`text-[14px] leading-[18px] ${SANS} text-sub`}>{rows.length}</span>
            </span>
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`flex items-center h-[30px] px-[12px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}
              >
                Show all
              </button>
            )}
          </div>
          <div className={`flex items-center gap-[16px] shrink-0 px-[24px] py-[8px] text-[13px] leading-[18px] ${SANS} text-sub`}>
            <span style={{ width: COLS.date }} className="shrink-0">Date</span>
            <span style={{ width: COLS.name }} className="shrink-0">Patient</span>
            <span className="grow min-w-[0px]">Service</span>
            <span style={{ width: COLS.coverage }} className="shrink-0">Coverage</span>
            <span style={{ width: COLS.amount }} className="shrink-0">Amount</span>
            <span style={{ width: COLS.status }} className="shrink-0">Status</span>
          </div>
          <div className="flex flex-col grow min-h-[0px] gap-[4px] px-[8px] pb-[8px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {rows.map((r) => {
              const on = open === r.id;
              const pending = r.auth !== null && r.auth !== "approved";
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => select(r.id)}
                  className={`flex items-center gap-[16px] h-[62px] shrink-0 px-[16px] rounded-[12px] bg-paper text-left transition-shadow duration-150 ${on ? "shadow-[0_0_0_1.5px_#140C04]" : "hover:shadow-[0_0_0_1.5px_#28191026]"}`}
                >
                  <span style={{ width: COLS.date }} className={`shrink-0 text-[16px] leading-[20px] ${SANS} font-[500] text-walnut`}>{r.date}</span>
                  <span style={{ width: COLS.name }} className={`shrink-0 truncate text-[17px] leading-[22px] tracking-[-0.02em] ${SANS} text-ink`}>{r.name}</span>
                  <span className={`grow min-w-[0px] truncate text-[15px] leading-[20px] ${SANS} text-[rgba(40,25,16,0.78)]`}>{r.service}</span>
                  <span style={{ width: COLS.coverage }} className="shrink-0 flex flex-col min-w-[0px]">
                    <span className={`truncate text-[14px] leading-[18px] ${SANS} text-walnut`}>{r.payer}</span>
                    <span className={`flex items-center gap-[4px] text-[12px] leading-[16px] ${SANS} ${pending ? "text-[#B4572F]" : "text-sub"}`}>
                      {r.auth ? <Shield size={12} /> : null}
                      {r.auth ? (pending ? "Auth in progress" : "Auth approved") : "No auth needed"}
                    </span>
                  </span>
                  <span style={{ width: COLS.amount }} className={`shrink-0 text-[16px] leading-[20px] ${SANS} font-[500] [font-variant-numeric:tabular-nums] ${r.stage === "auth" ? "text-sub" : "text-walnut"}`}>
                    {r.stage === "auth" ? `~${r.amount}` : r.amount}
                  </span>
                  <span style={{ width: COLS.status }} className="shrink-0 flex">
                    <Pill {...pillFor(r)} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-[0px] min-h-[0px] overflow-hidden" aria-hidden={!open}>
          <div
            className="h-full"
            style={{
              width: PANEL_W,
              opacity: open ? 1 : 0,
              transform: open ? "translateX(0)" : "translateX(20px)",
              transition: `opacity ${MOVE}, transform ${MOVE}`,
              pointerEvents: open ? "auto" : "none",
            }}
          >
            <JourneyPanel row={row} onClose={() => setOpen(null)} />
          </div>
        </div>
      </div>
    </div>
  );
}
