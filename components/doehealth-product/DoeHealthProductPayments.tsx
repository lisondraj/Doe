"use client";

/**
 * Payments tab — today's money at a glance: four soft stat cards, the day's payments with one action
 * each, and the week's collections as rounded bars.
 */
import { type ReactNode, useState } from "react";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type Status = "paid" | "due" | "sent" | "claim" | "denied";

const STATUS: Record<Status, { label: string; tone: string }> = {
  paid: { label: "Paid", tone: "#E3E9D9" },
  due: { label: "Due", tone: "#FCCFB8" },
  sent: { label: "Link sent", tone: "#EEE6D6" },
  claim: { label: "Claim pending", tone: "#F3E7C9" },
  denied: { label: "Claim denied", tone: "#F6D2C4" },
};

const PAYMENTS: { id: string; who: string; what: string; time: string; amount: number; status: Status; agent?: boolean }[] = [
  { id: "maya", who: "Maya Chen", what: "Visit copay", time: "8:30", amount: 25, status: "paid", agent: true },
  { id: "priya", who: "Priya Raman", what: "New patient visit", time: "9:00", amount: 185, status: "due" },
  { id: "daniel", who: "Daniel Okafor", what: "Physical, after insurance", time: "9:15", amount: 62, status: "due" },
  { id: "grace", who: "Grace Kim", what: "Refill visit", time: "10:40", amount: 30, status: "paid" },
  { id: "henry", who: "Henry Walsh", what: "Lipid panel copay", time: "11:00", amount: 40, status: "sent" },
  { id: "leo", who: "Leo Jacobs", what: "Ear check · Harbor Mutual", time: "11:30", amount: 142, status: "claim" },
  { id: "hannah", who: "Hannah Lee", what: "Follow-up", time: "1:15", amount: 25, status: "paid" },
  { id: "marcus", who: "Marcus Webb", what: "A1C panel · Blue Cross", time: "2:00", amount: 96, status: "denied" },
  { id: "omar", who: "Omar Haddad", what: "Ear check", time: "4:15", amount: 25, status: "paid", agent: true },
];

