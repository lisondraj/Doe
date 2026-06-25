import { inter } from "@/lib/home/fonts";
import {
  JOIN_HERO_AI_CARD_INVERSE_SCALE,
  JOIN_HERO_AI_FEATURE_CARDS,
  JOIN_HERO_TRIAGE_PANEL,
  JOIN_HERO_TRIAGE_SCALE,
  type JoinHeroAiFeatureCardId,
} from "@/lib/home/hero-triage-theme";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

const PANEL_SHELL =
  "overflow-hidden rounded-xl border border-[#E5E1DA] bg-white";

function JoinHeroBrainPanel() {
  return (
    <div className={`${PANEL_SHELL} w-[26rem]`}>
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-3"
        style={{ borderColor: "#EEEAE3", background: "#FAFAF8" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1" aria-hidden>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D2774C]" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D2774C]/55" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D2774C]/30" />
          </span>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#1E343A]/58">
            Brain
          </span>
        </div>
        <span className="rounded-md bg-[#1E343A] px-2.5 py-1 text-[0.62rem] font-medium text-white">
          Live
        </span>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div
          className="rounded-lg px-3.5 py-3"
          style={{ background: JOIN_FORM_BEIGE.page, border: `1px solid ${JOIN_FORM_BEIGE.border}` }}
        >
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#9A8F82]">
            Patient context
          </p>
          <p className="mt-1.5 text-[0.92rem] font-medium leading-snug tracking-[-0.02em] text-[#1E343A]">
            Dizziness after metformin titration · A1c 8.2%
          </p>
        </div>

        {[
          { step: "01", text: "Cross-check new Rx against orthostatic symptoms", tone: "high" },
          { step: "02", text: "Low confidence on dehydration — flag for review", tone: "warn" },
          { step: "03", text: "Suggest cardio follow-up within 5 days", tone: "neutral" },
        ].map((item) => (
          <div key={item.step} className="flex gap-3">
            <span className="mt-0.5 w-7 shrink-0 text-[0.68rem] font-semibold tabular-nums text-[#D2774C]">
              {item.step}
            </span>
            <div className="min-w-0 flex-1 border-l pl-3" style={{ borderColor: "#EEEAE3" }}>
              <p className="text-[0.82rem] font-normal leading-snug text-[#1E343A]/78">{item.text}</p>
              {item.tone === "warn" ? (
                <span className="mt-1.5 inline-block rounded-md bg-[#EFECE7] px-2 py-0.5 text-[0.58rem] font-medium text-[#1E343A]/62">
                  Needs sign-off
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JoinHeroAgentsPanel() {
  return (
    <div className={`${PANEL_SHELL} w-[28rem]`}>
      <div className="grid grid-cols-3 gap-2 border-b p-3" style={{ borderColor: "#EEEAE3", background: "#FAFAF8" }}>
        {[
          { label: "Scheduled", value: "4", accent: "#1E343A" },
          { label: "Running", value: "2", accent: "#D2774C" },
          { label: "Queued", value: "1", accent: "#9A8F82" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg px-2.5 py-2.5"
            style={{ background: "#FFFFFF", border: `1px solid ${JOIN_FORM_BEIGE.border}` }}
          >
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-[#9A8F82]">
              {stat.label}
            </p>
            <p
              className="mt-1 text-[1.35rem] font-medium leading-none tracking-[-0.03em]"
              style={{ color: stat.accent }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#1E343A]/58">
            Agents
          </p>
          <span className="text-[0.62rem] font-medium text-[#9A8F82]">Follow-ups in inbox</span>
        </div>

        <div className="space-y-2.5">
          {[
            { title: "Prior auth packet", meta: "Chart citations attached", state: "Running", fill: 68 },
            { title: "Referral chase", meta: "Cardio · Tue 9:20", state: "Queued", fill: 24 },
            { title: "Lab routing", meta: "Synopsis drafted", state: "Done", fill: 100 },
          ].map((task) => (
            <div
              key={task.title}
              className="rounded-lg px-3.5 py-3"
              style={{ background: JOIN_FORM_BEIGE.page, border: `1px solid ${JOIN_FORM_BEIGE.border}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.88rem] font-medium leading-snug tracking-[-0.02em] text-[#1E343A]">
                    {task.title}
                  </p>
                  <p className="mt-1 text-[0.68rem] leading-snug text-[#9A8F82]">{task.meta}</p>
                </div>
                <span
                  className="shrink-0 rounded-md px-2 py-0.5 text-[0.58rem] font-medium"
                  style={{
                    background: task.state === "Running" ? "#D2774C" : task.state === "Done" ? "#1E343A" : "#EFECE7",
                    color: task.state === "Queued" ? "#1E343A" : "#FFFFFF",
                  }}
                >
                  {task.state}
                </span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#E8E4DD]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${task.fill}%`,
                    background: task.state === "Done" ? "#1E343A" : "#D2774C",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PANELS: Record<JoinHeroAiFeatureCardId, () => JSX.Element> = {
  brain: JoinHeroBrainPanel,
  agents: JoinHeroAgentsPanel,
};

const CARD_ANCHOR: Record<
  JoinHeroAiFeatureCardId,
  { className: string; transform: string }
> = {
  brain: {
    className: "left-0 top-1/2",
    transform: `translate(-50%, -50%) scale(${JOIN_HERO_AI_CARD_INVERSE_SCALE})`,
  },
  agents: {
    className: "left-1/2 top-full",
    transform: `translate(-50%, -50%) scale(${JOIN_HERO_AI_CARD_INVERSE_SCALE})`,
  },
};

function JoinHeroAiFeatureCard({ id, zIndex }: { id: JoinHeroAiFeatureCardId; zIndex: number }) {
  const Panel = PANELS[id];
  const anchor = CARD_ANCHOR[id];

  return (
    <div
      className={`absolute ${anchor.className} ${inter.className}`}
      style={{
        zIndex,
        transform: anchor.transform,
      }}
      aria-hidden
    >
      <Panel />
    </div>
  );
}

/** Desktop join hero — AI panels locked to inbox preview edge midpoints. */
export function JoinHeroAiFeatureCards({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        top: JOIN_HERO_TRIAGE_PANEL.top,
        right: JOIN_HERO_TRIAGE_PANEL.right,
        bottom: JOIN_HERO_TRIAGE_PANEL.bottom,
        width: JOIN_HERO_TRIAGE_PANEL.width,
      }}
      aria-hidden
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: `scale(${JOIN_HERO_TRIAGE_SCALE})`,
          transformOrigin: "bottom right",
        }}
      >
        {JOIN_HERO_AI_FEATURE_CARDS.map((config) => (
          <JoinHeroAiFeatureCard key={config.id} id={config.id} zIndex={config.zIndex} />
        ))}
      </div>
    </div>
  );
}
