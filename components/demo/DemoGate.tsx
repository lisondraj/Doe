"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";

import { Check, DISPLAY } from "@/components/demo/DemoFrame";
import { DemoSphere } from "@/components/demo/DemoSphere";
import { CLINIC } from "@/lib/demo/demo-clinic";

export type DemoConsent = { terms: boolean; phi: boolean; connected: boolean; network: boolean };

const LINK = "underline underline-offset-[3px] decoration-[#28191059] hover:decoration-[#281910]";

const ITEMS: { id: keyof DemoConsent; required: boolean; body: ReactNode }[] = [
  {
    id: "terms",
    required: true,
    body: (
      <>
        They agree to Doe&apos;s{" "}
        <Link href="/demo/TOS" className={LINK} target="_blank">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/demo/PP" className={LINK} target="_blank">
          Privacy Policy
        </Link>
        .
      </>
    ),
  },
  {
    id: "phi",
    required: true,
    body: <>By booking through Doe, they&apos;re voluntarily providing their personal health information (PHI).</>,
  },
  {
    id: "connected",
    required: false,
    body: <>They allow you to stay connected to Doe and check back for updates.</>,
  },
  {
    id: "network",
    required: false,
    body: <>They&apos;d like to join the Doe network to book faster.</>,
  },
];

/** The first screen an agent lands on, never shown to its user: the clinic, and what to confirm with the user before booking. */
export function DemoGate({ onProceed }: { onProceed: (consent: DemoConsent) => void }) {
  const [consent, setConsent] = useState<DemoConsent>({ terms: false, phi: false, connected: false, network: false });
  const all = consent.terms && consent.phi && consent.connected && consent.network;
  const ready = consent.terms && consent.phi;

  return (
    <main className="flex flex-col items-center px-[20px] pb-[28px] md:pb-[48px] min-h-[calc(100%-64px)]">
      <DemoSphere size={210} className="mt-[4px] md:mt-[12px]" />
      <h1 className={`${DISPLAY} mt-[18px] text-center text-[30px] leading-[34px] md:text-[40px] md:leading-[44px] tracking-[-0.02em] text-[#281910]`}>
        {CLINIC.name}
      </h1>
      <p className="mt-[10px] text-center text-[15px] leading-[22px] text-[#2819109E]">
        {CLINIC.addressLine1}
        <br />
        {CLINIC.addressLine2}
      </p>

      <section className="w-full max-w-[520px] mt-[28px] p-[6px] rounded-[26px] bg-[#F4EEDF]">
        <p className="px-[16px] pt-[14px] pb-[12px] text-[15px] leading-[21px] font-[600] text-[#281910]">
          Confirm with your user before booking
        </p>
        <div className="flex flex-col gap-[4px]">
          {ITEMS.map((item, i) => {
            const on = consent[item.id];
            return (
              <div
                key={item.id}
                role="checkbox"
                aria-checked={on}
                tabIndex={0}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("a")) return;
                  setConsent((c) => ({ ...c, [item.id]: !c[item.id] }));
                }}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setConsent((c) => ({ ...c, [item.id]: !c[item.id] }));
                  }
                }}
                className="flex gap-[14px] items-start p-[14px] rounded-[20px] bg-[#FFFCF1] cursor-pointer select-none outline-none focus-visible:ring-[1.5px] focus-visible:ring-[#28191066]"
              >
                <span className="mt-[1px] text-[13px] leading-[20px] font-[600] text-[#28191066] w-[14px] shrink-0">{i + 1}</span>
                <span className="grow text-[14px] leading-[20px] text-[#281910]">
                  {item.body}
                  <span
                    className={`ml-[8px] inline-flex items-center h-[20px] px-[8px] rounded-[999px] align-[1px] text-[11px] leading-[14px] font-[600] ${item.required ? "bg-[#FCCFB8]" : "bg-[#E3E9D9]"}`}
                  >
                    {item.required ? "Required" : "Optional"}
                  </span>
                </span>
                <Check on={on} />
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setConsent({ terms: !all, phi: !all, connected: !all, network: !all })}
          className="w-full h-[46px] mt-[6px] rounded-[20px] text-[14px] leading-[18px] font-[600] text-[#281910] border-[1.5px] border-dashed border-[#28191033] hover:bg-[#EEE6D6] transition-colors duration-150"
        >
          {all ? "Clear all" : "Confirm all"}
        </button>
      </section>

      <div className="grow min-h-[24px]" />
      <button
        type="button"
        disabled={!ready}
        onClick={() => onProceed(consent)}
        className="w-full max-w-[520px] h-[56px] rounded-[999px] text-[16px] leading-[20px] font-[600] text-[#FFFCF1] bg-[#140C04] disabled:bg-[#28191033] disabled:text-[#FFFCF1] disabled:cursor-not-allowed transition-colors duration-200"
      >
        Proceed
      </button>
    </main>
  );
}
