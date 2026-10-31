"use client";

import { useEffect, useRef, useState } from "react";

import { ASSESSMENTS, type Assessment, type AssessmentQuestion, isComplete } from "@/lib/demo/demo-assessments";
import { CLINIC, INTAKE_FIELDS, type IntakeField } from "@/lib/demo/demo-clinic";
import type { DemoSession } from "@/lib/demo/demo-types";
import { lora } from "@/lib/home/fonts";

const SECTIONS: { id: IntakeField["section"]; title: string }[] = [
  { id: "About", title: "About the Patient" },
  { id: "Headache history", title: "Headache History" },
  { id: "Safety", title: "Safety Screen" },
];
const FIELDS = INTAKE_FIELDS.filter((f) => f.id !== "consent");
/** Intake fields answered Yes or No, set as two boxes like a paper form. */
const YES_NO = new Set(["pregnant", "neuro"]);
/** Fields that take a full row of the grid. */
const WIDE = new Set(["name", "tried", "acute", "allergies"]);

const RULE = "border-[#2819102E]";

/** A section's fields as grid cells: wide fields take the row, and an odd one out at the end fills its row too. */
function cells(section: IntakeField["section"]) {
  const list = FIELDS.filter((f) => f.section === section);
  const half = list.filter((f) => !WIDE.has(f.id));
  const last = half.length % 2 ? half[half.length - 1] : null;
  return list.map((f) => ({ f, span: WIDE.has(f.id) || f === last }));
}
const SERIF = `${lora.className} font-normal`;

/** How many forms in the packet are done, for the invite on the landing page. */
export function formsProgress(forms: DemoSession["forms"]) {
  const intake = Boolean(forms.signedBy) && FIELDS.every((f) => forms.intake[f.id]?.trim());
  const done = (intake ? 1 : 0) + ASSESSMENTS.filter((a) => isComplete(a, forms.assessments[a.id])).length;
  return { done, total: ASSESSMENTS.length + 1 };
}

/**
 * The clinic's packet, set like the paper it replaces: a list of documents, then the open one as a page with
 * bordered fields, check boxes and a signature line. Each answer saves to the session as it's given, and the whole
 * packet goes back to the clinic in one pass.
 */
