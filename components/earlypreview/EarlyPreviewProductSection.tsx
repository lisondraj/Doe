"use client";

import { useRef } from "react";

import { SkipIcon } from "@/components/doehealth-desk2/DoeHealthDesk2AudienceSection";
import {
  EP_UI,
  EpAvatar,
  EpChip,
  EpHeading,
  EpIcon,
  EpPhone,
  EpShell,
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
  EARLYPREVIEW_PRODUCT_SCREENS as COUNT,
  PRODUCT_API,
  PRODUCT_BOOK,
  PRODUCT_INBOX,
  PRODUCT_READY,
} from "@/lib/earlypreview/earlypreview-product-copy";
import { p22Mackinac } from "@/lib/home/fonts";

const END = lockEnd(COUNT);

/** The clinic's inbox, its shell cropped by the screen's right and bottom edges. */
function InboxScreen({ t }: { t: number }) {
  const c = PRODUCT_INBOX;
  return (
    <LockedScreen index={0} count={COUNT} title={c.title} t={t} className="earlypreview-product__inbox">
      <EpShell active={0} className={`earlypreview-product__shell ep-rise ${EP_UI}`} style={rise(ramp(t, 0.1, 0.45))}>
        <header className="earlypreview-product__panel-head">
          <EpHeading>{c.heading}</EpHeading>
          <EpChip tone="salmon">{c.count}</EpChip>
        </header>
        <div className="earlypreview-product__inbox-cols">
          <ul className="earlypreview-product__threads">
            {c.threads.map((thread, i) => (
              <li key={thread.name} className={`ep-rise${i === 0 ? " is-open" : ""}`} style={rise(ramp(t, 0.3 + i * 0.07, 0.55 + i * 0.07))}>
                <EpAvatar label={thread.initials} tone={thread.tone} />
                <span>
                  <strong>{thread.name}</strong>
                  <span>{thread.topic}</span>
                </span>
                <time>{thread.time}</time>
              </li>
            ))}
          </ul>
          <div className="earlypreview-product__thread">
            <div className="earlypreview-product__thread-head ep-rise" style={rise(ramp(t, 0.45, 0.7))}>
              <EpAvatar label="MJ" tone="salmon" />
              <span>
                <strong>{c.thread.who}</strong>
                <span>{c.thread.for}</span>
              </span>
            </div>
            <div className="earlypreview-product__bubbles">
              {c.thread.messages.map((m, i) => (
                <p key={m.text} className={`earlypreview-product__bubble is-${m.from} ep-rise`} style={rise(ramp(t, 0.6 + i * 0.25, 0.85 + i * 0.25))}>
                  {m.text}
                </p>
              ))}
              <EpChip tone="sage" icon="check" className="earlypreview-product__done ep-rise" style={rise(ramp(t, 1.35, 1.6))}>
                {c.thread.done}
              </EpChip>
            </div>
            <div className="earlypreview-product__composer">
              <span>{c.thread.reply}</span>
              <span className="earlypreview-product__send">
                <EpIcon name="arrowUp" />
              </span>
            </div>
          </div>
        </div>
      </EpShell>
    </LockedScreen>
  );
}

