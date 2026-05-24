"use client";

import { useWorkflowBlockTheme } from "@/components/herodesign/WorkflowBlockVariantContext";
import { suisseIntl } from "@/lib/home/fonts";

function PendingDot() {
  return (
    <span className="relative h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/90" aria-hidden />
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M6.5 3.5h3.2c.5 0 .9.4 1 1l.6 2.7c.1.4-.1.8-.4 1.1l-1.4 1.2a12.1 12.1 0 005.3 5.3l1.2-1.4c.3-.3.7-.5 1.1-.4l2.7.6c.5.1.9.5 1 1v3.2c0 .8-.6 1.5-1.4 1.6C10.5 21.5 2.5 13.4 2.5 4.9c0-.8.7-1.4 1.6-1.4z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ApprovedIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" opacity={0.9} />
      <path
        d="M4.35 7.05l1.68 1.68 3.62-4.06"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AwaitingCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <circle cx="7" cy="7" r="5.35" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

const TEAM: { name: string; responded: boolean }[] = [
  { name: "Dr. Chen MD", responded: false },
  { name: "Ashley RN", responded: true },
  { name: "Clarissa Admin", responded: false },
];

export function PhysicianCellBlock() {
  const t = useWorkflowBlockTheme();

  return (
    <div className={`flex h-fit w-full flex-col rounded-xl border ${t.shell} ${suisseIntl.className}`}>
      <div className={`relative shrink-0 border-b ${t.headerBorder} px-3.5 py-3 pr-10`}>
        <p className={`text-[14px] font-normal leading-none ${t.title}`}>Alerting Team</p>
        <p className={`mt-1.5 flex items-center gap-1.5 text-[11px] leading-none ${t.subtitle}`}>
          <PendingDot />
          Pending approval
        </p>
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.icon}`} aria-hidden>
          <PhoneIcon />
        </span>
      </div>

      <div className="space-y-2 px-3.5 pb-3 pt-3">
        {TEAM.map(({ name, responded }) => (
          <div key={name} className="flex items-start gap-2.5">
            {responded ? (
              <ApprovedIcon className={`shrink-0 ${t.approvedIcon}`} />
            ) : (
              <AwaitingCircleIcon className={`shrink-0 ${t.awaitingIcon}`} />
            )}
            <span className={`text-[13px] leading-snug ${responded ? t.emeraldSoft : t.body}`}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
