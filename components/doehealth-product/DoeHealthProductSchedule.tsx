"use client";

/**
 * Schedule tab — the day as stacked hour rows of soft visit boxes. Clicking a box opens it bento-style:
 * it widens and grows taller to show its note, and the boxes beside and below make room.
 * A finished pre-visit video opens in a panel that slides in on the right. Week, month and year switch
 * to the calendar views.
 */
import { useEffect, useRef, useState } from "react";

import { DoeHealthProductCalendar, type ScheduleView, ScheduleViewSwitch } from "@/components/doehealth-product/DoeHealthProductCalendar";

const DISPLAY = "font-['P22MackinacPro-Medium','P22_Mackinac_Pro',system-ui,sans-serif] font-[500]";
const SANS = "font-['DM_Sans',system-ui,sans-serif]";
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const MOVE = `520ms ${EASE}`;

const CLOSED_H = 168;
const OPEN_H = 470;
const TOP_FADE = 40;
const BOTTOM_FADE = 96;

type Status = "signed" | "draft" | "listening" | "upcoming";

const STATUS: Record<Status, { label: string; tone: string; chip: string }> = {
  signed: { label: "Signed", tone: "#EEF1E6", chip: "#DCE5D0" },
  draft: { label: "Draft ready", tone: "#FBEDE4", chip: "#F6D2C4" },
  listening: { label: "Listening", tone: "#F8F0DA", chip: "#F3E2B4" },
  upcoming: { label: "Upcoming", tone: "#FAF6EC", chip: "#EEEADF" },
};

type Visit = {
  id: string;
  hour: number;
  time: string;
  who: string;
  reason: string;
  status: Status;
  note: { s: string; a: string; p: string };
  codes: string[];
};

