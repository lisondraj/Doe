import type { CSSProperties } from "react";

import { DoeHealthCallHistoryScroll } from "@/components/doehealth/DoeHealthCallHistoryScroll";
import { Product2LandingLiveThread } from "@/components/product2/Product2LandingLiveThread";
import { DOEHEALTH_CALL_HISTORY_INTRO_TURNS, DOEHEALTH_CALL_HISTORY_TREE } from "@/lib/doehealth/doehealth-call-history-tree";
import "@/lib/doehealth/doehealth-initiatives.css";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import "@/lib/product2/product2-landing.css";

/** Centered call history tree — product2 brown / gold card styling. */
export function DoeHealthCallHistoryDiagram({
  className = "",
  width = "default",
  showConditions = true,
  showCallHistory = true,
  bare = false,
  durationLabel,
  callHistoryMode = "scroll",
  /** motion = Calling from / Answered morph (Remotion /motion4 only). */
  headerMode = "static",
  headerSettle = 1,
  headerMorph = 1,
  headerMorphSubline = 1,
  headerHeroY = "0px",
  callHistoryOpacity = 1,
  style,
}: {
  className?: string;
  width?: "default" | "wide";
  showConditions?: boolean;
  showCallHistory?: boolean;
  /** Drop outer card chrome — content only (motion / bare layouts). */
  bare?: boolean;
  /** Override hero duration label (e.g. animated count-up). */
  durationLabel?: string;
  /** scroll = auto-drift viewport; reveal = one turn at a time (Remotion). */
  callHistoryMode?: "scroll" | "reveal";
  /** static = /doehealth “Called”; motion = /motion4 Calling from → Answered. */
  headerMode?: "static" | "motion";
  /** 0 = large hero centered; 1 = compact header above convo. */
  headerSettle?: number;
  /** 0 = Incoming… / timer hidden; 1 = timer visible. */
  headerMorph?: number;
  /** 0 = Calling from; 1 = Answered. */
  headerMorphSubline?: number;
  /** Vertical anchor for incoming center → compact top settle. */
  headerHeroY?: string;
  callHistoryOpacity?: number;
  style?: CSSProperties;
}) {
  const { heroName, phone, totalDuration, conditions } = DOEHEALTH_CALL_HISTORY_TREE;
  const conditionsLabel = conditions.join(", ");
  const resolvedDuration = durationLabel ?? totalDuration;
  const isMotionHeader = headerMode === "motion";
  const statusLabel = isMotionHeader
    ? headerMorph >= 0.5
      ? resolvedDuration
      : "Incoming..."
    : resolvedDuration;
  const prefixLabel = isMotionHeader
    ? headerMorphSubline >= 0.5
      ? "Answered"
      : "Calling from"
    : "Called";

  const callHistory =
    showCallHistory ? (
      callHistoryMode === "reveal" ? (
        <div className="motion4-call-history-reveal" style={{ opacity: callHistoryOpacity }}>
          <Product2LandingLiveThread
            className="product-call-history-rail__thread doehealth-initiatives__call-history"
            showOutcome={false}
            showActions={false}
            showChartProfile={false}
            turns={DOEHEALTH_CALL_HISTORY_INTRO_TURNS}
          />
        </div>
      ) : (
        <DoeHealthCallHistoryScroll>
          <Product2LandingLiveThread
            className="product-call-history-rail__thread doehealth-initiatives__call-history"
            showOutcome={false}
            showActions={false}
            showChartProfile={false}
            turns={DOEHEALTH_CALL_HISTORY_INTRO_TURNS}
          />
        </DoeHealthCallHistoryScroll>
      )
    ) : null;

  const conditionsList = showConditions ? (
    <ul className="doehealth-initiatives__conditions" aria-label="Active conditions">
      {conditions.map((condition) => (
        <li key={condition} className={`doehealth-initiatives__condition ${dmSans.className}`}>
          {condition}
        </li>
      ))}
    </ul>
  ) : null;

  if (!isMotionHeader) {
    return (
      <div
        className={`doehealth-initiatives doehealth-initiatives--${width}${bare ? " doehealth-initiatives--bare" : ""} ${suisseIntl.className}${className ? ` ${className}` : ""}`}
        style={style}
        aria-label={
          showConditions
            ? `${heroName}, Called ${phone}, ${resolvedDuration}, ${conditionsLabel}`
            : `${heroName}, Called ${phone}, ${resolvedDuration}`
        }
      >
        <div className="doehealth-initiatives__card">
          <div className="doehealth-initiatives__hero-block">
            <div className="doehealth-initiatives__hero-row">
              <h2 className={`doehealth-initiatives__hero doehealth-initiatives__hero--bold ${dmSans.className}`}>
                {heroName}
              </h2>
              <span className={`doehealth-initiatives__hero-duration ${dmSans.className}`}>{resolvedDuration}</span>
            </div>
            <p className={`doehealth-initiatives__called-line ${suisseIntl.className}`}>
              <span className="doehealth-initiatives__called-prefix">Called </span>
              <span className={`doehealth-initiatives__called-number ${dmSans.className}`}>{phone}</span>
            </p>
          </div>

          {conditionsList}
          {callHistory}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`doehealth-initiatives doehealth-initiatives--${width}${bare ? " doehealth-initiatives--bare" : ""} motion4-call-header ${suisseIntl.className}${className ? ` ${className}` : ""}`}
      style={
        {
          ...style,
          "--m4-call-settle": headerSettle,
          "--m4-call-morph": headerMorph,
          "--m4-call-morph-status": headerMorph,
          "--m4-call-morph-subline": headerMorphSubline,
          "--m4-call-hero-y": headerHeroY,
          "--m4-call-history-o": callHistoryOpacity,
        } as CSSProperties
      }
      aria-label={
        showConditions
          ? `${heroName}, ${prefixLabel} ${phone}, ${statusLabel}, ${conditionsLabel}`
          : `${heroName}, ${prefixLabel} ${phone}, ${statusLabel}`
      }
    >
      <div className="doehealth-initiatives__card motion4-call-header__card">
        <div className="motion4-call-header__hero-zone">
          <div className="doehealth-initiatives__hero-block motion4-call-header__block">
            <div className="motion4-call-header__shell">
              <div className="doehealth-initiatives__hero-row motion4-call-header__row">
                <h2 className={`doehealth-initiatives__hero doehealth-initiatives__hero--bold motion4-call-header__name ${dmSans.className}`}>
                  {heroName}
                </h2>
                <div className="motion4-call-header__status-slot">
                  <span className={`motion4-call-header__incoming ${dmSans.className}`}>Incoming...</span>
                  <span className={`doehealth-initiatives__hero-duration motion4-call-header__duration ${dmSans.className}`}>
                    {resolvedDuration}
                  </span>
                </div>
              </div>
              <p className={`doehealth-initiatives__called-line motion4-call-header__subline ${suisseIntl.className}`}>
                <span className="motion4-call-header__prefix">
                  <span className={`motion4-call-header__calling-from ${suisseIntl.className}`}>Calling from </span>
                  <span className={`motion4-call-header__answered ${suisseIntl.className}`}>Answered </span>
                </span>
                <span className={`doehealth-initiatives__called-number motion4-call-header__phone ${dmSans.className}`}>{phone}</span>
              </p>
            </div>
          </div>
        </div>

        {conditionsList}
        {callHistory}
      </div>
    </div>
  );
}
