"use client";

import { useWorkflowBlockTheme } from "@/components/herodesign/WorkflowBlockVariantContext";
import { suisseIntl } from "@/lib/home/fonts";

function PendingDot() {
  return (
    <span className="relative h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/90" aria-hidden />
  );
}

function IntakeGlyphIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="6" y="3" width="12" height="17" rx="2" stroke="currentColor" strokeWidth="1.35" />
      <path d="M9 18h8M9 14h8M9 10h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={0.45} />
      <path d="M10 8h6" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity={0.75} />
    </svg>
  );
}

function FormCustomizeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="M2.5 3.75h7M10 9.25H9M2.5 9.25h2.5" />
      <circle cx="9" cy="3.75" r="1.15" stroke="currentColor" strokeWidth="1" />
      <circle cx="6.25" cy="9.25" r="1.15" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

const FIELDS = [
  { n: "01", label: "Medication requiring renewal" },
  { n: "02", label: "New or worsening symptoms" },
  { n: "03", label: "Dosage preference — hold or increase" },
] as const;

export function SendingIntakeFormBlock() {
  const t = useWorkflowBlockTheme();

  return (
    <div className={`flex h-fit w-full flex-col rounded-xl border ${t.shell} ${suisseIntl.className}`}>
      <div className={`relative shrink-0 border-b ${t.headerBorder} px-3.5 py-3 pr-10`}>
        <p className={`text-[14px] font-normal leading-none ${t.title}`}>Sending Intake Form</p>
        <p className={`mt-1.5 flex items-center gap-1.5 text-[11px] leading-none ${t.subtitle}`}>
          <PendingDot />
          Awaiting patient&apos;s approval
        </p>
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.icon}`} aria-hidden>
          <IntakeGlyphIcon />
        </span>
      </div>

      <div className={`divide-y ${t.rowDivider} px-3.5 pb-3 pt-3`}>
        {FIELDS.map(({ n, label }) => (
          <div key={n} className="flex items-center gap-3 py-2">
            <span className={`w-5 shrink-0 font-mono text-[10px] tabular-nums ${t.rowNum}`}>{n}</span>
            <p className={`text-[12px] leading-snug ${t.body}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className={`shrink-0 border-t ${t.footerBorder} px-2.5 pb-2 pt-2.5`}>
        <button
          type="button"
          className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-normal transition-colors ${t.btnGhost}`}
        >
          <FormCustomizeIcon />
          Customize Form
        </button>
      </div>
    </div>
  );
}