const VISITS: Visit[] = [
  { id: "maya", hour: 8, time: "8:00", who: "Maya Chen", reason: "Migraine follow-up", status: "signed", note: { s: "Down to 3 migraines a month on topiramate. Mild tingling in fingers.", a: "Migraine without aura, improving.", p: "Continue topiramate 50 mg, headache diary, recheck in 3 months." }, codes: ["G43.009", "99213"] },
  { id: "ben", hour: 8, time: "8:15", who: "Ben Torres", reason: "Numb hands at night", status: "signed", note: { s: "Both hands go numb at night, worse on the right. Types all day.", a: "Likely carpal tunnel, both sides.", p: "Wrist splints at night, EMG and nerve study next week." }, codes: ["G56.03", "99213"] },
  { id: "priya", hour: 8, time: "8:30", who: "Priya Raman", reason: "New patient, migraines", status: "signed", note: { s: "Migraines 3–4 times a week with aura for six months.", a: "Migraine with aura.", p: "MRI ordered, start sumatriptan, headache diary." }, codes: ["G43.109", "99204"] },
  { id: "clara", hour: 8, time: "8:45", who: "Clara Diaz", reason: "Concussion follow-up", status: "signed", note: { s: "Headaches easing two weeks after a fall skiing. Screens still bother her.", a: "Post-concussion syndrome, improving.", p: "Gradual return to work, limit screens, recheck in 2 weeks." }, codes: ["F07.81", "99213"] },
  { id: "daniel", hour: 9, time: "9:00", who: "Daniel Okafor", reason: "Seizure follow-up", status: "signed", note: { s: "No seizures since March. Sleeping well, no missed doses.", a: "Focal epilepsy, controlled.", p: "Continue levetiracetam 500 mg twice daily, return in 6 months." }, codes: ["G40.209", "99214"] },
  { id: "grace", hour: 9, time: "9:30", who: "Grace Kim", reason: "Parkinson’s check", status: "signed", note: { s: "Tremor in the right hand, worse late afternoon. Walking steady.", a: "Parkinson’s disease, stable.", p: "Add a fourth carbidopa-levodopa dose, refill sent to CVS, PT referral." }, codes: ["G20.A1", "99214"] },
  { id: "ava", hour: 9, time: "9:45", who: "Ava Morales", reason: "Tingling in both feet", status: "signed", note: { s: "Pins and needles in both feet for three months, worse at night.", a: "Peripheral neuropathy, cause unclear.", p: "B12, A1C and thyroid labs, EMG if no cause found." }, codes: ["G62.9", "99213"] },
  { id: "henry", hour: 10, time: "10:00", who: "Henry Walsh", reason: "Memory concerns", status: "draft", note: { s: "Wife notes he repeats questions and misses bills. Still drives.", a: "Mild cognitive impairment, MoCA 23.", p: "Brain MRI, neuropsych testing, recheck in 3 months." }, codes: ["G31.84", "99214"] },
  { id: "hannah", hour: 11, time: "11:00", who: "Hannah Lee", reason: "MS follow-up", status: "signed", note: { s: "No new symptoms. Some fatigue in the afternoons.", a: "Relapsing MS, stable on ocrelizumab.", p: "Next infusion in April, MRI in 6 months." }, codes: ["G35", "99214"] },
  { id: "leo", hour: 11, time: "11:15", who: "Leo Jacobs", reason: "Staring spells, again", status: "draft", note: { s: "Teacher reports staring spells several times a day, per mom.", a: "Possible absence seizures.", p: "Sleep-deprived EEG, seizure safety handout, follow up after EEG." }, codes: ["R56.9", "99214"] },
  { id: "marcus", hour: 11, time: "11:30", who: "Marcus Webb", reason: "Burning feet", status: "draft", note: { s: "Burning in both feet keeps him up. Sugars in the 140s.", a: "Diabetic polyneuropathy.", p: "Raise gabapentin to 600 mg at bedtime, foot care, recheck in 3 months." }, codes: ["E11.42", "99214"] },
  { id: "iris", hour: 11, time: "11:45", who: "Iris Novak", reason: "Dizzy spells", status: "draft", note: { s: "Room spins for a minute when she rolls over in bed.", a: "Benign positional vertigo, right side.", p: "Epley maneuver done today, home exercises, call if worse." }, codes: ["H81.11", "99213"] },
  { id: "omar", hour: 13, time: "1:00", who: "Omar Haddad", reason: "Return to play", status: "draft", note: { s: "Hit heads in soccer three weeks ago. No headaches for 10 days.", a: "Concussion, resolved.", p: "Cleared for stepwise return to play, form sent to school." }, codes: ["S06.0X0D", "99213"] },
  { id: "lily", hour: 13, time: "1:30", who: "Lily Park", reason: "Headaches after school", status: "draft", note: { s: "Afternoon headaches most school days since September.", a: "Tension-type headache.", p: "Water and lunch at school, sleep routine, headache diary." }, codes: ["G44.209", "99213"] },
  { id: "elena", hour: 14, time: "2:00", who: "Elena Cho", reason: "Migraine prevention", status: "draft", note: { s: "Eight migraine days a month, missing work.", a: "Episodic migraine, needs prevention.", p: "Start topiramate 25 mg at night, recheck in 6 weeks." }, codes: ["G43.009", "99214"] },
  { id: "noah", hour: 14, time: "2:30", who: "Noah Bennett", reason: "Daytime sleepiness", status: "draft", note: { s: "Falls asleep at his desk and once at a red light.", a: "Suspected narcolepsy.", p: "Sleep study and MSLT at Mass General, no driving until then." }, codes: ["G47.419", "99214"] },
  { id: "paul", hour: 14, time: "2:45", who: "Paul Greene", reason: "Botox for migraine", status: "draft", note: { s: "Chronic migraine, 18 headache days a month before Botox.", a: "Chronic migraine, down to 9 days.", p: "Botox, 155 units across 31 sites. Next round in 12 weeks." }, codes: ["G43.709", "64615"] },
  { id: "ruth", hour: 15, time: "3:00", who: "Ruth Alvarez", reason: "Numb left leg", status: "listening", note: { s: "Started after lifting boxes on Friday…", a: "", p: "" }, codes: [] },
  { id: "sam", hour: 15, time: "3:30", who: "Sam Ortiz", reason: "Headache, two weeks", status: "upcoming", note: { s: "", a: "", p: "" }, codes: [] },
  { id: "june", hour: 16, time: "4:00", who: "June Patel", reason: "Medication review", status: "upcoming", note: { s: "", a: "", p: "" }, codes: [] },
  { id: "omar2", hour: 16, time: "4:15", who: "Theo Haddad", reason: "Tic follow-up", status: "upcoming", note: { s: "", a: "", p: "" }, codes: [] },
  { id: "mia", hour: 16, time: "4:30", who: "Mia Rossi", reason: "Speech delay, age 4", status: "upcoming", note: { s: "", a: "", p: "" }, codes: [] },
  { id: "victor", hour: 16, time: "4:45", who: "Victor Lane", reason: "Stroke follow-up", status: "upcoming", note: { s: "", a: "", p: "" }, codes: [] },
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];

