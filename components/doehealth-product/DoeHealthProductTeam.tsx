"use client";

/**
 * Team tab — everyone who works at the practice, providers and staff alike, and how they work together. The list on
 * the left holds the team (with Team settings pinned at the top); the panel on the right edits the selected person
 * (role, locations, which tabs they use, what they can do, who covers for them) or, for Team settings, the rules the
 * whole team shares: who works the Needs you queue, approvals, coverage, office hours and sign-in.
 */
import { type ReactNode, useState } from "react";

import { LOCATIONS, useLocations } from "@/components/doehealth-product/DoeHealthProductLocations";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";

type Role = "clinician" | "clinical" | "desk" | "billing" | "admin";
type Status = "active" | "away" | "invited";

const ROLES: { id: Role; label: string; tone: string }[] = [
  { id: "clinician", label: "Clinician", tone: "#E3E9D9" },
  { id: "clinical", label: "Clinical staff", tone: "#EEE6D6" },
  { id: "desk", label: "Front desk", tone: "#F8DCCB" },
  { id: "billing", label: "Billing", tone: "#F3E7C9" },
  { id: "admin", label: "Admin", tone: "#ECE6DA" },
];

const STATUS: Record<Status, { label: string; background: string; color: string }> = {
  active: { label: "Active", background: "#D6DEC6", color: "#2F3B2A" },
  away: { label: "Away", background: "#F3E2B4", color: "#281910" },
  invited: { label: "Invited", background: "#28191014", color: "#281910" },
};

const TABS = ["Schedule", "Voice", "Transit", "Payments", "Offers", "Insights", "Automations", "Integrations"];

type Member = {
  id: string;
  name: string;
  title: string;
  role: Role;
  status: Status;
  note?: string;
  /** Location ids, from the shared Locations store. */
  locations: string[];
  tabs: string[];
  charts: boolean;
  approve: boolean;
  sign: boolean;
  covers: string | null;
  notify: "all" | "mine" | "none";
  stats: [string, string][];
};

/** Sensible starting access for each role; each person can still be changed. */
const ROLE_TABS: Record<Role, string[]> = {
  clinician: ["Schedule", "Transit", "Insights"],
  clinical: ["Schedule", "Transit"],
  desk: ["Schedule", "Voice", "Transit", "Payments"],
  billing: ["Payments", "Transit", "Insights"],
  admin: TABS,
};

function member(
  id: string,
  name: string,
  title: string,
  role: Role,
  status: Status,
  extra: Partial<Member> & { stats: [string, string][] },
): Member {
  return {
    id,
    name,
    title,
    role,
    status,
    locations: ["brookline"],
    tabs: ROLE_TABS[role],
    charts: role === "clinician" || role === "clinical",
    approve: role === "desk" || role === "admin",
    sign: role === "clinician",
    covers: null,
    notify: "mine",
    ...extra,
  };
}

