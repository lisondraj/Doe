"use client";

import {
  LINKEDIN2_GRID_BORDER,
  LINKEDIN2_GRID_FILL,
  LINKEDIN2_GRID_LINE_MAIN,
  LINKEDIN2_GRID_LINE_SOFT,
} from "@/lib/linkedin/linkedin2-colors";

/** Static 3D block grid — adapted from `DoePhoneCommIntelGrid` beige tiles. */
const BLOCK_BORDER = LINKEDIN2_GRID_BORDER;
const BLOCK_FILL = LINKEDIN2_GRID_FILL;
const LINE_MAIN = LINKEDIN2_GRID_LINE_MAIN;
const LINE_SOFT = LINKEDIN2_GRID_LINE_SOFT;

const CELL_H = 68;
const GAP = 7;
const RADIUS = 5;

function BlockLineArt() {
  const offsets = [-90, -72, -54, -36, -18, 0, 18, 36, 54, 72, 90, 108, 126, 144, 162];

  return (
    <svg viewBox="0 0 100 160" preserveAspectRatio="none" fill="none" className="absolute inset-0 h-full w-full" aria-hidden>
      {offsets.map((offset, index) => (
        <line
          key={offset}
          x1={offset}
          y1={0}
          x2={offset + 160}
          y2={160}
          stroke={index % 3 === 1 ? LINE_MAIN : LINE_SOFT}
          strokeWidth={index % 3 === 1 ? 0.85 : 0.7}
        />
      ))}
    </svg>
  );
}

function BlockCell({ withArt = false }: { withArt?: boolean }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        height: CELL_H,
        minHeight: CELL_H,
        borderRadius: RADIUS,
        background: BLOCK_FILL,
        border: `1px solid ${BLOCK_BORDER}`,
      }}
    >
      {withArt ? <BlockLineArt /> : null}
    </div>
  );
}

const COL_PATTERNS = [
  [true, false, true, false, true, false, true, false, true],
  [false, true, false, true, false, true, false, true, false],
  [true, false, true, false, true, false, true, false, true],
] as const;

/** Perspective block mosaic for /linkedin2 — covers full banner frame. */
export function LinkedIn2BlockGrid() {
  return (
    <div className="linkedin2-page__block-grid" aria-hidden>
      <div className="linkedin2-page__block-grid-stage">
        {COL_PATTERNS.map((pattern, columnIndex) => (
          <div key={columnIndex} className="flex flex-col" style={{ gap: GAP }}>
            {pattern.map((withArt, rowIndex) => (
              <BlockCell key={rowIndex} withArt={withArt} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
