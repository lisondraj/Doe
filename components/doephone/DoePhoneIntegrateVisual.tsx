"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";
import type { ReactNode } from "react";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const MUTED = "#9CA3AF";
const TILE_RADIUS = "rounded-[clamp(0.55rem,1.65vmin,0.68rem)]";
const TILE_HEIGHT = "clamp(2.05rem,6.35vmin,2.55rem)";
const TILE_PAD_X = "clamp(0.62rem,1.9vmin,0.78rem)";
const TILE_GAP = "clamp(0.38rem,1.15vmin,0.48rem)";
const LABEL_SIZE = "clamp(0.72rem,2.15vmin,0.86rem)";
const ICON_BOX = "clamp(1.28rem,3.95vmin,1.58rem)";

type TileIconKind = "epic" | "cerner" | "athena" | "uptodate" | "dax" | "evidence";

type IntegrationTile = {
  name: string;
  icon: TileIconKind;
};

/** Two rows × three columns — six integration tiles in a square mosaic. */
const INTEGRATION_TILES: readonly IntegrationTile[] = [
  { name: "Epic", icon: "epic" },
  { name: "Cerner", icon: "cerner" },
  { name: "Athena", icon: "athena" },
  { name: "DAX Copilot", icon: "dax" },
  { name: "UpToDate", icon: "uptodate" },
  { name: "OpenEvidence", icon: "evidence" },
];

const ADD_BADGE_SIZE = "clamp(2.05rem,6.35vmin,2.55rem)";
const ADD_BADGE_OFFSET = "clamp(-0.42rem,-1.28vmin,-0.52rem)";

function AddIntegrationBadge() {
  return (
    <span
      className="pointer-events-none absolute flex items-center justify-center rounded-full backdrop-blur-[10px] iphone-page:backdrop-blur-[8px] [transform:translateZ(0)]"
      style={{
        bottom: ADD_BADGE_OFFSET,
        right: ADD_BADGE_OFFSET,
        width: ADD_BADGE_SIZE,
        height: ADD_BADGE_SIZE,
        background: "rgba(255, 255, 255, 0.42)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.62)",
      }}
      aria-hidden
    >
      <span
        className="font-light leading-none"
        style={{
          color: DOE_ORANGE,
          fontSize: "clamp(1.35rem,4.15vmin,1.65rem)",
          marginTop: "-0.06em",
        }}
      >
        +
      </span>
    </span>
  );
}

function TileIcon({ kind }: { kind: TileIconKind }) {
  const sw = 1.25;
  const cap = "round" as const;
  const join = "round" as const;

  const icons: Record<TileIconKind, ReactNode> = {
    epic: (
      <>
        <rect x="3.5" y="4" width="13" height="12" rx="1.4" stroke={DOE_ORANGE} strokeWidth={sw} />
        <path d="M6.5 8h7M6.5 10.5h7M6.5 13h4.5" stroke={MUTED} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    cerner: (
      <>
        <circle cx="10" cy="10" r="6.25" stroke={DOE_ORANGE} strokeWidth={sw} />
        <path d="M6.5 10h7M10 6.5v7" stroke={MUTED} strokeWidth={sw * 0.95} strokeLinecap={cap} />
      </>
    ),
    athena: (
      <>
        <path d="M10 3.5l5.5 11h-11L10 3.5z" stroke={DOE_ORANGE} strokeWidth={sw} strokeLinejoin={join} />
        <path d="M7.5 12.5h5" stroke={MUTED} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    uptodate: (
      <>
        <path d="M5 5.5h10v9H5z" stroke={DOE_ORANGE} strokeWidth={sw} strokeLinejoin={join} />
        <path d="M7.5 8.5h5M7.5 11h3.5" stroke={MUTED} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    dax: (
      <>
        <path
          d="M4.5 14V6.5l5.5-2.5 5.5 2.5V14"
          stroke={DOE_ORANGE}
          strokeWidth={sw}
          strokeLinejoin={join}
        />
        <circle cx="10" cy="10.5" r="2.1" stroke={MUTED} strokeWidth={sw * 0.95} />
        <path d="M10 8.8v3.4M8.6 10.5h2.8" stroke={MUTED} strokeWidth={sw * 0.85} strokeLinecap={cap} />
      </>
    ),
    evidence: (
      <>
        <circle cx="9.5" cy="9.5" r="5.25" stroke={DOE_ORANGE} strokeWidth={sw} />
        <path d="M14.5 14.5l3 3" stroke={MUTED} strokeWidth={sw * 0.95} strokeLinecap={cap} />
      </>
    ),
  };

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[clamp(0.38rem,1.15vmin,0.48rem)]"
      style={{
        width: ICON_BOX,
        height: ICON_BOX,
        background: "rgba(210, 119, 76, 0.08)",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 20 20" fill="none" style={{ width: "68%", height: "68%" }}>
        {icons[kind]}
      </svg>
    </span>
  );
}

function IntegrationTileCard({ name, icon }: IntegrationTile) {
  return (
    <div
      className={`relative flex items-center overflow-visible border bg-white shadow-[0_8px_24px_rgba(30,52,58,0.12)] ${TILE_RADIUS}`}
      style={{
        height: TILE_HEIGHT,
        paddingInline: TILE_PAD_X,
        gap: "clamp(0.42rem,1.28vmin,0.55rem)",
        borderColor: DIVIDER,
      }}
    >
      <TileIcon kind={icon} />
      <span className="truncate font-medium leading-none" style={{ color: INK, fontSize: LABEL_SIZE }}>
        {name}
      </span>
      <AddIntegrationBadge />
    </div>
  );
}

/** Square mosaic of EMR, AI, and clinic app integrations — Integrate carousel slide. */
export function DoePhoneIntegrateVisual() {
  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div
        className="grid aspect-square w-[min(88%,20rem)] overflow-visible"
        style={{
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gridTemplateRows: "repeat(2, minmax(0, 1fr))",
          gap: TILE_GAP,
        }}
      >
        {INTEGRATION_TILES.map((tile) => (
          <IntegrationTileCard key={tile.name} {...tile} />
        ))}
      </div>
    </div>
  );
}