const START: Member[] = [
  member("brooks", "Dr. Sarah Brooks", "General neurology, MD", "clinician", "active", { locations: ["brookline", "newton", "telehealth"], notify: "all", stats: [["Visits this week", "41"], ["Notes to sign", "3"], ["Last active", "Now"]] }),
  member("alvarez", "Dr. Elena Alvarez", "Sleep medicine, MD", "clinician", "active", { locations: ["cambridge"], covers: "patel", stats: [["Visits this week", "38"], ["Notes to sign", "1"], ["Last active", "12m"]] }),
  member("patel", "Dr. Raj Patel", "Epilepsy, MD", "clinician", "away", { locations: ["brookline", "cambridge"], note: "Back Oct 28", covers: "alvarez", stats: [["Visits this week", "0"], ["Notes to sign", "0"], ["Last active", "Fri"]] }),
  member("chen", "Dr. Lin Chen", "Headache medicine, MD", "clinician", "active", { locations: ["newton", "telehealth"], stats: [["Visits this week", "22"], ["Notes to sign", "2"], ["Last active", "1h"]] }),
  member("singh", "Nora Singh", "Nurse practitioner", "clinician", "active", { locations: ["brookline", "telehealth"], stats: [["Visits this week", "29"], ["Notes to sign", "0"], ["Last active", "4m"]] }),
  member("ortiz", "Sam Ortiz", "EEG technologist", "clinical", "active", { locations: ["cambridge"], stats: [["EEGs run", "18"], ["Reports queued", "4"], ["Last active", "Now"]] }),
  member("nair", "Priya Nair", "Medical assistant", "clinical", "invited", { locations: ["newton"], stats: [["Invite sent", "Oct 22"], ["Expires", "Oct 29"], ["Last active", "—"]] }),
  member("moreno", "Jess Moreno", "Front desk lead", "desk", "active", { locations: ["brookline", "newton"], notify: "all", stats: [["Requests handled", "86"], ["Needs you open", "3"], ["Last active", "Now"]] }),
  member("reyes", "Tomás Reyes", "Front desk", "desk", "active", { stats: [["Requests handled", "54"], ["Needs you open", "1"], ["Last active", "20m"]] }),
  member("lin", "Abby Lin", "Front desk", "desk", "invited", { locations: ["newton"], stats: [["Invite sent", "Oct 24"], ["Expires", "Oct 31"], ["Last active", "—"]] }),
  member("mensah", "Kofi Mensah", "Billing", "billing", "active", { stats: [["Claims sent", "112"], ["Prior auths open", "4"], ["Last active", "35m"]] }),
  member("stone", "Rachel Stone", "Billing", "billing", "active", { locations: ["newton"], stats: [["Claims sent", "67"], ["Prior auths open", "0"], ["Last active", "2h"]] }),
  member("whitfield", "Dana Whitfield", "Practice manager", "admin", "active", { locations: LOCATIONS.map((l) => l.id), notify: "all", stats: [["Changes this week", "9"], ["Invites pending", "2"], ["Last active", "Now"]] }),
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "providers", label: "Providers" },
  { id: "staff", label: "Staff" },
] as const;

const initials = (name: string) =>
  name
    .replace("Dr. ", "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

const roleOf = (r: Role) => ROLES.find((x) => x.id === r)!;

function Pill({ status, note }: { status: Status; note?: string }) {
  const s = STATUS[status];
  return (
    <span className={`flex items-center h-[24px] px-[10px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] whitespace-nowrap`} style={{ backgroundColor: s.background, color: s.color }}>
      {note ?? s.label}
    </span>
  );
}

function Avatar({ m, size = 36 }: { m: Member; size?: number }) {
  return (
    <span
      className={`shrink-0 flex items-center justify-center rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[600] text-walnut`}
      style={{ width: size, height: size, backgroundColor: roleOf(m.role).tone, fontSize: size > 40 ? 18 : 13 }}
    >
      {initials(m.name)}
    </span>
  );
}

function Row({ label, children, top = false }: { label: string; children: ReactNode; top?: boolean }) {
  return (
    <div className={`flex shrink-0 ${top ? "items-start" : "items-center"} gap-[20px] min-h-[64px] px-[20px] py-[14px] rounded-[18px] bg-paper`}>
      <span className={`w-[230px] shrink-0 text-[14px] leading-[20px] ${SANS} font-[500] text-sub ${top ? "pt-[7px]" : ""}`}>{label}</span>
      <div className="flex grow min-w-[0px] items-center">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[34px] px-[14px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] transition-colors duration-150 ${on ? "bg-ink [color:#FFFCF1]" : "bg-[#F4EEDF] text-walnut hover:bg-[#EEE6D6]"}`}
    >
      {children}
    </button>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: readonly { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <span className="flex p-[3px] gap-[2px] rounded-[999px] bg-[#F4EEDF]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`h-[32px] px-[14px] rounded-[999px] text-[13px] leading-[16px] ${SANS} font-[500] whitespace-nowrap transition-colors duration-150 ${value === o.id ? "bg-paper text-ink" : "text-sub hover:text-walnut"}`}
        >
          {o.label}
        </button>
      ))}
    </span>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative w-[42px] h-[24px] shrink-0 rounded-[999px] transition-colors duration-200 ${on ? "bg-ink" : "bg-[#28191026]"}`}>
      <span className="absolute top-[3px] w-[18px] h-[18px] rounded-[999px] bg-paper transition-[left] duration-200" style={{ left: on ? 21 : 3 }} />
    </button>
  );
}

