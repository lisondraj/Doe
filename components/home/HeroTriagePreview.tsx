import {
  HERO_TRIAGE_MOBILE_LIST_WIDTH,
  HERO_TRIAGE_MOBILE_MIN_HEIGHT,
  HERO_TRIAGE_MOBILE_SCALE,
  HERO_TRIAGE_PANEL_ANCHOR,
  HERO_TRIAGE_PANEL_LEFT,
  HERO_TRIAGE_PANEL_RIGHT,
  HERO_TRIAGE_PANEL_WIDTH,
  HERO_TRIAGE_JOIN_AVATAR_GRADIENT,
  HERO_TRIAGE_JOIN_AVATAR_FLAT,
  HERO_TRIAGE_JOIN_NAV_CHIP_ACTIVE,
  HERO_TRIAGE_TILT,
} from "@/lib/home/hero-triage-preview-styles";
import { getHeroTriageThemeConfig, JOIN_MOBILE_HERO_TRIAGE_PANEL, type HeroTriageTheme, type HeroTriageThemeConfig } from "@/lib/home/hero-triage-theme";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";
import type { CSSProperties, ReactNode } from "react";

type InboxRow = {
  id: string;
  sender: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
  iconBg: string;
  iconColor: string;
  selected?: boolean;
};

const INBOX_ROWS: InboxRow[] = [
  {
    id: "pharmacy",
    sender: "Pharmacy",
    initials: "Rx",
    subject: "Refill request",
    preview: "Metformin 500mg for J. Martinez",
    time: "8:12",
    iconBg: "rgba(210,119,76,0.18)",
    iconColor: "rgba(255,236,205,0.88)",
  },
  {
    id: "labcorp",
    sender: "LabCorp",
    initials: "LC",
    subject: "Critical result",
    preview: "K+ 6.2 mEq/L, patient A. Chen",
    time: "7:48",
    iconBg: "rgba(191,89,61,0.18)",
    iconColor: "rgba(255,210,195,0.88)",
  },
  {
    id: "nurse",
    sender: "Nurse Patel",
    initials: "NP",
    subject: "Post-op update",
    preview: "Room 308 stable, discharge timeline requested",
    time: "Yesterday",
    iconBg: "rgba(231,169,68,0.17)",
    iconColor: "rgba(255,240,215,0.88)",
  },
  {
    id: "patient",
    sender: "M. Rodriguez",
    initials: "MR",
    subject: "Follow-up visit",
    preview: "Need to schedule a visit this week",
    time: "9:14",
    iconBg: "rgba(210,119,76,0.22)",
    iconColor: "rgba(255,248,235,0.90)",
    selected: true,
  },
  {
    id: "aetna",
    sender: "Aetna",
    initials: "AE",
    subject: "Pre-authorization",
    preview: "Approved for PT #8821",
    time: "Mon",
    iconBg: "rgba(196,122,90,0.17)",
    iconColor: "rgba(255,230,210,0.88)",
  },
  {
    id: "specialist",
    sender: "Dr. Okafor",
    initials: "DO",
    subject: "Referral accepted",
    preview: "Cardiology consult Tue 2 PM",
    time: "Mon",
    iconBg: "rgba(184,106,40,0.17)",
    iconColor: "rgba(255,225,195,0.88)",
  },
  {
    id: "quest",
    sender: "Quest Diagnostics",
    initials: "QD",
    subject: "Panel results",
    preview: "Lipid + HbA1c ready for T. Brooks",
    time: "Sun",
    iconBg: "rgba(212,157,79,0.17)",
    iconColor: "rgba(255,236,210,0.88)",
  },
  {
    id: "patient2",
    sender: "D. Kim",
    initials: "DK",
    subject: "Medication side effects",
    preview: "Dizziness since Monday morning",
    time: "Sun",
    iconBg: "rgba(168,106,64,0.17)",
    iconColor: "rgba(255,228,200,0.88)",
  },
  {
    id: "bcbs",
    sender: "BlueCross",
    initials: "BC",
    subject: "Claim processed",
    preview: "EOB attached for claim #44821",
    time: "Sat",
    iconBg: "rgba(139,111,71,0.17)",
    iconColor: "rgba(255,225,200,0.88)",
  },
  {
    id: "frontdesk",
    sender: "Front Desk",
    initials: "FD",
    subject: "Patient arrival",
    preview: "Room 4 ready for vitals",
    time: "Sat",
    iconBg: "rgba(180,130,70,0.16)",
    iconColor: "rgba(255,236,210,0.88)",
  },
  {
    id: "imaging",
    sender: "Metro Imaging",
    initials: "MI",
    subject: "MRI report",
    preview: "Lumbar spine for R. Walsh",
    time: "Fri",
    iconBg: "rgba(200,140,80,0.16)",
    iconColor: "rgba(255,240,220,0.88)",
  },
  {
    id: "priorauth",
    sender: "Humana",
    initials: "HU",
    subject: "Prior auth approved",
    preview: "12 PT sessions authorized",
    time: "Fri",
    iconBg: "rgba(210,119,76,0.16)",
    iconColor: "rgba(255,236,205,0.88)",
  },
];

