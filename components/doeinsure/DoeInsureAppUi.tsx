"use client";

import { useState, type ReactNode } from "react";

import {
  DOEINSURE_APP,
  DOEINSURE_HERO_CLASSES,
  DOEINSURE_MATCH,
  DOEINSURE_POLICY_SAMPLES,
  DOEINSURE_QUOTE,
} from "@/lib/doeinsure/doeinsure-copy";

export function DoeInsureAppFrame({
  file,
  children,
  className = "",
}: {
  file: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`doeinsure-app${className ? ` ${className}` : ""}`}>
      <div className="doeinsure-app__bar">
        <strong>
          {DOEINSURE_APP.mark} <span>{DOEINSURE_APP.accent}</span>
        </strong>
        <em>{file}</em>
      </div>
      {children}
    </div>
  );
}

function AppRail({
  active,
  onChange,
}: {
  active: string;
  onChange?: (id: string) => void;
}) {
  return (
    <nav className="doeinsure-app__rail" aria-label="Doe Insure platform">
      {DOEINSURE_APP.nav.map((item) => (
        <button
          key={item.id}
          type="button"
          className={active === item.id ? "is-on" : undefined}
          disabled={!onChange}
          onClick={() => onChange?.(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function IntakeMods({
  company,
  website,
  classIndex,
  onClass,
}: {
  company: string;
  website: string;
  classIndex: number;
  onClass: (index: number) => void;
}) {
  return (
    <div className="doeinsure-app__stage">
      <span className="doeinsure-app__kicker">{DOEINSURE_APP.intake.kicker}</span>
      <div className="doeinsure-mod">
        <span>{DOEINSURE_APP.intake.company}</span>
        <b>{company}</b>
      </div>
      <div className="doeinsure-mod">
        <span>{DOEINSURE_APP.intake.website}</span>
        <b>{website}</b>
      </div>
      <div className="doeinsure-mod">
        <span>{DOEINSURE_APP.intake.classLabel}</span>
        <div className="doeinsure-app__chips">
          {DOEINSURE_HERO_CLASSES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={classIndex === index ? "is-on" : undefined}
              onClick={() => onClass(index)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <p className="doeinsure-app__hint">{DOEINSURE_APP.intake.hint}</p>
    </div>
  );
}

function StackMods({
  on,
  onToggle,
}: {
  on: Record<string, boolean>;
  onToggle: (name: string) => void;
}) {
  return (
    <div className="doeinsure-app__stage">
      <span className="doeinsure-app__kicker">{DOEINSURE_APP.stack.kicker}</span>
      <div className="doeinsure-app__grid">
        {DOEINSURE_QUOTE.sources.map((source) => {
          const active = Boolean(on[source.name]);
          return (
            <button
              key={source.name}
              type="button"
              className={`doeinsure-mod doeinsure-mod--btn${active ? " is-on" : ""}`}
              aria-pressed={active}
              onClick={() => onToggle(source.name)}
            >
              <span>{active ? DOEINSURE_APP.stack.reading : DOEINSURE_APP.stack.connect}</span>
              <b>{source.name}</b>
              <em>{active ? source.value : source.reads}</em>
            </button>
          );
        })}
      </div>
      <p className="doeinsure-app__hint">{DOEINSURE_APP.stack.hint}</p>
    </div>
  );
}

function RiskMods({
  connected,
  total,
  limit,
  status,
}: {
  connected: number;
  total: number;
  limit: string;
  status: string;
}) {
  const ready = connected === total;
  return (
    <div className="doeinsure-app__stage">
      <span className="doeinsure-app__kicker">{DOEINSURE_APP.risk.kicker}</span>
      <div className="doeinsure-mod doeinsure-mod--score">
        <span>Risk score</span>
        <b>{ready ? DOEINSURE_APP.risk.score : "—"}</b>
        <em>{ready ? DOEINSURE_APP.risk.label : `${connected} of ${total} APIs`}</em>
      </div>
      <div className="doeinsure-app__grid doeinsure-app__grid--2">
        {DOEINSURE_APP.risk.signals.map((signal) => (
          <div key={signal.name} className={`doeinsure-mod${ready ? " is-on" : ""}`}>
            <span>{signal.name}</span>
            <b>{ready ? signal.value : "Waiting"}</b>
          </div>
        ))}
      </div>
      <div className="doeinsure-app__grid doeinsure-app__grid--2">
        <div className="doeinsure-mod">
          <span>Working limit</span>
          <b>{limit}</b>
        </div>
        <div className="doeinsure-mod">
          <span>Status</span>
          <b>{status}</b>
        </div>
      </div>
      <p className="doeinsure-app__hint">{DOEINSURE_APP.risk.hint}</p>
    </div>
  );
}

export function DoeInsureHeroApp() {
  const [tab, setTab] = useState("risk");
  const [index, setIndex] = useState(0);
  const [on, setOn] = useState<Record<string, boolean>>({ AWS: true, GitHub: true });
  const policy = DOEINSURE_POLICY_SAMPLES[index];
  const connected = DOEINSURE_QUOTE.sources.filter((source) => on[source.name]).length;

  return (
    <DoeInsureAppFrame file={policy.insured}>
      <div className="doeinsure-app__shell">
        <AppRail active={tab} onChange={setTab} />
        {tab === "intake" ? (
          <IntakeMods
            company={policy.insured}
            website="harbornotes.com"
            classIndex={index}
            onClass={setIndex}
          />
        ) : null}
        {tab === "stack" ? (
          <StackMods
            on={on}
            onToggle={(name) => setOn((current) => ({ ...current, [name]: !current[name] }))}
          />
        ) : null}
        {tab === "risk" ? (
          <RiskMods
            connected={connected}
            total={DOEINSURE_QUOTE.sources.length}
            limit={policy.limit}
            status={policy.status}
          />
        ) : null}
      </div>
    </DoeInsureAppFrame>
  );
}

export function DoeInsureQuoteApp() {
  const [tab, setTab] = useState("stack");
  const [on, setOn] = useState<Record<string, boolean>>({});
  const connected = DOEINSURE_QUOTE.sources.filter((source) => on[source.name]).length;
  const ready = connected === DOEINSURE_QUOTE.sources.length;

  return (
    <DoeInsureAppFrame file="New company">
      <div className="doeinsure-app__shell">
        <AppRail active={tab} onChange={setTab} />
        {tab === "intake" ? (
          <IntakeMods
            company="Harbor Notes, Inc."
            website="harbornotes.com"
            classIndex={0}
            onClass={() => setTab("stack")}
          />
        ) : null}
        {tab === "stack" ? (
          <StackMods
            on={on}
            onToggle={(name) => setOn((current) => ({ ...current, [name]: !current[name] }))}
          />
        ) : null}
        {tab === "risk" ? (
          <RiskMods
            connected={connected}
            total={DOEINSURE_QUOTE.sources.length}
            limit={ready ? "$2M" : "—"}
            status={ready ? DOEINSURE_QUOTE.ready : "Intake"}
          />
        ) : null}
      </div>
      <div className={`doeinsure-app__foot${ready ? " is-on" : ""}`}>
        <div>
          <span>{ready ? DOEINSURE_QUOTE.ready : DOEINSURE_QUOTE.waiting}</span>
          <b>{ready ? DOEINSURE_QUOTE.premium : `${connected} / ${DOEINSURE_QUOTE.sources.length}`}</b>
        </div>
        {ready ? (
          <a className="doeinsure-btn" href="#request">
            {DOEINSURE_QUOTE.bind}
          </a>
        ) : (
          <button
            type="button"
            className="doeinsure-inline"
            onClick={() => {
              setOn(Object.fromEntries(DOEINSURE_QUOTE.sources.map((source) => [source.name, true])));
              setTab("risk");
            }}
          >
            {DOEINSURE_QUOTE.connectAll}
          </button>
        )}
      </div>
    </DoeInsureAppFrame>
  );
}

export function DoeInsureHowApp({ step }: { step: number }) {
  const [on, setOn] = useState<Record<string, boolean>>({ AWS: true });
  const connected = DOEINSURE_QUOTE.sources.filter((source) => on[source.name]).length;
  const hospital = DOEINSURE_MATCH.systems[0];

  return (
    <DoeInsureAppFrame file={step === 2 ? hospital.name : "Harbor Notes, Inc."}>
      <div className="doeinsure-app__shell">
        <AppRail active={step === 0 ? "stack" : "risk"} />
        {step === 0 ? (
          <StackMods
            on={on}
            onToggle={(name) => setOn((current) => ({ ...current, [name]: !current[name] }))}
          />
        ) : null}
        {step === 1 ? (
          <RiskMods
            connected={Math.max(connected, 2)}
            total={DOEINSURE_QUOTE.sources.length}
            limit="$2M"
            status="Quoted"
          />
        ) : null}
        {step === 2 ? (
          <div className="doeinsure-app__stage">
            <span className="doeinsure-app__kicker">Contract desk</span>
            <div className="doeinsure-mod">
              <span>Clause</span>
              <b>{hospital.clauses[0].text}</b>
            </div>
            <div className="doeinsure-app__grid doeinsure-app__grid--2">
              <div className="doeinsure-mod">
                <span>Now</span>
                <b>{hospital.from}</b>
              </div>
              <div className="doeinsure-mod is-on">
                <span>Match to</span>
                <b>{hospital.ask}</b>
              </div>
            </div>
            <p className="doeinsure-app__hint">Raise the limit from the same file. No broker calendar.</p>
          </div>
        ) : null}
      </div>
    </DoeInsureAppFrame>
  );
}
