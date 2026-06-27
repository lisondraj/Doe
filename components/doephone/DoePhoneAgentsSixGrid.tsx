"use client";

import { HERO_AGENT_LABELS } from "@/lib/join/hero-agent-box-svg";
import { suisseIntl } from "@/lib/home/fonts";

const COLUMN_X = [16.666, 50, 83.333] as const;
const BUS_Y = 50;

function AgentSquare() {
  return (
    <div
      className="aspect-square w-[min(72%,4.85rem)] rounded-[clamp(0.52rem,0.42rem+0.48vmin,0.82rem)] border-[1.5px] border-[#1E343A] bg-[#D2774C]"
      aria-hidden
    />
  );
}

function AgentName({ label }: { label: string }) {
  return (
    <p className="mt-[clamp(0.28rem,0.18rem+0.42vmin,0.42rem)] text-center text-[clamp(0.52rem,2vmin,0.68rem)] font-normal leading-[1.12] tracking-[-0.015em] text-white">
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
      className={`relative mx-auto aspect-[1.08/1] w-full max-w-[min(90%,21rem)] iphone-page:max-w-[min(94%,23.5rem)] ${suisseIntl.className}`}
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
              y1="27"
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
              y2="73"
              stroke="white"
              strokeWidth="0.55"
              strokeLinecap="round"
              opacity="0.92"
            />
          </g>
        ))}
      </svg>

      <div className="relative grid h-full grid-cols-3 grid-rows-[1fr_auto_auto_1fr_auto] gap-x-[clamp(0.55rem,2.8vmin,1.05rem)] px-[2%]">
        {topAgents.map((label) => (
          <div key={`${label}-box-top`} className="flex items-end justify-center">
            <AgentSquare />
          </div>
        ))}

        {topAgents.map((label) => (
          <AgentName key={`${label}-name-top`} label={label} />
        ))}

        <div className="col-span-3 h-[clamp(0.75rem,2.8vmin,1.2rem)]" aria-hidden />

        {bottomAgents.map((label) => (
          <div key={`${label}-box-bottom`} className="flex items-start justify-center">
            <AgentSquare />
          </div>
        ))}

        {bottomAgents.map((label) => (
          <AgentName key={`${label}-name-bottom`} label={label} />
        ))}
      </div>
    </div>
  );
}
