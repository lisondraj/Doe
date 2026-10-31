"use client";

/**
 * /demo/forms/<token>: the read-only copy of the forms a patient's agent filled in at Dr. Brooks' clinic, opened from
 * the private link the agent pasted into their chat. Intake, each assessment with its answers and score, the signed
 * consent and any uploads, printable, with the link's safeguards at the foot.
 */
import { DISPLAY, DemoFrame } from "@/components/demo/DemoFrame";
import { ASSESSMENTS } from "@/lib/demo/demo-assessments";
import { CLINIC, INTAKE_FIELDS } from "@/lib/demo/demo-clinic";
import type { DemoSession, DemoShare } from "@/lib/demo/demo-types";

/** The shared copy: just what the page shows (see openShare in demo-service). */
type Copy = Pick<DemoSession, "userName" | "agentName" | "forms"> & { booking: Pick<DemoSession["booking"], "status" | "slotId" | "label"> };
import { lora } from "@/lib/home/fonts";

type Score = { id: string; name: string; complete: boolean; score: string | null; band: string | null; tone: string | null };

/** Plain facts about how the link is protected (see SHARE_SAFEGUARDS in demo-service). */
const SAFEGUARDS = [
  "A private link made for you; it isn't listed or searchable anywhere",
  "Read-only, and every time it's opened is logged for the clinic",
  "Sent over HTTPS and stored encrypted",
  "Handled under Doe's privacy policy, which follows Ontario's PHIPA and Canada's PIPEDA where they apply",
];

const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" }) : "—");

