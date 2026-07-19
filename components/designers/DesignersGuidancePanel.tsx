"use client";

import { useCallback, useState } from "react";

import {
  DESIGNERS_BRAND_COLORS,
} from "@/lib/designers/designers-brand-guidance";
import type { DesignersHeroGradientFlow } from "@/lib/designers/designers-hero-gradient-flows";
import { inter, lora, suisseIntl } from "@/lib/home/fonts";

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M7.25 3.75h5.5c.69 0 1.25.56 1.25 1.25v1.25H6v-1.25c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 6.25h8c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25H6c-.69 0-1.25-.56-1.25-1.25v-8.5c0-.69.56-1.25 1.25-1.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  const [copied, setCopied] = useState(false);
  const hexDisplay = hex.toUpperCase();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hexDisplay);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [hexDisplay]);

  return (
    <div className="designers-guidance-panel__swatch flex items-center gap-[0.65rem]">
      <span
        className="designers-guidance-panel__swatch-chip h-[1.65rem] w-[1.65rem] shrink-0 rounded-[0.32rem] border border-[rgba(245,230,208,0.16)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className={`m-0 text-[0.82rem] leading-[1.2] tracking-[-0.012em] text-[rgba(245,230,208,0.88)] ${inter.className}`}>
          {name}
        </p>
        <div className="mt-[0.12rem] flex items-center gap-[0.35rem]">
          <p className="m-0 font-mono text-[1rem] leading-[1.2] tracking-[0.02em] text-[rgba(245,230,208,0.78)]">
            {hexDisplay}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : `Copy ${hexDisplay}`}
            className="designers-guidance-panel__copy-button inline-flex h-[1.65rem] w-[1.65rem] shrink-0 items-center justify-center rounded-[0.28rem] border border-transparent text-[rgba(245,230,208,0.48)] transition-[background-color,border-color,color] duration-150 hover:border-[rgba(245,230,208,0.14)] hover:bg-[rgba(245,230,208,0.06)] hover:text-[rgba(245,230,208,0.88)]"
          >
            <ClipboardIcon className="h-[0.95rem] w-[0.95rem]" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Top-left on-page guidance — matches welcome modal styling. */
export function DesignersGuidancePanel({
  flows,
  flowIndex,
  onSelectFlow,
}: {
  flows: readonly DesignersHeroGradientFlow[];
  flowIndex: number;
  onSelectFlow: (index: number) => void;
}) {
  return (
    <aside
      className="designers-guidance-panel pointer-events-auto absolute left-[clamp(1rem,1.75vw,1.5rem)] top-[clamp(1rem,1.75vw,1.5rem)] z-[150] flex w-[min(100%,22.5rem)] max-h-[calc(100%-clamp(2rem,3.5vw,3rem))] flex-col overflow-hidden rounded-[clamp(0.65rem,0.9vw,0.85rem)] border border-[rgba(245,230,208,0.18)] bg-[#1a1208] shadow-[0_24px_64px_rgba(26,18,8,0.42)]"
      aria-label="Designer guidance"
    >
      <div className="designers-guidance-panel__scroll overflow-y-auto overscroll-contain px-[clamp(1.1rem,1.45vw,1.35rem)] py-[clamp(1.1rem,1.45vw,1.35rem)]">
        <p
          className={`designers-guidance-panel__logo m-0 text-left font-normal leading-none tracking-[-0.04em] text-[#f5e6d0] ${lora.className}`}
          style={{ fontSize: "clamp(2rem, 1.35rem + 1.8vw, 2.65rem)" }}
        >
          Doe
        </p>
        <p
          className={`designers-guidance-panel__label m-0 mt-[clamp(0.65rem,0.85vw,0.75rem)] text-left text-[0.68rem] font-medium uppercase leading-none tracking-[0.16em] text-[rgba(245,230,208,0.62)] ${suisseIntl.className}`}
        >
          Brand guidance
        </p>

        <section className="mt-[clamp(0.95rem,1.15vw,1.05rem)]">
          <h2
            className={`m-0 text-left text-[0.68rem] font-medium uppercase leading-none tracking-[0.14em] text-[rgba(245,230,208,0.48)] ${suisseIntl.className}`}
          >
            Core palette
          </h2>
          <div className="mt-[0.65rem] flex flex-col gap-[0.55rem]">
            {DESIGNERS_BRAND_COLORS.map((entry) => (
              <ColorSwatch key={entry.token} name={entry.name} hex={entry.hex} />
            ))}
          </div>
        </section>

        <section className="mt-[clamp(0.95rem,1.15vw,1.05rem)]">
          <h2
            className={`m-0 text-left text-[0.68rem] font-medium uppercase leading-none tracking-[0.14em] text-[rgba(245,230,208,0.48)] ${suisseIntl.className}`}
          >
            Hero gradient
          </h2>
          <div className="mt-[0.65rem] flex flex-col gap-[0.4rem]">
            {flows.map((entry, index) => {
              const isActive = index === flowIndex;

              return (
                <button
                  key={entry.label}
                  type="button"
                  onClick={() => onSelectFlow(index)}
                  aria-pressed={isActive}
                  className={`designers-guidance-panel__flow-button inline-flex min-h-[2.35rem] w-full items-center justify-center rounded-[0.45rem] border px-[0.95rem] text-[0.92rem] font-normal leading-none tracking-[-0.014em] transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.99] ${suisseIntl.className} ${
                    isActive
                      ? "border-[rgba(26,18,8,0.1)] bg-white text-[#1a1208] hover:bg-[#f7f7f5]"
                      : "border-[rgba(245,230,208,0.14)] bg-[rgba(245,230,208,0.06)] text-[rgba(245,230,208,0.88)] hover:border-[rgba(245,230,208,0.22)] hover:bg-[rgba(245,230,208,0.1)] hover:text-[#f5e6d0]"
                  }`}
                >
                  {entry.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}
