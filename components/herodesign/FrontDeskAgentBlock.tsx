"use client";

import { useWorkflowBlockTheme } from "@/components/herodesign/WorkflowBlockVariantContext";
import { suisseIntl } from "@/lib/home/fonts";

function AgentIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 11a6 6 0 0012 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 17v3M9 20h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
      <span className="absolute inset-0 rounded-full bg-red-400/35 animate-ping" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-red-400" />
    </span>
  );
}

function WaveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M1 6c1-2 2-2 3 0s2 2 3 0 2-2 3 0"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StepCheck({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1" />
      <path
        d="M4.5 7.1l1.8 1.8 3.2-3.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThinkingCircle({ ring, spin }: { ring: string; spin: string }) {
  return (
    <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center" aria-hidden>
      <span className={`absolute inset-0 rounded-full border ${ring}`} />
      <span
        className={`absolute inset-0 animate-spin rounded-full border border-r-transparent border-b-transparent [animation-duration:1.35s] ${spin}`}
      />
    </span>
  );
}

const COMPLETED_STEPS = [
  "Patient requesting appointment on Thursday for medication renewal",
  "Bupropion XL 300 mg pulled from chart",
  "Clinic availability provided",
];

export function FrontDeskAgentBlock() {
  const t = useWorkflowBlockTheme();

  return (
    <div className={`flex h-fit w-full flex-col rounded-xl border ${t.shell} ${suisseIntl.className}`}>
      <div className={`relative shrink-0 border-b ${t.headerBorder} px-3.5 py-3 pr-10`}>
        <p className={`text-[14px] font-normal leading-none ${t.title}`}>Front Desk Agent</p>
        <p className={`mt-1.5 flex items-center gap-1.5 text-[11px] leading-none ${t.subtitle}`}>
          <LiveDot />
          Live call in progress
        </p>
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.icon}`} aria-hidden>
          <AgentIcon />
        </span>
      </div>

      <div className="shrink-0 px-3.5 pb-2.5 pt-3">
        <div className="flex items-center justify-between gap-3">
          <span className={`text-[10px] uppercase tracking-[0.12em] ${t.label}`}>Incoming</span>
          <span className={`font-mono text-[11px] tabular-nums ${t.mono}`}>(555) 014-2098</span>
        </div>

        <div className="mt-3 space-y-2.5">
          {COMPLETED_STEPS.map((step) => (
            <div key={step} className="flex items-start gap-2.5">
              <StepCheck className={`shrink-0 ${t.checkMuted}`} />
              <p className={`min-w-0 text-[11px] leading-[1.4] ${t.stepText}`}>{step}</p>
            </div>
          ))}

          <div className="flex items-center gap-2.5 pt-0.5">
            <ThinkingCircle ring={t.thinkingRing} spin={t.thinkingSpin} />
            <p className={`text-[11px] leading-[1.4] ${t.activeText}`}>Reviewing calendar</p>
          </div>
        </div>
      </div>

      <div className={`shrink-0 border-t ${t.footerBorder} px-2.5 pb-2 pt-2.5`}>
        <button
          type="button"
          className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-normal transition-colors ${t.btn}`}
        >
          <WaveIcon />
          Customize Voice Agent
        </button>
      </div>
    </div>
  );
}