const PANEL_W = 452;

type VideoState = "done" | "recording" | "sent" | "later";

/** The pre-visit intake video each patient records before they come in. */
const VIDEO: Record<string, { state: VideoState; length?: string; by?: string; progress?: number }> = {
  maya: { state: "done", length: "7:14" },
  ben: { state: "done", length: "5:52" },
  priya: { state: "done", length: "6:48" },
  clara: { state: "done", length: "3:20" },
  daniel: { state: "done", length: "7:40" },
  grace: { state: "sent" },
  ava: { state: "done", length: "5:31" },
  henry: { state: "done", length: "6:12" },
  hannah: { state: "done", length: "7:55" },
  leo: { state: "done", length: "6:02", by: "Mia (Mom)" },
  marcus: { state: "done", length: "8:11" },
  iris: { state: "done", length: "9:02" },
  omar: { state: "done", length: "4:47", by: "Omar (Dad)" },
  lily: { state: "done", length: "5:15", by: "Jin (Mom)" },
  elena: { state: "done", length: "6:30" },
  noah: { state: "sent" },
  paul: { state: "done", length: "5:05" },
  ruth: { state: "done", length: "7:28" },
  sam: { state: "done", length: "6:40" },
  june: { state: "recording", progress: 6 / 9 },
  omar2: { state: "done", length: "3:58", by: "Omar (Dad)" },
  mia: { state: "sent", by: "Ana (Mom)" },
  victor: { state: "later" },
};

const CLINICIANS = ["Dr. Brooks", "Dr. Patel", "Dr. Shah"];
const MEDS: Record<string, string> = {
  grace: "Carbidopa-levodopa 25/100",
  marcus: "Gabapentin 300 mg",
  hannah: "Ocrelizumab infusions",
  elena: "Sumatriptan as needed",
  paul: "Rizatriptan as needed",
};
const PLANS: Record<string, string> = { leo: "Harbor Mutual", omar: "Harbor Mutual", omar2: "Harbor Mutual", daniel: "Aetna", priya: "Aetna", maya: "Aetna" };

const clinicianFor = (v: Visit) => CLINICIANS[VISITS.indexOf(v) % CLINICIANS.length]!;
const filledBy = (v: Visit) => VIDEO[v.id]?.by ?? v.who.split(" ")[0]!;
const answersFor = (v: Visit) => [
  { label: "Reason", value: v.reason },
  { label: "In their words", value: v.note.s || "Shared in the video" },
  { label: "Medications", value: MEDS[v.id] ?? "None listed" },
  { label: "Allergies", value: v.id === "lily" ? "Amoxicillin" : "None known" },
  { label: "Insurance", value: PLANS[v.id] ?? "Blue Cross" },
];
const toSeconds = (len: string) => {
  const [m, s] = len.split(":").map(Number);
  return (m ?? 0) * 60 + (s ?? 0);
};
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const hourLabel = (h: number) => `${((h + 11) % 12) + 1} ${h < 12 ? "am" : "pm"}`;

