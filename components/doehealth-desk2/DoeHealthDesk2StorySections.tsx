"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_AGENT_CAROUSEL,
  DOEHEALTH_DESK2_AGENTS,
  DOEHEALTH_DESK2_CLOSE,
  DOEHEALTH_DESK2_CLOSE_BOOK,
  DOEHEALTH_DESK2_SUNDAY,
} from "@/lib/doehealthdesk2/doehealthdesk2-story-copy";
import { dmSans, inter, p22Mackinac } from "@/lib/home/fonts";

function AgentArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      {direction === "right" ? (
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/** Three outline cards in the page margins. The rest clip off the screen edge. */
export function DoeHealthDesk2AgentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setVisibleCards(mq.matches ? 1 : 3);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // The title's sweep follows the scroll, not the clock: it starts as the head rises into view and
  // finishes as it reaches the middle of the screen. Each line trails the one above it.
  useEffect(() => {
    const section = sectionRef.current;
    const head = section?.querySelector<HTMLElement>(".doehealth-desk2-agents__head");
    if (!section || !head) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let last = -1;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const frac = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.95 - head.getBoundingClientRect().top) / (vh * 0.45)));
      if (frac === last) return;
      last = frac;
      section.style.setProperty("--agents-a1", String(Math.min(1, frac / 0.8)));
      section.style.setProperty("--agents-a2", String(Math.min(1, Math.max(0, (frac - 0.2) / 0.8))));
      section.style.setProperty("--agents-a3", String(Math.min(1, Math.max(0, (frac - 0.4) / 0.6))));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const agents = DOEHEALTH_DESK2_AGENT_CAROUSEL;
  const last = Math.max(0, agents.length - visibleCards);

  return (
    <section
      ref={sectionRef}
      id="agents"
      className="doehealth-desk2-agents"
      aria-label="Let personal agents do more with your clinic"
    >
      <header className={`doehealth-desk2-agents__head ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <h2 className={`doehealth-desk2-agents__title ${p22Mackinac.className}`}>
          {DOEHEALTH_DESK2_AGENTS.title.map((line, i) => (
            <span key={line} className={`desk2-headline-darken--ink doehealth-desk2-agents__line--desk agents-l${i + 1}`}>
              {line}
            </span>
          ))}
          {DOEHEALTH_DESK2_AGENTS.phoneTitle.map((line, i) => (
            <span key={line} className={`desk2-headline-darken--ink doehealth-desk2-agents__line--phone agents-l${i + 1}`}>
              {line}
            </span>
          ))}
        </h2>
        <div className="desk2-agent-carousel__nav">
          <button type="button" aria-label="Previous agents" disabled={index === 0} onClick={() => setIndex((current) => Math.max(0, current - 1))}>
            <AgentArrow direction="left" />
          </button>
          <button type="button" aria-label="Next agents" disabled={index >= last} onClick={() => setIndex((current) => Math.min(last, current + 1))}>
            <AgentArrow direction="right" />
          </button>
        </div>
      </header>

      <div className="desk2-agent-carousel">
        <ul className={inter.className} style={{ "--agent-index": index } as CSSProperties}>
          {agents.map((agent, position) => (
            <li key={agent.name} style={{ "--agent-order": position } as CSSProperties}>
              <strong className={dmSans.className}>{agent.name}</strong>
              <span>{agent.now}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Full-width blank band between sections. Brown uses the desk shell; white uses the page cream. */
export function DoeHealthDesk2BlankSection({ tone }: { tone: "brown" | "white" }) {
  const brownWash = tone === "brown" ? " doehealth-desk2-nav-wash-surface" : "";
  return <section className={`doehealth-desk2-blank doehealth-desk2-blank--${tone}${brownWash}`} aria-hidden />;
}

/** The week’s finished work, written into the next Genome. */
export function DoeHealthDesk2SundaySection() {
  return (
    <section
      className="doehealth-desk2-sunday doehealth-desk2-nav-wash-surface"
      aria-label="Sunday writes the next Genome"
    >
      <div className={`doehealth-desk2-sunday__layout ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <div className="doehealth-desk2-sunday__copy">
          <h2 className={p22Mackinac.className}>
            {DOEHEALTH_DESK2_SUNDAY.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className={inter.className}>
            {DOEHEALTH_DESK2_SUNDAY.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className={`doehealth-desk2-sunday__version ${inter.className}`}>
            Genome {DOEHEALTH_DESK2_SUNDAY.from}
            <span aria-hidden>→</span>
            {DOEHEALTH_DESK2_SUNDAY.to}
          </p>
        </div>

        <div className={`doehealth-desk2-sunday__sheet ${inter.className}`}>
          <ol>
            {DOEHEALTH_DESK2_SUNDAY.tasks.map((task) => (
              <li key={task.detail}>
                <strong className={dmSans.className}>{task.agent}</strong>
                <span>{task.detail}</span>
                <time>{task.day}</time>
              </li>
            ))}
          </ol>
          <footer>
            {DOEHEALTH_DESK2_SUNDAY.kept.map((row) => (
              <div key={row.label}>
                <em>{row.label}</em>
                <span>{row.value}</span>
              </div>
            ))}
          </footer>
        </div>
      </div>
    </section>
  );
}

/** Invitation just above the footer. */
export function DoeHealthDesk2InviteSection() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className={`doehealth-desk2-invite ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Teach personal agents about your clinic">
      <div className="doehealth-desk2-invite__panel doehealth-desk2-nav-wash-surface">
        <h2 className={p22Mackinac.className}>
          <span>Teach personal agents</span>
          <span>about your clinic.</span>
        </h2>
        <form className={`doehealth-desk2-invite__form ${inter.className}`} onSubmit={onSubmit}>
          <label>
            <span className="doehealth-desk2-hero__sr">Your email</span>
            <input type="email" name="email" placeholder="Your email" autoComplete="email" required />
            <button type="submit" aria-label="Teach personal agents about your clinic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </label>
        </form>
      </div>
    </section>
  );
}

/** The model on the line, the chart, and the book. */
export function DoeHealthDesk2CloseSection() {
  return (
    <section className={`doehealth-desk2-close ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="The desk already working">
      <header className="doehealth-desk2-close__head">
        <h2 className={p22Mackinac.className}>
          {DOEHEALTH_DESK2_CLOSE.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className={inter.className}>
          {DOEHEALTH_DESK2_CLOSE.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </header>

      <div className={`doehealth-desk2-floor ${inter.className}`}>
        <div className="doehealth-desk2-floor__bar">
          <strong className={dmSans.className}>Westfield</strong>
          <span>Thursday, 8:06 AM</span>
        </div>
        <div className="doehealth-desk2-floor__body">
          <ol className="doehealth-desk2-floor__book">
            {DOEHEALTH_DESK2_CLOSE_BOOK.map((slot) => (
              <li key={slot.time} className={"open" in slot && slot.open ? "is-open" : undefined}>
                <time>{slot.time}</time>
                <span>{slot.who}</span>
              </li>
            ))}
          </ol>
          <article className="doehealth-desk2-floor__note">
            <header>
              <strong className={dmSans.className}>Maya Chen</strong>
              <span>Diabetes follow-up · Dr. Shah</span>
            </header>
            <p>A1C 8.4, down from 9.1. Metformin continued for 90 days. Return Thursday at 9:40.</p>
            <p>The note is already in Athena.</p>
          </article>
          <article className="doehealth-desk2-floor__call">
            <header>
              <strong className={dmSans.className}>Clinic line</strong>
              <span>(416) 555-0148</span>
            </header>
            <blockquote className={p22Mackinac.className}>I can move you to 9:40 with Dr. Shah.</blockquote>
            <p>Reschedule. The chart is matched.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
