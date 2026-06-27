"use client";

import type { CSSProperties, ReactNode } from "react";
import { suisseIntl } from "@/lib/home/fonts";
import {
  joinHeroBoxRevealClass,
  joinHeroBoxRevealDelay,
} from "@/lib/join/use-join-hero-scroll-reveal";
import type { WorkflowCarouselSurface } from "@/lib/workflow-carousel-design-backdrops";

const FS = "clamp(0.72rem, 0.92vw, 0.86rem)";
const FS_SM = "clamp(0.6rem, 0.72vw, 0.7rem)";
const FS_LG = "clamp(0.96rem, 1.15vw, 1.1rem)";
const FS_XL = "clamp(1.32rem, 1.65vw, 1.55rem)";

/** Glass fill opacity — peaks at Appointment Agent, fades with grid distance. */
const GLASS_OPACITY_ORANGE = {
  center: 0.48,
  near: 0.28,
  mid: 0.18,
  far: 0.1,
  edge: 0.08,
} as const;

const GLASS_OPACITY_BEIGE = {
  center: 0.94,
  near: 0.76,
  mid: 0.58,
  far: 0.42,
  edge: 0.32,
} as const;

type GlassTier = keyof typeof GLASS_OPACITY_ORANGE;

function glassFillOpacity(tier: GlassTier, surface: WorkflowCarouselSurface): number {
  return surface === "beige" ? GLASS_OPACITY_BEIGE[tier] : GLASS_OPACITY_ORANGE[tier];
}

const DOE_ORANGE = "#D2774C";
const DOE_ORANGE_TRACK = "rgba(210, 119, 76, 0.16)";
const DOE_ORANGE_SOLID = "#D2774C";
const ON_ORANGE_INK = "#FFFFFF";
const ON_ORANGE_MUTED = "rgba(255, 255, 255, 0.82)";

function cardTheme(surface: WorkflowCarouselSurface) {
  if (surface === "beige") {
    return {
      ink: "#1E343A",
      accent: DOE_ORANGE,
      glass: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
      track: DOE_ORANGE_TRACK,
      fill: DOE_ORANGE,
      icon: "rgba(30, 52, 58, 0.72)",
      iconSoft: "rgba(30, 52, 58, 0.45)",
    };
  }

  return {
    ink: "#FFFFFF",
    accent: "#FFFFFF",
    glass: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
    track: "rgba(255, 255, 255, 0.18)",
    fill: "rgba(255, 255, 255, 0.72)",
    icon: "rgba(255, 255, 255, 0.85)",
    iconSoft: "rgba(255, 255, 255, 0.55)",
  };
}