function Chip({ status }: { status: Status }) {
  return (
    <span className={`flex items-center gap-[6px] h-[24px] px-[10px] shrink-0 rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[500] text-walnut`} style={{ backgroundColor: STATUS[status].chip }}>
      {status === "listening" && <span className="w-[6px] h-[6px] rounded-[99px] bg-[#C2603A] animate-pulse" />}
      {STATUS[status].label}
    </span>
  );
}

function NoteLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-[3px] p-[14px] rounded-[18px] bg-[#FFFCF1B3]">
      <span className={`text-[11px] leading-[14px] ${SANS} font-[600] uppercase tracking-[0.06em] text-sub`}>{label}</span>
      <span className={`text-[14px] leading-[20px] ${SANS} font-[500] text-walnut`}>{text}</span>
    </div>
  );
}

function PlayGlyph({ size = 10, color = "#FFFCF1" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" style={{ display: "block", marginLeft: size * 0.12 }}>
      <path d="M5 3.2v11.6c0 .6.7 1 1.2.6l8.6-5.8c.5-.3.5-1 0-1.3L6.2 2.6C5.7 2.3 5 2.6 5 3.2Z" fill={color} />
    </svg>
  );
}

/** Pre-visit video status. A finished video is a button that opens it in the side panel. */
function VideoChip({ visit, active, onOpen }: { visit: Visit; active: boolean; onOpen: () => void }) {
  const info = VIDEO[visit.id] ?? { state: "later" as const };
  const base = `flex items-center gap-[8px] h-[30px] min-w-[0px] rounded-[999px] text-[12px] leading-[16px] ${SANS} font-[600] text-walnut`;
  if (info.state === "done") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        onKeyDown={(e) => e.stopPropagation()}
        className={`${base} pl-[4px] pr-[12px] transition-colors duration-150 ${active ? "bg-ink [color:#FFFCF1]" : "bg-[#FFFCF1B3] hover:bg-paper"}`}
      >
        <span className={`w-[22px] h-[22px] shrink-0 flex items-center justify-center rounded-[999px] ${active ? "bg-paper" : "bg-ink"}`}>
          <PlayGlyph color={active ? "#140C04" : "#FFFCF1"} />
        </span>
        <span className="truncate">Pre-visit video</span>
        <span className={`shrink-0 font-[500] [font-variant-numeric:tabular-nums] ${active ? "[color:#FFFCF199]" : "text-sub"}`}>{info.length}</span>
      </button>
    );
  }
  if (info.state === "recording") {
    return (
      <span className={`${base} px-[12px] bg-[#FFFCF1B3]`}>
        <span className="w-[6px] h-[6px] shrink-0 rounded-[99px] bg-[#C2603A] animate-pulse" />
        <span className="truncate">Recording</span>
        <span className="w-[36px] h-[4px] shrink-0 rounded-[99px] bg-[#2819101A]">
          <span className="block h-full rounded-[99px] bg-walnut" style={{ width: `${(info.progress ?? 0) * 100}%` }} />
        </span>
      </span>
    );
  }
  return (
    <span className={`${base} px-[12px] border-[1.5px] border-dashed border-[#28191026] font-[500] text-sub`}>
      <span className="truncate">{info.state === "sent" ? "Video sent, not opened" : "Video link sends tonight"}</span>
    </span>
  );
}

