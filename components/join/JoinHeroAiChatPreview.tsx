"use client";

import { suisseIntl } from "@/lib/home/fonts";
import {
  joinHeroBoxRevealClass,
  joinHeroBoxRevealDelay,
  useJoinHeroScrollReveal,
} from "@/lib/join/use-join-hero-scroll-reveal";
import type { CSSProperties } from "react";

const FS_BUBBLE = "clamp(0.84rem, 1.08vw, 0.95rem)";
const FS_LABEL = "clamp(0.7rem, 0.86vw, 0.8rem)";

const SPEAKER_LABEL: CSSProperties = {
  fontSize: FS_LABEL,
  fontWeight: 500,
  color: "#FFFFFF",
  marginBottom: "0.28rem",
  lineHeight: 1.2,
};

const DOE_ORANGE_DARK = "#BF593D";
const DOE_ORANGE_TEXT = "#A04E36";

const INTEGRATIONS = ["Epic EHR", "Insurance API", "Clinic scheduler"] as const;

const BUBBLE_ICON_STROKE = "rgba(255, 255, 255, 0.78)";

function BubbleActionIcons() {
  const iconSize = 15;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.52rem",
        flexShrink: 0,
        alignSelf: "center",
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M10.8 2.2l3 3-8.1 8.1H3v-2.7L10.8 2.2z"
          stroke={BUBBLE_ICON_STROKE}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9.5 3.5l3 3" stroke={BUBBLE_ICON_STROKE} strokeWidth="1.25" strokeLinecap="round" />
      </svg>
      <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 2.5v6.5M5.2 5.8 8 3l2.8 2.8"
          stroke={BUBBLE_ICON_STROKE}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.5 10.5v2h9v-2"
          stroke={BUBBLE_ICON_STROKE}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M4 6.5l4 4 4-4"
          stroke={BUBBLE_ICON_STROKE}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function IntegrationCheck() {
  return (
    <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path
        d="M2 5.1l1.4 1.4 2.6-2.8"
        stroke={DOE_ORANGE_TEXT}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingWheel() {
  return (
    <span
      className="shrink-0 animate-spin rounded-full border-[1.5px] border-[#D9D4CC] border-r-transparent border-b-transparent"
      style={{ width: "0.85rem", height: "0.85rem", animationDuration: "1.1s" }}
      aria-hidden
    />
  );
}

/** AI reply — connected sources + pre-visit intake preview. */
function AiResultPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.42rem", width: "100%" }}>
      <div
        style={{
          borderRadius: "0.42rem",
          background: "#FAFAF8",
          padding: "0.55rem 0.65rem",
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
        }}
      >
        <LoadingWheel />
        <span style={{ fontSize: FS_BUBBLE, color: "#78716C" }}>Building pre-visit intake...</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.18rem" }}>
        {INTEGRATIONS.map((label) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}
          >
            <span style={{ fontSize: FS_BUBBLE, color: DOE_ORANGE_TEXT }}>{label}</span>
            <IntegrationCheck />
          </div>
        ))}
      </div>
    </div>
  );
}

const MESSAGES = [
  {
    id: "doc1",
    role: "user" as const,
    text: "Build me a pre-visit intake form. Pull the patient's chart from Epic, verify insurance, and send reminders through my scheduler.",
  },
  {
    id: "ai1",
    role: "ai" as const,
    showResult: true,
    lines: [] as const,
  },
] as const;

const FS = "clamp(0.88rem, 1.22vw, 1.05rem)";
const FS_SM = "clamp(0.72rem, 0.98vw, 0.84rem)";
/** Uniform scale for chat mock — messages, form, and input box. */
const PREVIEW_SCALE = 1.08;

