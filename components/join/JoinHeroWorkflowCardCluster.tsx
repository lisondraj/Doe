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

/** Glass fill opacity — peaks at Scheduling Agent, fades with grid distance. */
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
  style,
}: {
  children: ReactNode;
  opacity?: number;
  revealIndex: number;
  revealed: boolean;
  theme: ReturnType<typeof cardTheme>;
  compact?: boolean;
  gradient?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className={joinHeroBoxRevealClass(revealed)}
      style={{
        borderRadius: "1.1rem",
        background: gradient ? DOE_ORANGE_SOLID : theme.glass(opacity),
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
}: {
  label: string;
  pct: string;
  theme: ReturnType<typeof cardTheme>;
  last?: boolean;
}) {
  const n = parseFloat(pct);
  return (
    <div style={{ marginBottom: last ? 0 : "0.55rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.28rem" }}>
        <span style={{ fontSize: FS_SM, opacity: 0.88 }}>{label}</span>
        <span style={{ fontSize: FS_SM, color: theme.accent, opacity: 0.9 }}>{pct}</span>
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
}: {
  title: string;
  action?: string;
  accent?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem" }}>
      <span style={{ fontSize: FS_SM, fontWeight: 500, opacity: 0.82 }}>{title}</span>
      {action ? (
        <span style={{ fontSize: FS_SM, color: accent, opacity: accent ? 0.92 : 0.55 }}>{action}</span>
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

const HERO_MENU_ITEMS = [
  { label: "Open chart ›", tier: "mid" as const, revealIndex: 0 },
  { label: "Reschedule ›", tier: "mid" as const, revealIndex: 1 },
  { label: "Send reminder ›", tier: "edge" as const, revealIndex: 2 },
  { label: "View calendar ›", tier: "edge" as const, revealIndex: 3 },
] as const;

const FS_HERO_MENU = "clamp(1.02rem, 1.45vw, 1.22rem)";
const FS_HERO_BODY = "clamp(1.14rem, 1.62vw, 1.38rem)";
const FS_HERO_LABEL = "clamp(1.02rem, 1.28vw, 1.18rem)";

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
  variant?: "full" | "hero-scheduling";
}) {
  const theme = cardTheme(surface);
  const orangeTheme = cardTheme("orange");
  const isBeige = surface === "beige";

  if (variant === "hero-scheduling") {
    return (
      <div
        className={`${suisseIntl.className} ${className ?? ""}`}
        aria-hidden
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 38%) minmax(0, 44%)",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "stretch",
          width: "100%",
          minWidth: 0,
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.78rem",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          {HERO_MENU_ITEMS.map((item) => (
            <GlassCard
              key={item.label}
              theme={theme}
              revealIndex={item.revealIndex}
              revealed={revealed}
              compact
              opacity={glassFillOpacity(item.tier, surface)}
              style={{ padding: "0.72rem 1rem" }}
            >
              <span style={{ fontSize: FS_HERO_MENU, opacity: 0.78, fontWeight: 500 }}>{item.label}</span>
            </GlassCard>
          ))}
        </div>

        <GlassCard
          theme={theme}
          revealIndex={4}
          revealed={revealed}
          gradient
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "1.35rem 1.25rem",
            minHeight: "100%",
            minWidth: 0,
            maxWidth: "100%",
            justifySelf: "end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.85rem" }}>
            <AgentIcon theme={orangeTheme} />
            <span style={{ fontSize: FS_HERO_LABEL, fontWeight: 500, color: ON_ORANGE_MUTED }}>Scheduling Agent</span>
          </div>
          <p
            style={{
              fontSize: FS_HERO_BODY,
              lineHeight: 1.42,
              letterSpacing: "-0.015em",
              margin: 0,
              whiteSpace: "normal",
            }}
          >
            <span style={{ color: ON_ORANGE_INK, fontWeight: 500 }}>Sarah&apos;s intake is in Epic.</span>{" "}
            <span style={{ color: ON_ORANGE_MUTED }}>
              Insurance verified and a reminder goes out 48 h before her visit.
            </span>
          </p>
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
        <CardHeader title="Appointment details" action="Manage visit ›" accent={isBeige ? theme.accent : undefined} />
        <p style={{ fontSize: FS_LG, fontWeight: 500, marginBottom: "0.65rem", letterSpacing: "-0.01em" }}>
          Sarah Chen, annual physical
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <p style={{ fontSize: FS_SM, opacity: 0.55, marginBottom: "0.14rem" }}>Scheduled</p>
            <p style={{ fontSize: FS, fontWeight: 500 }}>Fri, Jun 27</p>
            <p style={{ fontSize: FS_SM, opacity: 0.65, marginTop: "0.1rem" }}>10:30 AM</p>
          </div>
          <div>
            <p style={{ fontSize: FS_SM, opacity: 0.55, marginBottom: "0.14rem" }}>Provider</p>
            <p style={{ fontSize: FS, fontWeight: 500 }}>Dr. Patel</p>
            <p style={{ fontSize: FS_SM, opacity: 0.65, marginTop: "0.1rem" }}>Exam Room 3</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={3} revealed={revealed} opacity={glassFillOpacity("near", surface)}>
        <ProgressRow theme={theme} label="Open slots today" pct="68%" />
        <ProgressRow theme={theme} label="Intake forms sent" pct="41%" last />
      </GlassCard>

      <GlassCard
        theme={theme}
        revealIndex={4}
        revealed={revealed}
        gradient
        style={{ gridColumn: "1 / -1" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.6rem" }}>
          <AgentIcon theme={orangeTheme} />
          <span style={{ fontSize: FS, fontWeight: 500, color: ON_ORANGE_MUTED }}>Scheduling Agent</span>
        </div>
        <p style={{ fontSize: FS_LG, lineHeight: 1.42, letterSpacing: "-0.015em" }}>
          <span style={{ color: ON_ORANGE_INK, fontWeight: 500 }}>Sarah&apos;s intake is in Epic.</span>{" "}
          <span style={{ color: ON_ORANGE_MUTED }}>
            Insurance verified and a reminder goes out 48 h before her visit.
          </span>
        </p>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={5} revealed={revealed} opacity={glassFillOpacity("near", surface)}>
        <CardHeader title="Integrations" action="Manage ›" accent={isBeige ? theme.accent : undefined} />
        <p style={{ fontSize: FS, marginBottom: "0.5rem", opacity: 0.88 }}>Epic EHR • Insurance API • Clinic scheduler</p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5.2l2 2 4-4.5"
              stroke={isBeige ? theme.accent : theme.icon}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: FS_SM, opacity: 0.72 }}>Chart synced to inbox</span>
        </div>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={6} revealed={revealed} opacity={glassFillOpacity("near", surface)}>
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

      <GlassCard theme={theme} revealIndex={7} revealed={revealed} compact opacity={glassFillOpacity("mid", surface)}>
        <span style={{ fontSize: FS_SM, opacity: 0.7 }}>Open chart ›</span>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={8} revealed={revealed} compact opacity={glassFillOpacity("mid", surface)}>
        <span style={{ fontSize: FS_SM, opacity: 0.65 }}>Reschedule ›</span>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={9} revealed={revealed} compact opacity={glassFillOpacity("edge", surface)}>
        <span style={{ fontSize: FS_SM, opacity: 0.7 }}>Send reminder ›</span>
      </GlassCard>

      <GlassCard theme={theme} revealIndex={10} revealed={revealed} compact opacity={glassFillOpacity("edge", surface)}>
        <span style={{ fontSize: FS_SM, opacity: 0.65 }}>View calendar ›</span>
      </GlassCard>
    </div>
  );
}
