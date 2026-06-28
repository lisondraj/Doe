"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { CAROUSEL_MENU_UI } from "@/lib/doephone/carousel-menu-visual-styles";
import type { ReactNode } from "react";

const { ink: INK, accent: DOE_ORANGE, divider: DIVIDER } = CAROUSEL_MENU_UI;

const TILE_RADIUS = "rounded-[clamp(0.62rem,1.88vmin,0.78rem)]";
const TILE_PAD_X = "clamp(0.68rem,2.1vmin,0.86rem)";
const TILE_PAD_Y = "clamp(0.48rem,1.45vmin,0.58rem)";
const TILE_GAP = "clamp(0.48rem,1.45vmin,0.58rem)";
const LABEL_SIZE = "clamp(0.82rem,2.5vmin,0.98rem)";
const ICON_SIZE = "clamp(1.12rem,3.45vmin,1.35rem)";

type TileIconKind =
  | "telus"
  | "oscar"
  | "accuro"
  | "chr"
  | "epic"
  | "cerner"
  | "evidence"
  | "uptodate"
  | "dax"
  | "fathom"
  | "nuance"
  | "abridge"
  | "ambience"
  | "fhir"
  | "slack"
  | "zoom"
  | "jane"
  | "meditech"
  | "athena"
  | "redox"
  | "teams"
  | "outlook"
  | "doximity"
  | "surescripts"
  | "avaros"
  | "pssuite"
  | "availity"
  | "stripe"
  | "modmed"
  | "canvas";

type IntegrationTile = {
  name: string;
  icon: TileIconKind;
};

/** Ten rows × three tiles — first and last rows preserved from earlier layout. */
const INTEGRATION_ROWS: readonly IntegrationTile[][] = [
  [
    { name: "TELUS EMR", icon: "telus" },
    { name: "OSCAR", icon: "oscar" },
    { name: "Accuro", icon: "accuro" },
  ],
  [
    { name: "CHR", icon: "chr" },
    { name: "Epic", icon: "epic" },
    { name: "Cerner", icon: "cerner" },
  ],
  [
    { name: "OpenEvidence", icon: "evidence" },
    { name: "UpToDate", icon: "uptodate" },
    { name: "DAX Copilot", icon: "dax" },
  ],
  [
    { name: "Abridge", icon: "abridge" },
    { name: "Ambience", icon: "ambience" },
    { name: "Fathom", icon: "fathom" },
  ],
  [
    { name: "Nuance", icon: "nuance" },
    { name: "FHIR", icon: "fhir" },
    { name: "Slack", icon: "slack" },
  ],
  [
    { name: "Zoom", icon: "zoom" },
    { name: "Jane App", icon: "jane" },
    { name: "Meditech", icon: "meditech" },
  ],
  [
    { name: "Athena", icon: "athena" },
    { name: "Redox", icon: "redox" },
    { name: "Teams", icon: "teams" },
  ],
  [
    { name: "Outlook", icon: "outlook" },
    { name: "Avaros", icon: "avaros" },
    { name: "Doximity", icon: "doximity" },
  ],
  [
    { name: "Surescripts", icon: "surescripts" },
    { name: "ModMed", icon: "modmed" },
    { name: "Canvas", icon: "canvas" },
  ],
  [
    { name: "PS Suite", icon: "pssuite" },
    { name: "Availity", icon: "availity" },
    { name: "Stripe", icon: "stripe" },
  ],
];

/** Desktop integrations — one flank tile per side; center three rows stay unchanged. */
const DESKTOP_INTEGRATION_FLANKS: readonly { left: IntegrationTile; right: IntegrationTile }[] = [
  { left: { name: "Meditech", icon: "meditech" }, right: { name: "Canvas", icon: "canvas" } },
  { left: { name: "Jane App", icon: "jane" }, right: { name: "Redox", icon: "redox" } },
  { left: { name: "Slack", icon: "slack" }, right: { name: "Zoom", icon: "zoom" } },
  { left: { name: "Athena", icon: "athena" }, right: { name: "Teams", icon: "teams" } },
  { left: { name: "Outlook", icon: "outlook" }, right: { name: "Doximity", icon: "doximity" } },
  { left: { name: "Surescripts", icon: "surescripts" }, right: { name: "Avaros", icon: "avaros" } },
  { left: { name: "PS Suite", icon: "pssuite" }, right: { name: "Availity", icon: "availity" } },
  { left: { name: "Stripe", icon: "stripe" }, right: { name: "ModMed", icon: "modmed" } },
  { left: { name: "Nuance", icon: "nuance" }, right: { name: "FHIR", icon: "fhir" } },
  { left: { name: "Fathom", icon: "fathom" }, right: { name: "Ambience", icon: "ambience" } },
];

