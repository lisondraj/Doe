"use client";

import { useRef } from "react";

import { SkipIcon } from "@/components/doehealth-desk2/DoeHealthDesk2AudienceSection";
import {
  EP_UI,
  EpChip,
  EpHeading,
  EpIcon,
  EpPhone,
  isShown,
  LockedScreen,
  lockEnd,
  ramp,
  rise,
  SPAN,
} from "@/components/earlypreview/EarlyPreviewLockedKit";
import {
  cssVars as vars,
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import {
  EARLYPREVIEW_TRUST_SCREENS as COUNT,
  TRUST_AUDIT,
  TRUST_CONSENT,
  TRUST_PROTOCOL,
  TRUST_SANDBOX,
} from "@/lib/earlypreview/earlypreview-trust-copy";
import { p22Mackinac } from "@/lib/home/fonts";

const END = lockEnd(COUNT);

/** Large serif names, each with a short line under it, coming in one after another from `from`. */
function Names({ items, t, from, className = "" }: { items: readonly { name: string; line: string }[]; t: number; from: number; className?: string }) {
  return (
    <ol className={`earlypreview-lock__names ${className}`}>
      {items.map((item, i) => (
        <li key={item.name} className="ep-rise" style={rise(ramp(t, from + i * 0.12, from + 0.3 + i * 0.12))}>
          <span className={p22Mackinac.className}>{item.name}</span>
          <span>{item.line}</span>
        </li>
      ))}
    </ol>
  );
}

/** The protocol's four parts, beside the credential an agent carries: who it is, and the grant it acts under. */
function ProtocolScreen({ t }: { t: number }) {
  const c = TRUST_PROTOCOL;
  const { grant } = c;
  return (
    <LockedScreen index={0} count={COUNT} title={c.title} t={t} className="earlypreview-trust__protocol">
      <div className="earlypreview-trust__copy">
        <Names items={c.parts} t={t} from={0.3} className="earlypreview-trust__parts" />
        <p className="earlypreview-lock__note ep-rise" style={rise(ramp(t, 0.85, 1.1))}>
          {c.note}
        </p>
      </div>
      <div className={`earlypreview-trust__credential ${EP_UI}`}>
        <div className="earlypreview-trust__identity ep-pop" style={rise(ramp(t, 0.25, 0.6))}>
          <span className="earlypreview-trust__label">
            <EpIcon name="shield" />
            {c.identity.label}
          </span>
          <EpHeading>{c.identity.name}</EpHeading>
          <span className="earlypreview-trust__verified">
            <EpIcon name="check" />
            {c.identity.sub}
          </span>
          <span className="earlypreview-trust__print" aria-hidden />
        </div>
        <article className="earlypreview-trust__grant ep-card ep-pop" style={rise(ramp(t, 0.5, 0.85))}>
          <header>
            <EpHeading>{grant.label}</EpHeading>
            <span className="earlypreview-trust__id">{grant.id}</span>
          </header>
          <dl>
            {grant.fields.map((field, i) => (
              <div key={field.label} className="ep-rise" style={rise(ramp(t, 0.7 + i * 0.08, 0.9 + i * 0.08))}>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
          <div className="earlypreview-trust__scopes">
            {grant.may.map((scope, i) => (
              <EpChip key={scope} tone="sage" icon="check" className="ep-rise" style={rise(ramp(t, 1.0 + i * 0.07, 1.15 + i * 0.07))}>
                {scope}
              </EpChip>
            ))}
            <EpChip tone="soft" icon="x" className="earlypreview-trust__never ep-rise" style={rise(ramp(t, 1.2, 1.35))}>
              {grant.never}
            </EpChip>
          </div>
          <footer className="ep-rise" style={rise(ramp(t, 1.3, 1.5))}>
            <EpChip tone="ink" icon="lock">
              {grant.seal}
            </EpChip>
            <span>{grant.revocable}</span>
          </footer>
        </article>
      </div>
    </LockedScreen>
  );
}

/** The patient's lock screen: one thing done alone, one waiting on Maya, one the agent was never allowed to do. */
function ConsentScreen({ t }: { t: number }) {
  const c = TRUST_CONSENT;
  const confirmed = t >= 1.3;
  return (
    <LockedScreen index={1} count={COUNT} title={c.title} t={t} className="earlypreview-trust__consent">
      <Names items={c.tiers} t={t} from={0.3} className="earlypreview-trust__tiers" />
      <EpPhone className={`earlypreview-trust__phone ep-rise ${EP_UI}`} style={rise(ramp(t, 0.1, 0.45))}>
        <div className="earlypreview-trust__lock">
          <span className="earlypreview-trust__date">{c.phone.date}</span>
          <span className="earlypreview-trust__time">{c.phone.time}</span>
          <div className="earlypreview-trust__notice ep-rise" style={rise(ramp(t, 0.45, 0.7))}>
            <NoticeHead app={c.phone.app} />
            <p>{c.found.text}</p>
            <EpChip tone="sage" icon="check">
              {c.found.tag}
            </EpChip>
          </div>
          <div className="earlypreview-trust__notice is-confirm ep-rise" style={rise(ramp(t, 0.75, 1))}>
            <NoticeHead app={c.phone.app} />
            <strong>{c.confirm.title}</strong>
            <p>{c.confirm.text}</p>
            {confirmed ? (
              <EpChip tone="sage" icon="check" className="earlypreview-trust__confirmed">
                {c.confirm.done}
              </EpChip>
            ) : (
              <span className="earlypreview-trust__buttons">
                <span className="ep-btn earlypreview-trust__deny">{c.confirm.deny}</span>
                <span className="ep-btn">{c.confirm.allow}</span>
              </span>
            )}
          </div>
          <div className="earlypreview-trust__notice ep-rise" style={rise(ramp(t, 1.05, 1.3))}>
            <NoticeHead app={c.phone.app} />
            <p>{c.refused.text}</p>
            <EpChip tone="salmon" icon="x">
              {c.refused.tag}
            </EpChip>
          </div>
        </div>
      </EpPhone>
    </LockedScreen>
  );
}

function NoticeHead({ app }: { app: string }) {
  return (
    <span className="earlypreview-trust__notice-head">
      <span className={`earlypreview-trust__app-icon ${p22Mackinac.className}`} aria-hidden>
        D
      </span>
      {app}
      <time>now</time>
    </span>
  );
}

/** The sandbox console, cropped by the screen's edges: attacks resolving one by one, and a model update cleared. */
function SandboxScreen({ t }: { t: number }) {
  const c = TRUST_SANDBOX;
  return (
    <LockedScreen index={2} count={COUNT} title={c.title} t={t} className="earlypreview-trust__sandbox">
      <div className={`earlypreview-trust__console ep-rise ${EP_UI}`} style={rise(ramp(t, 0.1, 0.45))}>
        <header>
          <span className="earlypreview-trust__lights" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="earlypreview-trust__window">{c.window}</span>
          <span className="earlypreview-trust__live">
            <i aria-hidden />
            {c.live}
          </span>
        </header>
        <div className="earlypreview-trust__console-body">
          <ul className="earlypreview-trust__attacks">
            {c.attacks.map((row, i) => {
              const done = t >= 0.7 + i * 0.12;
              return (
                <li key={row.attack} className="ep-rise" style={rise(ramp(t, 0.35 + i * 0.06, 0.6 + i * 0.06))}>
                  <span className="earlypreview-trust__attack-icon">
                    <EpIcon name="alert" />
                  </span>
                  <span>{row.attack}</span>
                  <span className={`earlypreview-trust__result${done ? " is-done" : ""}`}>
                    {done ? <EpIcon name="check" /> : null}
                    {done ? row.result : c.pending}
                  </span>
                </li>
              );
            })}
          </ul>
          <article className="earlypreview-trust__update ep-card ep-pop" style={rise(ramp(t, 0.6, 0.95))}>
            <span className="earlypreview-trust__update-label">{c.update.label}</span>
            <EpHeading>{c.update.change}</EpHeading>
            <ul>
              {c.update.checks.map((check, i) => {
                const k = ramp(t, 0.9 + i * 0.15, 1.15 + i * 0.15);
                return (
                  <li key={check}>
                    <span>{check}</span>
                    <span className="earlypreview-trust__bar" style={vars({ "--k": k })} />
                    <span className="earlypreview-trust__pass" style={vars({ "--k": k >= 1 ? 1 : 0 })}>
                      <EpIcon name="check" />
                    </span>
                  </li>
                );
              })}
            </ul>
            <EpChip tone="ink" icon="check" className="ep-rise" style={rise(ramp(t, 1.45, 1.65))}>
              {c.update.cleared}
            </EpChip>
          </article>
        </div>
      </div>
    </LockedScreen>
  );
}

/** The ledger entry the booking left, printed and stamped, beside the laws on both sides of the border. */
function AuditScreen({ t }: { t: number }) {
  const c = TRUST_AUDIT;
  const { receipt } = c;
  return (
    <LockedScreen index={3} count={COUNT} title={c.title} t={t} className="earlypreview-trust__audit">
      <div className="earlypreview-trust__receipt-box">
        <article className={`earlypreview-trust__receipt ep-pop ${EP_UI}`} style={rise(ramp(t, 0.2, 0.55))}>
          <header>
            <EpHeading>{receipt.head}</EpHeading>
            <span>{receipt.id}</span>
          </header>
          <dl>
            {receipt.rows.map((row, i) => (
              <div key={row.label} className="ep-rise" style={rise(ramp(t, 0.4 + i * 0.07, 0.6 + i * 0.07))}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <footer className="ep-rise" style={rise(ramp(t, 0.95, 1.15))}>
            <span className="earlypreview-trust__hash">{receipt.hash}</span>
            <span>{receipt.chained}</span>
          </footer>
          <span className="earlypreview-trust__stamp" style={vars({ "--k": ramp(t, 1.1, 1.3) })}>
            {receipt.stamp}
          </span>
        </article>
      </div>
      <div className="earlypreview-trust__laws">
        <Names items={c.regions.map((region) => ({ name: region.rules, line: region.name }))} t={t} from={0.5} className="earlypreview-trust__regions" />
        <p className="earlypreview-lock__note ep-rise" style={rise(ramp(t, 1.0, 1.25))}>
          {c.note}
        </p>
      </div>
    </LockedScreen>
  );
}

const SCREENS = [ProtocolScreen, ConsentScreen, SandboxScreen, AuditScreen] as const;

/**
 * /earlypreview: security and compliance as the last scroll-locked brown section, in the go-to-market section's form.
 * Four screens: the Health Intelligence Protocol, patient consent, the security sandbox, and the audit record with the
 * US and Canadian rules it is built around. The last screen stays once it has built.
 */
export function EarlyPreviewTrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip } = useDoeHealthDesk2ScrollLock(sectionRef, END);

  return (
    <div className="doehealth-desk2-visible-track earlypreview-trust-track" style={vars({ "--desk2-visible-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section
        ref={sectionRef}
        className={`doehealth-desk2-visible earlypreview-lock earlypreview-trust doehealth-desk2-nav-wash-surface ${p22Mackinac.className}`}
        aria-label="Security and compliance"
      >
        {SCREENS.map((Scene, i) => (isShown(p, i, COUNT) ? <Scene key={i} t={p - i * SPAN} /> : null))}

        {p > 0 && p < END ? (
          <button type="button" className="doehealth-desk2-visible__skip" aria-label="Skip past security and compliance" onClick={skip}>
            <SkipIcon />
          </button>
        ) : null}
      </section>
    </div>
  );
}
