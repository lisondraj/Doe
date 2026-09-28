"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, KeyboardEvent } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK_AGENT_AUDIENCES,
  DOEHEALTH_DESK_AGENTS,
  type DoeHealthDeskAgentAudienceId,
  DOEHEALTH_DESK_CLOSE,
  DOEHEALTH_DESK_CLOSE_BOOK,
  DOEHEALTH_DESK_SUNDAY,
} from "@/lib/doehealth/doehealth-desk-story-copy";
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
export function DoeHealthDeskAgentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [audienceId, setAudienceId] = useState<DoeHealthDeskAgentAudienceId>("practice");
  const [switched, setSwitched] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);
  const [titleIn, setTitleIn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setVisibleCards(mq.matches ? 1 : 3);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const head = section?.querySelector(".doehealth-desk-agents__head");
    if (!head) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTitleIn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.55) return;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setTitleIn(true));
        });
        observer.disconnect();
      },
      { threshold: [0, 0.25, 0.45, 0.55, 0.72] },
    );
    observer.observe(head);
    return () => observer.disconnect();
  }, []);

  const audienceIndex = Math.max(
    0,
    DOEHEALTH_DESK_AGENT_AUDIENCES.findIndex((audience) => audience.id === audienceId),
  );
  const agents = DOEHEALTH_DESK_AGENT_AUDIENCES[audienceIndex].agents;
  const last = Math.max(0, agents.length - visibleCards);

  function selectAudience(id: DoeHealthDeskAgentAudienceId) {
    if (id === audienceId) return;
    setSwitched(true);
    setAudienceId(id);
    setIndex(0);
  }

  function onSwitchKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const count = DOEHEALTH_DESK_AGENT_AUDIENCES.length;
    const next = DOEHEALTH_DESK_AGENT_AUDIENCES[(audienceIndex + step + count) % count];
    selectAudience(next.id);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-audience="${next.id}"]`)?.focus();
  }

  return (
    <section
      ref={sectionRef}
      id="agents"
      className="doehealth-desk-agents"
      aria-label="Agents for every task, on your model"
    >
      <header className={`doehealth-desk-agents__head ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <h2 className={`doehealth-desk-agents__title ${p22Mackinac.className}${titleIn ? " is-title-in" : ""}`}>
          {DOEHEALTH_DESK_AGENTS.title.map((line) => (
            <span key={line} className="desk-headline-darken--ink">
              {line}
            </span>
          ))}
        </h2>
        <div className="desk-agent-carousel__nav">
          <button type="button" aria-label="Previous agents" disabled={index === 0} onClick={() => setIndex((current) => Math.max(0, current - 1))}>
            <AgentArrow direction="left" />
          </button>
          <button type="button" aria-label="Next agents" disabled={index >= last} onClick={() => setIndex((current) => Math.min(last, current + 1))}>
            <AgentArrow direction="right" />
          </button>
        </div>
      </header>

      <div className={`doehealth-desk-agents__switch ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <div
          className={`desk-agent-switch ${inter.className}`}
          role="tablist"
          aria-label="Agents by audience"
          style={{ "--switch-index": audienceIndex } as CSSProperties}
          onKeyDown={onSwitchKeyDown}
        >
          <span className="desk-agent-switch__pill" aria-hidden />
          {DOEHEALTH_DESK_AGENT_AUDIENCES.map((audience) => (
            <button
              key={audience.id}
              type="button"
              role="tab"
              id={`agents-tab-${audience.id}`}
              data-audience={audience.id}
              aria-selected={audience.id === audienceId}
              aria-controls="agents-panel"
              tabIndex={audience.id === audienceId ? 0 : -1}
              className={audience.id === audienceId ? "is-on" : undefined}
              onClick={() => selectAudience(audience.id)}
            >
              {audience.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="desk-agent-carousel"
        id="agents-panel"
        role="tabpanel"
        aria-labelledby={`agents-tab-${audienceId}`}
      >
        <ul
          key={audienceId}
          className={`${inter.className}${switched ? " is-swapped" : ""}`}
          style={{ "--agent-index": index } as CSSProperties}
        >
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

/** The week’s finished work, written into the next Genome. */
export function DoeHealthDeskSundaySection() {
  return (
    <section
      className="doehealth-desk-sunday doehealth-desk-nav-wash-surface"
      aria-label="Sunday writes the next Genome"
    >
      <div className={`doehealth-desk-sunday__layout ${DOEPHONE_DESKTOP_PAGE_INSET_X}`}>
        <div className="doehealth-desk-sunday__copy">
          <h2 className={p22Mackinac.className}>
            {DOEHEALTH_DESK_SUNDAY.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className={inter.className}>
            {DOEHEALTH_DESK_SUNDAY.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className={`doehealth-desk-sunday__version ${inter.className}`}>
            Genome {DOEHEALTH_DESK_SUNDAY.from}
            <span aria-hidden>→</span>
            {DOEHEALTH_DESK_SUNDAY.to}
          </p>
        </div>

        <div className={`doehealth-desk-sunday__sheet ${inter.className}`}>
          <ol>
            {DOEHEALTH_DESK_SUNDAY.tasks.map((task) => (
              <li key={task.detail}>
                <strong className={dmSans.className}>{task.agent}</strong>
                <span>{task.detail}</span>
                <time>{task.day}</time>
              </li>
            ))}
          </ol>
          <footer>
            {DOEHEALTH_DESK_SUNDAY.kept.map((row) => (
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
export function DoeHealthDeskInviteSection() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className={`doehealth-desk-invite ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Secure your intelligence model">
      <div className="doehealth-desk-invite__panel">
        <h2 className={p22Mackinac.className}>
          <span>Secure your</span>
          <span>intelligence model.</span>
        </h2>
        <form className={`doehealth-desk-invite__form ${inter.className}`} onSubmit={onSubmit}>
          <label>
            <span className="doehealth-desk-hero__sr">Work email</span>
            <input type="email" name="email" placeholder="Work email" autoComplete="email" required />
            <button type="submit" aria-label="Secure your intelligence model">
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
export function DoeHealthDeskCloseSection() {
  return (
    <section className={`doehealth-desk-close ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="The desk already working">
      <header className="doehealth-desk-close__head">
        <h2 className={p22Mackinac.className}>
          {DOEHEALTH_DESK_CLOSE.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className={inter.className}>
          {DOEHEALTH_DESK_CLOSE.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </header>

      <div className={`doehealth-desk-floor ${inter.className}`}>
        <div className="doehealth-desk-floor__bar">
          <strong className={dmSans.className}>Westfield</strong>
          <span>Thursday, 8:06 AM</span>
        </div>
        <div className="doehealth-desk-floor__body">
          <ol className="doehealth-desk-floor__book">
            {DOEHEALTH_DESK_CLOSE_BOOK.map((slot) => (
              <li key={slot.time} className={"open" in slot && slot.open ? "is-open" : undefined}>
                <time>{slot.time}</time>
                <span>{slot.who}</span>
              </li>
            ))}
          </ol>
          <article className="doehealth-desk-floor__note">
            <header>
              <strong className={dmSans.className}>Maya Chen</strong>
              <span>Diabetes follow-up · Dr. Shah</span>
            </header>
            <p>A1C 8.4, down from 9.1. Metformin continued for 90 days. Return Thursday at 9:40.</p>
            <p>The note is already in Athena.</p>
          </article>
          <article className="doehealth-desk-floor__call">
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