function Section({ title, sub, right, children }: { title: string; sub?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid rounded-[24px] bg-[#F4EEDF] p-[6px] print:bg-white print:border print:border-[#2819101F]">
      <div className="flex items-start justify-between gap-[10px] px-[14px] pt-[12px] pb-[10px]">
        <span className="min-w-0">
          <h2 className={`${DISPLAY} text-[21px] leading-[26px] tracking-[-0.01em]`}>{title}</h2>
          {sub && <p className="mt-[2px] text-[12.5px] text-[#2819109E]">{sub}</p>}
        </span>
        {right}
      </div>
      <div className="flex flex-col gap-[4px]">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-x-[16px] gap-y-[2px] p-[12px_14px] rounded-[16px] bg-[#FFFCF1]">
      <span className="text-[13px] leading-[19px] text-[#2819109E]">{k}</span>
      <span className="text-[14.5px] leading-[20px] font-[500] break-words">{v}</span>
    </div>
  );
}

export function DemoSharedForms({ session: s, share, scores }: { session: Copy; share: DemoShare; scores: Score[] }) {
  const uploads = (s.forms.uploads ?? []).filter((u) => u.by === "agent");
  const answer = (aid: string, qid: string) => {
    const v = s.forms.assessments[aid]?.[qid];
    if (v === undefined) return <span className="text-[#28191066]">Not answered</span>;
    const q = ASSESSMENTS.find((a) => a.id === aid)!.questions.find((x) => x.id === qid)!;
    if (q.kind === "choice") return q.options.find((o) => o.value === v)?.label ?? String(v);
    if (q.kind === "scale") return `${v} out of 10`;
    return `${v} day${v === 1 ? "" : "s"}`;
  };

  return (
    <DemoFrame
      right={
        <button type="button" onClick={() => window.print()} className="print:hidden h-[38px] px-[16px] rounded-full bg-[#3A2516] text-[#FFFCF1] text-[13.5px] font-[600]">
          Print or Save PDF
        </button>
      }
    >
      <main className="mx-auto w-full max-w-[760px] px-[14px] md:px-[24px] pt-[8px] pb-[64px] flex flex-col gap-[10px]">
        <div className="px-[6px] pb-[6px]">
          <p className="text-[13px] font-[500] text-[#2819109E]">Your copy · {CLINIC.name}</p>
          <h1 className={`${DISPLAY} mt-[4px] text-[34px] leading-[38px] md:text-[44px] md:leading-[48px] tracking-[-0.02em]`}>{s.userName}&apos;s forms</h1>
          <p className="mt-[8px] text-[14px] leading-[20px] text-[#281910CC]">
            Filled in by {s.agentName} for you{s.forms.sentAt ? ` and sent to the clinic on ${day(s.forms.sentAt)}` : ""}. If anything is wrong, tell {s.agentName} or call the clinic at {CLINIC.phone}.
          </p>
          <div className="mt-[10px] flex flex-wrap gap-[6px]">
            <span className={`h-[28px] px-[12px] flex items-center rounded-full text-[12.5px] font-[600] ${s.forms.status === "sent" ? "bg-[#DCE5D0]" : "bg-[#F3E7C9]"}`}>{s.forms.status === "sent" ? "✓ Sent to the clinic" : "In progress"}</span>
            {s.booking.slotId && s.booking.status !== "declined" && (
              <span className="h-[28px] px-[12px] flex items-center rounded-full bg-[#F4EEDF] text-[12.5px] font-[600]">
                {s.booking.status === "confirmed" ? "Booked" : "Requested"} · {s.booking.label}
              </span>
            )}
          </div>
        </div>

        <Section title="New patient intake" sub="About you, headache history and safety">
          {INTAKE_FIELDS.filter((f) => f.id !== "consent").map((f) => (
            <Row key={f.id} k={f.label} v={s.forms.intake[f.id]?.trim() || <span className="text-[#28191066]">—</span>} />
          ))}
        </Section>

        {ASSESSMENTS.map((a) => {
          const sc = scores.find((x) => x.id === a.id);
          return (
            <Section
              key={a.id}
              title={a.name}
              sub={`${a.full} · ${a.window}`}
              right={
                sc?.complete ? (
                  <span className="shrink-0 flex flex-col items-end gap-[4px]">
                    <span className={`${DISPLAY} text-[22px] leading-[24px]`}>{sc.score}</span>
                    <span className="h-[22px] px-[9px] flex items-center rounded-full text-[11px] font-[700]" style={{ backgroundColor: sc.tone ?? "#F4EEDF" }}>
                      {sc.band}
                    </span>
                  </span>
                ) : (
                  <span className="shrink-0 text-[12px] font-[600] text-[#2819109E]">Not finished</span>
                )
              }
            >
              {a.questions.map((q, i) => (
                <Row key={q.id} k={`${i + 1}. ${q.prompt}`} v={answer(a.id, q.id)} />
              ))}
            </Section>
          );
        })}

        <Section title="Consent to treatment" sub="Botox for chronic migraine">
          <div className="p-[14px] rounded-[16px] bg-[#FFFCF1] text-[13.5px] leading-[20px] text-[#281910CC]">
            I consent to onabotulinumtoxinA (Botox) injections for chronic migraine by {CLINIC.doctor} or a clinic provider. The benefits, risks and alternatives have been explained to me,
            including neck pain, eyelid droop and temporary weakness, and I may withdraw consent at any time.
            <div className="mt-[16px] grid grid-cols-[minmax(0,1fr)_130px] gap-[16px] items-end">
              <span className="min-h-[40px] flex items-end pb-[4px] border-b-[1.5px] border-solid border-[#281910]">
                {s.forms.signedBy ? <span className={`${lora.className} italic text-[22px] leading-[28px] text-[#281910]`}>{s.forms.signedBy}</span> : <span className="text-[#28191066]">Not signed yet</span>}
              </span>
              <span className="min-h-[40px] flex items-end pb-[4px] border-b-[1.5px] border-solid border-[#281910] text-[14px] text-[#281910]">{s.forms.signedAt ? new Date(s.forms.signedAt).toLocaleDateString("en-CA") : ""}</span>
              <span className="-mt-[12px] text-[11.5px] text-[#28191099]">Signature of patient</span>
              <span className="-mt-[12px] text-[11.5px] text-[#28191099]">Date</span>
            </div>
          </div>
        </Section>

        {uploads.length > 0 && (
          <Section title="What was attached" sub="Sent to the clinic with your forms">
            {uploads.map((u) => (
              <div key={u.id} className="p-[12px_14px] rounded-[16px] bg-[#FFFCF1]">
                <div className="text-[14.5px] font-[600]">{u.title}</div>
                <div className="text-[12px] text-[#2819109E]">
                  {u.fileName} · {Math.max(1, Math.round(u.size / 1024))} KB · {day(u.at)}
                </div>
                {u.text && <pre className="mt-[8px] max-h-[360px] overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-[18px] text-[#281910CC] print:max-h-none">{u.text}</pre>}
              </div>
            ))}
          </Section>
        )}

        <section className="mt-[6px] p-[16px] rounded-[24px] border-[1.5px] border-dashed border-[#28191033]">
          <p className="text-[13.5px] font-[700]">About this link</p>
          <ul className="mt-[8px] flex flex-col gap-[6px] text-[13px] leading-[19px] text-[#281910CC]">
            <li>
              • Works until {day(share.expiresAt)}, then stops. The clinic can turn it off sooner.
            </li>
            {SAFEGUARDS.map((x) => (
              <li key={x}>• {x}</li>
            ))}
            <li>• Please don&apos;t forward it; anyone with the link can see these forms.</li>
          </ul>
          <p className="mt-[10px] text-[11.5px] text-[#28191080]">Demo: Dr. Brooks&apos; Migraine Clinic and the people in it are fictional.</p>
        </section>
      </main>
    </DemoFrame>
  );
}

export function DemoShareUnavailable({ reason }: { reason: "missing" | "expired" | "revoked" }) {
  const text =
    reason === "expired"
      ? "This link has expired. Ask your agent for a new copy of your forms."
      : reason === "revoked"
        ? "The clinic has turned this link off. Ask your agent or the clinic for a new copy."
        : "This link doesn't work. Check that you copied all of it, or ask your agent for a new one.";
  return (
    <DemoFrame>
      <main className="mx-auto max-w-[520px] px-[18px] pt-[40px] pb-[64px] text-center">
        <h1 className={`${DISPLAY} text-[30px] leading-[34px] tracking-[-0.02em]`}>{reason === "expired" ? "Link expired" : reason === "revoked" ? "Link turned off" : "Link not found"}</h1>
        <p className="mt-[10px] text-[14.5px] leading-[21px] text-[#281910CC]">{text}</p>
      </main>
    </DemoFrame>
  );
}
