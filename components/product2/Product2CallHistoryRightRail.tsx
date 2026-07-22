"use client";

import { useState } from "react";

import { Product2LandingLiveThread } from "@/components/product2/Product2LandingLiveThread";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT2_CALL_HISTORY_COMPOSER_MODEL,
  PRODUCT2_CALL_HISTORY_COMPOSER_PLACEHOLDER,
  PRODUCT2_CALL_HISTORY_CONVO_VIEW_AGENT_ONLY,
  PRODUCT2_CALL_HISTORY_CONVO_VIEW_FULL,
  PRODUCT2_CALL_HISTORY_RAIL_ACTIONS,
} from "@/lib/product2/product2-copy";
import "@/lib/product2/product2-landing.css";

type CallHistoryConvoView = "full" | "agent-only";

function ComposerChevronIcon() {
  return (
    <svg className="product-call-history-rail__composer-chevron" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path
        d="M2 3 4 5 6 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ComposerSubmitIcon() {
  return (
    <svg className="product-call-history-rail__composer-submit-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8h8.75M9.25 4.75 12.5 8l-3.25 3.25"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Call History right rail — punched brown card with live transcript + view toggle. */
export function Product2CallHistoryRightRail() {
  const [convoView, setConvoView] = useState<CallHistoryConvoView>("full");
  const [composerValue, setComposerValue] = useState("");

  return (
    <aside
      className={`product-brown-sidebar product-brown-sidebar--call-history-rail product-brown-call-history-rail shrink-0 ${suisseIntl.className}`}
    >
      <div className="product-call-history-rail__surface flex h-full min-h-0 flex-col">
        <div className={`product-call-history-rail__toolbar shrink-0 ${dmSans.className}`}>
          <div
            className={`product-call-history-rail__segmented product-call-history-rail__segmented--${convoView}`}
            role="group"
            aria-label="Conversation view"
          >
            <button
              type="button"
              className={`product-call-history-rail__segmented-btn${convoView === "full" ? " product-call-history-rail__segmented-btn--active" : ""}`}
              aria-pressed={convoView === "full"}
              onClick={() => setConvoView("full")}
            >
              {PRODUCT2_CALL_HISTORY_CONVO_VIEW_FULL}
            </button>
            <button
              type="button"
              className={`product-call-history-rail__segmented-btn${convoView === "agent-only" ? " product-call-history-rail__segmented-btn--active" : ""}`}
              aria-pressed={convoView === "agent-only"}
              onClick={() => setConvoView("agent-only")}
            >
              {PRODUCT2_CALL_HISTORY_CONVO_VIEW_AGENT_ONLY}
            </button>
          </div>

          <div className="product-call-history-rail__actions" role="group" aria-label="Call history actions">
            {PRODUCT2_CALL_HISTORY_RAIL_ACTIONS.map((label) => (
              <button key={label} type="button" className="product-call-history-rail__action-btn">
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="product-call-history-rail__scroll min-h-0 flex-1">
          <Product2LandingLiveThread
            className="product-call-history-rail__thread"
            showOutcome={false}
            showActions={false}
            convoView={convoView}
          />
        </div>

        <div className={`product-call-history-rail__composer shrink-0 ${dmSans.className}`}>
          <div className="product-call-history-rail__composer-box">
            <label className="sr-only" htmlFor="call-history-rail-composer">
              Ask about this call
            </label>
            <textarea
              id="call-history-rail-composer"
              className="product-call-history-rail__composer-input"
              rows={2}
              placeholder={PRODUCT2_CALL_HISTORY_COMPOSER_PLACEHOLDER}
              value={composerValue}
              onChange={(event) => setComposerValue(event.target.value)}
            />
            <div className="product-call-history-rail__composer-footer">
              <button type="button" className="product-call-history-rail__model-select" aria-haspopup="listbox">
                <span>{PRODUCT2_CALL_HISTORY_COMPOSER_MODEL}</span>
                <ComposerChevronIcon />
              </button>
              <button
                type="button"
                className="product-call-history-rail__composer-submit"
                aria-label="Submit"
                disabled={!composerValue.trim()}
              >
                <ComposerSubmitIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