function GlassCard({
  children,
  opacity = 0.32,
  revealIndex,
  revealed,
  theme,
  compact = false,
  gradient = false,
  gradientOpacity = 1,
  style,
}: {
  children: ReactNode;
  opacity?: number;
  revealIndex: number;
  revealed: boolean;
  theme: ReturnType<typeof cardTheme>;
  compact?: boolean;
  gradient?: boolean;
  gradientOpacity?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className={joinHeroBoxRevealClass(revealed)}
      style={{
        borderRadius: "1.1rem",
        background: gradient ? `rgba(210, 119, 76, ${gradientOpacity})` : theme.glass(opacity),
        padding: compact ? "0.58rem 0.85rem" : "0.95rem 1.05rem",
        color: gradient ? ON_ORANGE_INK : theme.ink,
        animationDelay: joinHeroBoxRevealDelay(revealed, revealIndex),
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ProgressRow({
  label,
  pct,
  theme,
  last = false,
  labelSize = FS_SM,
}: {
  label: string;
  pct: string;
  theme: ReturnType<typeof cardTheme>;
  last?: boolean;
  labelSize?: string;
}) {
  const n = parseFloat(pct);
  return (
    <div style={{ marginBottom: last ? 0 : "0.55rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.28rem" }}>
        <span style={{ fontSize: labelSize, opacity: 0.88 }}>{label}</span>
        <span style={{ fontSize: labelSize, color: theme.accent, opacity: 0.9 }}>{pct}</span>
      </div>
      <div
        style={{
          height: "0.28rem",
          borderRadius: "999px",
          background: theme.track,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${n}%`,
            height: "100%",
            borderRadius: "999px",
            background: theme.fill,
          }}
        />
      </div>
    </div>
  );
}

function CardHeader({
  title,
  action,
  accent,
  labelSize = FS_SM,
}: {
  title: string;
  action?: string;
  accent?: string;
  labelSize?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem" }}>
      <span style={{ fontSize: labelSize, fontWeight: 500, opacity: 0.82 }}>{title}</span>
      {action ? (
        <span style={{ fontSize: labelSize, color: accent, opacity: accent ? 0.92 : 0.55 }}>{action}</span>
      ) : null}
    </div>
  );
}

function AgentIcon({ theme }: { theme: ReturnType<typeof cardTheme> }) {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke={theme.accent} strokeWidth="1.1" />
      <circle cx="7" cy="7" r="1.6" fill={theme.accent} />
      <path d="M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2" stroke={theme.iconSoft} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

const APPOINTMENT_AGENT_COPY = {
  title: "Appointment Agent",
  lead: "Sarah's appointment is at 10:30 AM today.",
  body: "Pre-appointment form sent, insurance verified, and info from chart extracted.",
} as const;

const APPOINTMENT_HEADLINE = "Sarah Chen, blood pressure follow-up";

function MiniLabSparkline({
  label,
  value,
  unit,
  path,
  theme,
  isBeige,
  labelSize,
  valueSize,
}: {
  label: string;
  value: string;
  unit: string;
  path: string;
  theme: ReturnType<typeof cardTheme>;
  isBeige: boolean;
  labelSize: string;
  valueSize: string;
}) {
  const stroke = isBeige ? DOE_ORANGE : theme.accent;

  return (
    <div>
      <p style={{ fontSize: labelSize, opacity: 0.55, marginBottom: "0.1rem" }}>{label}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.18rem", marginBottom: "0.22rem" }}>
        <span style={{ fontSize: valueSize, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</span>
        <span style={{ fontSize: labelSize, opacity: 0.62 }}>{unit}</span>
      </div>
      <svg viewBox="0 0 72 22" fill="none" aria-hidden style={{ display: "block", width: "100%", height: "1.35rem" }}>
        <line x1="0" y1="20" x2="72" y2="20" stroke={isBeige ? DOE_ORANGE_TRACK : "rgba(255,255,255,0.16)"} strokeWidth="0.8" />
        <path
          d={path}
          stroke={stroke}
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function LabResultsColumn({
  theme,
  isBeige,
  labelSize,
  valueSize,
}: {
  theme: ReturnType<typeof cardTheme>;
  isBeige: boolean;
  labelSize: string;
  valueSize: string;
}) {
  return (
    <div>
      <p style={{ fontSize: labelSize, opacity: 0.55, marginBottom: "0.28rem" }}>Lab results</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.48rem" }}>
        <MiniLabSparkline
          label="A1c"
          value="8.2"
          unit="%"
          path="M2 16 L18 12 L34 14 L52 7 L70 9"
          theme={theme}
          isBeige={isBeige}
          labelSize={labelSize}
          valueSize={valueSize}
        />
        <MiniLabSparkline
          label="Systolic BP"
          value="142"
          unit="mmHg"
          path="M2 8 L20 10 L36 13 L54 11 L70 15"
          theme={theme}
          isBeige={isBeige}
          labelSize={labelSize}
          valueSize={valueSize}
        />
      </div>
    </div>
  );
}

function AppointmentDetailsGrid({
  theme,
  isBeige,
  labelSize,
  valueSize,
  detailSize,
  headlineSize,
  showLiveCta = false,
}: {
  theme: ReturnType<typeof cardTheme>;
  isBeige: boolean;
  labelSize: string;
  valueSize: string;
  detailSize: string;
  headlineSize: string;
  showLiveCta?: boolean;
}) {
  return (
    <>
      <CardHeader
        title="Appointment details"
        action="Manage visit ›"
        accent={isBeige ? theme.accent : undefined}
        labelSize={labelSize}
      />
      <p style={{ fontSize: headlineSize, fontWeight: 500, marginBottom: "0.65rem", letterSpacing: "-0.012em", lineHeight: 1.15 }}>
        {APPOINTMENT_HEADLINE}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto minmax(0, 1fr)",
          columnGap: "0.28rem",
          rowGap: "0.75rem",
        }}
      >
        <div>
          <p style={{ fontSize: labelSize, opacity: 0.55, marginBottom: "0.14rem" }}>Scheduled</p>
          <p style={{ fontSize: valueSize, fontWeight: 500 }}>Fri, Jun 27</p>
          <p style={{ fontSize: detailSize, opacity: 0.65, marginTop: "0.1rem" }}>10:30 AM</p>
        </div>
        <div>
          <p style={{ fontSize: labelSize, opacity: 0.55, marginBottom: "0.14rem" }}>Provider</p>
          <p style={{ fontSize: valueSize, fontWeight: 500 }}>Dr. Patel</p>
          <p style={{ fontSize: detailSize, opacity: 0.65, marginTop: "0.1rem" }}>Exam Room 3</p>
        </div>
        <LabResultsColumn theme={theme} isBeige={isBeige} labelSize={labelSize} valueSize={detailSize} />
      </div>
      {showLiveCta ? (
        <p
          style={{
            marginTop: "0.72rem",
            fontSize: labelSize,
            fontWeight: 500,
            color: isBeige ? theme.accent : theme.ink,
            opacity: 0.92,
          }}
        >
          Begin Live Appointment ›
        </p>
      ) : null}
    </>
  );
}

function AppointmentAgentCard({
  theme,
  orangeTheme,
  revealIndex,
  revealed,
  gradientOpacity,
  titleSize,
  bodySize,
  padding,
  borderRadius,
  style,
}: {
  theme: ReturnType<typeof cardTheme>;
  orangeTheme: ReturnType<typeof cardTheme>;
  revealIndex: number;
  revealed: boolean;
  gradientOpacity: number;
  titleSize: string;
  bodySize: string;
  padding?: string;
  borderRadius?: string;
  style?: CSSProperties;
}) {
  return (
    <GlassCard
      theme={theme}
      revealIndex={revealIndex}
      revealed={revealed}
      gradient
      gradientOpacity={gradientOpacity}
      style={{
        ...(padding ? { padding } : null),
        ...(borderRadius ? { borderRadius } : null),
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.6rem" }}>
        <AgentIcon theme={orangeTheme} />
        <span style={{ fontSize: titleSize, fontWeight: 500, color: ON_ORANGE_MUTED }}>{APPOINTMENT_AGENT_COPY.title}</span>
      </div>
      <p style={{ fontSize: bodySize, lineHeight: 1.46, letterSpacing: "-0.015em", margin: 0 }}>
        <span style={{ color: ON_ORANGE_INK, fontWeight: 500 }}>{APPOINTMENT_AGENT_COPY.lead}</span>{" "}
        <span style={{ color: ON_ORANGE_MUTED }}>{APPOINTMENT_AGENT_COPY.body}</span>
      </p>
    </GlassCard>
  );
}

const FS_HERO = {
  sm: "clamp(0.95rem, 1.28vw, 1.12rem)",
  base: "clamp(1.18rem, 1.62vw, 1.42rem)",
  lg: "clamp(1.42rem, 1.92vw, 1.68rem)",
  xl: "clamp(1.68rem, 2.25vw, 2rem)",
} as const;

const HERO_CARD_PAD = "1.25rem 1.35rem";
const HERO_CARD_PAD_COMPACT = "1rem 1.2rem";
const HERO_CARD_GAP = "0.82rem";

/** hero-left-column — peaks at agent + appointment; subtle fade downward. */
const HERO_STACK_AGENT_OPACITY = 0.86;

const HERO_STACK_GLASS_ORANGE = {
  peak: 0.4,
  fade1: 0.37,
  fade2: 0.34,
  fade3: 0.31,
  fade4: 0.28,
  fade5: 0.25,
} as const;

const HERO_STACK_GLASS_BEIGE = {
  peak: 0.86,
  fade1: 0.81,
  fade2: 0.76,
  fade3: 0.71,
  fade4: 0.66,
  fade5: 0.61,
} as const;

function heroStackGlassOpacity(tier: keyof typeof HERO_STACK_GLASS_ORANGE, surface: WorkflowCarouselSurface): number {
  return surface === "beige" ? HERO_STACK_GLASS_BEIGE[tier] : HERO_STACK_GLASS_ORANGE[tier];
}

/** Glass workflow card bento — shared by join hero and DoePhone comm + intelligence. */
export function JoinHeroWorkflowCardCluster({
  surface = "orange",
  revealed,
  className,
  style,
  variant = "full",
}: {
  surface?: WorkflowCarouselSurface;
  revealed: boolean;
  className?: string;
  style?: CSSProperties;
  variant?: "full" | "hero-left-column";
}) {
  const theme = cardTheme(surface);
  const orangeTheme = cardTheme("orange");
  const isBeige = surface === "beige";

  if (variant === "hero-left-column") {
    return (
      <div
        className={`${suisseIntl.className} ${className ?? ""}`}
        aria-hidden
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.95rem, 2.1vmin, 1.15rem)",
          width: "100%",
          minWidth: 0,
          ...style,
        }}
      >
        <AppointmentAgentCard
          theme={theme}
          orangeTheme={orangeTheme}
          revealIndex={0}
          revealed={revealed}
          gradientOpacity={HERO_STACK_AGENT_OPACITY}
          titleSize={FS_HERO.base}
          bodySize={FS_HERO.base}
          padding={HERO_CARD_PAD}
          borderRadius="1.25rem"
        />

        <GlassCard
          theme={theme}
          revealIndex={1}
          revealed={revealed}
          opacity={heroStackGlassOpacity("peak", surface)}
          style={{ padding: HERO_CARD_PAD, borderRadius: "1.25rem" }}
        >
          <AppointmentDetailsGrid
            theme={theme}
            isBeige={isBeige}
            labelSize={FS_HERO.sm}
            valueSize={FS_HERO.base}
            detailSize={FS_HERO.sm}
            headlineSize={FS_HERO.xl}
            showLiveCta
          />
        </GlassCard>

      </div>
    );
  }

  return (
    <div
      className={`${suisseIntl.className} ${className ?? ""}`}
      aria-hidden
      style={{
        display: "grid",
        gridTemplateColumns: "1.45fr 1fr",
        gap: "0.65rem",
        alignContent: "center",
        minWidth: 0,
        ...style,
      }}
    >
      <GlassCard theme={theme} revealIndex={0} revealed={revealed} opacity={glassFillOpacity("mid", surface)}>
        <p style={{ fontSize: FS_SM, opacity: 0.6, marginBottom: "0.16rem" }}>Today</p>
        <p style={{ fontSize: FS, fontWeight: 500 }}>Fri, Jun 27</p>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={1} revealed={revealed} opacity={glassFillOpacity("mid", surface)}>
        <p style={{ fontSize: FS_SM, opacity: 0.6, marginBottom: "0.16rem" }}>Checked in</p>
        <p style={{ fontSize: FS, fontWeight: 500 }}>3 patients</p>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={2} revealed={revealed} opacity={glassFillOpacity("near", surface)}>
        <AppointmentDetailsGrid
          theme={theme}
          isBeige={isBeige}
          labelSize={FS_SM}
          valueSize={FS}
          detailSize={FS_SM}
          headlineSize={FS_XL}
        />
      </GlassCard>

      <GlassCard theme={theme} revealIndex={3} revealed={revealed} opacity={glassFillOpacity("near", surface)}>
        <ProgressRow theme={theme} label="Intake forms sent" pct="41%" last />
      </GlassCard>

      <AppointmentAgentCard
        theme={theme}
        orangeTheme={orangeTheme}
        revealIndex={4}
        revealed={revealed}
        gradientOpacity={1}
        titleSize={FS}
        bodySize={FS_LG}
        style={{ gridColumn: "1 / -1" }}
      />

      <GlassCard theme={theme} revealIndex={5} revealed={revealed} opacity={glassFillOpacity("near", surface)}>
        <p style={{ fontSize: FS_SM, opacity: 0.6, marginBottom: "0.2rem" }}>Next in queue</p>
        <p
          style={{
            fontSize: FS_XL,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: isBeige ? theme.accent : theme.ink,
          }}
        >
          10:30 AM
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.32rem", marginTop: "0.42rem" }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
            <rect x="1" y="2" width="9" height="7" rx="1.2" stroke={theme.iconSoft} strokeWidth="1" />
            <path d="M1 4.5h9" stroke={theme.iconSoft} strokeWidth="1" />
          </svg>
          <span style={{ fontSize: FS_SM, opacity: 0.65 }}>Front desk triage</span>
        </div>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={6} revealed={revealed} compact opacity={glassFillOpacity("mid", surface)}>
        <span style={{ fontSize: FS_SM, opacity: 0.7 }}>Open chart ›</span>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={7} revealed={revealed} compact opacity={glassFillOpacity("mid", surface)}>
        <span style={{ fontSize: FS_SM, opacity: 0.65 }}>Reschedule ›</span>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={8} revealed={revealed} compact opacity={glassFillOpacity("edge", surface)}>
        <span style={{ fontSize: FS_SM, opacity: 0.7 }}>Send reminder ›</span>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={9} revealed={revealed} compact opacity={glassFillOpacity("edge", surface)}>
        <span style={{ fontSize: FS_SM, opacity: 0.65 }}>View calendar ›</span>
      </GlassCard>
    </div>
  );
}
