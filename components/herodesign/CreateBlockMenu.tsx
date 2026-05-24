"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { suisseIntl } from "@/lib/home/fonts";

const ICON_BOX =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-neutral-300";

const SCROLL_STEP = 72;

type Panel = "presets" | "connectors";

type MenuRow = {
  label: string;
  sub: string;
  shortcut: string;
  icon: ReactNode;
};

const PRESET_AGENTS: MenuRow[] = [
  {
    label: "Front Desk",
    sub: "Patient intake and scheduling",
    shortcut: "F",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect x="3" y="2.5" width="8" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <path d="M5.5 5h3M5.5 7h3M5.5 9h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Scribe",
    sub: "Visit documentation and notes",
    shortcut: "S",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M4 2.5h3.5L10 5v6.5a1 1 0 01-1 1H4a1 1 0 01-1-1V3.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.1" />
        <path d="M6.5 2.5V5H9" stroke="currentColor" strokeWidth="1.1" />
        <path d="M5 8.5l1.5 1.5L9 7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Billing",
    sub: "Coding and claims assistance",
    shortcut: "B",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect x="2.5" y="3.5" width="9" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <path d="M5 6.5h4M5 8.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="9.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Triage Nurse",
    sub: "Symptom routing and urgency checks",
    shortcut: "T",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M7 2.5v9M4.5 5.5h5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    label: "Care Coordinator",
    sub: "Follow-ups and care plan handoffs",
    shortcut: "C",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="4.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="9.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M2.5 11c0-1.5 1.5-2.5 2-2.5s2 .5 2.5 2M7 11c0-1.5 1-2.5 2.5-2.5S12 9.5 12 11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Prior Auth",
    sub: "Authorization requests and status",
    shortcut: "P",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect x="3" y="2.5" width="8" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <path d="M5.5 7l1.5 1.5L8.5 6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
];

const CONNECTORS: MenuRow[] = [
  {
    label: "Heidi",
    sub: "Clinical documentation assistant",
    shortcut: "H",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.1" />
        <path d="M3.5 12c0-2.2 1.6-3.5 3.5-3.5S10.5 9.8 10.5 12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Open Evidence",
    sub: "Evidence-based clinical references",
    shortcut: "O",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M4 2.5h4l2.5 2.5V11a1 1 0 01-1 1H4a1 1 0 01-1-1V3.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.1" />
        <path d="M8 2.5V5H10.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M5 7h4M5 9h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "EPIC",
    sub: "Connect to Epic EHR workflows",
    shortcut: "E",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect x="2.5" y="3" width="9" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
        <path d="M5 6h4M5 8h4M5 10h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Cerner",
    sub: "Oracle Health EHR integration",
    shortcut: "N",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M4.5 7h5M7 4.5v5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Athena",
    sub: "Ambulatory EHR and billing",
    shortcut: "A",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M7 2.5l4.5 9h-9L7 2.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M5.5 9h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Redox",
    sub: "Healthcare data exchange network",
    shortcut: "R",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-0.5 pb-1 text-[11px] font-normal tracking-wide text-neutral-500">
      {children}
    </p>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19v4M8 23h8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ChevronIcon({ up }: { up?: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={up ? "rotate-180" : ""}
    >
      <path
        d="M2 3.5L5 6.5L8 3.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuRowButton({ row }: { row: MenuRow }) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.07]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <span className={ICON_BOX}>{row.icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-normal leading-tight text-neutral-100">
          {row.label}
        </span>
        <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 group-hover:grid-rows-[1fr]">
          <span className="overflow-hidden">
            <span className="mt-0.5 block truncate text-[11px] leading-tight text-neutral-500">
              {row.sub}
            </span>
          </span>
        </span>
      </span>
      <span className="shrink-0 text-[11px] tabular-nums text-neutral-500">{row.shortcut}</span>
    </button>
  );
}

function CustomAgentButton() {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-left transition-colors hover:bg-white/[0.07]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <span className={ICON_BOX}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M7 3.5v7M3.5 7h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="min-w-0 flex-1 text-[13px] font-normal leading-tight text-neutral-100">
        Agent
      </span>
    </button>
  );
}

function PanelTabs({ panel, onChange }: { panel: Panel; onChange: (p: Panel) => void }) {
  const tabs: { id: Panel; label: string }[] = [
    { id: "presets", label: "Presets" },
    { id: "connectors", label: "Connectors" },
  ];

  return (
    <div className="flex gap-1 rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`flex-1 rounded-md px-2 py-1.5 text-[12px] font-normal transition-colors ${
            panel === tab.id
              ? "bg-white/[0.08] text-neutral-100"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ScrollableList({ rows, panelKey }: { rows: MenuRow[]; panelKey: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(false);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanUp(el.scrollTop > 2);
    setCanDown(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    updateScroll();
  }, [panelKey, rows, updateScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    const ro = new ResizeObserver(updateScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      ro.disconnect();
    };
  }, [updateScroll]);

  const scrollBy = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ top: dir * SCROLL_STEP, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-0 flex-1">
      {canUp ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7 bg-gradient-to-b from-[#121212] via-[#121212]/90 to-transparent"
            aria-hidden
          />
          <button
            type="button"
            aria-label="Scroll up"
            className="absolute left-1/2 top-0.5 z-20 flex h-5 w-7 -translate-x-1/2 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-300"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => scrollBy(-1)}
          >
            <ChevronIcon up />
          </button>
        </>
      ) : null}

      {canDown ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-9 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent"
            aria-hidden
          />
          <button
            type="button"
            aria-label="Scroll down"
            className="absolute bottom-1.5 left-1/2 z-20 flex h-5 w-7 -translate-x-1/2 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-300"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => scrollBy(1)}
          >
            <ChevronIcon />
          </button>
        </>
      ) : null}

      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingBottom: canDown ? 44 : 12 }}
      >
        <div className="space-y-0.5">
          {rows.map((row) => (
            <MenuRowButton key={row.label} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const CREATE_BLOCK_MENU_W = 268;
export const CREATE_BLOCK_MENU_H = 340;

export function CreateBlockMenu({
  isNew,
  isSource,
  isTarget,
  isSelected,
}: {
  isNew?: boolean;
  isSource?: boolean;
  isTarget?: boolean;
  isSelected?: boolean;
}) {
  const [panel, setPanel] = useState<Panel>("presets");
  const rows = panel === "presets" ? PRESET_AGENTS : CONNECTORS;

  return (
    <div
      className={`relative flex h-full w-full flex-col rounded-xl border bg-[#121212] shadow-[0_8px_32px_rgba(0,0,0,0.28),0_1px_0_rgba(255,255,255,0.04)_inset] transition-[border-color] duration-150 ${suisseIntl.className} ${
        isNew ? "hd-box-bounce" : ""
      } ${
        isTarget
          ? "border-neutral-500 shadow-[0_0_0_2px_rgba(163,163,163,0.35)]"
          : isSource
            ? "border-neutral-600"
            : isSelected
              ? "border-white/60"
              : "border-white/[0.08]"
      }`}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest("button, textarea, input")) e.stopPropagation();
      }}
    >
      <div className="flex shrink-0 flex-col gap-2 px-3 pt-3">
        <SectionLabel>Add Block</SectionLabel>

        <div className="relative h-24 w-full rounded-lg border border-white/[0.08] bg-white/[0.03]">
          <textarea
            placeholder="Describe your block…"
            className="h-full w-full resize-none bg-transparent px-3 pb-10 pt-2.5 text-[13px] leading-snug text-neutral-100 placeholder:text-neutral-600 focus:outline-none"
            onMouseDown={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <button
              type="button"
              aria-label="Voice input"
              className="inline-flex text-neutral-500 transition-colors hover:text-neutral-300"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <MicIcon />
            </button>
            <button
              type="button"
              aria-label="Submit"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 transition-opacity hover:opacity-90"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <SendIcon />
            </button>
          </div>
        </div>

        <CustomAgentButton />
        <PanelTabs panel={panel} onChange={setPanel} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-4 pt-1">
        <ScrollableList rows={rows} panelKey={panel} />
      </div>
    </div>
  );
}
