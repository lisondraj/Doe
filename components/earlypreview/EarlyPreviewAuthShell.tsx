"use client";

import { ShadowsContext, AppShell } from "@/remotion/video1/ui";
import { AuditCard } from "@/remotion/video2/Section2Permissions";
import { dmSans, inter, p22Mackinac } from "@/lib/home/fonts";

/** The shell's size, the product's own 1440×900, and the Activity card's inner paper, which its rail leaves. */
const SHELL = { w: 1440, h: 900 };
const RAIL = 64;
const PAPER = { w: SHELL.w - RAIL - 12, h: SHELL.h - 24 };
const CARD = { w: 820, h: 420, scale: 1.15 };
/** The card's place in the paper, from its top left, so the shell's top-left corner is the one the box shows. */
const CARD_AT = { x: 48, y: 48 };
/** The permissions film's frame 660: the Activity card in its finished state. */
const CARD_FRAME = 660;

/**
 * The authentication box: the Activity card in the same outer shell as the product (the ink rail, and the paper panel
 * with its rounded corners), in the paper's top left corner. No shadows, as everywhere in the section.
 */
export function EarlyPreviewAuthShell() {
  return (
    <div className={`${dmSans.variable} ${inter.className} ${p22Mackinac.className}`} style={{ width: SHELL.w, height: SHELL.h }}>
      <ShadowsContext.Provider value={false}>
        <AppShell active={4} width={SHELL.w} height={SHELL.h}>
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
          <AuditCard frame={CARD_FRAME} />
        </div>
        </AppShell>
      </ShadowsContext.Provider>
    </div>
  );
}
