"use client";

/** Building blocks /demo/clinic's pages share, in /doehealthproduct's language: titles, toned cards, tags and controls. */
import type { ReactNode } from "react";

import { DISPLAY } from "@/components/demo/DemoFrame";

export function SyncDot({ ok }: { ok: boolean }) {
  return (
    <span className="relative flex w-[10px] h-[10px] shrink-0" aria-label={ok ? "Live" : "Reconnecting"}>
      {ok && <span className="doe-ripple absolute inset-0 rounded-full bg-[#9DBF8A]" />}
      <span className={`relative m-auto w-[6px] h-[6px] rounded-full ${ok ? "bg-[#4E7A3E]" : "bg-[#C9704B]"}`} />
    </span>
  );
}

export function PageTitle({ kicker, children, right }: { kicker?: ReactNode; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-[16px] gap-y-[12px] mb-[16px] md:mb-[22px]">
      <div className="flex flex-col gap-[4px] min-w-0">
        {kicker && <span className="text-[13px] leading-[16px] font-[500] text-[#2819109E]">{kicker}</span>}
        <h1 className={`${DISPLAY} text-[36px] leading-[40px] md:text-[48px] md:leading-[52px] lg:text-[58px] lg:leading-[62px] tracking-[-0.03em] text-[#281910]`}>{children}</h1>
      </div>
      {right && <div className="flex flex-wrap items-center gap-[8px] w-full sm:w-auto">{right}</div>}
    </div>
  );
}

export function Card({ tone = "#FAF6EC", className = "", children }: { tone?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`flex flex-col min-w-0 p-[16px] md:p-[20px_22px] rounded-[24px] md:rounded-[28px] ${className}`} style={{ backgroundColor: tone }}>
      {children}
    </div>
  );
}

export function CardTitle({ title, note, right }: { title: string; note?: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-[10px] mb-[12px] shrink-0">
      <span className="flex flex-col min-w-0">
        <span className={`${DISPLAY} text-[20px] leading-[24px] md:text-[22px] tracking-[-0.01em] text-[#281910]`}>{title}</span>
        {note && <span className="mt-[3px] text-[12.5px] leading-[16px] font-[500] text-[rgba(40,25,16,0.55)]">{note}</span>}
      </span>
      {right}
    </div>
  );
}

export function Tag({ children, tone }: { children: ReactNode; tone?: "sage" | "salmon" | "line" }) {
  return (
    <span
      className={`flex items-center gap-[6px] h-[26px] px-[12px] rounded-full text-[12px] leading-[16px] font-[500] whitespace-nowrap ${
        tone === "sage" ? "bg-[#D6DEC6] text-[#2F3B2A]" : tone === "salmon" ? "bg-[#FCCFB8] text-[#7A3E26]" : tone === "line" ? "shadow-[inset_0_0_0_1px_rgba(40,25,16,0.2)] text-[#281910]" : "bg-[#FFFCF1BF] text-[#281910]"
      }`}
    >
      {children}
    </span>
  );
}

export function Segmented<T extends string>({ value, options, onChange, className = "" }: { value: T; options: { id: T; label: ReactNode }[]; onChange: (v: T) => void; className?: string }) {
  return (
    <span role="tablist" className={`flex p-[3px] gap-[2px] rounded-full bg-[#F4EEDF] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`grow shrink-0 flex items-center justify-center gap-[6px] h-[34px] md:h-[32px] px-[14px] rounded-full text-[13px] leading-[16px] font-[500] whitespace-nowrap transition-colors duration-150 ${value === o.id ? "bg-[#FFFCF1] text-[#140C04] shadow-[0_1px_2px_rgba(40,25,16,0.08)]" : "text-[#2819109E] hover:text-[#281910]"}`}
        >
          {o.label}
        </button>
      ))}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-center min-h-[72px] rounded-[16px] bg-[#FFFCF1CC] p-[16px] text-center text-[13.5px] leading-[19px] text-[#2819109E]">{children}</div>;
}

export function Switch({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`relative block shrink-0 w-[44px] h-[26px] rounded-full transition-colors duration-200 ${on ? "bg-[#140C04]" : "bg-[#2819102E]"}`}>
      <span className="absolute top-[3px] w-[20px] h-[20px] rounded-full bg-[#FFFCF1] shadow-[0_1px_3px_rgba(20,12,4,0.25)] transition-[left] duration-200" style={{ left: on ? 21 : 3 }} />
    </span>
  );
}
