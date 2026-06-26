import type { ReactNode } from "react";
import { suisseIntl } from "@/lib/home/fonts";

const FS = "clamp(0.58rem, 0.72vw, 0.68rem)";
const FS_SM = "clamp(0.48rem, 0.58vw, 0.56rem)";
const FS_LG = "clamp(0.72rem, 0.92vw, 0.86rem)";
const FS_XL = "clamp(1.05rem, 1.35vw, 1.28rem)";

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
        borderRadius: "0.95rem",
        border: "1px solid rgba(255,255,255,0.28)",
        background: `rgba(255,255,255,${opacity})`,
        padding: "0.72rem 0.82rem",
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
    <div style={{ marginBottom: "0.55rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.28rem" }}>
        <span style={{ fontSize: FS_SM, opacity: 0.88 }}>{label}</span>
        <span style={{ fontSize: FS_SM, opacity: 0.72 }}>{pct}</span>
      </div>
      <div
        style={{
          height: "0.28rem",
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem" }}>
      <span style={{ fontSize: FS_SM, fontWeight: 500, opacity: 0.82 }}>{title}</span>
      {action ? (
        <span style={{ fontSize: FS_SM, opacity: 0.55 }}>{action}</span>
      ) : null}
    </div>
  );
}

function AgentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.1" />
      <circle cx="7" cy="7" r="1.6" fill="rgba(255,255,255,0.85)" />
      <path d="M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2" stroke="rgba(255,255,255,0.65)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** Layered glass cards — central focus card with faded cards around it (Co-Founders band). */
export function JoinHeroCoFoundersCards({ variant }: { variant: "mobile" | "desktop" }) {
  if (variant === "mobile") return null;

  return (
    <div
      className={`pointer-events-none absolute z-[2] ${suisseIntl.className}`}
      aria-hidden
      style={{
        top: "50%",
        right: "clamp(7rem, 16vw, 13rem)",
        transform: "translateY(-50%)",
        width: "min(40rem, 50%)",
        height: "min(24rem, 76%)",
      }}
    >
      {/* Top — booking-style card */}
      <GlassCard style={{ top: "2%", left: "12%", width: "60%", zIndex: 1 }} opacity={0.14}>
        <CardHeader title="Background" action="View profile ›" />
        <p style={{ fontSize: FS_LG, fontWeight: 500, marginBottom: "0.65rem", letterSpacing: "-0.01em" }}>
          James Lisondra
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          <div>
            <p style={{ fontSize: FS_SM, opacity: 0.55, marginBottom: "0.15rem" }}>Degree</p>
            <p style={{ fontSize: FS, fontWeight: 500 }}>MD</p>
            <p style={{ fontSize: FS_SM, opacity: 0.65, marginTop: "0.1rem" }}>U. of Ottawa</p>
          </div>
          <div>
            <p style={{ fontSize: FS_SM, opacity: 0.55, marginBottom: "0.15rem" }}>Focus</p>
            <p style={{ fontSize: FS, fontWeight: 500 }}>Clinical</p>
            <p style={{ fontSize: FS_SM, opacity: 0.65, marginTop: "0.1rem" }}>Medicine</p>
          </div>
        </div>
      </GlassCard>

      {/* Top right — progress bars */}
      <GlassCard style={{ top: "4%", right: "0%", width: "36%", zIndex: 1 }} opacity={0.12}>
        <ProgressRow label="Clinical medicine" pct="43%" />
        <ProgressRow label="Healthcare delivery" pct="26.9%" />
      </GlassCard>

      {/* Left edge — more info */}
      <GlassCard style={{ top: "20%", left: "0%", width: "auto", zIndex: 2, padding: "0.45rem 0.65rem" }} opacity={0.1}>
        <span style={{ fontSize: FS_SM, opacity: 0.7 }}>More info ›</span>
      </GlassCard>

      {/* Center — primary card */}
      <GlassCard style={{ top: "24%", left: "2%", width: "54%", zIndex: 5 }} opacity={0.42}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.65rem" }}>
          <AgentIcon />
          <span style={{ fontSize: FS, fontWeight: 500 }}>Clinical Co-Founder</span>
        </div>
        <p style={{ fontSize: FS_LG, lineHeight: 1.45, letterSpacing: "-0.015em" }}>
          Hi — James here. Building Doe with Matthew to give providers control over their workflows.
        </p>
      </GlassCard>

      {/* Bottom center — subscriptions-style */}
      <GlassCard style={{ bottom: "18%", left: "14%", width: "58%", zIndex: 3 }} opacity={0.13}>
        <CardHeader title="Publications" action="Manage ›" />
        <p style={{ fontSize: FS, marginBottom: "0.55rem", opacity: 0.88 }}>Scholarly journals • Healthcare access</p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 5.2l2 2 4-4.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: FS_SM, opacity: 0.72 }}>International conferences</span>
        </div>
      </GlassCard>

      {/* Bottom right — ETA-style */}
      <GlassCard style={{ bottom: "6%", right: "0%", width: "32%", zIndex: 4 }} opacity={0.16}>
        <p style={{ fontSize: FS_SM, opacity: 0.6, marginBottom: "0.2rem" }}>Technical Co-Founder</p>
        <p style={{ fontSize: FS_XL, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1 }}>PhD</p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.45rem" }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
            <rect x="1" y="2" width="9" height="7" rx="1.2" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            <path d="M1 4.5h9" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
          </svg>
          <span style={{ fontSize: FS_SM, opacity: 0.65 }}>U. of Toronto</span>
        </div>
      </GlassCard>

      {/* Bottom left — partial link */}
      <GlassCard style={{ bottom: "4%", left: "0%", width: "auto", zIndex: 2, padding: "0.45rem 0.65rem" }} opacity={0.09}>
        <span style={{ fontSize: FS_SM, opacity: 0.65 }}>View profile ›</span>
      </GlassCard>
    </div>
  );
}
