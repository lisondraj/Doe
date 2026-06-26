"use client";

import type { CSSProperties, ReactNode } from "react";
import { suisseIntl } from "@/lib/home/fonts";
import { useJoinHeroScrollReveal } from "@/lib/join/use-join-hero-scroll-reveal";
import type { WorkflowCarouselSurface } from "@/lib/workflow-carousel-design-backdrops";

const FS = "clamp(0.72rem, 0.92vw, 0.86rem)";
const FS_SM = "clamp(0.6rem, 0.72vw, 0.7rem)";
const FS_LG = "clamp(0.96rem, 1.15vw, 1.1rem)";
const FS_XL = "clamp(1.32rem, 1.65vw, 1.55rem)";
const CLUSTER_GAP = "0.65rem";
const CLUSTER_SCALE = 0.94;

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

function cardTheme(surface: WorkflowCarouselSurface) {
  if (surface === "beige") {
    return {
      ink: "#1E343A",
      accent: DOE_ORANGE,
      border: "rgba(30, 52, 58, 0.12)",
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
    border: "rgba(255, 255, 255, 0.26)",
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
  style,
}: {
  children: ReactNode;
  opacity?: number;
  revealIndex: number;
  revealed: boolean;
  theme: ReturnType<typeof cardTheme>;
  compact?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`join-hero-box-reveal${revealed ? " join-hero-box-reveal--in" : ""}`}
      style={{
        borderRadius: "1.1rem",
        border: `1px solid ${theme.border}`,
        background: theme.glass(opacity),
        padding: compact ? "0.58rem 0.85rem" : "0.95rem 1.05rem",
        color: theme.ink,
        animationDelay: revealed ? `${revealIndex * 70}ms` : undefined,
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

/** Glass card cluster — non-overlapping bento grid with uniform gaps (join hero band). */
export function JoinHeroCoFoundersCards({
  variant,
  surface = "orange",
}: {
  variant: "mobile" | "desktop";
  surface?: WorkflowCarouselSurface;
}) {
  const { ref, revealed } = useJoinHeroScrollReveal();
  const theme = cardTheme(surface);

  if (variant === "mobile") return null;

  const isBeige = surface === "beige";

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute z-[2] ${suisseIntl.className}`}
      aria-hidden
      style={{
        top: "50%",
        left: isBeige ? "46%" : "40%",
        right: "clamp(4.5rem, 9vw, 7.5rem)",
        transform: `translateY(-50%) translateX(1.25rem) scale(${CLUSTER_SCALE})`,
        transformOrigin: "right center",
        display: "grid",
        gridTemplateColumns: "1.45fr 1fr",
        gap: CLUSTER_GAP,
        alignContent: "center",
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
        opacity={glassFillOpacity("center", surface)}
        style={{ gridColumn: "1 / -1" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.6rem" }}>
          <AgentIcon theme={theme} />
          <span style={{ fontSize: FS, fontWeight: 500, color: isBeige ? theme.accent : theme.ink }}>Scheduling Agent</span>
        </div>
        <p style={{ fontSize: FS_LG, lineHeight: 1.42, letterSpacing: "-0.015em" }}>
          Sarah&apos;s intake is in Epic. Insurance verified and a reminder goes out 48 h before her visit.
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