function VideoPanel({ visit, onClose, onOpenNote }: { visit: Visit; onClose: () => void; onOpenNote: () => void }) {
  const total = toSeconds(VIDEO[visit.id]?.length ?? "0:00");
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setElapsed((s) => {
        if (s + 1 >= total) {
          setPlaying(false);
          return total;
        }
        return s + 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, total]);

  const tile = "flex flex-col grow basis-[0px] min-w-[0px] gap-[4px] py-[12px] px-[14px] rounded-[16px] bg-[#FFFCF10F]";
  const tileLabel = `text-[12px] leading-[16px] ${SANS} [color:#FFFCF180]`;
  const tileValue = `truncate text-[15px] leading-[20px] ${SANS} font-[500] [color:#FFFCF1]`;

  return (
    <div className="flex flex-col h-full gap-[14px] pt-[22px] pb-[20px] px-[20px] rounded-[24px] bg-ink">
      <div className="flex items-center justify-between gap-[12px]">
        <span className="flex flex-col min-w-[0px]">
          <span className={`text-[12px] leading-[16px] ${SANS} [color:#FFFCF180]`}>Pre-visit video</span>
          <span className={`truncate text-[28px] leading-[34px] tracking-[-0.02em] ${DISPLAY} [color:#FFFCF1]`}>{visit.who}</span>
        </span>
        <button type="button" aria-label="Close" onClick={onClose} className="w-[36px] h-[36px] shrink-0 flex items-center justify-center rounded-[999px] bg-[#FFFCF114] hover:bg-[#FFFCF124] transition-colors duration-150">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#FFFCF1" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className="relative flex items-center justify-center h-[220px] shrink-0 rounded-[20px] overflow-clip"
        style={{ backgroundImage: "linear-gradient(in oklab 160deg, oklab(31% 0.022 0.026) 0%, oklab(21% 0.014 0.011) 100%)" }}
      >
        <span className={`absolute top-[14px] left-[16px] text-[64px] leading-[64px] tracking-[-0.03em] ${DISPLAY} [color:#FFFCF114]`}>
          {visit.who
            .split(" ")
            .map((p) => p[0])
            .join("")}
        </span>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => {
            if (elapsed >= total) setElapsed(0);
            setPlaying((p) => !p);
          }}
          className="w-[56px] h-[56px] flex items-center justify-center rounded-[999px] bg-[#FFFCF1E6] hover:bg-paper transition-colors duration-150"
        >
          {playing ? (
            <span className="flex gap-[4px]">
              <span className="w-[4px] h-[16px] rounded-[2px] bg-ink" />
              <span className="w-[4px] h-[16px] rounded-[2px] bg-ink" />
            </span>
          ) : (
            <PlayGlyph size={18} color="#140C04" />
          )}
        </button>
        <span className="absolute left-[14px] right-[14px] bottom-[14px] flex items-center gap-[10px]">
          <span className={`text-[12px] leading-[16px] ${SANS} font-[500] [color:#FFFCF1] [font-variant-numeric:tabular-nums]`}>{mmss(elapsed)}</span>
          <span className="grow h-[4px] rounded-[99px] bg-[#FFFCF126]">
            <span className="block h-full rounded-[99px] bg-salmon" style={{ width: `${total ? (elapsed / total) * 100 : 0}%`, transition: "width 1s linear" }} />
          </span>
          <span className={`text-[12px] leading-[16px] ${SANS} [color:#FFFCF199] [font-variant-numeric:tabular-nums]`}>{mmss(total)}</span>
        </span>
      </div>

      <div className="flex gap-[8px]">
        <span className={tile}>
          <span className={tileLabel}>Visit</span>
          <span className={tileValue}>{visit.time}</span>
        </span>
        <span className={tile}>
          <span className={tileLabel}>Clinician</span>
          <span className={tileValue}>{clinicianFor(visit)}</span>
        </span>
        <span className={tile}>
          <span className={tileLabel}>Recorded by</span>
          <span className={tileValue}>{filledBy(visit)}</span>
        </span>
      </div>

      <div className="flex flex-col grow min-h-[0px] rounded-[18px] bg-[#FFFCF10A] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className={`px-[16px] pt-[14px] pb-[6px] text-[15px] leading-[20px] ${SANS} font-[500] [color:#FFFCF1]`}>Intake answers</span>
        {answersFor(visit).map((a, i) => (
          <div key={a.label} className={`flex items-start gap-[12px] px-[16px] py-[11px] ${i ? "border-t border-solid border-[#FFFCF10F]" : ""}`}>
            <span className={`w-[104px] shrink-0 text-[13px] leading-[18px] ${SANS} [color:#FFFCF180]`}>{a.label}</span>
            <span className={`grow min-w-[0px] text-[14px] leading-[18px] ${SANS} [color:#FFFCF1E6]`}>{a.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-[8px] shrink-0">
        <button type="button" onClick={onOpenNote} className={`grow h-[46px] rounded-[999px] bg-salmon hover:bg-[#F8C2A8] transition-colors duration-150 text-[15px] leading-[20px] ${SANS} font-[500] text-ink`}>
          Open visit
        </button>
        <button type="button" className={`h-[46px] px-[18px] rounded-[999px] border border-solid border-[#FFFCF12E] hover:bg-[#FFFCF10F] transition-colors duration-150 text-[15px] leading-[20px] ${SANS} font-[500] [color:#FFFCF1]`}>
          Message {visit.who.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}

function OpenBody({ visit, status, onSign }: { visit: Visit; status: Status; onSign: () => void }) {
  if (status === "upcoming") {
    return (
      <div className="grid grid-cols-3 gap-[8px]">
        <NoteLine
          label="Pre-visit video"
          text={
            VIDEO[visit.id]?.state === "done"
              ? `Recorded by ${filledBy(visit)}`
              : VIDEO[visit.id]?.state === "recording"
                ? "Recording now"
                : "Not recorded yet"
          }
        />
        <NoteLine label="Last visit" text="Spring, routine check" />
        <NoteLine label="Scribe" text="Starts listening when the visit begins" />
      </div>
    );
  }
  if (status === "listening") {
    return (
      <div className="flex flex-col gap-[8px]">
        <NoteLine label="Live" text={visit.note.s} />
        <div className="flex items-end gap-[3px] h-[40px] px-[14px]">
          {Array.from({ length: 48 }, (_, i) => (
            <span key={i} className="doe-ripple w-[4px] rounded-[99px] bg-[#D9B860]" style={{ height: `${20 + 70 * Math.abs(Math.sin(i * 0.7))}%`, animationDelay: `${(i % 8) * 0.12}s` }} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[1fr_220px] gap-[8px]">
      <div className="flex flex-col gap-[8px]">
        <NoteLine label="Subjective" text={visit.note.s} />
        <NoteLine label="Assessment" text={visit.note.a} />
        <NoteLine label="Plan" text={visit.note.p} />
      </div>
      <div className="flex flex-col gap-[8px] p-[14px] rounded-[18px] bg-[#FFFCF1B3]">
        <span className={`text-[11px] leading-[14px] ${SANS} font-[600] uppercase tracking-[0.06em] text-sub`}>Codes</span>
        <span className="flex flex-wrap gap-[6px]">
          {visit.codes.map((c) => (
            <span key={c} className={`h-[26px] flex items-center px-[10px] rounded-[999px] bg-sand text-[12px] leading-[16px] ${SANS} font-[600] text-walnut`}>
              {c}
            </span>
          ))}
        </span>
        <span className="mt-auto flex flex-col gap-[6px]">
          {status === "draft" ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSign();
              }}
              className={`h-[38px] rounded-[999px] bg-ink [color:#FFFCF1] hover:bg-[#2B1D12] transition-colors duration-150 text-[14px] leading-[18px] ${SANS} font-[500]`}
            >
              Sign note
            </button>
          ) : (
            <span className={`h-[38px] flex items-center justify-center rounded-[999px] bg-[#DCE5D0] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`}>In the chart</span>
          )}
        </span>
      </div>
    </div>
  );
}

function DayView({ onView }: { onView: (v: ScheduleView) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [viewing, setViewing] = useState(VISITS[0]!.id);
  const shown = VISITS.find((v) => v.id === (video ?? viewing)) ?? VISITS[0]!;
  const [statuses, setStatuses] = useState<Record<string, Status>>(() => Object.fromEntries(VISITS.map((v) => [v.id, v.status])));
  const [fade, setFade] = useState({ top: 0, bottom: BOTTOM_FADE });
  const listRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const count = (s: Status) => VISITS.filter((v) => statuses[v.id] === s).length;

  const measure = () => {
    const el = listRef.current;
    if (!el) return;
    const below = el.scrollHeight - el.clientHeight - el.scrollTop;
    const top = Math.round(Math.min(TOP_FADE, Math.max(0, el.scrollTop)));
    const bottom = Math.round(Math.min(BOTTOM_FADE, Math.max(0, below)));
    setFade((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
  };

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    if (innerRef.current) observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, []);

  const openVideo = (id: string) => {
    setViewing(id);
    setVideo((cur) => (cur === id ? null : id));
  };

  const toggle = (visit: Visit, force?: boolean) => {
    const next = force || open !== visit.id ? visit.id : null;
    setOpen(next);
    if (!next) return;
    window.setTimeout(() => {
      const el = listRef.current;
      const row = el?.querySelector<HTMLElement>(`[data-hour="${visit.hour}"]`);
      if (!el || !row) return;
      const top = row.offsetTop - TOP_FADE;
      const bottom = row.offsetTop + row.offsetHeight + BOTTOM_FADE / 2 - el.clientHeight;
      if (top < el.scrollTop) el.scrollTo({ top, behavior: "smooth" });
      else if (bottom > el.scrollTop) el.scrollTo({ top: Math.min(top, bottom), behavior: "smooth" });
    }, 540);
  };

  const mask = `linear-gradient(180deg, transparent 0px, #000 ${fade.top}px, #000 calc(100% - ${fade.bottom}px), transparent 100%)`;

  return (
    <div
      className="relative [font-synthesis:none] h-full w-full rounded-[24px] overflow-clip bg-paper antialiased"
      style={{ display: "grid", gridTemplateColumns: video ? `1fr ${PANEL_W}px` : "1fr 0px", transition: `grid-template-columns ${MOVE}` }}
    >
     <div className="flex flex-col min-w-[0px] h-full gap-[20px] pt-[36px] px-[40px]">
      <div className="relative flex items-end justify-between gap-[16px]">
        <span className={`text-[58px] leading-[62px] tracking-[-0.03em] ${DISPLAY} text-walnut`}>Schedule</span>
        <span className="flex items-center gap-[8px]">
          {(["signed", "draft", "listening"] as const).map((s) => (
            <span key={s} className={`flex items-center gap-[8px] h-[36px] px-[14px] rounded-[999px] text-[14px] leading-[18px] ${SANS} font-[500] text-walnut`} style={{ backgroundColor: STATUS[s].chip }}>
              <span className={DISPLAY}>{count(s)}</span>
              {s === "draft" ? "drafts" : STATUS[s].label.toLowerCase()}
            </span>
          ))}
          <span className="ml-[8px]">
            <ScheduleViewSwitch view="day" onChange={onView} />
          </span>
        </span>
      </div>

      <div
        ref={listRef}
        onScroll={measure}
        className="relative grow min-h-[0px] overflow-y-auto overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <div ref={innerRef} className="flex flex-col gap-[12px] pb-[48px]">
          {HOURS.map((h) => {
            const visits = VISITS.filter((v) => v.hour === h);
            const rowOpen = visits.some((v) => v.id === open);
            return (
              <div key={h} data-hour={h} className="flex items-start gap-[16px]">
                <span className={`w-[64px] shrink-0 pt-[18px] text-[18px] leading-[22px] tracking-[-0.01em] ${DISPLAY} text-sub`}>{hourLabel(h)}</span>
                {visits.length === 0 ? (
                  <div className={`grow flex items-center justify-center h-[64px] rounded-[26px] border-[1.5px] border-dashed border-[#2819101F] text-[14px] leading-[18px] ${SANS} font-[500] text-sub`}>
                    Lunch
                  </div>
                ) : (
                  <div className="grow min-w-[0px] flex items-start gap-[12px]">
                    {visits.map((v) => {
                      const isOpen = open === v.id;
                      const status = statuses[v.id]!;
                      return (
                        <div
                          key={v.id}
                          role="button"
                          tabIndex={0}
                          aria-expanded={isOpen}
                          onClick={() => toggle(v)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggle(v);
                            }
                          }}
                          className={`relative min-w-[0px] basis-[0px] overflow-hidden rounded-[28px] p-[20px] outline-none cursor-pointer ${isOpen ? "" : "hover:-translate-y-[1px]"}`}
                          style={{
                            flexGrow: isOpen ? 3.2 : 1,
                            height: rowOpen ? OPEN_H : CLOSED_H,
                            backgroundColor: STATUS[status].tone,
                            transition: `flex-grow ${MOVE}, height ${MOVE}, background-color 300ms ease, transform 200ms ease`,
                          }}
                        >
                          <div className="flex items-center justify-between gap-[10px]">
                            <span className={`text-[13px] leading-[16px] ${SANS} font-[600] text-sub`}>{v.time}</span>
                            <Chip status={status} />
                          </div>
                          <div className="flex flex-col gap-[2px] mt-[14px]">
                            <span className={`truncate tracking-[-0.01em] ${DISPLAY} text-walnut`} style={{ fontSize: isOpen ? 30 : 22, lineHeight: isOpen ? "34px" : "26px", transition: `font-size ${MOVE}, line-height ${MOVE}` }}>
                              {v.who}
                            </span>
                            <span className={`truncate text-[13px] leading-[18px] ${SANS} font-[500] text-sub`}>{v.reason}</span>
                          </div>
                          <div className="absolute left-[20px] right-[20px] bottom-[18px] flex items-center min-w-[0px]">
                            <VideoChip visit={v} active={video === v.id} onOpen={() => openVideo(v.id)} />
                          </div>
                          <div
                            className="absolute left-[20px] right-[20px] top-[140px]"
                            style={{ opacity: isOpen ? 1 : 0, transform: `translateY(${isOpen ? 0 : 8}px)`, transition: `opacity 260ms ease ${isOpen ? "220ms" : "0ms"}, transform ${MOVE}`, pointerEvents: isOpen ? "auto" : "none" }}
                          >
                            <OpenBody visit={v} status={status} onSign={() => setStatuses((prev) => ({ ...prev, [v.id]: "signed" }))} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
     </div>

      <div className="h-full min-w-[0px] overflow-hidden" aria-hidden={!video}>
        <div
          className="h-full py-[12px] pr-[12px]"
          style={{
            width: PANEL_W,
            opacity: video ? 1 : 0,
            transform: video ? "translateX(0)" : "translateX(20px)",
            transition: `opacity ${MOVE}, transform ${MOVE}`,
            pointerEvents: video ? "auto" : "none",
          }}
        >
          <VideoPanel
            key={shown.id}
            visit={shown}
            onClose={() => setVideo(null)}
            onOpenNote={() => {
              setVideo(null);
              toggle(shown, true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** Day is the default; the calendar stays mounted so its place is kept when you come back to it. */
export function DoeHealthProductSchedulePage() {
  const [view, setView] = useState<ScheduleView>("day");
  const [calendarView, setCalendarView] = useState<Exclude<ScheduleView, "day">>("week");
  const switchView = (v: ScheduleView) => {
    if (v !== "day") setCalendarView(v);
    setView(v);
  };

  return (
    <>
      <div className={view === "day" ? "h-full w-full" : "hidden"}>
        <DayView onView={switchView} />
      </div>
      <div className={view === "day" ? "hidden" : "h-full w-full"}>
        <DoeHealthProductCalendar view={calendarView} onView={switchView} />
      </div>
    </>
  );
}