/** Leo's visit as the clinic sees it, checked and filled in, beside the three products that did it. */
function ReadyScreen({ t }: { t: number }) {
  const c = PRODUCT_READY;
  const { chart } = c;
  return (
    <LockedScreen index={1} count={COUNT} title={c.title} t={t} className="earlypreview-product__ready">
      <div className="earlypreview-product__chart-box">
        <article className={`earlypreview-product__chart ep-card ep-pop ${EP_UI}`} style={rise(ramp(t, 0.2, 0.55))}>
          <header>
            <EpAvatar label="LJ" tone="salmon" />
            <span>
              <EpHeading>{chart.name}</EpHeading>
              <span>{chart.visit}</span>
            </span>
          </header>
          <dl>
            {chart.rows.map((row, i) => {
              const e = ramp(t, 0.45 + i * 0.12, 0.7 + i * 0.12);
              return (
                <div key={row.label} className="ep-rise" style={rise(e)}>
                  <dt>{row.label}</dt>
                  <dd>
                    {row.value}
                    {"chip" in row ? (
                      <EpChip tone="sage" icon="check">
                        {row.chip}
                      </EpChip>
                    ) : null}
                  </dd>
                </div>
              );
            })}
          </dl>
          <section className="earlypreview-product__forms">
            <p>
              <strong>{chart.formsLabel}</strong>
              <span>{chart.formsBy}</span>
            </p>
            <ul>
              {chart.forms.map((form, i) => (
                <li key={form}>
                  <span className="earlypreview-product__box" style={vars({ "--k": ramp(t, 0.85 + i * 0.14, 1.0 + i * 0.14) })}>
                    <EpIcon name="check" />
                  </span>
                  {form}
                </li>
              ))}
            </ul>
          </section>
          <footer className="ep-rise" style={rise(ramp(t, 1.3, 1.55))}>
            <EpChip tone="ink" icon="check">
              {chart.ready}
            </EpChip>
          </footer>
        </article>
      </div>
      <ol className="earlypreview-lock__names earlypreview-product__names">
        {c.products.map((product, i) => (
          <li key={product.name} className="ep-rise" style={rise(ramp(t, 0.4 + i * 0.13, 0.7 + i * 0.13))}>
            <span className={p22Mackinac.className}>{product.name}</span>
            <span>{product.line}</span>
          </li>
        ))}
      </ol>
    </LockedScreen>
  );
}

/** Minutes after 9:00 as a share of the three hours the day card shows. */
const dayPct = (minutes: number) => `${(minutes / 180) * 100}%`;

/** The patient's assistant books the slot; it lands on the clinic's Friday as the button turns to Booked. */
function BookScreen({ t }: { t: number }) {
  const c = PRODUCT_BOOK;
  const { phone, day } = c;
  const booked = t >= 1.15;
  return (
    <LockedScreen index={2} count={COUNT} title={c.title} t={t} className="earlypreview-product__book">
      <article className={`earlypreview-product__day ep-card ep-pop ${EP_UI}`} style={rise(ramp(t, 0.3, 0.65))}>
        <header>
          <EpHeading>{day.heading}</EpHeading>
          <span>{day.date}</span>
        </header>
        <div className="earlypreview-product__hours">
          {day.hours.map((hour, i) => (
            <span key={hour} className="earlypreview-product__hour" style={{ top: dayPct(i * 60) }}>
              {hour}
            </span>
          ))}
          {day.visits.map((visit) => (
            <div key={visit.name} className="earlypreview-product__visit" style={{ top: dayPct(visit.at), height: dayPct(visit.len) }}>
              <strong>{visit.name}</strong>
              <span>{visit.what}</span>
            </div>
          ))}
          <div
            className="earlypreview-product__visit is-booked ep-pop"
            style={{ top: dayPct(day.booked.at), height: dayPct(day.booked.len), ...rise(ramp(t, 1.2, 1.45)) }}
          >
            <strong>{day.booked.name}</strong>
            <span>{day.booked.what}</span>
            <EpChip tone="paper">{day.booked.by}</EpChip>
          </div>
        </div>
      </article>
      <EpPhone className={`earlypreview-product__phone ep-rise ${EP_UI}`} style={rise(ramp(t, 0.1, 0.45))}>
        <div className="ep-chat">
          <header className="ep-chat__head">
            <span className="ep-chat__app">
              <i aria-hidden />
              {phone.app}
            </span>
          </header>
          <p className="ep-chat__msg is-me ep-rise" style={rise(ramp(t, 0.35, 0.55))}>
            {phone.ask}
          </p>
          <p className="ep-chat__msg ep-rise" style={rise(ramp(t, 0.55, 0.8))}>
            {phone.answer}
          </p>
          <div className="ep-chat__card ep-rise" style={rise(ramp(t, 0.75, 1))}>
            <EpHeading>{phone.card.clinic}</EpHeading>
            <span>{phone.card.when}</span>
            <span>{phone.card.who}</span>
            <span className={`ep-btn${booked ? " is-done" : ""}`}>
              {booked ? <EpIcon name="check" /> : null}
              {booked ? phone.card.done : phone.card.action}
            </span>
          </div>
        </div>
      </EpPhone>
    </LockedScreen>
  );
}

