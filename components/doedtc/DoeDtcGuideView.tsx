"use client";

import { dmSans } from "@/lib/home/fonts";
import { DoeDtcPageHeader } from "@/components/doedtc/DoeDtcPageHeader";
import type { DoeDtcGuideBlock, DoeDtcGuideRow } from "@/lib/doedtc/doedtc-types";

function GuideIllustration({ preset }: { preset: "pen" | "fridge" | "clock" | "rotate" }) {
  if (preset === "fridge") {
    return (
      <svg viewBox="0 0 120 120" className="doedtc-guide__illustration-svg" aria-hidden>
        <rect x="24" y="16" width="72" height="88" rx="8" fill="none" stroke="currentColor" strokeWidth="3" />
        <line x1="24" y1="48" x2="96" y2="48" stroke="currentColor" strokeWidth="3" />
        <rect x="34" y="58" width="16" height="28" rx="3" fill="currentColor" opacity="0.35" />
      </svg>
    );
  }
  if (preset === "clock") {
    return (
      <svg viewBox="0 0 120 120" className="doedtc-guide__illustration-svg" aria-hidden>
        <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="3" />
        <line x1="60" y1="60" x2="60" y2="36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="60" x2="78" y2="60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (preset === "rotate") {
    return (
      <svg viewBox="0 0 120 120" className="doedtc-guide__illustration-svg" aria-hidden>
        <path
          d="M60 24a36 36 0 1 1-25.5 10.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <polyline points="28,38 34,24 48,30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="60" r="8" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" className="doedtc-guide__illustration-svg" aria-hidden>
      <rect x="42" y="18" width="36" height="84" rx="18" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="50" y="10" width="20" height="16" rx="4" fill="currentColor" opacity="0.35" />
      <line x1="60" y1="34" x2="60" y2="86" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    </svg>
  );
}

function SiteChip({ site }: { site: "abdomen" | "thigh" | "arm" }) {
  const label = site === "abdomen" ? "Abdomen" : site === "thigh" ? "Thigh" : "Arm";
  return (
    <div className="doedtc-guide__site-chip">
      <svg viewBox="0 0 64 64" className="doedtc-guide__site-icon" aria-hidden>
        <ellipse cx="32" cy="34" rx="18" ry="22" fill="none" stroke="currentColor" strokeWidth="2" />
        {site === "abdomen" ? (
          <circle cx="32" cy="38" r="6" fill="currentColor" opacity="0.55" />
        ) : null}
        {site === "thigh" ? (
          <circle cx="32" cy="48" r="5" fill="currentColor" opacity="0.55" />
        ) : null}
        {site === "arm" ? (
          <circle cx="46" cy="28" r="5" fill="currentColor" opacity="0.55" />
        ) : null}
      </svg>
      <span>{label}</span>
    </div>
  );
}

function GuideBlock({ block }: { block: DoeDtcGuideBlock }) {
  switch (block.kind) {
    case "hero":
      return (
        <div className="doedtc-card doedtc-card--flat doedtc-guide__hero">
          <h2 className={`doedtc-headline ${dmSans.className}`}>{block.title}</h2>
          {block.body ? <p className="doedtc-body">{block.body}</p> : null}
        </div>
      );
    case "steps":
      return (
        <div className="doedtc-card doedtc-card--flat">
          <h3 className="doedtc-section-title">{block.title ?? "Steps"}</h3>
          <ol className="doedtc-guide__steps">
            {(block.steps ?? []).map((step, index) => (
              <li key={`${block.id}-step-${index}`} className="doedtc-guide__step">
                <span className="doedtc-guide__step-number">{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  {step.body ? <p className="doedtc-muted">{step.body}</p> : null}
                  {step.duration ? <span className="doedtc-guide__step-duration">{step.duration}</span> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    case "callout":
      return (
        <div className={`doedtc-guide__callout doedtc-guide__callout--${block.tone ?? "info"}`}>
          {block.title ? <strong>{block.title}</strong> : null}
          <p>{block.body}</p>
        </div>
      );
    case "checklist":
      return (
        <div className="doedtc-card doedtc-card--flat">
          <h3 className="doedtc-section-title">{block.title ?? "Checklist"}</h3>
          <ul className="doedtc-guide__checklist">
            {(block.items as string[] | undefined)?.map((item) => (
              <li key={`${block.id}-${item}`}>
                <span className="doedtc-guide__check" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    case "timeline":
      return (
        <div className="doedtc-card doedtc-card--flat">
          <h3 className="doedtc-section-title">{block.title ?? "Timeline"}</h3>
          <ul className="doedtc-guide__timeline">
            {(block.entries ?? []).map((entry, index) => (
              <li key={`${block.id}-entry-${index}`}>
                <span className="doedtc-guide__timeline-dot" aria-hidden />
                <div>
                  <strong>{entry.label}</strong>
                  {entry.detail ? <p className="doedtc-muted">{entry.detail}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    case "dose_card":
      return (
        <div className="doedtc-card doedtc-card--flat doedtc-guide__dose-card">
          <p className="doedtc-eyebrow">Medication</p>
          <h3 className="doedtc-section-title">{block.medication ?? block.title}</h3>
          <div className="doedtc-guide__dose-meta">
            {block.dose ? <span className="doedtc-guide__chip">{block.dose}</span> : null}
            {block.cadence ? <span className="doedtc-guide__chip">{block.cadence}</span> : null}
            {block.site ? <span className="doedtc-guide__chip">{block.site}</span> : null}
          </div>
        </div>
      );
    case "site_map":
      return (
        <div className="doedtc-card doedtc-card--flat">
          <h3 className="doedtc-section-title">{block.title ?? "Injection sites"}</h3>
          {block.body ? <p className="doedtc-muted">{block.body}</p> : null}
          <div className="doedtc-guide__site-grid">
            {(block.sites ?? []).map((site) => (
              <SiteChip key={`${block.id}-${site}`} site={site} />
            ))}
          </div>
        </div>
      );
    case "do_dont":
      return (
        <div className="doedtc-guide__dodont">
          <div className="doedtc-card doedtc-card--flat doedtc-guide__dodont-col">
            <h3 className="doedtc-section-title">Do</h3>
            <ul className="doedtc-prepare__list">
              {(block.dos ?? []).map((item) => (
                <li key={`${block.id}-do-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="doedtc-card doedtc-card--flat doedtc-guide__dodont-col">
            <h3 className="doedtc-section-title">Don&apos;t</h3>
            <ul className="doedtc-prepare__list">
              {(block.donts ?? []).map((item) => (
                <li key={`${block.id}-dont-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "faq":
      return (
        <div className="doedtc-card doedtc-card--flat">
          <h3 className="doedtc-section-title">{block.title ?? "FAQ"}</h3>
          <dl className="doedtc-guide__faq">
            {(
              block.items as Array<{ question: string; answer: string }> | undefined
            )?.map((item) => (
              <div key={`${block.id}-${item.question}`} className="doedtc-guide__faq-item">
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "facts":
      return (
        <div className="doedtc-guide__facts">
          {(
            block.items as Array<{ label: string; value: string }> | undefined
          )?.map((item) => (
            <div key={`${block.id}-${item.label}`} className="doedtc-card doedtc-card--flat doedtc-guide__fact">
              <p className="doedtc-eyebrow">{item.label}</p>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      );
    case "illustration":
      return (
        <div className="doedtc-card doedtc-card--flat doedtc-guide__illustration">
          <GuideIllustration preset={block.preset ?? "pen"} />
          {block.title ? <h3 className="doedtc-section-title">{block.title}</h3> : null}
          {block.body ? <p className="doedtc-muted">{block.body}</p> : null}
        </div>
      );
    case "disclaimer":
      return <p className="doedtc-guide__disclaimer">{block.body}</p>;
    default:
      return null;
  }
}

type DoeDtcGuideViewProps = {
  guide: Pick<DoeDtcGuideRow, "title" | "topic" | "layout" | "blocks">;
};

export function DoeDtcGuideView({ guide }: DoeDtcGuideViewProps) {
  return (
    <div className="doedtc-guide">
      <p className="doedtc-eyebrow">{guide.layout.replace("_", " ")}</p>
      <DoeDtcPageHeader title={guide.title} />
      {guide.topic ? <p className="doedtc-muted">{guide.topic}</p> : null}
      <div className="doedtc-guide__blocks">
        {guide.blocks.map((block) => (
          <GuideBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