const WEEK = [
  { day: "Mon", value: 4210, today: true },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 0 },
  { day: "Fri", value: 0 },
];
const LAST_WEEK = [5120, 4380, 6010, 3890, 5460];
const GOAL = 6000;

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function Stat({ label, value, note, tone, children }: { label: string; value: string; note: string; tone: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between h-[150px] p-[20px] rounded-[28px]" style={{ backgroundColor: tone }}>
      <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-walnut opacity-70`}>{label}</span>
      <span className="flex flex-col gap-[8px]">
        <span className={`text-[38px] leading-[42px] tracking-[-0.02em] ${DISPLAY} text-ink`}>{value}</span>
        {children}
        <span className={`text-[12px] leading-[16px] ${SANS} font-[500] text-walnut opacity-70`}>{note}</span>
      </span>
    </div>
  );
}

export function DoeHealthProductPaymentsPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(() => Object.fromEntries(PAYMENTS.map((p) => [p.id, p.status])));
  const set = (id: string, status: Status) => setStatuses((prev) => ({ ...prev, [id]: status }));

  const owed = PAYMENTS.filter((p) => statuses[p.id] === "due" || statuses[p.id] === "sent");
  const dueCount = PAYMENTS.filter((p) => statuses[p.id] === "due").length;
  const collected = 4210;
  const max = Math.max(GOAL, ...LAST_WEEK);

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[24px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">

      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Payments</span>
        <button
          type="button"
          disabled={dueCount === 0}
          onClick={() => PAYMENTS.forEach((p) => statuses[p.id] === "due" && set(p.id, "sent"))}
          className={`h-[40px] px-[18px] rounded-[999px] text-[14px] leading-[18px] ${SANS} font-[500] transition-colors duration-150 ${dueCount ? "bg-ink [color:#FFFCF1] hover:bg-[#2B1D12]" : "bg-[#EEEADF] text-sub"}`}
        >
          {dueCount ? `Send ${dueCount} payment links` : "All links sent"}
        </button>
      </div>

      <div className="relative grid grid-cols-4 gap-[12px]">
        <Stat label="Collected today" value={money(collected)} note={`${Math.round((collected / GOAL) * 100)}% of a ${money(GOAL)} day`} tone="#E9DCC7">
          <span className="h-[6px] rounded-[99px] bg-[#FFFCF199] overflow-hidden">
            <span className="block h-full rounded-[99px] bg-ink" style={{ width: `${(collected / GOAL) * 100}%` }} />
          </span>
        </Stat>
        <Stat label="Still owed" value={money(owed.reduce((s, p) => s + p.amount, 0))} note={`${owed.length} patients`} tone="#FBE4D8" />
        <Stat label="Paid at booking" value="$860" note="Through patients’ agents" tone="#E3E9D9" />
        <Stat label="Claims in flight" value="23" note="Waystar offline since 9:12" tone="#F3EEE2" />
      </div>

      <div className="relative flex grow min-h-[0px] gap-[12px]">
        <div className="grow min-w-[0px] flex flex-col p-[8px] rounded-[28px] bg-[#FAF6EC] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PAYMENTS.map((p) => {
            const status = statuses[p.id]!;
            const s = STATUS[status];
            return (
              <div key={p.id} className="flex items-center gap-[16px] h-[60px] shrink-0 px-[16px] rounded-[20px] hover:bg-sand transition-colors duration-150">
                <span className={`w-[44px] shrink-0 text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{p.time}</span>
                <span className="flex flex-col grow min-w-[0px]">
                  <span className={`truncate text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>{p.who}</span>
                  <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>{p.agent ? `${p.what} · paid by agent` : p.what}</span>
                </span>
                <span className={`w-[64px] shrink-0 text-right text-[18px] leading-[22px] ${DISPLAY} text-ink`}>{money(p.amount)}</span>
                <span
                  className={`w-[118px] shrink-0 flex items-center justify-center h-[26px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}
                  style={{ backgroundColor: s.tone, transition: `background-color 300ms ${EASE}` }}
                >
                  {s.label}
                </span>
                <span className="w-[104px] shrink-0 flex justify-end">
                  {(status === "due" || status === "denied") && (
                    <button
                      type="button"
                      onClick={() => set(p.id, status === "due" ? "sent" : "claim")}
                      className={`doe-menu-in h-[30px] px-[12px] rounded-[999px] border border-solid border-[#28191033] hover:bg-[#F4EEDF] transition-colors duration-150 text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`}
                    >
                      {status === "due" ? "Send link" : "Resubmit"}
                    </button>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-[400px] shrink-0 flex flex-col gap-[16px] p-[20px] rounded-[28px] bg-[#FAF6EC]">
          <span className="flex items-baseline justify-between">
            <span className={`text-[22px] leading-[26px] tracking-[-0.01em] ${DISPLAY} text-walnut`}>This week</span>
            <span className={`flex items-center gap-[6px] text-[12px] leading-[16px] ${SANS} font-[500] text-sub`}>
              <span className="w-[8px] h-[8px] rounded-[99px] bg-[#E6DCC8]" />
              Last week
            </span>
          </span>
          <div className="relative flex grow min-h-[0px] items-end gap-[14px] mt-[12px]">
            <span className="absolute left-0 right-0 border-t border-dashed border-[#28191026]" style={{ bottom: `${(GOAL / max) * 100}%` }} />
            {WEEK.map((d, i) => (
              <div key={d.day} className="relative flex-1 h-full flex items-end">
                <span className="absolute bottom-0 w-full rounded-[16px] bg-[#EFE8D9]" style={{ height: `${(LAST_WEEK[i]! / max) * 100}%` }} />
                {d.value > 0 && <span className="relative w-full rounded-[16px] bg-[#E8A585]" style={{ height: `${(d.value / max) * 100}%` }} />}
              </div>
            ))}
          </div>
          <div className="flex gap-[14px]">
            {WEEK.map((d) => (
              <span key={d.day} className={`flex-1 text-center text-[12px] leading-[16px] ${SANS} font-[500] ${d.today ? "text-walnut" : "text-sub"}`}>
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
