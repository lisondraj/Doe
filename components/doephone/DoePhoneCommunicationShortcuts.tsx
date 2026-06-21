"use client";

import {
  DOEPHONE_COMMUNICATION_SHORTCUT_ROWS,
  DOEPHONE_COMMUNICATION_SHORTCUT_ROW_OFFSETS,
  DOEPHONE_SHORTCUT_KEY_GRADIENT,
  DOEPHONE_SHORTCUT_PILL_GRADIENT,
  type DoePhoneCommunicationShortcut,
} from "@/lib/doephone/communication-shortcuts";
import { inter } from "@/lib/home/fonts";

function ShortcutPill({ shortcut }: { shortcut: DoePhoneCommunicationShortcut }) {
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-[clamp(0.55rem,0.44rem+0.48vmin,0.78rem)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[3px] [transform:translateZ(0)] iphone-page:rounded-[clamp(0.68rem,0.52rem+0.62vmin,0.92rem)] iphone-page:backdrop-blur-[2px] ${
        shortcut.key
          ? "gap-[clamp(0.55rem,0.4rem+0.75vmin,0.85rem)] py-[clamp(0.38rem,0.28rem+0.5vmin,0.58rem)] pl-[clamp(0.38rem,0.28rem+0.5vmin,0.58rem)] pr-[clamp(1.05rem,0.8rem+1.25vmin,1.45rem)] iphone-page:gap-[clamp(0.72rem,0.5rem+1.1vmin,1.05rem)] iphone-page:py-[clamp(0.52rem,0.36rem+0.75vmin,0.78rem)] iphone-page:pl-[clamp(0.52rem,0.36rem+0.75vmin,0.78rem)] iphone-page:pr-[clamp(1.35rem,0.95rem+1.65vmin,1.85rem)]"
          : "px-[clamp(1.05rem,0.8rem+1.25vmin,1.45rem)] py-[clamp(0.62rem,0.45rem+0.8vmin,0.88rem)] iphone-page:px-[clamp(1.35rem,0.95rem+1.65vmin,1.85rem)] iphone-page:py-[clamp(0.78rem,0.55rem+1.05vmin,1.08rem)]"
      }`}
      style={{ background: DOEPHONE_SHORTCUT_PILL_GRADIENT }}
    >
      {shortcut.key ? (
        <span
          className={`flex h-[clamp(1.85rem,1.45rem+2.1vmin,2.55rem)] w-[clamp(2rem,1.55rem+2.25vmin,2.75rem)] shrink-0 items-center justify-center rounded-[0.24rem] text-[clamp(0.72rem,0.58rem+0.72vmin,0.95rem)] font-medium leading-none text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-[4px] iphone-page:h-[clamp(2.65rem,2rem+3.2vmin,3.45rem)] iphone-page:w-[clamp(2.9rem,2.2rem+3.45vmin,3.75rem)] iphone-page:rounded-[0.3rem] iphone-page:text-[clamp(1.02rem,0.82rem+1.05vmin,1.32rem)] iphone-page:backdrop-blur-[3px] ${inter.className}`}
          style={{ background: DOEPHONE_SHORTCUT_KEY_GRADIENT }}
        >
          {shortcut.key}
        </span>
      ) : null}
      <span
        className={`whitespace-nowrap text-[clamp(0.62rem,0.5rem+0.62vmin,0.82rem)] font-medium uppercase leading-none tracking-[0.13em] text-white/84 iphone-page:text-[clamp(0.88rem,0.68rem+1.05vmin,1.15rem)] iphone-page:text-white/86 iphone-page:tracking-[0.12em] ${inter.className}`}
      >
        {shortcut.label}
      </span>
    </div>
  );
}

/** Glass keyboard shortcuts — full-bleed over section backdrop, staggered rows. */
export function DoePhoneCommunicationShortcuts() {
  return (
    <div className="relative w-full overflow-hidden" aria-label="Communication shortcuts">
      <div className="flex flex-col gap-[clamp(0.82rem,0.62rem+1.05vmin,1.25rem)] iphone-page:gap-[clamp(1.15rem,0.85rem+1.45vmin,1.75rem)]">
        {DOEPHONE_COMMUNICATION_SHORTCUT_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex w-max max-w-none flex-nowrap items-center gap-[clamp(0.58rem,0.42rem+0.82vmin,0.92rem)] ${DOEPHONE_COMMUNICATION_SHORTCUT_ROW_OFFSETS[rowIndex]} iphone-page:gap-[clamp(0.82rem,0.58rem+1.15vmin,1.28rem)]`}
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