function Input({ value, onChange, width }: { value: string; onChange: (v: string) => void; width?: number }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width }}
      className={`h-[38px] px-[14px] rounded-[12px] bg-[#F4EEDF] border-[1.5px] border-solid border-transparent focus:border-ink outline-none text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}
    />
  );
}

function Tiles({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-3 gap-[8px] shrink-0">
      {items.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-[4px] px-[18px] py-[14px] rounded-[18px] bg-[#F4EEDF]">
          <span className={`text-[13px] leading-[16px] ${SANS} font-[500] text-sub`}>{label}</span>
          <span className={`text-[28px] leading-[32px] tracking-[-0.02em] ${DISPLAY} text-walnut [font-variant-numeric:tabular-nums]`}>{value}</span>
        </div>
      ))}
    </div>
  );
}

const btnGrey = `h-[38px] px-[16px] rounded-[999px] bg-[#28191014] hover:bg-[#2819101F] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`;

function MemberPanel({ m, team, onEdit, onAddLocation }: { m: Member; team: Member[]; onEdit: (patch: Partial<Member>) => void; onAddLocation?: () => void }) {
  const { locations } = useLocations();
  const toggle = (list: string[], item: string) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  const colleagues = team.filter((x) => x.id !== m.id && x.role === m.role);

  return (
    <>
      <div className="flex items-center justify-between gap-[16px]">
        <span className="flex items-center gap-[14px] min-w-[0px]">
          <Avatar m={m} size={52} />
          <span className="flex flex-col min-w-[0px]">
            <span className={`truncate text-[32px] leading-[38px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>{m.name}</span>
            <span className={`text-[14px] leading-[18px] ${SANS} text-sub`}>{m.title}</span>
          </span>
          <Pill status={m.status} note={m.note} />
        </span>
        <span className="flex items-center gap-[8px] shrink-0">
          {m.status === "invited" ? (
            <button type="button" className={btnGrey}>
              Resend invite
            </button>
          ) : (
            <button type="button" className={btnGrey}>
              Message
            </button>
          )}
          <button type="button" className={btnGrey}>
            Remove
          </button>
        </span>
      </div>

      <Tiles items={m.stats} />

      <div className="flex flex-col grow min-h-[0px] gap-[6px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Row label="Role">
          <Segmented value={m.role} options={ROLES} onChange={(r) => onEdit({ role: r, tabs: ROLE_TABS[r], sign: r === "clinician" })} />
        </Row>
        <Row label="Locations">
          <span className="flex flex-wrap gap-[6px]">
            {locations.map((l) => (
              <Chip key={l.id} on={m.locations.includes(l.id)} onClick={() => onEdit({ locations: toggle(m.locations, l.id) })}>
                {l.short || l.name}
              </Chip>
            ))}
            {onAddLocation && (
              <button
                type="button"
                onClick={onAddLocation}
                className={`h-[34px] px-[14px] rounded-[999px] border-[1.5px] border-dashed border-[#28191033] hover:bg-[#F4EEDF] transition-colors duration-150 text-[13px] leading-[16px] ${SANS} font-[500] text-walnut`}
              >
                Add location
              </button>
            )}
          </span>
        </Row>
        <Row label="Tabs they use" top>
          <span className="flex flex-wrap gap-[6px]">
            {TABS.map((t) => (
              <Chip key={t} on={m.tabs.includes(t)} onClick={() => onEdit({ tabs: toggle(m.tabs, t) })}>
                {t}
              </Chip>
            ))}
          </span>
        </Row>
        <Row label="Opens patient charts">
          <Toggle on={m.charts} onChange={(v) => onEdit({ charts: v })} label="Opens patient charts" />
        </Row>
        <Row label="Approves agent requests">
          <Toggle on={m.approve} onChange={(v) => onEdit({ approve: v })} label="Approves agent requests" />
        </Row>
        <Row label="Signs notes and forms">
          <Toggle on={m.sign} onChange={(v) => onEdit({ sign: v })} label="Signs notes and forms" />
        </Row>
        <Row label="Covered by" top>
          <span className="flex flex-wrap gap-[6px]">
            <Chip on={m.covers === null} onClick={() => onEdit({ covers: null })}>
              No one
            </Chip>
            {colleagues.map((c) => (
              <Chip key={c.id} on={m.covers === c.id} onClick={() => onEdit({ covers: c.id })}>
                {c.name}
              </Chip>
            ))}
          </span>
        </Row>
        <Row label="Notifications">
          <Segmented
            value={m.notify}
            onChange={(v) => onEdit({ notify: v })}
            options={[
              { id: "all", label: "Everything" },
              { id: "mine", label: "Assigned to them" },
              { id: "none", label: "Off" },
            ]}
          />
        </Row>
      </div>
    </>
  );
}

type Settings = {
  queue: "everyone" | "role" | "assigned";
  approvers: Role[];
  coverage: boolean;
  twoSign: boolean;
  handoff: boolean;
  opens: string;
  closes: string;
  defaultRole: Role;
  signIn: "google" | "microsoft" | "email";
  twoFactor: boolean;
};

function TeamPanel({ team, settings, onChange }: { team: Member[]; settings: Settings; onChange: (patch: Partial<Settings>) => void }) {
  const providers = team.filter((m) => m.role === "clinician").length;
  const invited = team.filter((m) => m.status === "invited").length;
  return (
    <>
      <div className="flex items-center justify-between gap-[16px]">
        <span className={`text-[32px] leading-[38px] tracking-[-0.02em] ${DISPLAY} text-walnut`}>Team settings</span>
      </div>

      <Tiles
        items={[
          ["Providers", String(providers)],
          ["Staff", String(team.length - providers)],
          ["Invites pending", String(invited)],
        ]}
      />

      <div className="flex flex-col grow min-h-[0px] gap-[6px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Row label="Needs you queue">
          <Segmented
            value={settings.queue}
            onChange={(v) => onChange({ queue: v })}
            options={[
              { id: "everyone", label: "Shared by everyone" },
              { id: "role", label: "Split by role" },
              { id: "assigned", label: "Assigned only" },
            ]}
          />
        </Row>
        <Row label="Who approves new patients" top>
          <span className="flex flex-wrap gap-[6px]">
            {ROLES.map((r) => (
              <Chip
                key={r.id}
                on={settings.approvers.includes(r.id)}
                onClick={() => onChange({ approvers: settings.approvers.includes(r.id) ? settings.approvers.filter((x) => x !== r.id) : [...settings.approvers, r.id] })}
              >
                {r.label}
              </Chip>
            ))}
          </span>
        </Row>
        <Row label="Route work to coverage when away">
          <Toggle on={settings.coverage} onChange={(v) => onChange({ coverage: v })} label="Route work to coverage" />
        </Row>
        <Row label="Hand off unfinished tasks at close">
          <Toggle on={settings.handoff} onChange={(v) => onChange({ handoff: v })} label="Hand off unfinished tasks" />
        </Row>
        <Row label="Two sign-offs on payer letters">
          <Toggle on={settings.twoSign} onChange={(v) => onChange({ twoSign: v })} label="Two sign-offs on payer letters" />
        </Row>
        <Row label="Office hours">
          <span className="flex items-center gap-[8px]">
            <Input value={settings.opens} onChange={(v) => onChange({ opens: v })} width={110} />
            <span className={`text-[14px] ${SANS} text-sub`}>to</span>
            <Input value={settings.closes} onChange={(v) => onChange({ closes: v })} width={110} />
          </span>
        </Row>
        <Row label="New invites start as">
          <Segmented value={settings.defaultRole} options={ROLES} onChange={(v) => onChange({ defaultRole: v })} />
        </Row>
        <Row label="Sign in with">
          <Segmented
            value={settings.signIn}
            onChange={(v) => onChange({ signIn: v })}
            options={[
              { id: "google", label: "Google" },
              { id: "microsoft", label: "Microsoft" },
              { id: "email", label: "Email link" },
            ]}
          />
        </Row>
        <Row label="Require two-factor">
          <Toggle on={settings.twoFactor} onChange={(v) => onChange({ twoFactor: v })} label="Require two-factor" />
        </Row>
      </div>
    </>
  );
}

export function DoeHealthProductTeamPage({ onAddLocation }: { onAddLocation?: () => void } = {}) {
  const { locations } = useLocations();
  const [team, setTeam] = useState(START);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selected, setSelected] = useState<string>("team");
  const [settings, setSettings] = useState<Settings>({
    queue: "role",
    approvers: ["desk", "admin"],
    coverage: true,
    twoSign: false,
    handoff: true,
    opens: "8:00 AM",
    closes: "5:30 PM",
    defaultRole: "desk",
    signIn: "google",
    twoFactor: true,
  });

  const shown = team.filter((m) => filter === "all" || (filter === "providers" ? m.role === "clinician" : m.role !== "clinician"));
  const current = team.find((m) => m.id === selected);
  const edit = (patch: Partial<Member>) => setTeam((prev) => prev.map((m) => (m.id === selected ? { ...m, ...patch } : m)));

  return (
    <div className="relative [font-synthesis:none] h-full w-full flex flex-col gap-[20px] pt-[36px] px-[40px] pb-[28px] rounded-[24px] overflow-clip bg-paper antialiased">
      <div className="relative flex items-end justify-between">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Team</span>
        <button type="button" className={`flex items-center h-[40px] px-[18px] rounded-[999px] bg-ink hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500] [color:#FFFCF1]`}>
          Invite
        </button>
      </div>

      <div className="grid grid-cols-[400px_1fr] gap-[16px] grow min-h-[0px]">
        <div className="flex flex-col min-h-[0px] gap-[12px]">
          <button
            type="button"
            onClick={() => setSelected("team")}
            className={`flex items-center gap-[12px] h-[60px] shrink-0 px-[14px] rounded-[18px] bg-[#F4EEDF] text-left outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${selected === "team" ? "outline-ink" : "outline-transparent hover:outline-[#28191026]"}`}
          >
            <span className="w-[36px] h-[36px] shrink-0 flex items-center justify-center rounded-[999px] bg-ink">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
                <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" fill="none" stroke="#FFFCF1" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="flex flex-col grow min-w-[0px]">
              <span className={`text-[15px] leading-[20px] ${SANS} font-[600] text-walnut`}>Team settings</span>
              <span className={`text-[12px] leading-[16px] ${SANS} text-sub`}>{team.length} people · {locations.length} locations</span>
            </span>
          </button>

          <span className="flex self-start">
            <Segmented value={filter} onChange={setFilter} options={FILTERS} />
          </span>

          <div className="flex flex-col grow min-h-[0px] gap-[4px] p-[8px] rounded-[18px] bg-[#F4EEDF] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shown.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m.id)}
                className={`flex items-center gap-[12px] h-[60px] shrink-0 px-[12px] rounded-[12px] bg-paper text-left outline outline-[1.5px] -outline-offset-[1.5px] transition-[outline-color] duration-150 ${selected === m.id ? "outline-ink" : "outline-transparent hover:outline-[#28191026]"} ${m.status === "invited" ? "opacity-70" : ""}`}
              >
                <Avatar m={m} />
                <span className="flex flex-col grow min-w-[0px]">
                  <span className={`truncate text-[15px] leading-[20px] ${SANS} font-[500] text-ink`}>{m.name}</span>
                  <span className={`truncate text-[12px] leading-[16px] ${SANS} text-sub`}>
                    {roleOf(m.role).label} · {m.title}
                  </span>
                </span>
                {m.status !== "active" && <Pill status={m.status} note={m.note} />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col min-w-[0px] min-h-[0px] gap-[16px] p-[24px] rounded-[28px] bg-[#FAF6EC]">
          {current ? (
            <MemberPanel key={current.id} m={current} team={team} onEdit={edit} onAddLocation={onAddLocation} />
          ) : (
            <TeamPanel team={team} settings={settings} onChange={(patch) => setSettings((s) => ({ ...s, ...patch }))} />
          )}
        </div>
      </div>
    </div>
  );
}
