"use client";

import { inter, suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";
import type { ReactNode } from "react";

const { ink: INK, accent: DOE_ORANGE } = CAROUSEL_MENU_UI;

const MUTED = "#9CA3AF";
const MUTED_TEXT = "#6B7280";
const BORDER = "#E5E7EB";
const BTN_BG = "#F3F4F6";
const LIVE_BG = "rgba(210, 119, 76, 0.12)";

const OUTER_RADIUS = "rounded-[clamp(0.86rem,2.6vmin,1.03rem)]";
const BTN_RADIUS = "rounded-[clamp(0.35rem,1.03vmin,0.43rem)]";

const CAROUSEL_INPUT_PAD = "clamp(0.89rem,2.75vmin,1.1rem) clamp(0.95rem,2.97vmin,1.13rem)";
const SECTION_INPUT_PAD = "clamp(1.12rem,3.45vmin,1.38rem) clamp(1.15rem,3.55vmin,1.42rem)";
const SECTION_INPUT_PAD_LARGE = "clamp(1.65rem,5.1vmin,2rem) clamp(1.68rem,5.2vmin,2.05rem)";
const SECTION_INPUT_PAD_DESKTOP = "1.75rem 1.85rem";
const BODY_SIZE = "clamp(0.95rem,2.86vmin,1.13rem)";
const SECTION_BODY_SIZE = "clamp(1.02rem,3.1vmin,1.22rem)";
const SECTION_BODY_SIZE_LARGE = "clamp(1.32rem,4.05vmin,1.58rem)";
const SECTION_BODY_SIZE_DESKTOP = "1.28rem";
const ACTION_SIZE = "clamp(0.91rem,2.75vmin,1.08rem)";
const ACTION_SIZE_LARGE = "clamp(1.05rem,3.2vmin,1.25rem)";
const ACTION_SIZE_DESKTOP = "1.05rem";
const HEADER_SIZE = "clamp(0.84rem,2.54vmin,0.99rem)";
const SECTION_HEADER_SIZE = "clamp(0.92rem,2.8vmin,1.08rem)";
const SECTION_HEADER_SIZE_LARGE = "clamp(1.05rem,3.2vmin,1.28rem)";
const SECTION_HEADER_SIZE_DESKTOP = "1.02rem";
const SUBMIT_SIZE_LARGE = "clamp(2.45rem,7.5vmin,2.85rem)";
const SUBMIT_ICON_LARGE = "clamp(1.05rem,3.2vmin,1.25rem)";
const SUBMIT_SIZE_DESKTOP = "2.65rem";
const SUBMIT_ICON_DESKTOP = "1.15rem";

export function PromptTag({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center font-normal leading-snug ${BTN_RADIUS}`}
      style={{
        background: LIVE_BG,
        color: DOE_ORANGE,
        fontSize: "inherit",
        padding: "clamp(0.13rem,0.41vmin,0.17rem) clamp(0.41rem,1.24vmin,0.52rem)",
        marginInline: "clamp(0.22rem,0.68vmin,0.3rem)",
        verticalAlign: "baseline",
      }}
    >
      {label}
    </span>
  );
}

export function PatientPromptTag({ label }: { label: string }) {
  return <PromptTag label={`@${label}'s`} />;
}

const WORKFLOW_MENTION_PEOPLE = [
  { name: "Melissa Alvarez", role: "Study Coordinator" },
  { name: "James Chen", role: "Principal Investigator" },
  { name: "Sarah Okonkwo", role: "Data Analyst" },
] as const;

export function WorkflowMentionDropdown() {
  const menuRadius = "rounded-[clamp(0.45rem,1.35vmin,0.55rem)]";
  const rowPad = "clamp(0.55rem,1.65vmin,0.68rem) clamp(0.62rem,1.88vmin,0.75rem)";
  const nameSize = "clamp(0.88rem,2.65vmin,1.05rem)";
  const roleSize = "clamp(0.72rem,2.15vmin,0.86rem)";

  return (
    <span
      className={`absolute left-[1.05em] top-0 z-20 overflow-hidden border bg-white shadow-[0_8px_24px_rgba(30,52,58,0.12)] ${menuRadius} ${inter.className}`}
      style={{ borderColor: BORDER, minWidth: "clamp(13.5rem,42vmin,16.5rem)" }}
      aria-hidden
    >
      {WORKFLOW_MENTION_PEOPLE.map((person, index) => (
        <div
          key={person.name}
          className="flex items-center justify-between"
          style={{
            gap: "clamp(0.55rem,1.65vmin,0.68rem)",
            padding: rowPad,
            borderTop: index > 0 ? `1px solid ${BORDER}` : undefined,
          }}
        >
          <span className="min-w-0 truncate font-normal leading-snug" style={{ color: INK, fontSize: nameSize }}>
            {person.name}
          </span>
          <span
            className={`shrink-0 font-normal leading-snug ${BTN_RADIUS}`}
            style={{
              background: BTN_BG,
              color: MUTED_TEXT,
              fontSize: roleSize,
              padding: "clamp(0.16rem,0.48vmin,0.2rem) clamp(0.38rem,1.15vmin,0.48rem)",
            }}
          >
            {person.role}
          </span>
        </div>
      ))}
    </span>
  );
}

export function WorkflowMentionAt() {
  return (
    <span className="relative inline-block align-baseline">
      <span className="font-normal leading-snug" style={{ color: INK }}>
        @
      </span>
      <WorkflowMentionDropdown />
    </span>
  );
}

function ContextHeader({ label, headerSize, large = false }: { label: string; headerSize: string; large?: boolean }) {
  const iconSize = large
    ? "clamp(0.62rem,1.88vmin,0.75rem)"
    : "clamp(0.52rem,1.57vmin,0.63rem)";

  return (
    <div
      className="flex items-center"
      style={{
        gap: large ? "clamp(0.38rem,1.15vmin,0.48rem)" : "clamp(0.3rem,0.92vmin,0.39rem)",
        marginBottom: large ? "clamp(0.78rem,2.38vmin,0.95rem)" : "clamp(0.59rem,1.78vmin,0.73rem)",
      }}
    >
      <span className="font-medium leading-none" style={{ color: DOE_ORANGE, fontSize: headerSize }}>
        {label}
      </span>
      <svg viewBox="0 0 8 8" fill="none" aria-hidden style={{ width: iconSize, height: iconSize }}>
        <path
          d="M2 3l2 2 2-2"
          stroke={DOE_ORANGE}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ChartToolIcons() {
  const iconSize = "clamp(1.27rem,3.94vmin,1.53rem)";
  const sw = 1.3;
  const cap = "round" as const;
  const join = "round" as const;

  return (
    <div className="flex items-center" style={{ gap: "clamp(0.73rem,2.21vmin,0.89rem)" }} aria-hidden>
      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }}>
        <path d="M2.5 12.5V3.5" stroke={MUTED} strokeWidth={sw} strokeLinecap={cap} />
        <path d="M2.5 12.5h11" stroke={MUTED} strokeWidth={sw} strokeLinecap={cap} />
        <path
          d="M4.5 10l2.5-2.5 2 1.5 4.5-5"
          stroke={MUTED}
          strokeWidth={sw}
          strokeLinecap={cap}
          strokeLinejoin={join}
        />
      </svg>

      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }}>
        <rect x="3" y="6.25" width="10" height="3.5" rx="1.75" stroke={MUTED} strokeWidth={sw} />
        <path d="M8 6.25v3.5" stroke={MUTED} strokeWidth={sw} strokeLinecap={cap} />
      </svg>

      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }}>
        <rect x="2.5" y="3.5" width="8.5" height="7" rx="1.2" stroke={MUTED} strokeWidth={sw} />
        <rect x="5" y="5.5" width="8.5" height="7" rx="1.2" stroke={MUTED} strokeWidth={sw} />
        <path
          d="M7.2 8.2h4.8M7.2 10.2h3.4"
          stroke={DOE_ORANGE}
          strokeWidth={sw * 0.95}
          strokeLinecap={cap}
        />
      </svg>
    </div>
  );
}

