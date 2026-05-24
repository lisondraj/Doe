"use client";

import { useWorkflowBlockTheme } from "@/components/herodesign/WorkflowBlockVariantContext";
import { suisseIntl } from "@/lib/home/fonts";

function SyncDot() {
  return (
    <span className="relative h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/90" aria-hidden />
  );
}

function EmrPanelIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.35" />
      <path d="M8 9.5h8M8 12.75h8M8 16h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
    </svg>
  );
}

const ITEMS = [
  "Problems & allergies surfaced",
  "Meds reconciled from chart",
  "Intake notes in HP template",
] as const;

export function PreChartingEmrBlock() {
  const t = useWorkflowBlockTheme();

  return (
    <div className={`flex h-fit w-full flex-col rounded-xl border ${t.shell} ${suisseIntl.className}`}>
      <div className={`relative shrink-0 border-b ${t.headerBorder} px-3.5 py-3 pr-10`}>
        <p className={`text-[14px] font-normal leading-none ${t.title}`}>Pre-charting in EMR</p>
        <p className={`mt-1.5 flex items-center gap-1.5 text-[11px] leading-none ${t.subtitle}`}>
          <SyncDot />
          Building visit packet in Epic
        </p>
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.icon}`} aria-hidden>
          <EmrPanelIcon />
        </span>
      </div>

      <div className={`divide-y ${t.rowDivider} px-3.5 pb-3 pt-3`}>
        {ITEMS.map((item) => (
          <p key={item} className={`py-2 text-[12px] leading-snug ${t.body} first:pt-0 last:pb-0`}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
