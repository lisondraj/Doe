"use client";

import {
  PRODUCT2_VOICE_AGENT,
  product2AgentStatusLabel,
} from "@/lib/product2/product2-agents-copy";
import { inter, suisseIntl } from "@/lib/home/fonts";

/** Voice agent editor — single-agent configuration on the agents canvas. */
export function Product2VoiceAgentEditor() {
  const agent = PRODUCT2_VOICE_AGENT;

  return (
    <section className="product-voice-agent-editor" aria-label="Voice agent editor">
      <div className="product-voice-agent-editor__layout">
        <header className="product-voice-agent-editor__hero">
          <div className="product-voice-agent-editor__hero-main">
            <div className="product-voice-agent-editor__hero-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className={`product-voice-agent-editor__eyebrow m-0 ${suisseIntl.className}`}>Voice agent</p>
              <h2 className={`product-voice-agent-editor__title m-0 mt-1 ${suisseIntl.className}`}>{agent.name}</h2>
              <p className={`product-voice-agent-editor__line m-0 mt-1 ${inter.className}`}>{agent.line}</p>
            </div>
          </div>
          <span className={`product-voice-agent-editor__status ${suisseIntl.className}`}>
            {product2AgentStatusLabel(agent.status)}
          </span>
        </header>

        <div className="product-voice-agent-editor__sections">
          <section className="product-voice-agent-editor__section">
            <h3 className={`product-voice-agent-editor__section-title m-0 ${suisseIntl.className}`}>Opening greeting</h3>
            <div className={`product-voice-agent-editor__field ${inter.className}`}>{agent.greeting}</div>
          </section>

          <section className="product-voice-agent-editor__section">
            <h3 className={`product-voice-agent-editor__section-title m-0 ${suisseIntl.className}`}>Language & voice</h3>
            <div className="product-voice-agent-editor__meta-grid">
              <div className="product-voice-agent-editor__meta">
                <p className={`product-voice-agent-editor__meta-label m-0 ${suisseIntl.className}`}>Languages</p>
                <p className={`product-voice-agent-editor__meta-value m-0 mt-1 ${inter.className}`}>{agent.language}</p>
              </div>
              <div className="product-voice-agent-editor__meta">
                <p className={`product-voice-agent-editor__meta-label m-0 ${suisseIntl.className}`}>Voice style</p>
                <p className={`product-voice-agent-editor__meta-value m-0 mt-1 ${inter.className}`}>{agent.voice}</p>
              </div>
            </div>
            <p className={`product-voice-agent-editor__hint m-0 mt-2 ${inter.className}`}>{agent.hours}</p>
          </section>

          <section className="product-voice-agent-editor__section">
            <h3 className={`product-voice-agent-editor__section-title m-0 ${suisseIntl.className}`}>Intent routing</h3>
            <ul className="product-voice-agent-editor__list m-0 list-none p-0">
              {agent.intents.map((intent) => (
                <li key={intent.id} className="product-voice-agent-editor__list-item">
                  <p className={`product-voice-agent-editor__list-label m-0 ${suisseIntl.className}`}>{intent.label}</p>
                  <p className={`product-voice-agent-editor__list-detail m-0 mt-0.5 ${inter.className}`}>{intent.action}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="product-voice-agent-editor__section">
            <h3 className={`product-voice-agent-editor__section-title m-0 ${suisseIntl.className}`}>Handoff rules</h3>
            <ul className="product-voice-agent-editor__list m-0 list-none p-0">
              {agent.handoffs.map((handoff) => (
                <li key={handoff.id} className="product-voice-agent-editor__list-item">
                  <p className={`product-voice-agent-editor__list-label m-0 ${suisseIntl.className}`}>{handoff.label}</p>
                  <p className={`product-voice-agent-editor__list-detail m-0 mt-0.5 ${inter.className}`}>{handoff.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