export function JoinHeroAiChatPreview({ variant }: { variant: "mobile" | "desktop" }) {
  const { ref, revealed } = useJoinHeroScrollReveal();

  if (variant === "mobile") return null;

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute z-[2] flex flex-col ${suisseIntl.className}`}
      aria-hidden
      style={{
        top: "50%",
        transform: `translateY(calc(-50% - 1.25rem)) translateX(0.5rem) scale(${PREVIEW_SCALE})`,
        transformOrigin: "right center",
        right: "clamp(3.25rem, 9vw, 7.75rem)",
        width: "min(36rem, 50%)",
        gap: "1rem",
      }}
    >
      {/* Messages */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
        }}
      >
        {MESSAGES.map((msg, msgIndex) =>
          msg.role === "user" ? (
            <div
              key={msg.id}
              className={joinHeroBoxRevealClass(revealed)}
              style={{ animationDelay: joinHeroBoxRevealDelay(revealed, msgIndex), display: "flex", justifyContent: "flex-end" }}
            >
              <div style={{ display: "flex", flexDirection: "column", maxWidth: "61.33%" }}>
                <div style={{ display: "flex", alignItems: "stretch", gap: "0.55rem" }}>
                  <BubbleActionIcons />
                  <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                    <span style={SPEAKER_LABEL}>Dr. Chen</span>
                    <div
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "1.1rem 1.1rem 0.35rem 1.1rem",
                        padding: "0.9rem 1.05rem",
                      }}
                    >
                      <p style={{ fontSize: FS, color: "#1E343A", lineHeight: 1.5 }}>{msg.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={msg.id}
              className={joinHeroBoxRevealClass(revealed)}
              style={{ animationDelay: joinHeroBoxRevealDelay(revealed, msgIndex), display: "flex", justifyContent: "flex-start" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "showResult" in msg && msg.showResult ? "66.67%" : undefined,
                  maxWidth: "showResult" in msg && msg.showResult ? "66.67%" : "96%",
                }}
              >
                <span style={SPEAKER_LABEL}>Doe Agent</span>
                <div style={{ display: "flex", alignItems: "stretch", gap: "0.55rem" }}>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      background: "#FFFFFF",
                      borderRadius: "1.1rem 1.1rem 1.1rem 0.35rem",
                      padding: "0.85rem 0.95rem",
                    }}
                  >
                    {"showResult" in msg && msg.showResult ? <AiResultPreview /> : null}
                    {msg.lines.map((line, i) => (
                      <p
                        key={line}
                        style={{
                          fontSize: FS,
                          color: "#1E343A",
                          lineHeight: 1.5,
                          marginTop: i > 0 ? "0.45rem" : 0,
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <BubbleActionIcons />
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Input box — chatbox style with model selector and toolbar */}
      <div
        className={joinHeroBoxRevealClass(revealed)}
        style={{
          animationDelay: joinHeroBoxRevealDelay(revealed, MESSAGES.length),
          background: "#FFFFFF",
          borderRadius: "0.95rem",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Model selector row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.65rem 0.85rem 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.32rem" }}>
            <span style={{ fontSize: FS_SM, fontWeight: 500, color: DOE_ORANGE_TEXT }}>Dr. Chen&apos;s Clinic</span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
              <path
                d="M2 3l2 2 2-2"
                stroke={DOE_ORANGE_TEXT}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Text area */}
        <div style={{ padding: "0.65rem 0.85rem" }}>
          <p style={{ fontSize: FS, color: "#A8A29E", lineHeight: 1.45 }}>
            Describe a tool or change to your workflow
          </p>
        </div>

        {/* Toolbar row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 0.85rem 0.65rem",
            gap: "0.5rem",
          }}
        >
          {/* Left tools */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            {/* Attach */}
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M13.5 8.5l-6 6a4 4 0 0 1-5.66-5.66l6-6a2.5 2.5 0 0 1 3.54 3.54l-5.3 5.3a1 1 0 0 1-1.42-1.42l5-5" stroke="#9A9590" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Globe / integrations */}
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="8" cy="8" r="6.5" stroke="#9A9590" strokeWidth="1.3" />
              <path d="M8 1.5C8 1.5 5 5 5 8s3 6.5 3 6.5M8 1.5C8 1.5 11 5 11 8s-3 6.5-3 6.5M1.5 8h13" stroke="#9A9590" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {/* Workflow / tool */}
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="#9A9590" strokeWidth="1.3" />
              <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="#9A9590" strokeWidth="1.3" />
              <rect x="5.5" y="9.5" width="5" height="5" rx="1" stroke="#9A9590" strokeWidth="1.3" />
              <path d="M4 9.5V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" stroke="#9A9590" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>

          {/* Model picker + send */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexShrink: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.28rem",
                height: "2.1rem",
                background: "#F7F6F3",
                borderRadius: "0.52rem",
                padding: "0 0.55rem",
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: FS_SM, fontWeight: 500, color: "#1E343A" }}>Fable 5</span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                <path d="M2 3l2 2 2-2" stroke="#9A9590" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Send */}
            <div
              style={{
                width: "2.1rem",
                height: "2.1rem",
                borderRadius: "0.52rem",
                background: DOE_ORANGE_DARK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 10 10" fill="none" aria-hidden>
                <path d="M1 5h8M5 1l4 4-4 4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
