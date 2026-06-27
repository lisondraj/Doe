"use client";

import { HERO_AGENT_LABELS } from "@/lib/join/hero-agent-box-svg";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";
import { suisseIntl } from "@/lib/home/fonts";

const COLUMN_X = [16.666, 50, 83.333] as const;
const BUS_Y = 50;
const TOP_STUB_Y = 35;
const BOTTOM_STUB_Y = 65;

function AgentSquare() {
  return (
    <div
      className={`aspect-square w-[min(90%,9.25rem)] ${CAROUSEL_MENU_UI.cardRadius} bg-white shadow-[0_12px_32px_rgba(30,52,58,0.16)]`}
      aria-hidden
    />
  );
}

function AgentName({ label, placement }: { label: string; placement: "above" | "below" }) {
  return (
    <p
      className={`text-center font-normal leading-[1.08] tracking-[-0.018em] text-white ${
        placement === "above"
          ? "mb-[clamp(0.45rem,1.55vmin,0.65rem)]"
          : "mt-[clamp(0.2rem,0.65vmin,0.32rem)]"
      }`}
      style={{ fontSize: CAROUSEL_MENU_UI.type.caption }}
    >
      {label}
    </p>
  );
}

/** Six-agent 2×3 grid with white bus wiring — Agents carousel slide. */
export function DoePhoneAgentsSixGrid() {
  const topAgents = HERO_AGENT_LABELS.slice(0, 3);
  const bottomAgents = HERO_AGENT_LABELS.slice(3, 6);

  return (
    <div
      className={`relative mx-auto h-full w-full max-h-full aspect-[0.98/1] ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidth }}
      aria-hidden
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line
          x1="6"
          y1={BUS_Y}
          x2="94"
          y2={BUS_Y}
          stroke="white"
          strokeWidth="0.62"
          strokeLinecap="round"
          opacity="0.94"
        />
        {COLUMN_X.map((x) => (
          <g key={x}>
            <line
              x1={x}
              y1={TOP_STUB_Y}
              x2={x}
              y2={BUS_Y}
              stroke="white"
              strokeWidth="0.62"
              strokeLinecap="round"
              opacity="0.94"
            />
            <line
              x1={x}
              y1={BUS_Y}
              x2={x}
              y2={BOTTOM_STUB_Y}
              stroke="white"
              strokeWidth="0.62"
              strokeLinecap="round"
              opacity="0.94"
            />
          </g>
        ))}
      </svg>

      <div className="relative grid h-full grid-cols-3 grid-rows-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] gap-x-[clamp(0.85rem,3.8vmin,1.45rem)] px-[0.5%]">
        {topAgents.map((label) => (
          <AgentName key={`${label}-name-top`} label={label} placement="above" />
        ))}

        {topAgents.map((label) => (
          <div key={`${label}-box-top`} className="flex items-end justify-center">
            <AgentSquare />
          </div>
        ))}

        <div className="col-span-3 h-[clamp(1rem,3.6vmin,1.55rem)]" aria-hidden />

        {bottomAgents.map((label) => (
          <div key={`${label}-box-bottom`} className="flex items-start justify-center">
            <AgentSquare />
          </div>
        ))}

        {bottomAgents.map((label) => (
          <AgentName key={`${label}-name-bottom`} label={label} placement="below" />
        ))}
      </div>
    </div>
  );
}
