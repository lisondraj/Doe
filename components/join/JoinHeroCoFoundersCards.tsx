import type { ReactNode } from "react";
import { suisseIntl } from "@/lib/home/fonts";

const FS = "clamp(0.76rem, 0.98vw, 0.92rem)";
const FS_SM = "clamp(0.62rem, 0.76vw, 0.74rem)";
const FS_LG = "clamp(1.02rem, 1.25vw, 1.18rem)";
const FS_XL = "clamp(1.48rem, 1.88vw, 1.78rem)";

function GlassCard({
  children,
  style,
  opacity = 0.32,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "1.2rem",
        border: "1px solid rgba(255,255,255,0.26)",
        background: `rgba(255,255,255,${opacity})`,
        padding: "1.15rem 1.25rem",
        color: "#FFFFFF",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ProgressRow({ label, pct }: { label: string; pct: string }) {
  const n = parseFloat(pct);
  return (
    <div style={{ marginBottom: "0.7rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.32rem" }}>
        <span style={{ fontSize: FS_SM, opacity: 0.88 }}>{label}</span>
        <span style={{ fontSize: FS_SM, opacity: 0.72 }}>{pct}</span>
      </div>
      <div
        style={{
          height: "0.32rem",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.18)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${n}%`,
            height: "100%",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.72)",
          }}
        />
      </div>
    </div>
  );
}

function CardHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
      <span style={{ fontSize: FS_SM, fontWeight: 500, opacity: 0.82 }}>{title}</span>
      {action ? (
        <span style={{ fontSize: FS_SM, opacity: 0.55 }}>{action}</span>
      ) : null}
    </div>
  );
}

function AgentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.1" />
      <circle cx="7" cy="7" r="1.6" fill="rgba(255,255,255,0.85)" />
      <path d="M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2" stroke="rgba(255,255,255,0.65)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** Layered glass cards — clinic scheduling / EMR UI mock (Co-Founders band). */
export function JoinHeroCoFoundersCards({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") return null;

  return (
    <div
      className={`pointer-events-none absolute z-[2] ${suisseIntl.className}`}
      aria-hidden
      style={{
        top: "50%",
        right: "clamp(5rem, 12vw, 10rem)",
        transform: "translateY(-50%)",
        width: "min(54rem, 60%)",
        height: "min(36rem, 92%)",
      }}
    >
      {/* Top — appointment details card (anchor) */}
      <GlassCard style={{ top: "0%", left: "6%", width: "74%", zIndex: 1 }} opacity={0.13}>
        <CardHeader title="Appointment details" action="Manage visit ›" />
        <p style={{ fontSize: FS_LG, fontWeight: 500, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
          Sarah Chen, annual physical
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
          <div>
            <p style={{ fontSize: FS_SM, opacity: 0.55, marginBottom: "0.18rem" }}>Scheduled</p>
            <p style={{ fontSize: FS, fontWeight: 500 }}>Fri, Jun 27</p>
            <p style={{ fontSize: FS_SM, opacity: 0.65, marginTop: "0.12rem" }}>10:30 AM</p>
          </div>
          <div>
            <p style={{ fontSize: FS_SM, opacity: 0.55, marginBottom: "0.18rem" }}>Provider</p>
            <p style={{ fontSize: FS, fontWeight: 500 }}>Dr. Patel</p>
            <p style={{ fontSize: FS_SM, opacity: 0.65, marginTop: "0.12rem" }}>Exam Room 3</p>
          </div>
        </div>
      </GlassCard>

      {/* Top right — schedule metrics, overlapping background */}
      <GlassCard style={{ top: "0%", left: "52%", width: "50%", zIndex: 2 }} opacity={0.11}>
        <ProgressRow label="Open slots today" pct="68%" />
        <ProgressRow label="Intake forms sent" pct="41%" />
      </GlassCard>

      {/* Left — chart chip */}
      <GlassCard style={{ top: "30%", left: "0%", width: "auto", zIndex: 4, padding: "0.62rem 0.9rem" }} opacity={0.1}>
        <span style={{ fontSize: FS_SM, opacity: 0.7 }}>Open chart ›</span>
      </GlassCard>

      {/* Center — primary scheduling agent card */}
      <GlassCard style={{ top: "24%", left: "0%", width: "64%", zIndex: 6 }} opacity={0.46}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <AgentIcon />
          <span style={{ fontSize: FS, fontWeight: 500 }}>Scheduling Agent</span>
        </div>
        <p style={{ fontSize: FS_LG, lineHeight: 1.45, letterSpacing: "-0.015em" }}>
          Sarah&apos;s intake is in Epic. Insurance verified and a reminder goes out 48 h before her visit.
        </p>
      </GlassCard>

      {/* Bottom center — EMR integrations */}
      <GlassCard style={{ top: "58%", left: "10%", width: "68%", zIndex: 3 }} opacity={0.12}>
        <CardHeader title="Integrations" action="Manage ›" />
        <p style={{ fontSize: FS, marginBottom: "0.65rem", opacity: 0.88 }}>Epic EHR • Insurance API • Clinic scheduler</p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 5.2l2 2 4-4.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: FS_SM, opacity: 0.72 }}>Chart synced to inbox</span>
        </div>
      </GlassCard>

      {/* Bottom right — next appointment */}
      <GlassCard style={{ top: "70%", left: "56%", width: "40%", zIndex: 5 }} opacity={0.15}>
        <p style={{ fontSize: FS_SM, opacity: 0.6, marginBottom: "0.25rem" }}>Next in queue</p>
        <p style={{ fontSize: FS_XL, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1 }}>10:30 AM</p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.5rem" }}>
          <svg width="12" height="12" viewBox="0 0 11 11" fill="none" aria-hidden>
            <rect x="1" y="2" width="9" height="7" rx="1.2" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            <path d="M1 4.5h9" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
          </svg>
          <span style={{ fontSize: FS_SM, opacity: 0.65 }}>Front desk triage</span>
        </div>
      </GlassCard>

      {/* Bottom left — reschedule chip */}
      <GlassCard style={{ top: "78%", left: "0%", width: "auto", zIndex: 2, padding: "0.62rem 0.9rem" }} opacity={0.09}>
        <span style={{ fontSize: FS_SM, opacity: 0.65 }}>Reschedule ›</span>
      </GlassCard>
    </div>
  );
}
