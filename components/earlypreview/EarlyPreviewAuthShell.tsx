"use client";

import { AuditCard } from "@/remotion/video2/Section2Permissions";
import { ShadowsContext } from "@/remotion/video1/ui";
import { dmSans, inter, p22Mackinac } from "@/lib/home/fonts";
import { EarlyPreviewProductFilmFrame, type EarlyPreviewProductFilm } from "@/components/earlypreview/EarlyPreviewProductFilmFrame";
import { ProductShell, type ProductRailKey } from "@/components/earlypreview/EarlyPreviewProductShell";

/** The shell's size, the product's own 1440×900, and the paper the rail leaves (1364×876). */
const SHELL = { w: 1440, h: 900 };
const PAPER = { w: SHELL.w - 64 - 12, h: SHELL.h - 24 };
/** Tall enough for all five rows (the last ends 450 px down) with the same 26 px under them as the title has above. */
const CARD = { w: 820, h: 476, scale: 1.15 };
/** The card's place in the paper, from its top left, so the shell's top-left corner is the one the box shows. */
const CARD_AT = { x: 48, y: 48 };
/** Past the Activity card's new-row insert, so every row sits in its place and none overlaps another. */
const CARD_FRAME = 720;

/**
 * The authentication box: the Activity card in the product's outer shell (the ink rail, and the paper panel with its
 * rounded corners), in the paper's top left corner. No shadows, as everywhere in the section.
 */
export function EarlyPreviewAuthShell() {
  return (
    <div className={`${dmSans.variable} ${inter.className} ${p22Mackinac.className}`} style={{ width: SHELL.w, height: SHELL.h }}>
      <ShadowsContext.Provider value={false}>
        <ProductShell active="integrations">
          <div
            style={{
              position: "absolute",
              left: CARD_AT.x,
              top: CARD_AT.y,
              width: CARD.w,
              height: CARD.h,
              transform: `scale(${CARD.scale})`,
              transformOrigin: "0 0",
            }}
          >
            <AuditCard frame={CARD_FRAME} height={CARD.h} />
          </div>
        </ProductShell>
      </ShadowsContext.Provider>
    </div>
  );
}

/** The films' own frame, in the product's outer shell: the ink rail with its nav icons, and the paper panel. */
const FILM = { w: 1920, h: 1080 };
/** Cover the paper with the film, so the film runs off its edges and leaves no paper showing. */
const FILM_SCALE = Math.max(PAPER.w / FILM.w, PAPER.h / FILM.h);

/** `anchor: "start"` holds the film's left edge to the paper's, so the film's left-hand UI is never the part that is cut. */
export function EarlyPreviewFilmShell({
  film,
  frame,
  active,
  anchor = "center",
  focus,
  inset,
}: {
  film: EarlyPreviewProductFilm;
  frame: number;
  active: ProductRailKey;
  anchor?: "center" | "start";
  /** A rectangle of the 1920×1080 film to cover the paper with, so a film that draws its own window shows only that window's page. */
  focus?: { x: number; y: number; w: number; h: number };
  /** Keeps the film's page this far (in artboard px) off the rail and the top edge, as the other boxes' pages sit. */
  inset?: { x: number; y: number };
}) {
  const ix = inset?.x ?? 0;
  const iy = inset?.y ?? 0;
  const area = { w: PAPER.w - ix, h: PAPER.h - iy };
  const scale = focus ? Math.max(area.w / focus.w, area.h / focus.h) : FILM_SCALE;
  const left = focus ? (area.w - focus.w * scale) / 2 - focus.x * scale : anchor === "start" ? 0 : (area.w - FILM.w * scale) / 2;
  const top = focus ? (area.h - focus.h * scale) / 2 - focus.y * scale : (area.h - FILM.h * scale) / 2;
  return (
    <div className={`${dmSans.variable} ${inter.className} ${p22Mackinac.className}`} style={{ width: SHELL.w, height: SHELL.h }}>
      <ShadowsContext.Provider value={false}>
        <ProductShell active={active}>
          <div style={{ position: "absolute", left: ix, top: iy, width: area.w, height: area.h, overflow: "hidden" }}>
            <div style={{ position: "absolute", left, top, width: FILM.w, height: FILM.h, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
              <EarlyPreviewProductFilmFrame film={film} frame={frame} />
            </div>
          </div>
        </ProductShell>
      </ShadowsContext.Provider>
    </div>
  );
}