function WorkflowToolIcons({ large = false }: { large?: boolean }) {
  const iconSize = large
    ? "clamp(1.48rem,4.55vmin,1.78rem)"
    : "clamp(1.22rem,3.75vmin,1.48rem)";
  const sw = 1.25;
  const cap = "round" as const;

  return (
    <div
      className="flex items-center"
      style={{ gap: large ? "clamp(0.98rem,3vmin,1.18rem)" : "clamp(0.82rem,2.5vmin,1rem)" }}
      aria-hidden
    >
      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }}>
        <circle cx="8" cy="8" r="4.75" stroke={MUTED} strokeWidth={sw} />
        <circle cx="8" cy="8" r="1.35" fill={MUTED} />
      </svg>

      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }}>
        <rect x="3" y="3" width="10" height="10" rx="1.5" stroke={MUTED} strokeWidth={sw} />
        <path d="M3 8h10M8 3v10" stroke={MUTED} strokeWidth={sw} strokeLinecap={cap} />
      </svg>

      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }}>
        <path
          d="M3.5 12.5L12.5 3.5M12.5 3.5H7M12.5 3.5V9"
          stroke={MUTED}
          strokeWidth={sw}
          strokeLinecap={cap}
          strokeLinejoin={cap}
        />
      </svg>
    </div>
  );
}