const SELECTED = INBOX_ROWS.find((r) => r.selected)!;

type JoinDesktopNavItem = {
  id: string;
  d: string;
  active?: boolean;
};

const JOIN_DESKTOP_NAV_MAIN: readonly JoinDesktopNavItem[] = [
  { id: "inbox", d: "M4 6h16v12H4V6zm0 0 8 7 8-7", active: true },
  {
    id: "patients",
    d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  { id: "calendar", d: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z" },
  { id: "tasks", d: "M9 11l3 3 8.5-8.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
] as const;

const JOIN_DESKTOP_NAV_MID: readonly JoinDesktopNavItem[] = [
  { id: "compose", d: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" },
  { id: "files", d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" },
  { id: "search", d: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" },
] as const;

const JOIN_DESKTOP_NAV_BOTTOM: readonly JoinDesktopNavItem[] = [
  { id: "analytics", d: "M3 3v18h18M7 16l4-4 4 4 5-6" },
  { id: "settings", d: "M12 6h.01M12 12h.01M12 18h.01" },
] as const;

const JOIN_DESKTOP_SELECTED_ORANGE = "#D2774C";

function JoinDesktopAvatar({
  initials,
  selected = false,
  row,
  size = "1.62rem",
  fontSize = "0.54rem",
}: {
  initials: string;
  selected?: boolean;
  row?: Pick<InboxRow, "iconBg" | "iconColor">;
  size?: string;
  fontSize?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${
        !selected && !row ? HERO_TRIAGE_JOIN_AVATAR_FLAT : ""
      }`}
      style={{
        width: size,
        height: size,
        fontSize,
        ...(selected
          ? {
              background: "rgba(255,255,255,0.22)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.26)",
            }
          : row
            ? {
                background: row.iconBg,
                color: row.iconColor,
                border: "1px solid #ECE8E1",
              }
            : {}),
      }}
    >
      {initials}
    </div>
  );
}

function JoinDesktopInboxRow({ row }: { row: InboxRow }) {
  const selected = Boolean(row.selected);
  return (
    <div
      className="flex items-start gap-2.5"
      style={{
        margin: selected ? "0.18rem 0.32rem" : "0 0.32rem",
        padding: selected ? "0.58rem 0.62rem" : "0.52rem 0.62rem",
        borderRadius: selected ? "0.42rem" : undefined,
        background: selected ? JOIN_DESKTOP_SELECTED_ORANGE : "transparent",
        borderBottom: selected ? "none" : "1px solid #F2F0EC",
      }}
    >
      <JoinDesktopAvatar initials={row.initials} selected={selected} row={row} size="1.62rem" fontSize="0.54rem" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className="truncate text-[0.6rem] font-medium tracking-tight"
            style={{ color: selected ? "#FFFFFF" : JOIN_FORM_BEIGE.ink }}
          >
            {row.sender}
          </span>
          <span
            className="shrink-0 text-[0.46rem] font-normal tabular-nums"
            style={{ color: selected ? "rgba(255,255,255,0.78)" : "#A8A29E" }}
          >
            {row.time}
          </span>
        </div>
        <p
          className="mt-0.5 truncate text-[0.54rem] font-medium"
          style={{ color: selected ? "rgba(255,255,255,0.94)" : "#1E343A" }}
        >
          {row.subject}
        </p>
        {!selected ? (
          <p className="mt-0.5 truncate text-[0.48rem] font-normal text-[#9A9590]">{row.preview}</p>
        ) : null}
      </div>
    </div>
  );
}

function JoinDesktopPreviewPane({ row }: { row: InboxRow }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-[1.05] flex-col border-r border-[#EEEAE3] bg-[#FAFAF8]">
      <div className="border-b border-[#F0F0F0] px-4 py-3.5">
        <h3 className="text-[0.82rem] font-semibold leading-snug tracking-tight text-[#1E343A]">{row.subject}</h3>
        <p className="mt-1 text-[0.5rem] text-neutral-500">
          {row.sender} · {row.time}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-4 py-3.5">
        <p className="text-[0.56rem] leading-[1.55] text-neutral-700">{row.preview}</p>
        <p className="mt-3 text-[0.54rem] leading-[1.55] text-neutral-500">
          Need to schedule a visit this week. Thursday or Friday works on my end.
        </p>
      </div>
    </div>
  );
}

function JoinDesktopThreadPane() {
  const threadMessages = EMAIL_THREAD.slice(1, 4);

  return (
    <div className="flex min-h-0 min-w-0 flex-[0.95] flex-col bg-white">
      <div className="border-b border-[#F0F0F0] px-3.5 py-3">
        <p className="text-[0.64rem] font-semibold tracking-tight text-[#1E343A]">Follow-up visit</p>
        <p className="mt-0.5 text-[0.48rem] text-neutral-500">Maria Rodriguez · 4 messages</p>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-3 py-2.5">
        {threadMessages.map((msg) => {
          const isDoctor = msg.from === "Dr. Singh";
          const initials = isDoctor ? "DS" : "MR";
          const avatarRow = isDoctor ? SELECTED : { iconBg: SELECTED.iconBg, iconColor: SELECTED.iconColor };

          return (
            <div key={msg.id} className="mb-3 border-b border-[#F2F0EC] pb-3 last:mb-0 last:border-0 last:pb-0">
              <div className="flex items-start gap-2">
                <JoinDesktopAvatar
                  initials={initials}
                  row={isDoctor ? undefined : avatarRow}
                  size="1.38rem"
                  fontSize="0.46rem"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                    <span className="text-[0.52rem] font-medium text-[#1E343A]">{msg.from}</span>
                    <span className="text-[0.44rem] text-neutral-400">to {msg.to}</span>
                  </div>
                  <p className="mt-0.5 text-[0.44rem] text-neutral-400">{msg.time}</p>
                  <div className="mt-1.5 space-y-0.5">
                    {msg.lines.map((line) => (
                      <p key={line} className="text-[0.5rem] leading-[1.48] text-neutral-600">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="mt-2 rounded-md border border-[#F0F0F0] bg-[#FAFAF8] px-3 py-2">
          <p className="text-[0.48rem] leading-[1.45] text-neutral-500">
            Thursday at 10 AM works. See you then.
          </p>
        </div>
      </div>
    </div>
  );
}

function JoinDesktopNavButton({
  active = false,
  children,
}: {
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="flex h-[1.85rem] w-[1.85rem] items-center justify-center rounded-[0.45rem]"
      style={{
        background: active ? JOIN_DESKTOP_SELECTED_ORANGE : "transparent",
      }}
    >
      {children}
    </div>
  );
}

function JoinDesktopNav({
  config,
}: {
  config: HeroTriageThemeConfig;
}) {
  const iconClass = (active?: boolean) =>
    active
      ? "h-[16px] w-[16px] shrink-0 text-white"
      : heroInboxIconClass({ mobile: false, active: false });

  const renderItems = (items: readonly JoinDesktopNavItem[]) =>
    items.map((item) => (
      <JoinDesktopNavButton key={item.id} active={item.active}>
        <HeroInboxIcon d={item.d} className={iconClass(item.active)} />
      </JoinDesktopNavButton>
    ));

  return (
    <nav
      className={`flex w-[3.35rem] shrink-0 flex-col items-center border-r border-[#EEEAE3] bg-[#F7F6F3] py-3 ${config.paneGlassTw}`}
      style={config.paneStyle({ background: "#F7F6F3" })}
    >
      <div className="mb-2 flex h-[1.85rem] w-[1.85rem] items-center justify-center rounded-[0.45rem] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <span className="text-[0.62rem] font-semibold tracking-tight text-[#D2774C]">D</span>
      </div>
      <div className="flex w-full flex-col items-center gap-0.5 px-1.5">{renderItems(JOIN_DESKTOP_NAV_MAIN)}</div>
      <div className="my-2 h-px w-[1.65rem] bg-[#E8E4DD]" />
      <div className="flex w-full flex-col items-center gap-0.5 px-1.5">{renderItems(JOIN_DESKTOP_NAV_MID)}</div>
      <div className="flex-1" />
      <div className="flex w-full flex-col items-center gap-0.5 px-1.5 pb-1">{renderItems(JOIN_DESKTOP_NAV_BOTTOM)}</div>
      <div className="mt-2.5 border-t border-[#E8E4DD] pt-2.5">
        <JoinDesktopAvatar initials="DS" size="1.85rem" fontSize="0.5rem" />
      </div>
    </nav>
  );
}

function JoinDesktopInboxPane({ rows }: { rows: readonly InboxRow[] }) {
  const selected = rows.find((row) => row.selected) ?? rows[0];
  const visibleRows = rows.slice(0, 8);

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <div className="flex w-[31%] shrink-0 flex-col bg-white">
        <div className="flex items-center justify-between border-b border-[#F0F0F0] px-3.5 py-2.5">
          <div className="flex items-center gap-1.5">
            <HeroInboxIcon
              d="M4 6h16v12H4V6zm0 0 8 7 8-7"
              className={heroInboxIconClass({ mobile: false, accent: true })}
            />
            <span className="text-[0.68rem] font-semibold tracking-tight text-[#1E343A]">Inbox</span>
          </div>
          <span className="rounded-full bg-[#F0EDE8] px-1.5 py-0.5 text-[0.44rem] font-medium tabular-nums text-[#78716C]">
            12
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden pt-0.5">
          {visibleRows.map((row) => (
            <JoinDesktopInboxRow key={row.id} row={row} />
          ))}
        </div>
      </div>
      <JoinDesktopPreviewPane row={selected} />
      <JoinDesktopThreadPane />
    </div>
  );
}

function heroInboxIconClass({
  mobile,
  joinCompact = false,
  accent = false,
  active = false,
}: {
  mobile: boolean;
  joinCompact?: boolean;
  accent?: boolean;
  active?: boolean;
}) {
  if (joinCompact || mobile) {
    if (accent) return "h-[1.5rem] w-[1.5rem] shrink-0 text-[#D2774C] iphone-page:h-[1.7rem] iphone-page:w-[1.7rem]";
    if (active) return "h-[1.5rem] w-[1.5rem] shrink-0 text-[#1E343A] iphone-page:h-[1.7rem] iphone-page:w-[1.7rem]";
    return "h-[1.5rem] w-[1.5rem] shrink-0 text-neutral-400 iphone-page:h-[1.7rem] iphone-page:w-[1.7rem]";
  }
  if (accent) return "h-[18px] w-[18px] shrink-0 text-[#D2774C]";
  if (active) return "h-[18px] w-[18px] shrink-0 text-[#1E343A]";
  return "h-[18px] w-[18px] shrink-0 text-neutral-500";
}

function HeroInboxIcon({
  d,
  className,
}: {
  d: string;
  className: string;
}) {
  return (
    <DoeBuildIcon className={className}>
      <path d={d} />
    </DoeBuildIcon>
  );
}

function NavIcon({
  children,
  active = false,
  mobile,
  config,
}: {
  children: ReactNode;
  active?: boolean;
  mobile: boolean;
  config: HeroTriageThemeConfig;
}) {
  const { colors } = config;
  const sz = mobile ? "3.1rem" : "2rem";
  if (config.flat) {
    return (
      <div
        className={`flex items-center justify-center rounded-[0.55rem] ${active ? HERO_TRIAGE_JOIN_NAV_CHIP_ACTIVE : ""}`}
        style={{
          width: sz,
          height: sz,
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center${active ? ` ${config.paneGlassTw}` : ""}`}
      style={{
        width: sz,
        height: sz,
        borderRadius: mobile ? "0.85rem" : "0.55rem",
        color: active ? colors.navActive : colors.navIcon,
        ...(active
          ? config.chipStyle({ background: config.chipGradient })
          : { background: "transparent" }),
      }}
    >
      {children}
    </div>
  );
}

function SenderMark({
  row,
  mobile,
  joinCompact = false,
  config,
}: {
  row: InboxRow;
  mobile: boolean;
  joinCompact?: boolean;
  config: HeroTriageThemeConfig;
}) {
  const { colors } = config;
  const sz = joinCompact ? "1.28rem" : mobile ? "2.35rem" : "1.45rem";
  const onSelectedRow = Boolean(row.selected);
  const useFlatSelectedMark = onSelectedRow && config.flat;
  const useFlatLightMark = !onSelectedRow && config.flat;
  const fontSize = joinCompact ? "0.48rem" : mobile ? "0.82rem" : "0.52rem";

  if (useFlatLightMark) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${HERO_TRIAGE_JOIN_AVATAR_GRADIENT}`}
        style={{
          width: sz,
          height: sz,
          fontSize,
        }}
      >
        {row.initials}
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-medium ${config.paneGlassTw}`}
      style={{
        width: sz,
        height: sz,
        borderRadius: "50%",
        background: useFlatSelectedMark ? "rgba(255,255,255,0.14)" : row.iconBg,
        color: useFlatSelectedMark ? "#FFFFFF" : row.iconColor,
        fontSize,
        border: `1px solid ${useFlatSelectedMark ? "rgba(255,255,255,0.12)" : colors.glassBorder}`,
        boxShadow: config.flat ? "none" : config.insetShadow,
      }}
    >
      {row.initials}
    </div>
  );
}

function InboxListRow({
  row,
  mobile,
  joinCompact = false,
  config,
}: {
  row: InboxRow;
  mobile: boolean;
  joinCompact?: boolean;
  config: HeroTriageThemeConfig;
}) {
  const { colors } = config;
  const nameFs = joinCompact ? "0.58rem" : mobile ? "0.96rem" : "0.62rem";
  const subFs = joinCompact ? "0.52rem" : mobile ? "0.88rem" : "0.56rem";
  const timeFs = joinCompact ? "0.46rem" : mobile ? "0.78rem" : "0.48rem";
  const pad = joinCompact ? "0.85rem 0.46rem" : mobile ? "0.62rem 0.9rem" : "0.42rem 0.52rem";
  const gap = joinCompact ? "0.38rem" : mobile ? "0.62rem" : "0.38rem";
  const rowMargin = joinCompact ? "0 0.24rem" : mobile ? "0 0.5rem" : "0 0.32rem";
  const rowRadius = joinCompact ? "0.42rem" : mobile ? "0.85rem" : "0.55rem";
  const rowRadiusDefault = joinCompact ? "0.38rem" : mobile ? "0.65rem" : "0.45rem";

  if (row.selected) {
    return (
      <div
        className={config.paneGlassTw}
        style={{
          margin: rowMargin,
          padding: pad,
          borderRadius: rowRadius,
          background: config.selectedGradient,
          border: `1px solid ${config.selectedBorder}`,
          boxShadow: "none",
          display: "flex",
          alignItems: "flex-start",
          gap,
        }}
      >
        <SenderMark row={row} mobile={mobile} joinCompact={joinCompact} config={config} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-[0.4em]">
            <span
              style={{
                fontSize: nameFs,
                fontWeight: 500,
                color: colors.selectedSender,
                letterSpacing: "-0.01em",
              }}
            >
              {row.sender}
            </span>
            <span style={{ fontSize: timeFs, fontWeight: 400, color: colors.selectedTime, flexShrink: 0 }}>
              {row.time}
            </span>
          </div>
          <p
            className="truncate"
            style={{ fontSize: subFs, fontWeight: 500, color: colors.selectedSubject, marginTop: "0.15em" }}
          >
            {row.subject}
          </p>
          <p
            className="mt-[0.12em] truncate"
            style={{ fontSize: subFs, fontWeight: 400, color: colors.selectedPreview }}
          >
            {row.preview}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start ${config.paneGlassTw}`}
      style={{
        gap,
        margin: rowMargin,
        padding: pad,
        borderRadius: rowRadiusDefault,
        ...config.chipStyle(),
      }}
    >
      <SenderMark row={row} mobile={mobile} joinCompact={joinCompact} config={config} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-[0.4em]">
          <span style={{ fontSize: nameFs, fontWeight: 500, color: colors.navActive, letterSpacing: "-0.01em" }}>
            {row.sender}
          </span>
          <span style={{ fontSize: timeFs, fontWeight: 400, color: colors.rowTime, flexShrink: 0 }}>
            {row.time}
          </span>
        </div>
        <p
          className="truncate"
          style={{ fontSize: subFs, fontWeight: 500, color: colors.pillText, marginTop: "0.15em" }}
        >
          {row.subject}
        </p>
        <p
          className="mt-[0.1em] truncate"
          style={{ fontSize: subFs, fontWeight: 400, color: colors.rowText }}
        >
          {row.preview}
        </p>
      </div>
    </div>
  );
}

type EmailThreadMessage = {
  id: string;
  from: string;
  to: string;
  time: string;
  lines: string[];
};

const EMAIL_THREAD: EmailThreadMessage[] = [
  {
    id: "e1",
    from: "Maria Rodriguez",
    to: "Dr. Singh",
    time: "Jun 21, 9:02 AM",
    lines: [
      "Hi Dr. Singh,",
      "I wanted to follow up on my chest tightness from last week. Symptoms have improved but I still notice mild tightness in the mornings.",
      "Would it be possible to schedule a visit this week?",
      "Thank you,",
      "Maria",
    ],
  },
  {
    id: "e2",
    from: "Dr. Singh",
    to: "Maria Rodriguez",
    time: "Jun 21, 2:18 PM",
    lines: [
      "Hi Maria,",
      "Thanks for the update. Glad to hear things are improving.",
      "Any shortness of breath with walking or stairs?",
    ],
  },
  {
    id: "e3",
    from: "Maria Rodriguez",
    to: "Dr. Singh",
    time: "Jun 22, 8:41 AM",
    lines: [
      "No shortness of breath, just the morning tightness.",
      "Thursday or Friday would work well on my end.",
    ],
  },
  {
    id: "e4",
    from: "Dr. Singh",
    to: "Maria Rodriguez",
    time: "Jun 22, 9:14 AM",
    lines: [
      "I have Thursday at 10 AM or Friday at 2 PM open.",
      "Let me know which you prefer and I will confirm.",
    ],
  },
];

function OpenEmailPane({ mobile, config }: { mobile: boolean; config: HeroTriageThemeConfig }) {
  const { colors } = config;
  const titleFs = mobile ? "1.22rem" : "0.82rem";
  const bodyFs = mobile ? "0.94rem" : "0.64rem";
  const metaFs = mobile ? "0.82rem" : "0.54rem";
  const labelFs = mobile ? "0.78rem" : "0.50rem";
  const pad = mobile ? "1.15rem 1.3rem" : "0.85rem 0.95rem";

  return (
    <div
      className="flex h-full min-w-0 flex-col border-l"
      style={{ borderColor: colors.divider, background: "transparent" }}
    >
      {/* Thread header */}
      <div
        className={config.paneGlassTw}
        style={{
          padding: pad,
          paddingBottom: mobile ? "0.85rem" : "0.55rem",
          borderBottom: `1px solid ${colors.divider}`,
          ...config.paneStyle(),
          borderRadius: 0,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
        }}
      >
        <p style={{ fontSize: titleFs, fontWeight: 500, color: colors.navActive, letterSpacing: "-0.02em" }}>
          Follow-up visit scheduling
        </p>
        <p style={{ fontSize: metaFs, fontWeight: 400, color: colors.detailMuted, marginTop: "0.28em" }}>
          Maria Rodriguez · Patient message
        </p>
      </div>

      {/* Email thread */}
      <div className="min-h-0 flex-1 overflow-hidden" style={{ padding: mobile ? "0.35rem 0" : "0.25rem 0" }}>
        {EMAIL_THREAD.map((msg) => (
          <div
            key={msg.id}
            className={config.paneGlassTw}
            style={{
              margin: mobile ? "0.45rem 0.85rem" : "0.3rem 0.6rem",
              padding: mobile ? "0.75rem 0.95rem" : "0.5rem 0.65rem",
              borderRadius: mobile ? "0.75rem" : "0.5rem",
              ...config.chipStyle(),
            }}
          >
            <div className="flex items-start gap-[0.5em]">
              <SenderMark
                row={{
                  ...SELECTED,
                  selected: false,
                  initials: msg.from === "Dr. Singh" ? "DS" : "MR",
                }}
                mobile={mobile}
                config={config}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-[0.35em] gap-y-[0.1em]">
                  <span style={{ fontSize: metaFs, fontWeight: 500, color: colors.navActive }}>
                    {msg.from}
                  </span>
                  <span style={{ fontSize: labelFs, fontWeight: 400, color: colors.detailMuted }}>
                    to {msg.to}
                  </span>
                </div>
                <p style={{ fontSize: labelFs, fontWeight: 400, color: colors.rowTime, marginTop: "0.12em" }}>
                  {msg.time}
                </p>
              </div>
            </div>
            <div style={{ marginTop: mobile ? "0.65rem" : "0.4rem", paddingLeft: mobile ? "2.95rem" : "1.85rem" }}>
              {msg.lines.map((line) => (
                <p
                  key={line}
                  style={{
                    fontSize: bodyFs,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: colors.detailBody,
                    marginBottom: line.startsWith("Hi") || line === "Maria" || line === "Thank you," ? "0.45em" : "0.2em",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reply compose */}
      <div
        className={config.paneGlassTw}
        style={{
          borderTop: `1px solid ${colors.divider}`,
          padding: mobile ? "0.85rem 1.3rem" : "0.55rem 0.95rem",
          flexShrink: 0,
          ...config.paneStyle({ borderRadius: 0, borderBottom: "none", borderLeft: "none", borderRight: "none" }),
        }}
      >
        <p style={{ fontSize: labelFs, fontWeight: 500, color: colors.detailMuted, marginBottom: "0.45em" }}>
          Reply to Maria Rodriguez
        </p>
        <div
          className={config.paneGlassTw}
          style={{
            borderRadius: mobile ? "0.65rem" : "0.45rem",
            padding: mobile ? "0.65rem 0.85rem" : "0.45rem 0.55rem",
            display: "flex",
            alignItems: "center",
            gap: "0.55em",
            ...config.chipStyle(),
          }}
        >
          <p style={{ flex: 1, fontSize: bodyFs, fontWeight: 400, color: colors.rowMuted, lineHeight: 1.4 }}>
            Thursday at 10 AM works. See you then.
          </p>
          <div
            className={config.paneGlassTw}
            style={{
              borderRadius: "0.45rem",
              padding: mobile ? "0.32rem 0.75rem" : "0.2rem 0.5rem",
              flexShrink: 0,
              background: config.selectedGradient,
              border: `1px solid ${config.selectedBorder}`,
              boxShadow: "none",
            }}
          >
            <span style={{ fontSize: labelFs, fontWeight: 500, color: colors.sendButtonText }}>Send</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileNavMark({ mobile }: { mobile: boolean }) {
  const sz = mobile ? "3.1rem" : "2rem";
  return (
    <div
      className={`flex items-center justify-center rounded-full ${HERO_TRIAGE_JOIN_AVATAR_GRADIENT}`}
      style={{
        width: sz,
        height: sz,
        fontSize: mobile ? "0.82rem" : "0.52rem",
      }}
    >
      DS
    </div>
  );
}

export type HeroTriagePreviewProps = {
  fontClassName: string;
  size?: "desktop" | "mobile";
  theme?: HeroTriageTheme;
  layout?: "full" | "simple";
  showNavIcons?: boolean;
  desktopScale?: number;
  mobileScale?: number;
  mobileAnchor?: "default" | "join";
  style?: CSSProperties;
  className?: string;
};

/**
 * Doctor inbox — three-column UI (collapsed nav · inbox list · open message),
 * styled after modern inbox references. Flat layout; hero overflow clips edges.
 */
export function HeroTriagePreview({
  fontClassName,
  size = "desktop",
  theme = "dark",
  layout = "full",
  showNavIcons = false,
  desktopScale = 1,
  mobileScale,
  mobileAnchor = "default",
  style,
  className = "",
}: HeroTriagePreviewProps) {
  const isMobile = size === "mobile";
  const isSimple = layout === "simple";
  const isJoinMobile = isMobile && mobileAnchor === "join";
  const isJoinDesktop = !isMobile && isSimple && showNavIcons;
  const showFullNav = !isSimple || showNavIcons;
  const config = getHeroTriageThemeConfig(theme);
  const { colors } = config;
  const navW = isJoinMobile ? "3.15rem" : isMobile ? "5.1rem" : isSimple ? "3.25rem" : "2.85rem";
  const listW = isMobile && !isSimple ? HERO_TRIAGE_MOBILE_LIST_WIDTH : isSimple ? undefined : "38%";
  const inboxRows = isJoinMobile ? INBOX_ROWS : isSimple ? INBOX_ROWS.slice(0, 5) : INBOX_ROWS;
  const listRowMobile = (isMobile || isSimple) && !isJoinMobile;
  const navIconMobile = isMobile && !isJoinMobile;
  const mobileScaleValue = mobileScale ?? HERO_TRIAGE_MOBILE_SCALE;
  const desktopTransform =
    !isMobile && desktopScale !== 1 ? `scale(${desktopScale})` : HERO_TRIAGE_TILT.desktop;
  const mobileOuterHeight = isJoinMobile
    ? JOIN_MOBILE_HERO_TRIAGE_PANEL.outerHeight
    : isMobile && isSimple
      ? "26rem"
      : isMobile
        ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.outer
        : undefined;
  const mobileInnerMinHeight = isJoinMobile
    ? JOIN_MOBILE_HERO_TRIAGE_PANEL.innerMinHeight
    : isMobile && isSimple
      ? "28rem"
      : isSimple
        ? "24rem"
        : isMobile
          ? HERO_TRIAGE_MOBILE_MIN_HEIGHT.inner
          : "18rem";

  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        ...(isMobile && mobileAnchor === "default" ? HERO_TRIAGE_PANEL_ANCHOR.mobile : {}),
        ...(isMobile && mobileAnchor === "default"
          ? { width: HERO_TRIAGE_PANEL_WIDTH.mobile }
          : !isMobile
            ? { top: "30%", right: HERO_TRIAGE_PANEL_RIGHT.desktop, width: HERO_TRIAGE_PANEL_WIDTH.desktop }
            : {}),
        ...(isMobile && HERO_TRIAGE_PANEL_LEFT.mobile != null && mobileAnchor === "default"
          ? { left: HERO_TRIAGE_PANEL_LEFT.mobile }
          : {}),
        ...style,
      }}
      aria-hidden
    >
      <div
        style={{
          transform: isMobile ? `scale(${mobileScaleValue})` : desktopTransform,
          transformOrigin: isJoinMobile ? "bottom left" : isMobile ? "bottom left" : "bottom right",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <div
          className={`${config.outerGlassTw} ${fontClassName} overflow-hidden`}
          style={{
            borderRadius: isJoinMobile ? "0 0 1rem 1rem" : theme === "light" ? "1rem" : isMobile ? "1.35rem" : "1.1rem",
            background: config.shellGradient,
            ...(isJoinMobile ? { width: JOIN_MOBILE_HERO_TRIAGE_PANEL.panelWidth } : {}),
            ...(theme === "light"
              ? {}
              : {
                  border: `1px solid ${colors.shellBorder}`,
                  boxShadow: "inset 0 1px 0 rgba(255,228,196,0.1)",
                }),
            height: mobileOuterHeight,
            minHeight: isMobile ? undefined : isSimple ? "22rem" : "16rem",
          }}
        >
          <div
            className={`flex h-full ${config.innerGlassTw}`}
            style={{
              minHeight: isMobile ? mobileInnerMinHeight : isJoinDesktop ? "26rem" : isSimple ? "24rem" : "18rem",
              background: config.innerGradient,
            }}
          >
            {isJoinDesktop ? (
              <>
                <JoinDesktopNav config={config} />
                <JoinDesktopInboxPane rows={INBOX_ROWS} />
              </>
            ) : (
              <>
            {/* Collapsed vertical nav — icons only */}
            <nav
              className={`flex shrink-0 flex-col items-center ${config.paneGlassTw}`}
              style={{
                width: navW,
                borderRight: isSimple && !showNavIcons ? "none" : `1px solid ${colors.divider}`,
                padding: isJoinMobile ? "0.58rem 0.3rem" : isMobile ? "1.1rem 0.55rem" : isSimple ? "0.85rem 0.4rem" : "0.65rem 0.32rem",
                gap: isJoinMobile ? "0.18rem" : isMobile ? "0.35rem" : "0.28rem",
                ...config.paneStyle(),
                borderRadius: 0,
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
              }}
            >
              <NavIcon active mobile={navIconMobile} config={config}>
                <HeroInboxIcon
                  d="M4 6h16v12H4V6zm0 0 8 7 8-7"
                  className={heroInboxIconClass({
                    mobile: navIconMobile,
                    joinCompact: isJoinMobile,
                    active: config.flat,
                  })}
                />
              </NavIcon>
              {showFullNav ? (
                <>
                  <NavIcon mobile={isMobile} config={config}>
                    <HeroInboxIcon
                      d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                  </NavIcon>
                  <NavIcon mobile={isMobile} config={config}>
                    <HeroInboxIcon
                      d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7l9 6 9-6M3 7h18"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                  </NavIcon>
                  <NavIcon mobile={isMobile} config={config}>
                    <HeroInboxIcon
                      d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                  </NavIcon>
                  <div className="flex-1" />
                  <ProfileNavMark mobile={isMobile} />
                </>
              ) : null}
            </nav>

            {/* Inbox preview column */}
            <div
              className={`flex h-full min-w-0 flex-col ${isSimple ? "flex-1" : "shrink-0"} ${config.paneGlassTw}`}
              style={{
                ...(listW ? { width: listW } : {}),
                borderRight: isSimple ? "none" : `1px solid ${colors.divider}`,
                ...config.paneStyle(),
                borderRadius: 0,
                borderTop: "none",
                borderBottom: "none",
              }}
            >
              {/* Toolbar */}
              <div
                className={`flex items-center gap-[0.45em] ${config.paneGlassTw}`}
                style={{
                  padding: isJoinMobile ? "0.52rem 0.75rem" : isMobile ? "0.85rem 0.95rem" : isSimple ? "0.85rem 1rem" : "0.52rem 0.58rem",
                  borderBottom: `1px solid ${colors.divider}`,
                  color: colors.navIcon,
                  ...config.paneStyle({ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }),
                }}
              >
                <div
                  className={`flex items-center gap-[0.35em] ${config.paneGlassTw}`}
                  style={{
                    borderRadius: "999px",
                    padding: isJoinMobile ? "0.28rem 0.55rem" : isMobile ? "0.38rem 0.75rem" : isSimple ? "0.35rem 0.65rem" : "0.24rem 0.48rem",
                    ...(isSimple ? { background: "transparent" } : config.chipStyle()),
                  }}
                >
                  <HeroInboxIcon
                    d="M4 6h16v12H4V6zm0 0 8 7 8-7"
                    className={heroInboxIconClass({
                      mobile: navIconMobile,
                      joinCompact: isJoinMobile,
                      accent: isSimple && config.flat,
                    })}
                  />
                  <span
                    style={{
                      fontSize: isJoinMobile ? "0.92rem" : isMobile ? "0.95rem" : isSimple ? "0.92rem" : "0.58rem",
                      fontWeight: 500,
                      color: isSimple ? JOIN_FORM_BEIGE.ink : colors.pillText,
                    }}
                  >
                    Inbox
                  </span>
                  {!isSimple ? (
                    <span
                      className={config.paneGlassTw}
                      style={{
                        fontSize: isMobile ? "0.78rem" : "0.48rem",
                        fontWeight: 500,
                        color: colors.badgeText,
                        borderRadius: "999px",
                        padding: "0.12em 0.45em",
                        minWidth: "1.4em",
                        textAlign: "center",
                        ...config.chipStyle({ background: config.chipGradient }),
                      }}
                    >
                      12
                    </span>
                  ) : null}
                </div>
                {!isSimple ? (
                  <>
                    <HeroInboxIcon
                      d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                    <HeroInboxIcon
                      d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                    <HeroInboxIcon
                      d="M12 6h.01M12 12h.01M12 18h.01"
                      className={heroInboxIconClass({ mobile: isMobile, joinCompact: isJoinMobile })}
                    />
                  </>
                ) : null}
              </div>

              {/* Message list */}
              <div
                className="min-h-0 flex-1 overflow-hidden"
                style={{ padding: isJoinMobile ? "0.35rem 0.22rem" : isMobile ? "0.45rem 0.35rem" : isSimple ? "0.55rem 0.45rem" : "0.28rem 0.2rem", gap: isJoinMobile ? "0.32rem" : isMobile ? "0.28rem" : "0.18rem" }}
              >
                {inboxRows.map((row) => (
                  <div key={row.id}>
                    <InboxListRow row={row} mobile={listRowMobile} joinCompact={isJoinMobile} config={config} />
                  </div>
                ))}
              </div>
            </div>

            {!isSimple ? (
              /* Open email — partial column, clipped by hero overflow */
              <div
                className={`min-w-0 flex-1 ${config.paneGlassTw}`}
                style={config.paneStyle({ borderRadius: 0, borderTop: "none", borderBottom: "none", borderRight: "none" })}
              >
                <OpenEmailPane mobile={isMobile} config={config} />
              </div>
            ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use HeroTriagePreview */
export const DesktopHeroTriagePreview = HeroTriagePreview;
