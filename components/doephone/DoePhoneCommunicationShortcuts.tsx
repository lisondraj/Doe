"use client";

import {
  DOEPHONE_COMMUNICATION_SHORTCUT_PANEL_GRADIENT,
  DOEPHONE_COMMUNICATION_SHORTCUT_ROWS,
  DOEPHONE_COMMUNICATION_SHORTCUT_ROW_OFFSETS,
  type DoePhoneCommunicationShortcut,
} from "@/lib/doephone/communication-shortcuts";
import { HERO_CAROUSEL_GRAIN_BG } from "@/lib/hero-carousel-grain";
import { inter } from "@/lib/home/fonts";

function ShortcutPill({ shortcut }: { shortcut: DoePhoneCommunicationShortcut }) {
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-full border border-white/28 bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_10px_28px_rgba(62,28,12,0.16)] backdrop-blur-[10px] ${
        shortcut.key
          ? "gap-[0.55rem] py-[0.34rem] pl-[0.34rem] pr-[0.95rem] iphone-page:gap-[0.5rem] iphone-page:py-[0.32rem] iphone-page:pl-[0.32rem] iphone-page:pr-[0.88rem]"
          : "px-[0.95rem] py-[0.55rem] iphone-page:px-[0.88rem] iphone-page:py-[0.52rem]"
      }`}
    >
      {shortcut.key ? (
        <span
          className={`flex h-[1.65rem] w-[1.65rem] shrink-0 items-center justify-center rounded-[0.42rem] bg-white text-[0.68rem] font-medium leading-none text-[#1E343A] iphone-page:h-[1.55rem] iphone-page:w-[1.55rem] iphone-page:text-[0.64rem] ${inter.className}`}
        >
          {shortcut.key}
        </span>
      ) : null}
      <span
        className={`whitespace-nowrap text-[0.58rem] font-medium uppercase leading-none tracking-[0.14em] text-white/95 iphone-page:text-[0.54rem] iphone-page:tracking-[0.13em] ${inter.className}`}
      >
        {shortcut.label}
      </span>
    </div>
  );
}

/** Glass keyboard shortcut grid — Doe orange panel, staggered rows. */
export function DoePhoneCommunicationShortcuts() {
  return (
    <div
      className="relative w-[min(100%,21.5rem)] overflow-hidden rounded-[clamp(1.05rem,0.9rem+0.7vmin,1.35rem)] iphone-page:w-[min(100%,19.75rem)]"
      aria-label="Communication shortcuts"
    >
      <div className="absolute inset-0" style={{ background: DOEPHONE_COMMUNICATION_SHORTCUT_PANEL_GRADIENT }} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.42] mix-blend-overlay"
        style={{
          backgroundImage: HERO_CAROUSEL_GRAIN_BG,
          backgroundSize: "180px 180px",
        }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-[0.82rem] overflow-hidden py-[clamp(1.35rem,1rem+1.4vmin,1.85rem)] iphone-page:gap-[0.74rem] iphone-page:py-[clamp(1.2rem,0.9rem+1.2vmin,1.65rem)]">
        {DOEPHONE_COMMUNICATION_SHORTCUT_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex w-max max-w-none flex-nowrap items-center gap-[0.58rem] ${DOEPHONE_COMMUNICATION_SHORTCUT_ROW_OFFSETS[rowIndex]} iphone-page:gap-[0.52rem]`}
          >
            {row.map((shortcut) => (
              <ShortcutPill key={`${shortcut.key ?? "none"}-${shortcut.label}`} shortcut={shortcut} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