function ModelSelector({ actionSize = ACTION_SIZE, large = false }: { actionSize?: string; large?: boolean }) {
  const iconSize = large
    ? "clamp(0.62rem,1.88vmin,0.75rem)"
    : "clamp(0.52rem,1.57vmin,0.63rem)";

  return (
    <span
      className={`inline-flex shrink-0 items-center font-medium leading-none ${BTN_RADIUS} ${inter.className}`}
      style={{
        background: BTN_BG,
        color: INK,
        fontSize: actionSize,
        gap: large ? "clamp(0.32rem,0.95vmin,0.4rem)" : "clamp(0.24rem,0.73vmin,0.3rem)",
        padding: large
          ? "clamp(0.52rem,1.58vmin,0.65rem) clamp(0.72rem,2.18vmin,0.88rem)"
          : "clamp(0.41rem,1.3vmin,0.52rem) clamp(0.59rem,1.78vmin,0.73rem)",
      }}
    >
      Fable 5
      <svg viewBox="0 0 8 8" fill="none" aria-hidden style={{ width: iconSize, height: iconSize }}>
        <path
          d="M2 3l2 2 2-2"
          stroke={MUTED}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function SubmitIconButton({ desktop = false, large = false }: { desktop?: boolean; large?: boolean }) {
  const size = desktop ? SUBMIT_SIZE_DESKTOP : large ? SUBMIT_SIZE_LARGE : "clamp(2rem,6.1vmin,2.32rem)";
  const iconSize = desktop ? SUBMIT_ICON_DESKTOP : large ? SUBMIT_ICON_LARGE : "clamp(0.89rem,2.7vmin,1.06rem)";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${BTN_RADIUS}`}
      style={{ background: DOE_ORANGE, width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 16 16" fill="none" style={{ width: iconSize, height: iconSize }} aria-hidden>
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="#FFFFFF"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function DoePhoneAmbientPromptCard({
  headerLabel,
  layout = "carousel",
  size = "default",
  toolIcons = "chart",
  children,
}: {
  headerLabel: string;
  layout?: "carousel" | "section";
  size?: "default" | "large" | "desktop";
  toolIcons?: "chart" | "workflow";
  children: ReactNode;
}) {
  const isSection = layout === "section";
  const isDesktop = isSection && size === "desktop";
  const isLarge = isSection && size === "large";
  const bodySize = isDesktop
    ? SECTION_BODY_SIZE_DESKTOP
    : isLarge
      ? SECTION_BODY_SIZE_LARGE
      : isSection
        ? SECTION_BODY_SIZE
        : BODY_SIZE;
  const headerSize = isDesktop
    ? SECTION_HEADER_SIZE_DESKTOP
    : isLarge
      ? SECTION_HEADER_SIZE_LARGE
      : isSection
        ? SECTION_HEADER_SIZE
        : HEADER_SIZE;
  const pad = isDesktop
    ? SECTION_INPUT_PAD_DESKTOP
    : isLarge
      ? SECTION_INPUT_PAD_LARGE
      : isSection
        ? SECTION_INPUT_PAD
        : CAROUSEL_INPUT_PAD;
  const widthClass = isSection ? "w-full" : "w-[96%]";
  const actionSize = isDesktop ? ACTION_SIZE_DESKTOP : isLarge ? ACTION_SIZE_LARGE : ACTION_SIZE;
  const modelAfterTools = isDesktop && toolIcons === "workflow";

  return (
    <div
      className={`${widthClass} bg-white ${OUTER_RADIUS} ${isSection ? "overflow-visible" : ""} ${suisseIntl.className}`}
      style={{ padding: pad }}
    >
      <ContextHeader label={headerLabel} headerSize={headerSize} large={isLarge} />

      <p
        className={`font-normal ${isSection ? "relative overflow-visible" : ""}`}
        style={{
          color: INK,
          fontSize: bodySize,
          lineHeight: isLarge ? 1.62 : isSection ? 1.58 : 1.46,
        }}
      >
        {children}
      </p>

      <div
        className="flex items-center justify-between"
        style={{
          gap: isLarge ? "clamp(0.78rem,2.38vmin,0.95rem)" : "clamp(0.59rem,1.78vmin,0.73rem)",
          marginTop: isLarge ? "clamp(0.95rem,2.9vmin,1.18rem)" : "clamp(0.67rem,2.05vmin,0.84rem)",
        }}
      >
        <div
          className="flex min-w-0 items-center"
          style={{
            gap: modelAfterTools
              ? "clamp(0.72rem,1.05vw,1rem)"
              : isLarge
                ? "clamp(0.78rem,2.38vmin,0.95rem)"
                : "clamp(0.59rem,1.78vmin,0.73rem)",
          }}
        >
          {toolIcons === "workflow" ? <WorkflowToolIcons large={isLarge} /> : <ChartToolIcons />}
          {modelAfterTools ? <ModelSelector actionSize={actionSize} large={isLarge} /> : null}
        </div>

        <div
          className="flex shrink-0 items-center"
          style={{ gap: isLarge ? "clamp(0.58rem,1.75vmin,0.72rem)" : "clamp(0.45rem,1.38vmin,0.59rem)" }}
        >
          {!modelAfterTools ? <ModelSelector actionSize={actionSize} large={isLarge} /> : null}
          <SubmitIconButton desktop={isDesktop} large={isLarge} />
        </div>
      </div>
    </div>
  );
}
