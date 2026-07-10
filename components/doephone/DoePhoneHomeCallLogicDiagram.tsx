"use client";

import { dmSans } from "@/lib/home/fonts";

const CALL_TYPE = "Refill request";

const TRUNK_STEPS = [
  { id: "trigger", label: "Call answered", status: "done" as const },
  { id: "verify", label: "Verify patient", status: "done" as const },
  { id: "condition", label: "On active med list?", status: "current" as const, kind: "condition" as const },
] as const;

const PATHS = [
  {
    id: "yes",
    label: "Yes",
    steps: [
      { id: "eligibility", label: "Check refill date", status: "active" as const },
      { id: "route", label: "Send to pharmacy", status: "upcoming" as const },
    ],
  },
  {
    id: "no",
    label: "No",
    steps: [
      { id: "transfer", label: "Transfer to desk", status: "upcoming" as const },
      { id: "escalate", label: "Flag for review", status: "upcoming" as const },
    ],
  },
] as const;

const TRACK_STEPS = [
  { id: "answer", label: "Answer", status: "done" as const },
  { id: "verify", label: "Verify", status: "done" as const },
  { id: "refill", label: "Refill", status: "active" as const },
  { id: "route", label: "Route", status: "upcoming" as const },
] as const;

const TRACK_ACTIVE_INDEX = TRACK_STEPS.findIndex((step) => step.status === "active");
const TRACK_FILL_PERCENT =
  TRACK_ACTIVE_INDEX <= 0 ? 0 : (TRACK_ACTIVE_INDEX / (TRACK_STEPS.length - 1)) * 100;

type StepStatus = "done" | "current" | "active" | "upcoming";

function TrunkMarker({ status, kind }: { status: StepStatus; kind?: "condition" }) {
  return (
    <span
      className={`home-call-logic-diagram__marker home-call-logic-diagram__marker--${status}${
        kind === "condition" ? " home-call-logic-diagram__marker--condition" : ""
      }`}
      aria-hidden
    />
  );
}

function PathMarker({ status }: { status: StepStatus }) {
  return (
    <span
      className={`home-call-logic-diagram__path-marker home-call-logic-diagram__path-marker--${status}`}
      aria-hidden
    />
  );
}

/** Mock refill call-logic runbook on the Customize agents shader band. */
export function DoePhoneHomeCallLogicDiagram() {
  return (
    <div className={`home-call-logic-diagram ${dmSans.className}`} aria-hidden>
      <header className="home-call-logic-diagram__header">
        <div className="home-call-logic-diagram__header-copy">
          <h3 className="home-call-logic-diagram__title">{CALL_TYPE}</h3>
          <p className="home-call-logic-diagram__meta">Agent call logic</p>
        </div>
        <span className="home-call-logic-diagram__step-count">
          {TRUNK_STEPS.length + PATHS[0].steps.length}
          <span className="home-call-logic-diagram__step-count-unit"> steps</span>
        </span>
      </header>

      <div className="home-call-logic-diagram__panel">
        <ol className="home-call-logic-diagram__trunk">
          {TRUNK_STEPS.map((step, index) => (
            <li
              key={step.id}
              className={`home-call-logic-diagram__trunk-step home-call-logic-diagram__trunk-step--${step.status}${
                step.kind === "condition" ? " home-call-logic-diagram__trunk-step--condition" : ""
              }`}
            >
              <TrunkMarker status={step.status} kind={step.kind} />
              <span className="home-call-logic-diagram__trunk-label">{step.label}</span>
              {index < TRUNK_STEPS.length - 1 ? (
                <span className="home-call-logic-diagram__trunk-line" aria-hidden />
              ) : null}
            </li>
          ))}
        </ol>

        <div className="home-call-logic-diagram__fork">
          {PATHS.map((path) => (
            <div key={path.id} className={`home-call-logic-diagram__path home-call-logic-diagram__path--${path.id}`}>
              <span className="home-call-logic-diagram__path-label">{path.label}</span>
              <ol className="home-call-logic-diagram__path-steps">
                {path.steps.map((step) => (
                  <li
                    key={step.id}
                    className={`home-call-logic-diagram__path-step home-call-logic-diagram__path-step--${step.status}`}
                  >
                    <PathMarker status={step.status} />
                    <span className="home-call-logic-diagram__path-step-label">{step.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <div className="home-call-logic-diagram__track">
        <div className="home-call-logic-diagram__track-rail">
          <span className="home-call-logic-diagram__track-fill" style={{ width: `${TRACK_FILL_PERCENT}%` }} />
        </div>
        <div className="home-call-logic-diagram__track-labels">
          {TRACK_STEPS.map((step) => (
            <span
              key={step.id}
              className={`home-call-logic-diagram__track-label${
                step.status === "active" ? " home-call-logic-diagram__track-label--active" : ""
              }`}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <button type="button" className="home-call-logic-diagram__add-step" tabIndex={-1}>
        <span aria-hidden>+</span>
        Add step
      </button>
    </div>
  );
}
