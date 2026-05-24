"use client";

import { useWorkflowBlockTheme } from "@/components/herodesign/WorkflowBlockVariantContext";
import { suisseIntl } from "@/lib/home/fonts";

function ReadyDot() {
  return (
    <span className="relative h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400/90" aria-hidden />
  );
}

function PlayAppointmentIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="7.75" stroke="currentColor" strokeWidth="1.25" opacity={0.9} />
      <path d="M10.85 14.92V10.98l4.42 2.06-4.42 2.88z" fill="currentColor" opacity={0.92} stroke="none" />
    </svg>
  );
}

function PlayCueIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3.25 10.98V5.92l5.5 2.73-5.5 3.34z" fill="currentColor" opacity={0.92} />
    </svg>
  );
}

const FLOW = [
  { n: "01", label: "Pull evidence from visit journals" },
  { n: "02", label: "Chart review surfaced for physician" },
  { n: "03", label: "SOAP & billing forms auto-completed" },
  { n: "04", label: "Scripts queued to pharmacy" },
] as const;

export function LoadingAppointmentBlock() {
  const t = useWorkflowBlockTheme();

  return (
    <div className={`flex h-fit w-full flex-col rounded-xl border ${t.shell} ${suisseIntl.className}`}>
      <div className={`relative shrink-0 border-b ${t.headerBorder} px-3.5 py-3 pr-10`}>
        <p className={`text-[14px] font-normal leading-none ${t.title}`}>Loading Appointment</p>
        <p className={`mt-1.5 flex items-center gap-1.5 text-[11px] leading-none ${t.subtitle}`}>
          <ReadyDot />
          Staged for encounter start
        </p>
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.icon}`} aria-hidden>
          <PlayAppointmentIcon />
        </span>
      </div>

      <div className={`divide-y ${t.rowDivider} px-3.5 pb-3 pt-3`}>
        {FLOW.map(({ n, label }) => (
          <div key={n} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
            <span className={`w-5 shrink-0 font-mono text-[10px] tabular-nums ${t.rowNum}`}>{n}</span>
            <p className={`text-[12px] leading-snug ${t.body}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className={`shrink-0 border-t ${t.footerBorder} px-2.5 pb-2 pt-2.5`}>
        <button
          type="button"
          className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-normal transition-colors ${t.btnPrimary}`}
        >
          <PlayCueIcon />
          Start appointment
        </button>
      </div>
    </div>
  );
}
