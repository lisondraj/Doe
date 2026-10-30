"use client";

import { useEffect, useRef, useState } from "react";

import { DISPLAY } from "@/components/demo/DemoFrame";
import { ASSESSMENTS, type Assessment, type AssessmentQuestion, isComplete } from "@/lib/demo/demo-assessments";
import { INTAKE_FIELDS, type IntakeField } from "@/lib/demo/demo-clinic";
import type { DemoSession } from "@/lib/demo/demo-types";

const SECTIONS: IntakeField["section"][] = ["About", "Headache history", "Safety"];
const FIELDS = INTAKE_FIELDS.filter((f) => f.id !== "consent");

export type Answers = Record<string, Record<string, number>>;

/**
 * The clinic's forms, saved to the session as the agent fills them: the intake, and the validated headache
 * assessments the agent asks the user one question at a time. All of it goes back to the clinic in one pass.
 */
export function DemoForms({
  forms,
  userName,
  onIntake,
  onAnswer,
  onSign,
  onSubmit,
}: {
  forms: DemoSession["forms"];
  userName: string;
  onIntake: (fields: Record<string, string>) => Promise<unknown>;
  onAnswer: (assessmentId: string, answers: Record<string, number>) => Promise<unknown>;
  onSign: () => Promise<unknown>;
  onSubmit: () => Promise<unknown>;
}) {
  const [tab, setTab] = useState("intake");
  const [draft, setDraft] = useState<Record<string, string>>(forms.intake);
  const [asking, setAsking] = useState(false);
  const [steps, setSteps] = useState<Record<string, number>>({});
  const focused = useRef<string | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  /** Server values win, except in the field being typed in. */
  useEffect(() => {
    setDraft((d) => {
      const next = { ...forms.intake };
      if (focused.current) next[focused.current] = d[focused.current] ?? "";
      return next;
    });
  }, [forms.intake]);

  const sent = forms.status === "sent";
  const intakeDone = Boolean(forms.signedBy) && FIELDS.every((f) => forms.intake[f.id]?.trim());
  const done = (id: string) => (id === "intake" ? intakeDone : isComplete(ASSESSMENTS.find((a) => a.id === id)!, forms.assessments[id]));
  const tabs = [{ id: "intake", label: "Intake" }, ...ASSESSMENTS.map((a) => ({ id: a.id, label: a.name }))];
  const complete = tabs.filter((t) => done(t.id)).length;
  const assessment = ASSESSMENTS.find((a) => a.id === tab);

  const askToSign = () => {
    setAsking(true);
    timer.current = window.setTimeout(() => {
      void onSign().finally(() => setAsking(false));
    }, 1400);
  };

  const fillProfile = () => {
    const fields = Object.fromEntries(FIELDS.map((f) => [f.id, f.id === "name" ? draft.name?.trim() || userName : f.value]));
    setDraft(fields);
    void onIntake(fields);
  };

  return (
    <div className="rounded-[24px] bg-[#F4EEDF] p-[6px]">
      <div className="flex items-center justify-between gap-[12px] px-[12px] pt-[8px] pb-[10px]">
        <span className="text-[13px] font-[600]">
          {complete} of {tabs.length} complete
        </span>
        <span className={`h-[26px] px-[10px] flex items-center rounded-full text-[12px] font-[600] ${sent ? "bg-[#DCE5D0]" : "bg-[#FFFCF1]"}`}>{sent ? "Passed back" : "Draft"}</span>
      </div>
      <div className="flex gap-[4px] overflow-x-auto pb-[6px] [scrollbar-width:none]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 h-[36px] pl-[10px] pr-[14px] flex items-center gap-[8px] rounded-full text-[13px] font-[600] transition-colors duration-150 ${tab === t.id ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#FFFCF1] text-[#281910]"}`}
          >
            <span
              className={`w-[16px] h-[16px] rounded-full flex items-center justify-center ${done(t.id) ? (tab === t.id ? "bg-[#FFFCF1]" : "bg-[#140C04]") : tab === t.id ? "border-[1.5px] border-solid border-[#FFFCF166]" : "border-[1.5px] border-solid border-[#28191033]"}`}
            >
              {done(t.id) && (
                <svg width="9" height="9" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={tab === t.id ? "#140C04" : "#FFFCF1"} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {t.label}
          </button>
        ))}
      </div>

      {assessment ? (
        <Walkthrough
          key={assessment.id}
          assessment={assessment}
          answers={forms.assessments[assessment.id] ?? {}}
          step={steps[assessment.id] ?? 0}
          locked={sent}
          onStep={(n) => setSteps((s) => ({ ...s, [assessment.id]: n }))}
          onAnswer={(q, v) => onAnswer(assessment.id, { [q]: v })}
          onFill={() => {
            void onAnswer(assessment.id, assessment.demo);
            setSteps((s) => ({ ...s, [assessment.id]: assessment.questions.length }));
          }}
        />
      ) : (
        <div className="flex flex-col gap-[6px]">
          {SECTIONS.map((section) => (
            <div key={section} className="rounded-[20px] bg-[#FFFCF1] p-[14px]">
              <div className="flex items-center justify-between mb-[10px]">
                <span className="text-[11px] leading-[14px] font-[600] uppercase tracking-[0.07em] text-[#28191080]">{section}</span>
                {section === "About" && !sent && (
                  <button type="button" onClick={fillProfile} className="text-[12px] font-[600] text-[#2819109E] hover:text-[#281910] underline underline-offset-[3px] decoration-[#28191040]">
                    Fill from user&apos;s profile
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[14px] gap-y-[12px]">
                {FIELDS.filter((f) => f.section === section).map((f) => (
                  <label key={f.id} className="flex flex-col gap-[6px] min-w-0">
                    <span className="text-[13px] leading-[16px] font-[600]">{f.label}</span>
                    <input
                      value={draft[f.id] ?? ""}
                      disabled={sent}
                      onFocus={() => {
                        focused.current = f.id;
                      }}
                      onChange={(e) => setDraft((v) => ({ ...v, [f.id]: e.target.value }))}
                      onBlur={() => {
                        focused.current = null;
                        if ((draft[f.id] ?? "") !== (forms.intake[f.id] ?? "")) void onIntake({ [f.id]: draft[f.id] ?? "" });
                      }}
                      className="h-[42px] px-[12px] rounded-[12px] bg-[#F4EEDF99] border border-solid border-transparent focus:border-[#28191040] outline-none text-[16px] md:text-[14px] disabled:opacity-70"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="rounded-[20px] bg-[#FFFCF1] p-[14px]">
            <div className="text-[11px] leading-[14px] font-[600] uppercase tracking-[0.07em] text-[#28191080] mb-[10px]">Consent</div>
            <div className="flex items-center gap-[10px] min-h-[46px] px-[14px] rounded-[14px] border-[1.5px] border-dashed border-[#28191033]">
              {forms.signedBy ? (
                <span className="font-['Lora',serif] italic text-[18px]">
                  {forms.signedBy}{" "}
                  <span className="not-italic font-sans text-[12px] text-[#28191080]">· {new Date(forms.signedAt!).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}</span>
                </span>
              ) : (
                <span className="text-[13px] text-[#28191099]">{asking ? "Waiting for signature…" : "Consent to Botox treatment"}</span>
              )}
              {!forms.signedBy && !asking && !sent && (
                <button type="button" onClick={askToSign} className="ml-auto h-[32px] px-[12px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[12.5px] font-[600]">
                  Request signature
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-[10px] px-[6px] pt-[10px] pb-[4px]">
        <button
          type="button"
          disabled={sent || complete < tabs.length}
          onClick={() => void onSubmit()}
          className="h-[46px] px-[20px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[14px] font-[600] disabled:bg-[#28191033] disabled:cursor-not-allowed transition-colors duration-200"
        >
          {sent ? "Passed back" : `Pass back to clinic${complete < tabs.length ? ` · ${complete}/${tabs.length}` : ""}`}
        </button>
      </div>
    </div>
  );
}

function Walkthrough({
  assessment,
  answers,
  step,
  locked,
  onStep,
  onAnswer,
  onFill,
}: {
  assessment: Assessment;
  answers: Record<string, number>;
  step: number;
  locked: boolean;
  onStep: (n: number) => void;
  onAnswer: (q: string, v: number) => Promise<unknown>;
  onFill: () => void;
}) {
  const total = assessment.questions.length;
  const complete = isComplete(assessment, answers);
  const finished = (step >= total || locked) && complete;
  const q = assessment.questions[Math.min(step, total - 1)]!;
  const result = complete ? assessment.result(answers) : null;
  const [local, setLocal] = useState<number | undefined>(answers[q.id]);
  useEffect(() => setLocal(answers[q.id]), [q.id, answers]);

  const pick = (v: number) => {
    setLocal(v);
    void onAnswer(q.id, v);
    onStep(step + 1);
  };

  return (
    <div className="rounded-[20px] bg-[#FFFCF1] p-[16px] md:p-[20px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <div className={`${DISPLAY} text-[20px] leading-[24px]`}>{assessment.full}</div>
          <div className="mt-[2px] text-[12px] text-[#28191080]">
            {assessment.name} · {assessment.window}
          </div>
        </div>
        {result && (
          <span className="shrink-0 flex flex-col items-end">
            <span className={`${DISPLAY} text-[22px] leading-[24px]`}>{result.score}</span>
            <span className="mt-[4px] h-[22px] px-[8px] flex items-center rounded-full text-[11px] font-[700]" style={{ backgroundColor: result.tone }}>
              {result.band}
            </span>
          </span>
        )}
      </div>

      <div className="mt-[14px] flex gap-[3px]" aria-hidden="true">
        {assessment.questions.map((x, i) => (
          <span key={x.id} className="h-[4px] grow rounded-full transition-colors duration-200" style={{ backgroundColor: answers[x.id] !== undefined ? "#140C04" : i === step ? "#28191059" : "#2819101A" }} />
        ))}
      </div>

      {finished ? (
        <div className="mt-[16px] flex flex-col gap-[2px]">
          {assessment.questions.map((x, i) => (
            <button key={x.id} type="button" disabled={locked} onClick={() => onStep(i)} className="flex items-center justify-between gap-[12px] min-h-[38px] px-[10px] rounded-[10px] text-left hover:bg-[#F4EEDF] transition-colors duration-150 disabled:hover:bg-transparent">
              <span className="text-[13px] text-[#281910B3]">{x.short}</span>
              <span className="text-[13px] font-[700]">{label(x, answers[x.id])}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-[16px] flex items-center justify-between">
            <span className="text-[11px] font-[700] uppercase tracking-[0.08em] text-[#28191080]">Ask your user</span>
            <span className="text-[12px] font-[600] text-[#28191080]">
              {Math.min(step, total - 1) + 1} / {total}
            </span>
          </div>
          <p className="mt-[6px] text-[18px] leading-[25px] md:text-[20px] md:leading-[28px] font-[500]">&ldquo;{q.prompt}&rdquo;</p>
          <div className="mt-[14px]">
            <Answer question={q} value={local} onPick={pick} onSet={(v) => setLocal(v)} />
          </div>
          <div className="mt-[14px] flex items-center gap-[8px]">
            <button type="button" disabled={step === 0} onClick={() => onStep(step - 1)} className="h-[40px] px-[16px] rounded-full bg-[#F4EEDF] text-[13px] font-[600] disabled:opacity-40">
              Back
            </button>
            {q.kind === "days" && (
              <button
                type="button"
                disabled={local === undefined}
                onClick={() => local !== undefined && pick(local)}
                className="h-[40px] px-[18px] rounded-full bg-[#140C04] text-[#FFFCF1] text-[13px] font-[600] disabled:bg-[#28191033]"
              >
                Next
              </button>
            )}
            <button type="button" disabled={locked} onClick={onFill} className="ml-auto h-[40px] px-[12px] rounded-full text-[12.5px] font-[600] text-[#2819109E] hover:text-[#281910] underline underline-offset-[3px] decoration-[#28191040]">
              Use user&apos;s answers
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function label(q: AssessmentQuestion, v: number | undefined) {
  if (v === undefined) return "—";
  if (q.kind === "choice") return q.options.find((o) => o.value === v)?.label ?? String(v);
  if (q.kind === "scale") return `${v} / 10`;
  return q.id === "months" ? `${v} mo` : `${v} days`;
}

function Answer({ question: q, value, onPick, onSet }: { question: AssessmentQuestion; value: number | undefined; onPick: (v: number) => void; onSet: (v: number) => void }) {
  if (q.kind === "choice") {
    return (
      <div className="flex flex-wrap gap-[6px]">
        {q.options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onPick(o.value)}
            className={`h-[44px] px-[18px] rounded-full text-[14px] font-[600] transition-colors duration-150 ${value === o.value ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    );
  }
  if (q.kind === "scale") {
    return (
      <div className="grid grid-cols-11 gap-[4px]">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            className={`h-[44px] rounded-[12px] text-[14px] font-[700] transition-colors duration-150 ${value === i ? "bg-[#140C04] text-[#FFFCF1]" : "bg-[#F4EEDF] hover:bg-[#EEE6D6]"}`}
          >
            {i}
          </button>
        ))}
      </div>
    );
  }
  const v = value ?? 0;
  return (
    <div className="flex items-center gap-[8px]">
      <button type="button" aria-label="Fewer" onClick={() => onSet(Math.max(0, v - 1))} className="w-[44px] h-[44px] rounded-full bg-[#F4EEDF] text-[20px] font-[600]">
        −
      </button>
      <input
        inputMode="numeric"
        value={value === undefined ? "" : String(value)}
        placeholder="0"
        onChange={(e) => {
          const n = Number(e.target.value.replace(/[^\d]/g, ""));
          onSet(Math.min(q.max, Number.isFinite(n) ? n : 0));
        }}
        className="w-[84px] h-[44px] rounded-[12px] bg-[#F4EEDF] text-center text-[20px] font-[700] outline-none"
      />
      <button type="button" aria-label="More" onClick={() => onSet(Math.min(q.max, v + 1))} className="w-[44px] h-[44px] rounded-full bg-[#F4EEDF] text-[20px] font-[600]">
        +
      </button>
      <span className="text-[13px] text-[#28191080]">{q.id === "months" ? "months" : "days"}</span>
    </div>
  );
}
