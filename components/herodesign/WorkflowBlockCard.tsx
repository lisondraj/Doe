"use client";

import type { ReactNode } from "react";
import { suisseIntl } from "@/lib/home/fonts";

export type WorkflowBlockKind = "agent" | "connector";

export function WorkflowBlockCard({
  kind,
  title,
  subtitle,
  children,
  className = "",
  hideKind = false,
}: {
  kind: WorkflowBlockKind;
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  hideKind?: boolean;
}) {
  return (
    <div
      className={`flex h-full w-full flex-col rounded-xl border border-white/[0.08] bg-[#121212] shadow-[0_8px_32px_rgba(0,0,0,0.22),0_1px_0_rgba(255,255,255,0.04)_inset] ${suisseIntl.className} ${className}`}
    >
      <div className="flex shrink-0 flex-col gap-1.5 px-3.5 pt-3.5">
        {!hideKind ? (
          <p className="text-[10px] font-normal uppercase tracking-[0.14em] text-neutral-500">
            {kind === "agent" ? "Agent" : "Connector"}
          </p>
        ) : null}
        <div>
          <p className="text-[14px] font-normal leading-tight text-neutral-100">{title}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-neutral-500">{subtitle}</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 px-3.5 pb-3.5 pt-2.5">{children}</div>
    </div>
  );
}

export function PreviewPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`h-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 ${className}`}
    >
      {children}
    </div>
  );
}

export function PreviewRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/[0.05] py-1.5 last:border-0">
      <span className="shrink-0 text-[10px] text-neutral-500">{label}</span>
      <span className={`truncate text-right text-[11px] text-neutral-200 ${mono ? "font-mono tabular-nums" : ""}`}>
        {value}
      </span>
    </div>
  );
}
