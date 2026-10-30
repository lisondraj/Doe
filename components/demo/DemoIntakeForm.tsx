"use client";

import { useEffect, useRef, useState } from "react";

import { DISPLAY } from "@/components/demo/DemoFrame";
import { DEMO_USER, INTAKE_FIELDS, type IntakeField, type IntakeSource } from "@/lib/demo/demo-clinic";

const SOURCE: Record<IntakeSource, { label: string; tone: string }> = {
  profile: { label: "From user's profile", tone: "#F4EEDF" },
  confirmed: { label: "Confirmed with user", tone: "#E3E9D9" },
  user: { label: "Needs your user", tone: "#FCCFB8" },
};

const SECTIONS: IntakeField["section"][] = ["About", "Headache history", "Safety", "Consent"];

export type IntakeState = "draft" | "sent";

/**
 * The clinic's new patient intake, as the user's agent fills it. The agent drafts every answer it can from the
 * user's profile, asks the user to sign, and passes the form back to the clinic.
 */
export function DemoIntakeForm({ state, onPassBack }: { state: IntakeState; onPassBack: () => void }) {
  const [values, setValues] = useState(() => Object.fromEntries(INTAKE_FIELDS.map((f) => [f.id, f.value])));
  const [sign, setSign] = useState<"none" | "asked" | "signed">("none");
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const sent = state === "sent";
  const filled = INTAKE_FIELDS.filter((f) => (f.id === "consent" ? sign === "signed" : values[f.id]?.trim())).length;

  const askToSign = () => {
    setSign("asked");
    timer.current = window.setTimeout(() => setSign("signed"), 1800);
  };

  return (
    <div className="rounded-[24px] bg-[#F4EEDF] p-[6px]">
      <div className="flex items-start justify-between gap-[12px] px-[14px] pt-[12px] pb-[12px]">
        <div className="flex flex-col gap-[2px] min-w-0">
          <span className={`${DISPLAY} text-[20px] leading-[24px] tracking-[-0.01em]`}>New patient intake</span>
          <span className="text-[12.5px] leading-[17px] text-[#2819109E]">
            Requested by the clinic · {filled} of {INTAKE_FIELDS.length} answered
          </span>
        </div>
        <span className={`shrink-0 h-[26px] px-[10px] flex items-center rounded-[999px] text-[12px] font-[600] ${sent ? "bg-[#DCE5D0]" : "bg-[#FFFCF1]"}`}>
          {sent ? "Passed back" : "Draft"}
        </span>
      </div>
      <div className="h-[4px] mx-[14px] mb-[12px] rounded-full bg-[#2819100F] overflow-hidden">
        <div className="h-full bg-[#140C04] transition-[width] duration-500" style={{ width: `${(filled / INTAKE_FIELDS.length) * 100}%` }} />
      </div>

      <div className="flex flex-col gap-[6px]">
        {SECTIONS.map((section) => (
          <div key={section} className="rounded-[20px] bg-[#FFFCF1] p-[14px]">
            <div className="text-[11px] leading-[14px] font-[600] uppercase tracking-[0.07em] text-[#28191080] mb-[10px]">{section}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[14px] gap-y-[12px]">
              {INTAKE_FIELDS.filter((f) => f.section === section).map((f) =>
                f.id === "consent" ? (
                  <div key={f.id} className="md:col-span-2 flex flex-col gap-[8px]">
                    <FieldLabel label={f.label} source={sign === "signed" ? "confirmed" : f.source} sourceLabel={sign === "signed" ? "Signed by user" : undefined} />
                    <p className="text-[13px] leading-[19px] text-[#281910B3]">
                      I consent to onabotulinumtoxinA (Botox) injections for chronic migraine, and I understand the private fee and the common side effects.
                    </p>
                    <div className="flex items-center gap-[10px] min-h-[44px] px-[14px] rounded-[14px] border-[1.5px] border-dashed border-[#28191033]">
                      {sign === "signed" ? (
                        <span className="font-['Lora',serif] italic text-[18px] text-[#281910]">
                          {DEMO_USER.name} <span className="not-italic font-sans text-[12px] text-[#28191080]">· signed Oct 30, 2026</span>
                        </span>
                      ) : sign === "asked" ? (
                        <span className="text-[13px] text-[#28191099]">Waiting for {DEMO_USER.name} to sign on their phone…</span>
                      ) : (
                        <span className="text-[13px] text-[#28191099]">Agents can&apos;t sign for their user.</span>
                      )}
                      {sign === "none" && !sent && (
                        <button type="button" onClick={askToSign} className="ml-auto h-[32px] px-[12px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] text-[12.5px] font-[600]">
                          Ask user to sign
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <label key={f.id} className="flex flex-col gap-[6px] min-w-0">
                    <FieldLabel label={f.label} source={f.source} />
                    <input
                      value={values[f.id] ?? ""}
                      disabled={sent}
                      onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                      className="h-[42px] px-[12px] rounded-[12px] bg-[#F4EEDF99] border border-solid border-transparent focus:border-[#28191040] outline-none text-[16px] md:text-[14px] text-[#281910] disabled:opacity-70"
                    />
                  </label>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-[10px] px-[10px] pt-[12px] pb-[8px]">
        <p className="grow text-[12.5px] leading-[17px] text-[#2819109E]">
          {sent
            ? "The clinic has the form. Dr. Brooks reviews it before the visit."
            : sign === "signed"
              ? "Everything is answered. Check the drafts, then pass the form back."
              : "Your user needs to sign before the form can go back."}
        </p>
        <button
          type="button"
          disabled={sent || sign !== "signed"}
          onClick={onPassBack}
          className="shrink-0 h-[46px] px-[20px] rounded-[999px] bg-[#140C04] text-[#FFFCF1] text-[14px] font-[600] disabled:bg-[#28191033] disabled:cursor-not-allowed transition-colors duration-200"
        >
          {sent ? "Passed back to clinic" : "Pass back to clinic"}
        </button>
      </div>
    </div>
  );
}

function FieldLabel({ label, source, sourceLabel }: { label: string; source: IntakeSource; sourceLabel?: string }) {
  const s = SOURCE[source];
  return (
    <span className="flex items-center justify-between gap-[8px]">
      <span className="text-[13px] leading-[16px] font-[600] text-[#281910]">{label}</span>
      <span className="shrink-0 h-[20px] px-[8px] flex items-center rounded-[999px] text-[10.5px] leading-[12px] font-[600] text-[#281910B3]" style={{ backgroundColor: s.tone }}>
        {sourceLabel ?? s.label}
      </span>
    </span>
  );
}