export function DemoForms({
  forms,
  userName,
  onIntake,
  onAnswer,
  onSign,
  onSubmit,
  onUpload,
}: {
  forms: DemoSession["forms"];
  userName: string;
  onIntake: (fields: Record<string, string>) => Promise<unknown>;
  onAnswer: (assessmentId: string, answers: Record<string, number>) => Promise<unknown>;
  onSign: () => Promise<unknown>;
  onSubmit: () => Promise<unknown>;
  /** Uploads a written form or a file (a migraine diary, a referral) to the clinic. */
  onUpload?: (u: { title: string; text?: string; file_name?: string; mime_type?: string; content_base64?: string }) => Promise<unknown>;
}) {
  const [tab, setTab] = useState("intake");
  const [draft, setDraft] = useState<Record<string, string>>(forms.intake);
  const [asking, setAsking] = useState(false);
  const focused = useRef<string | null>(null);
  const timer = useRef<number | null>(null);
  const page = useRef<HTMLDivElement>(null);
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
  const docs = [{ id: "intake", label: "Patient Intake & Consent" }, ...ASSESSMENTS.map((a) => ({ id: a.id, label: a.name }))];
  const complete = docs.filter((d) => done(d.id)).length;
  const index = docs.findIndex((d) => d.id === tab);
  const assessment = ASSESSMENTS.find((a) => a.id === tab);

  const open = (id: string) => {
    setTab(id);
    page.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

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

  const setField = (id: string, v: string) => {
    setDraft((d) => ({ ...d, [id]: v }));
    if (v !== (forms.intake[id] ?? "")) void onIntake({ [id]: v });
  };

  return (
    <div className="grow min-h-0 overflow-y-auto overscroll-contain border-t border-solid border-[#2819100F]">
      <div className="md:grid md:grid-cols-[210px_minmax(0,1fr)] md:gap-[20px] p-[14px] md:p-[20px]">
        <nav aria-label="Documents" className="md:sticky md:top-0 md:self-start mb-[14px] md:mb-0">
          <div className="flex md:flex-col gap-[4px] overflow-x-auto [scrollbar-width:none]">
            {docs.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => open(d.id)}
                aria-current={tab === d.id}
                className={`shrink-0 flex items-center gap-[10px] min-h-[42px] px-[10px] rounded-[8px] text-left transition-colors duration-150 ${tab === d.id ? "bg-[#F4EEDF]" : "hover:bg-[#F4EEDF99]"}`}
              >
                <span className="text-[12px] tabular-nums text-[#28191080]">{String(i + 1).padStart(2, "0")}</span>
                <span className="grow text-[13.5px] leading-[17px] font-[600] whitespace-nowrap md:whitespace-normal">{d.label}</span>
                <Box on={done(d.id)} size={16} />
              </button>
            ))}
          </div>
          <p className="hidden md:block mt-[12px] px-[10px] text-[12px] leading-[17px] text-[#28191080]">
            {complete} of {docs.length} complete. {sent ? "Passed back to the clinic." : "Answers save as you go."}
          </p>
        </nav>

        <div ref={page} className={`scroll-mt-[14px] rounded-[6px] border border-solid ${RULE} bg-[#FFFEFA] shadow-[0_1px_0_rgba(40,25,16,0.04)]`}>
          <header className={`flex items-start justify-between gap-[12px] px-[18px] md:px-[24px] pt-[18px] pb-[14px] border-b border-solid ${RULE}`}>
            <div className="min-w-0">
              <div className="text-[11.5px] leading-[15px] text-[#28191099]">
                {CLINIC.name} · {CLINIC.addressLine1}
              </div>
              <h3 className={`${SERIF} mt-[6px] text-[24px] leading-[28px] md:text-[28px] md:leading-[32px] text-[#281910]`}>{assessment ? assessment.full : "Patient Intake & Consent"}</h3>
              <div className="mt-[4px] text-[12px] text-[#28191080]">
                Form {index + 1} of {docs.length}
                {assessment ? ` · ${assessment.window}` : " · Botox for chronic migraine"}
              </div>
            </div>
            {sent ? (
              <span className={`${SERIF} shrink-0 mt-[2px] px-[8px] py-[2px] border-[1.5px] border-solid border-[#4C7A4F] rounded-[4px] text-[13px] text-[#4C7A4F] rotate-[-4deg]`}>Received</span>
            ) : assessment ? (
              <button type="button" onClick={() => void onAnswer(assessment.id, assessment.demo)} className="shrink-0 text-[12.5px] font-[600] text-[#2819109E] hover:text-[#281910] underline underline-offset-[3px] decoration-[#28191040]">
                Use user&apos;s answers
              </button>
            ) : (
              <button type="button" onClick={fillProfile} className="shrink-0 text-[12.5px] font-[600] text-[#2819109E] hover:text-[#281910] underline underline-offset-[3px] decoration-[#28191040]">
                Fill from profile
              </button>
            )}
          </header>

          {assessment ? (
            <Questionnaire assessment={assessment} answers={forms.assessments[assessment.id] ?? {}} locked={sent} onAnswer={(q, v) => onAnswer(assessment.id, { [q]: v })} />
          ) : (
            <>
              {SECTIONS.map((section, si) => (
                <section key={section.id} className={`border-b border-solid ${RULE}`}>
                  <h4 className="px-[18px] md:px-[24px] pt-[14px] pb-[8px] text-[13px] font-[700]">
                    {String.fromCharCode(65 + si)}. {section.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-[#2819102E] border-t border-solid border-[#2819102E]">
                    {cells(section.id).map(({ f, span }) => (
                      <label key={f.id} className={`flex flex-col gap-[2px] min-w-0 px-[18px] md:px-[24px] pt-[8px] pb-[6px] bg-[#FFFEFA] ${span ? "sm:col-span-2" : ""}`}>
                        <span className="text-[11.5px] leading-[14px] text-[#28191099]">{f.label}</span>
                        {YES_NO.has(f.id) ? (
                          <span className="flex gap-[18px] h-[32px] items-center">
                            {["Yes", "No"].map((v) => (
                              <button key={v} type="button" disabled={sent} onClick={() => setField(f.id, v)} className="flex items-center gap-[8px] text-[14.5px] disabled:cursor-default">
                                <Box on={(draft[f.id] ?? "") === v} size={16} />
                                {v}
                              </button>
                            ))}
                          </span>
                        ) : (
                          <input
                            value={draft[f.id] ?? ""}
                            disabled={sent}
                            type={f.id === "dob" ? "date" : f.id === "email" ? "email" : f.id === "phone" ? "tel" : "text"}
                            onFocus={() => {
                              focused.current = f.id;
                            }}
                            onChange={(e) => setDraft((v) => ({ ...v, [f.id]: e.target.value }))}
                            onBlur={() => {
                              focused.current = null;
                              if ((draft[f.id] ?? "") !== (forms.intake[f.id] ?? "")) void onIntake({ [f.id]: draft[f.id] ?? "" });
                            }}
                            className="h-[32px] w-full bg-transparent outline-none text-[16px] md:text-[14.5px] text-[#281910] disabled:text-[#281910] focus:bg-[#F4EEDF66]"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </section>
              ))}
              <section className="px-[18px] md:px-[24px] pt-[14px] pb-[18px]">
                <h4 className="text-[13px] font-[700]">D. Consent to Treatment</h4>
                <p className="mt-[8px] text-[13px] leading-[19px] text-[#281910CC]">
                  I consent to onabotulinumtoxinA (Botox) injections for chronic migraine by {CLINIC.doctor} or a clinic provider. The benefits, risks and alternatives have been
                  explained to me, including neck pain, eyelid droop and temporary weakness, and I may withdraw consent at any time.
                </p>
                <div className="mt-[16px] grid grid-cols-[minmax(0,1fr)_120px] gap-[16px] items-end">
                  <div className={`min-h-[44px] flex items-end pb-[4px] border-b-[1.5px] border-solid border-[#281910]`}>
                    {forms.signedBy ? (
                      <span className={`${lora.className} italic text-[22px] leading-[28px]`}>{forms.signedBy}</span>
                    ) : sent ? null : asking ? (
                      <span className="text-[13px] text-[#28191099]">Waiting for {userName.split(" ")[0]} to sign…</span>
                    ) : (
                      <button type="button" onClick={askToSign} className="mb-[2px] h-[32px] px-[12px] rounded-[6px] bg-[#3A2516] text-[#FFFCF1] text-[12.5px] font-[600]">
                        Request signature
                      </button>
                    )}
                  </div>
                  <div className="min-h-[44px] flex items-end pb-[4px] border-b-[1.5px] border-solid border-[#281910] text-[14px]">
                    {forms.signedAt ? new Date(forms.signedAt).toLocaleDateString("en-CA") : ""}
                  </div>
                  <span className="-mt-[12px] text-[11.5px] text-[#28191099]">Signature of Patient</span>
                  <span className="-mt-[12px] text-[11.5px] text-[#28191099]">Date</span>
                </div>
              </section>
            </>
          )}
        </div>

        <div className="md:col-start-2 flex items-center justify-between gap-[12px] pt-[14px]">
          <span className="text-[13px] text-[#2819109E]">
            {complete} of {docs.length} complete
          </span>
          <span className="flex gap-[6px]">
            {index < docs.length - 1 && (
              <button type="button" onClick={() => open(docs[index + 1]!.id)} className="h-[44px] px-[16px] rounded-[8px] border border-solid border-[#28191033] text-[14px] font-[600]">
                Next form
              </button>
            )}
            <button
              type="button"
              disabled={sent || complete < docs.length}
              onClick={() => void onSubmit()}
              className="h-[44px] px-[18px] rounded-[8px] bg-[#3A2516] text-[#FFFCF1] text-[14px] font-[600] disabled:bg-[#28191033] disabled:cursor-not-allowed transition-colors duration-200"
            >
              {sent ? "Passed Back" : "Pass Back to Clinic"}
            </button>
          </span>
        </div>
      </div>
      {onUpload && <Uploads uploads={forms.uploads ?? []} onUpload={onUpload} />}
    </div>
  );
}

const ACCEPT = "application/pdf,image/png,image/jpeg,image/heic,text/plain,text/csv,text/markdown";
/** The demo stores files inline, so they stay small. */
const MAX_FILE = 64_000;

/** Files and written forms passed back and forth: what the clinic sent, what the agent uploaded, and a spot to add more. */
function Uploads({ uploads, onUpload }: { uploads: NonNullable<DemoSession["forms"]["uploads"]>; onUpload: NonNullable<Parameters<typeof DemoForms>[0]["onUpload"]> }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const send = async (u: Parameters<typeof onUpload>[0]) => {
    setBusy(true);
    setError(null);
    await onUpload(u);
    setBusy(false);
    setTitle("");
    setText("");
  };
  const pick = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_FILE) return setError("That file is over 60 KB. Send a smaller file, or write the form as text.");
    const r = new FileReader();
    r.onload = () => void send({ title: title.trim() || f.name.replace(/\.[^.]+$/, ""), file_name: f.name, mime_type: f.type || "application/pdf", content_base64: String(r.result) });
    r.readAsDataURL(f);
  };

  return (
    <section aria-label="Uploads" className="mt-[16px] p-[6px] rounded-[22px] bg-[#F4EEDF]">
      <div className="flex items-baseline justify-between px-[12px] pt-[10px] pb-[8px]">
        <span className="text-[14px] font-[700]">Uploads</span>
        <span className="text-[12px] text-[#2819109E]">Migraine diary, referrals, past prescriptions</span>
      </div>
      {uploads.length > 0 && (
        <div className="flex flex-col gap-[4px] mb-[6px]">
          {uploads.map((u) => (
            <div key={u.id} className="flex flex-col gap-[4px] p-[12px] rounded-[16px] bg-[#FFFCF1]">
              <span className="flex items-center gap-[10px]">
                <span className="grow min-w-0">
                  <span className="block truncate text-[14px] font-[600]">{u.title}</span>
                  <span className="block truncate text-[12px] text-[#2819109E]">
                    {u.by === "clinic" ? "From the clinic" : "Uploaded by you"} · {u.fileName} · {Math.max(1, Math.round(u.size / 1024))} KB
                  </span>
                </span>
                <span className={`shrink-0 h-[24px] px-[9px] flex items-center rounded-full text-[11.5px] font-[700] ${u.by === "clinic" ? "bg-[#FCCFB8]" : "bg-[#DCE5D0]"}`}>{u.by === "clinic" ? "Received" : "Sent"}</span>
              </span>
              {u.by === "clinic" && u.text && <p className="whitespace-pre-wrap text-[13px] leading-[19px] text-[#281910CC]">{u.text}</p>}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-[6px] p-[10px] rounded-[16px] border-[1.5px] border-dashed border-[#28191033]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 120))}
          placeholder="Title, e.g. Migraine diary, last 30 days"
          className="h-[42px] px-[12px] rounded-[10px] bg-[#FFFCF1] text-[16px] md:text-[14px] outline-none"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 12000))}
          placeholder="Write or paste the form here, or attach a file"
          rows={3}
          className="px-[12px] py-[10px] rounded-[10px] bg-[#FFFCF1] text-[16px] md:text-[14px] leading-[20px] outline-none resize-y"
        />
        <input ref={file} type="file" accept={ACCEPT} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        <span className="flex flex-wrap gap-[6px]">
          <button type="button" disabled={busy} onClick={() => file.current?.click()} className="h-[42px] px-[14px] rounded-[10px] border border-solid border-[#28191033] text-[13.5px] font-[600] disabled:opacity-50">
            Attach File
          </button>
          <button
            type="button"
            disabled={busy || !title.trim() || !text.trim()}
            onClick={() => void send({ title: title.trim(), text: text.trim() })}
            className="h-[42px] px-[16px] rounded-[10px] bg-[#3A2516] text-[#FFFCF1] text-[13.5px] font-[600] disabled:bg-[#28191033]"
          >
            {busy ? "Uploading…" : "Upload to Clinic"}
          </button>
        </span>
        {error && <p className="text-[12.5px] font-[600] text-[#B4532F]">{error}</p>}
      </div>
    </section>
  );
}

/** One assessment as a printed questionnaire: every question numbered, the answers as boxes to tick, the score at the foot. */
function Questionnaire({ assessment, answers, locked, onAnswer }: { assessment: Assessment; answers: Record<string, number>; locked: boolean; onAnswer: (q: string, v: number) => Promise<unknown> }) {
  const result = isComplete(assessment, answers) ? assessment.result(answers) : null;
  return (
    <>
      <p className={`px-[18px] md:px-[24px] py-[10px] border-b border-solid ${RULE} text-[12.5px] leading-[18px] text-[#281910B3]`}>
        Read each question to your user in your own words and mark their answer.
      </p>
      <ol>
        {assessment.questions.map((q, i) => (
          <li key={q.id} className={`grid grid-cols-[28px_minmax(0,1fr)] gap-x-[6px] px-[18px] md:px-[24px] py-[12px] border-b border-solid ${RULE}`}>
            <span className="text-[13px] leading-[20px] tabular-nums text-[#28191080]">{i + 1}.</span>
            <div className="min-w-0">
              <p className="text-[14px] leading-[20px]">{q.prompt}</p>
              <div className="mt-[8px]">
                <Answer question={q} value={answers[q.id]} locked={locked} onSet={(v) => void onAnswer(q.id, v)} />
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-between gap-[12px] px-[18px] md:px-[24px] py-[14px]">
        <span className="text-[13px] font-[700]">Score</span>
        {result ? (
          <span className="flex items-center gap-[10px]">
            <span className={`${SERIF} text-[22px] leading-[24px]`}>{result.score}</span>
            <span className="h-[22px] px-[8px] flex items-center rounded-[4px] text-[11.5px] font-[700]" style={{ backgroundColor: result.tone }}>
              {result.band}
            </span>
          </span>
        ) : (
          <span className="text-[13px] text-[#28191080]">
            {assessment.questions.filter((q) => answers[q.id] !== undefined).length} of {assessment.questions.length} answered
          </span>
        )}
      </div>
    </>
  );
}

function Answer({ question: q, value, locked, onSet }: { question: AssessmentQuestion; value: number | undefined; locked: boolean; onSet: (v: number) => void }) {
  const [text, setText] = useState(value === undefined ? "" : String(value));
  useEffect(() => setText(value === undefined ? "" : String(value)), [value]);

  if (q.kind === "choice") {
    return (
      <div className="flex flex-wrap gap-x-[18px] gap-y-[8px]">
        {q.options.map((o) => (
          <button key={o.label} type="button" disabled={locked} onClick={() => onSet(o.value)} className="flex items-center gap-[8px] min-h-[28px] text-[14px] disabled:cursor-default">
            <Box on={value === o.value} size={16} />
            {o.label}
          </button>
        ))}
      </div>
    );
  }
  if (q.kind === "scale") {
    return (
      <div className={`inline-grid grid-cols-11 border border-solid ${RULE} rounded-[4px] overflow-hidden`}>
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            type="button"
            disabled={locked}
            onClick={() => onSet(i)}
            className={`w-[30px] md:w-[34px] h-[34px] text-[13px] font-[600] tabular-nums border-solid ${RULE} [&:not(:last-child)]:border-r transition-colors duration-150 ${value === i ? "bg-[#3A2516] text-[#FFFCF1]" : "hover:bg-[#F4EEDF]"}`}
          >
            {i}
          </button>
        ))}
      </div>
    );
  }
  const commit = () => {
    const n = Number(text.replace(/[^\d]/g, ""));
    if (text.trim() === "" || !Number.isFinite(n)) return;
    const v = Math.min(q.max, n);
    if (v !== value) onSet(v);
    setText(String(v));
  };
  return (
    <span className="inline-flex items-end gap-[8px]">
      <input
        inputMode="numeric"
        disabled={locked}
        value={text}
        aria-label={q.short}
        onChange={(e) => setText(e.target.value.replace(/[^\d]/g, "").slice(0, 3))}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="w-[64px] h-[30px] border-b-[1.5px] border-solid border-[#281910] bg-transparent text-center text-[16px] font-[600] tabular-nums outline-none focus:bg-[#F4EEDF66]"
      />
      <span className="pb-[4px] text-[13px] text-[#28191099]">{q.id === "months" ? "months" : "days"}</span>
    </span>
  );
}

/** A square check box, as printed on a form. */
function Box({ on, size }: { on: boolean; size: number }) {
  return (
    <span className="shrink-0 flex items-center justify-center rounded-[3px] border-[1.5px] border-solid" style={{ width: size, height: size, borderColor: on ? "#3A2516" : "#28191066", backgroundColor: on ? "#3A2516" : "transparent" }} aria-hidden="true">
      {on && (
        <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFFCF1" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
