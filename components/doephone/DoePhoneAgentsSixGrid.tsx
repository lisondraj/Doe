"use client";

import { HERO_AGENT_LABELS } from "@/lib/join/hero-agent-box-svg";
import { suisseIntl } from "@/lib/home/fonts";

const COLUMN_X = [16.666, 50, 83.333] as const;
const BUS_Y = 50;
/** Line anchors — bottom of top row boxes / top of bottom row boxes. */
const TOP_STUB_Y = 36;
const BOTTOM_STUB_Y = 64;

function AgentSquare() {
  return (
    <div
      className="aspect-square w-[min(84%,6.5rem)] rounded-[clamp(0.55rem,0.45rem+0.5vmin,0.88rem)] bg-white shadow-[0_10px_28px_rgba(30,52,58,0.14)]"
      aria-hidden
    />
  );
}

function AgentName({ label, placement }: { label: string; placement: "above" | "below" }) {
  return (
    <p
      className={`text-center text-[clamp(0.58rem,2.15vmin,0.76rem)] font-normal leading-[1.1] tracking-[-0.015em] text-white ${
        placement === "above"
          ? "mb-[clamp(0.35rem,1.25vmin,0.5rem)]"
          : "mt-[clamp(0.14rem,0.45vmin,0.22rem)]"
      }`}
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
      className={`relative mx-auto aspect-[1.02/1] w-full max-w-[min(96%,28rem)] iphone-page:max-w-[min(98%,30.5rem)] ${suisseIntl.className}`}
      aria-hidden
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line
          x1="7"
          y1={BUS_Y}
          x2="93"
          y2={BUS_Y}
          stroke="white"
          strokeWidth="0.55"
          strokeLinecap="round"
          opacity="0.92"
        />
        {COLUMN_X.map((x) => (
          <g key={x}>
            <line
              x1={x}
              y1={TOP_STUB_Y}
              x2={x}
              y2={BUS_Y}
              stroke="white"
              strokeWidth="0.55"
              strokeLinecap="round"
              opacity="0.92"
            />
            <line
              x1={x}
              y1={BUS_Y}
              x2={x}
              y2={BOTTOM_STUB_Y}
              stroke="white"
              strokeWidth="0.55"
              strokeLinecap="round"
              opacity="0.92"
            />
          </g>
        ))}
      </svg>

      <div className="relative grid h-full grid-cols-3 grid-rows-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] gap-x-[clamp(0.65rem,3.2vmin,1.15rem)] px-[1%]">
        {topAgents.map((label) => (
          <AgentName key={`${label}-name-top`} label={label} placement="above" />
        ))}

        {topAgents.map((label) => (
          <div key={`${label}-box-top`} className="flex items-end justify-center">
            <AgentSquare />
          </div>
        ))}

        <div className="col-span-3 h-[clamp(0.85rem,3.1vmin,1.28rem)]" aria-hidden />

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
