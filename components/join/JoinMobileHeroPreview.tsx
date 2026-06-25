import { inter, suisseIntl } from "@/lib/home/fonts";
import { JOIN_MOBILE_HERO_PREVIEW } from "@/lib/home/hero-triage-theme";
import { JOIN_FORM_BEIGE } from "@/lib/join/join-form-beige";

const MODULES = [
  { label: "Brain", value: "3", sub: "Active reviews", accent: "#1E343A" },
  { label: "Agents", value: "2", sub: "Running now", accent: "#D2774C" },
  { label: "Charts", value: "12", sub: "Synced today", accent: "#9A8F82" },
] as const;

const WORKFLOWS = [
  { title: "Prior auth packet", meta: "Citations attached · cardiology", progress: 72 },
  { title: "Referral routing", meta: "Cardio NP · Tue 9:20", progress: 46 },
  { title: "Ambient chart sync", meta: "Visit note structured", progress: 88 },
  { title: "Lab triage", meta: "Urgent panel flagged", progress: 34 },
] as const;

const REASONING = [
  "Cross-check new Rx against orthostatic symptoms",
  "Suggest cardio follow-up within 5 days",
] as const;

/** Join iPhone hero — platform workflow UI (not inbox/email). */
export function JoinMobileHeroPreview({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        left: JOIN_MOBILE_HERO_PREVIEW.left,
        top: JOIN_MOBILE_HERO_PREVIEW.top,
        right: JOIN_MOBILE_HERO_PREVIEW.right,
        bottom: JOIN_MOBILE_HERO_PREVIEW.bottom,
      }}
      aria-hidden
    >
      <div
        className="h-full w-full"
        style={{
          transform: `scale(${JOIN_MOBILE_HERO_PREVIEW.scale})`,
          transformOrigin: "top left",
        }}
      >
        <div
          className={`flex h-full min-h-[24rem] flex-col overflow-hidden rounded-xl border border-[#E5E1DA] bg-white ${inter.className}`}
        >
          <div
            className="flex items-center justify-between gap-3 border-b px-4 py-3.5"
            style={{ borderColor: "#EEEAE3", background: "#FAFAF8" }}
          >
            <div>
              <p className={`text-[1.05rem] font-medium tracking-[-0.02em] text-[#1E343A] ${suisseIntl.className}`}>
                Doe Platform
              </p>
              <p className="mt-0.5 text-[0.68rem] font-medium text-[#9A8F82]">Clinical workflow · today</p>
            </div>
            <span className="rounded-md bg-[#1E343A] px-2.5 py-1 text-[0.62rem] font-medium text-white">Live</span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-b p-3" style={{ borderColor: "#EEEAE3" }}>
            {MODULES.map((module) => (
              <div
                key={module.label}
                className="rounded-lg px-2.5 py-3"
                style={{ background: JOIN_FORM_BEIGE.page, border: `1px solid ${JOIN_FORM_BEIGE.border}` }}
              >
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-[#9A8F82]">
                  {module.label}
                </p>
                <p
                  className="mt-1 text-[1.45rem] font-medium leading-none tracking-[-0.03em]"
                  style={{ color: module.accent }}
                >
                  {module.value}
                </p>
                <p className="mt-1.5 text-[0.58rem] leading-snug text-[#1E343A]/52">{module.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-4 py-3.5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#1E343A]/58">
                Active workflows
              </p>
              <span className="text-[0.62rem] font-medium text-[#9A8F82]">4 in queue</span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden">
              {WORKFLOWS.map((workflow) => (
                <div
                  key={workflow.title}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: JOIN_FORM_BEIGE.page, border: `1px solid ${JOIN_FORM_BEIGE.border}` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[0.88rem] font-medium leading-snug tracking-[-0.02em] text-[#1E343A]">
                        {workflow.title}
                      </p>
                      <p className="mt-1 text-[0.66rem] leading-snug text-[#9A8F82]">{workflow.meta}</p>
                    </div>
                    <span className="shrink-0 text-[0.62rem] font-medium tabular-nums text-[#D2774C]">
                      {workflow.progress}%
                    </span>
                  </div>
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[#E8E4DD]">
                    <div
                      className="h-full rounded-full bg-[#D2774C]"
                      style={{ width: `${workflow.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="border-t px-4 py-3.5"
            style={{ borderColor: "#EEEAE3", background: "#FAFAF8" }}
          >
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#9A8F82]">
              Clinical reasoning
            </p>
            <div className="mt-2 space-y-2">
              {REASONING.map((line, index) => (
                <div key={line} className="flex gap-2.5">
                  <span className="w-5 shrink-0 text-[0.62rem] font-semibold tabular-nums text-[#D2774C]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.72rem] leading-snug text-[#1E343A]/72">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