/** The sample call, typed out to `n` characters, with a caret where typing has got to. */
function TypedCode({ n }: { n: number }) {
  let left = n;
  return (
    <code>
      {PRODUCT_API.code.map((line, row) => {
        const tokens = [];
        let caret = false;
        for (const [text, kind] of line) {
          if (left <= 0) break;
          const shown = text.slice(0, left);
          left -= text.length;
          tokens.push(
            <span key={tokens.length} className={kind ? `is-${kind}` : undefined}>
              {shown}
            </span>,
          );
          if (left < 0) caret = true;
        }
        const lineDone = left >= 0;
        // Each line break costs one character, so the caret rests on a fresh line for a beat.
        if (lineDone) left -= 1;
        const atEnd = lineDone && left < 0;
        return (
          <span key={row} className="earlypreview-product__line">
            <span className="earlypreview-product__gutter">{row + 1}</span>
            {tokens}
            {caret || atEnd ? <span className="earlypreview-product__caret" aria-hidden /> : null}
          </span>
        );
      })}
    </code>
  );
}

const CODE_LENGTH = PRODUCT_API.code.reduce((sum, line) => sum + line.reduce((n, [text]) => n + text.length, 0) + 1, 0);

/** A developer's call against Doe's index, in the corner of an editor, with the openings it returns. */
function ApiScreen({ t }: { t: number }) {
  const c = PRODUCT_API;
  const typed = Math.round(ramp(t, 0.35, 1) * CODE_LENGTH);
  return (
    <LockedScreen index={3} count={COUNT} title={c.title} t={t} className="earlypreview-product__api">
      <div className={`earlypreview-product__editor ep-rise ${EP_UI}`} style={rise(ramp(t, 0.1, 0.45))}>
        <header>
          <span className="earlypreview-product__lights" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className="earlypreview-product__file">{c.file}</span>
          <span className="earlypreview-product__tabs">
            {c.tabs.map((tab, i) => (
              <span key={tab} className={i === 0 ? "is-active" : undefined}>
                {tab}
              </span>
            ))}
          </span>
        </header>
        <pre aria-label="doe.search for a pediatric ENT near Mission, San Francisco, that takes Harbor Mutual">
          <TypedCode n={typed} />
        </pre>
      </div>
      <div className={`earlypreview-product__results ${EP_UI}`}>
        <p className="ep-rise" style={rise(ramp(t, 0.95, 1.15))}>
          <EpIcon name="search" />
          {c.results.head}
        </p>
        {c.results.items.map((item, i) => (
          <div key={item.name} className="earlypreview-product__result ep-card ep-pop" style={rise(ramp(t, 1.0 + i * 0.12, 1.25 + i * 0.12))}>
            <EpAvatar label={item.name.slice(0, 1)} tone={item.tone} />
            <span>
              <strong>{item.name}</strong>
              <span>{item.meta}</span>
            </span>
            <EpChip tone="salmon">{item.slot}</EpChip>
          </div>
        ))}
      </div>
    </LockedScreen>
  );
}

const SCREENS = [InboxScreen, ReadyScreen, BookScreen, ApiScreen] as const;

/**
 * /earlypreview: the product as a scroll-locked brown section, in the go-to-market section's form. Four screens, each
 * a piece of the app: the clinic's inbox, a visit checked and ready, a booking from the patient's assistant, and the
 * API behind it. The last screen stays once it has built.
 */
export function EarlyPreviewProductSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip } = useDoeHealthDesk2ScrollLock(sectionRef, END);

  return (
    <div className="doehealth-desk2-visible-track earlypreview-product-track" style={vars({ "--desk2-visible-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section
        ref={sectionRef}
        className={`doehealth-desk2-visible earlypreview-lock earlypreview-product doehealth-desk2-nav-wash-surface ${p22Mackinac.className}`}
        aria-label="The Doe product"
      >
        {SCREENS.map((Scene, i) => (isShown(p, i, COUNT) ? <Scene key={i} t={p - i * SPAN} /> : null))}

        {p > 0 && p < END ? (
          <button type="button" className="doehealth-desk2-visible__skip" aria-label="Skip past the product" onClick={skip}>
            <SkipIcon />
          </button>
        ) : null}
      </section>
    </div>
  );
}