function TileIcon({ kind, size = ICON_SIZE }: { kind: TileIconKind; size?: string }) {
  const sw = 1.25;
  const cap = "round" as const;
  const join = "round" as const;
  const stroke = DOE_ORANGE;

  const icons: Record<TileIconKind, ReactNode> = {
    telus: (
      <>
        <path d="M6.5 5.5h7v9h-7z" stroke={stroke} strokeWidth={sw} strokeLinejoin={join} />
        <path d="M8.5 5.5V4M11.5 5.5V4" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
        <path d="M8.5 9h3M8.5 11.5h2" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    oscar: (
      <>
        <circle cx="10" cy="10" r="6.25" stroke={stroke} strokeWidth={sw} />
        <path
          d="M10 6.8c-1.8 0-3.2 1.5-3.2 3.2S8.2 13.2 10 13.2s3.2-1.5 3.2-3.2S11.8 6.8 10 6.8z"
          stroke={stroke}
          strokeWidth={sw * 0.95}
        />
      </>
    ),
    accuro: (
      <>
        <rect x="4.5" y="4" width="11" height="12" rx="1.4" stroke={stroke} strokeWidth={sw} />
        <path d="M7 8h6M7 10.5h4.5M7 13h5.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    chr: (
      <>
        <path d="M4.5 11.5c1.5-3.5 4-5 5.5-5s4 1.5 5.5 5" stroke={stroke} strokeWidth={sw} strokeLinecap={cap} />
        <path d="M7 14.5h6" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
        <circle cx="10" cy="7.5" r="1.5" stroke={stroke} strokeWidth={sw * 0.9} />
      </>
    ),
    epic: (
      <>
        <rect x="3.5" y="4" width="13" height="12" rx="1.4" stroke={stroke} strokeWidth={sw} />
        <path d="M6.5 8h7M6.5 10.5h7M6.5 13h4.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    cerner: (
      <>
        <circle cx="10" cy="10" r="6.25" stroke={stroke} strokeWidth={sw} />
        <path d="M6.5 10h7M10 6.5v7" stroke={stroke} strokeWidth={sw * 0.95} strokeLinecap={cap} />
      </>
    ),
    uptodate: (
      <>
        <path d="M5 5.5h10v9H5z" stroke={stroke} strokeWidth={sw} strokeLinejoin={join} />
        <path d="M7.5 8.5h5M7.5 11h3.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    dax: (
      <>
        <path d="M4.5 14V6.5l5.5-2.5 5.5 2.5V14" stroke={stroke} strokeWidth={sw} strokeLinejoin={join} />
        <circle cx="10" cy="10.5" r="2.1" stroke={stroke} strokeWidth={sw * 0.95} />
      </>
    ),
    fathom: (
      <>
        <path d="M5 14V6l5-2.5 5 2.5v8" stroke={stroke} strokeWidth={sw} strokeLinejoin={join} />
        <path d="M8 10h4" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    nuance: (
      <>
        <rect x="4.5" y="5" width="11" height="10" rx="1.4" stroke={stroke} strokeWidth={sw} />
        <path d="M7.5 9.5c1.2-1.2 3.8-1.2 5 0M7.5 12c1.2 1.2 3.8 1.2 5 0" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    abridge: (
      <>
        <path d="M4 10h2.5l1.5-3 1.5 6 1.5-4 1.5 4 1.5-6 1.5 3H16" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} strokeLinejoin={join} />
      </>
    ),
    ambience: (
      <>
        <rect x="7.5" y="4.5" width="5" height="8.5" rx="2.5" stroke={stroke} strokeWidth={sw} />
        <path d="M5 9.5v1.5a5 5 0 0010 0V9.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
        <path d="M10 15.5v1.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    fhir: (
      <>
        <path d="M5 6.5h10v7H5z" stroke={stroke} strokeWidth={sw} strokeLinejoin={join} />
        <path d="M8 9.5h4M8 12h2.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
        <circle cx="14.5" cy="8.5" r="1.4" fill={stroke} />
      </>
    ),
    evidence: (
      <>
        <circle cx="9.5" cy="9.5" r="5.25" stroke={stroke} strokeWidth={sw} />
        <path d="M14.5 14.5l3 3" stroke={stroke} strokeWidth={sw * 0.95} strokeLinecap={cap} />
      </>
    ),
    slack: (
      <>
        <rect x="4.5" y="9" width="3.5" height="3.5" rx="1" stroke={stroke} strokeWidth={sw * 0.95} />
        <rect x="9" y="4.5" width="3.5" height="3.5" rx="1" stroke={stroke} strokeWidth={sw * 0.95} />
        <rect x="12.5" y="9" width="3.5" height="3.5" rx="1" stroke={stroke} strokeWidth={sw * 0.95} />
        <rect x="9" y="12.5" width="3.5" height="3.5" rx="1" stroke={stroke} strokeWidth={sw * 0.95} />
      </>
    ),
    zoom: (
      <>
        <rect x="3.5" y="6" width="9.5" height="8" rx="1.5" stroke={stroke} strokeWidth={sw} />
        <path d="M13 9.5l3.5-2v7l-3.5-2" stroke={stroke} strokeWidth={sw * 0.95} strokeLinejoin={join} />
      </>
    ),
    jane: (
      <>
        <rect x="4" y="5" width="12" height="10" rx="1.5" stroke={stroke} strokeWidth={sw} />
        <path d="M7 8.5h6M7 11h4" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    meditech: (
      <>
        <path d="M5 15V5h10v10H5z" stroke={stroke} strokeWidth={sw} strokeLinejoin={join} />
        <path d="M8 8h4v4H8z" stroke={stroke} strokeWidth={sw * 0.9} strokeLinejoin={join} />
      </>
    ),
    athena: (
      <>
        <path d="M10 3.5l5.5 11h-11L10 3.5z" stroke={stroke} strokeWidth={sw} strokeLinejoin={join} />
        <path d="M7.5 12.5h5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    redox: (
      <>
        <path d="M4 10h8M8 6l4 4-4 4" stroke={stroke} strokeWidth={sw} strokeLinecap={cap} strokeLinejoin={join} />
        <circle cx="15" cy="10" r="2" stroke={stroke} strokeWidth={sw * 0.95} />
      </>
    ),
    teams: (
      <>
        <rect x="4" y="5" width="8" height="10" rx="1.2" stroke={stroke} strokeWidth={sw} />
        <path d="M12 8.5h3v6.5h-3z" stroke={stroke} strokeWidth={sw * 0.95} strokeLinejoin={join} />
        <circle cx="8" cy="9" r="1.5" stroke={stroke} strokeWidth={sw * 0.85} />
      </>
    ),
    outlook: (
      <>
        <rect x="4" y="6" width="12" height="9" rx="1.2" stroke={stroke} strokeWidth={sw} />
        <path d="M4 7.5l6 3.5 6-3.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinejoin={join} />
      </>
    ),
    doximity: (
      <>
        <circle cx="10" cy="8" r="3" stroke={stroke} strokeWidth={sw} />
        <path d="M5.5 15c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke={stroke} strokeWidth={sw * 0.95} strokeLinecap={cap} />
      </>
    ),
    surescripts: (
      <>
        <path d="M6 14l4-8 4 8" stroke={stroke} strokeWidth={sw} strokeLinecap={cap} strokeLinejoin={join} />
        <path d="M7.5 11.5h5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    avaros: (
      <>
        <rect x="5" y="4.5" width="10" height="11" rx="1.4" stroke={stroke} strokeWidth={sw} />
        <path d="M8 8h4M8 10.5h2.5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    pssuite: (
      <>
        <rect x="3.5" y="5" width="13" height="10" rx="1.2" stroke={stroke} strokeWidth={sw} />
        <path d="M6.5 8.5h7M6.5 11.5h5" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    availity: (
      <>
        <circle cx="10" cy="10" r="5.5" stroke={stroke} strokeWidth={sw} />
        <path d="M10 7v6M7 10h6" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    stripe: (
      <>
        <rect x="3.5" y="7" width="13" height="6" rx="1.5" stroke={stroke} strokeWidth={sw} />
        <path d="M3.5 9.5h13" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} />
      </>
    ),
    modmed: (
      <>
        <rect x="4.5" y="4" width="11" height="12" rx="1.4" stroke={stroke} strokeWidth={sw} />
        <path d="M7 14V6l3 4 3-4v8" stroke={stroke} strokeWidth={sw * 0.9} strokeLinecap={cap} strokeLinejoin={join} />
      </>
    ),
    canvas: (
      <>
        <rect x="4" y="5" width="12" height="10" rx="1.2" stroke={stroke} strokeWidth={sw} />
        <path d="M4 8h12M8 5v10" stroke={stroke} strokeWidth={sw * 0.85} strokeLinecap={cap} />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
      style={{ width: size, height: size }}
    >
      {icons[kind]}
    </svg>
  );
}

function IntegrationTileCard({
  name,
  icon,
  sizes,
}: IntegrationTile & {
  sizes: {
    tileRadius: string;
    tilePadX: string;
    tilePadY: string;
    labelSize: string;
    iconSize: string;
  };
}) {
  return (
    <div
      className={`inline-flex w-fit max-w-full shrink-0 items-center border bg-white shadow-[0_8px_24px_rgba(30,52,58,0.12)] ${sizes.tileRadius}`}
      style={{
        padding: `${sizes.tilePadY} ${sizes.tilePadX}`,
        gap: "clamp(0.32rem,0.98vmin,0.42rem)",
        borderColor: DIVIDER,
      }}
    >
      <TileIcon kind={icon} size={sizes.iconSize} />
      <span className="whitespace-nowrap font-medium leading-none" style={{ color: INK, fontSize: sizes.labelSize }}>
        {name}
      </span>
    </div>
  );
}

function IntegrationRow({
  tiles,
  sizes,
  gap,
}: {
  tiles: IntegrationTile[];
  sizes: {
    tileRadius: string;
    tilePadX: string;
    tilePadY: string;
    labelSize: string;
    iconSize: string;
  };
  gap: string;
}) {
  return (
    <div className="flex w-full flex-nowrap items-center justify-center" style={{ gap }}>
      {tiles.map((tile) => (
        <IntegrationTileCard key={tile.name} {...tile} sizes={sizes} />
      ))}
    </div>
  );
}

function IntegrationRowWithFlanks({
  centerTiles,
  left,
  right,
  sizes,
  gap,
  rowIndex,
}: {
  centerTiles: IntegrationTile[];
  left: IntegrationTile;
  right: IntegrationTile;
  sizes: {
    tileRadius: string;
    tilePadX: string;
    tilePadY: string;
    labelSize: string;
    iconSize: string;
  };
  gap: string;
  rowIndex: number;
}) {
  return (
    <div className="flex w-full justify-center">
      <div className="relative flex flex-nowrap items-center justify-center" style={{ gap }}>
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ right: `calc(100% + ${gap})` }}
        >
          <IntegrationTileCard key={`${rowIndex}-left`} {...left} sizes={sizes} />
        </div>
        {centerTiles.map((tile) => (
          <IntegrationTileCard key={tile.name} {...tile} sizes={sizes} />
        ))}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `calc(100% + ${gap})` }}
        >
          <IntegrationTileCard key={`${rowIndex}-right`} {...right} sizes={sizes} />
        </div>
      </div>
    </div>
  );
}

const PHONE_INTEGRATION_SIZES = {
  tileRadius: TILE_RADIUS,
  tilePadX: TILE_PAD_X,
  tilePadY: TILE_PAD_Y,
  tileGap: TILE_GAP,
  labelSize: LABEL_SIZE,
  iconSize: ICON_SIZE,
  maxWidth: "min(99%,24rem)",
} as const;

const DESKTOP_INTEGRATION_SIZES = {
  tileRadius: "rounded-[clamp(0.72rem,0.88vw,0.92rem)]",
  tilePadX: "clamp(0.92rem,1.12vw,1.2rem)",
  tilePadY: "clamp(0.65rem,0.82vw,0.88rem)",
  tileGap: "clamp(0.68rem,0.85vw,0.92rem)",
  labelSize: "clamp(1.02rem,1.22vw,1.28rem)",
  iconSize: "clamp(1.38rem,1.68vw,1.78rem)",
  maxWidth: "min(100%, 40rem)",
  outerMaxWidth: "min(100%, 58rem)",
} as const;

/** Integration mosaic — Integrate carousel slide. */
export function DoePhoneIntegrateVisual({ layout = "phone" }: { layout?: "phone" | "desktop" }) {
  const isDesktop = layout === "desktop";
  const sizes = isDesktop ? DESKTOP_INTEGRATION_SIZES : PHONE_INTEGRATION_SIZES;
  const tileSizes = {
    tileRadius: sizes.tileRadius,
    tilePadX: sizes.tilePadX,
    tilePadY: sizes.tilePadY,
    labelSize: sizes.labelSize,
    iconSize: sizes.iconSize,
  };
  const outerMaxWidth = isDesktop ? DESKTOP_INTEGRATION_SIZES.outerMaxWidth : sizes.maxWidth;

  return (
    <div
      className={`mx-auto flex h-full w-full items-center justify-center ${suisseIntl.className}`}
      style={{ maxWidth: isDesktop ? outerMaxWidth : CAROUSEL_MENU_UI.maxWidthPhone }}
      aria-hidden
    >
      <div className="flex w-full flex-col" style={{ gap: sizes.tileGap, maxWidth: outerMaxWidth }}>
        {INTEGRATION_ROWS.map((row, index) =>
          isDesktop ? (
            <IntegrationRowWithFlanks
              key={`row-${index}`}
              rowIndex={index}
              centerTiles={row}
              left={DESKTOP_INTEGRATION_FLANKS[index]!.left}
              right={DESKTOP_INTEGRATION_FLANKS[index]!.right}
              sizes={tileSizes}
              gap={sizes.tileGap}
            />
          ) : (
            <IntegrationRow key={`row-${index}`} tiles={row} sizes={tileSizes} gap={sizes.tileGap} />
          ),
        )}
      </div>
    </div>
  );
}
