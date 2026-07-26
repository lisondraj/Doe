"use client";

import { Fragment } from "react";

import { Product2ChartProfileA1cTrend } from "@/components/product2/Product2ChartProfileA1cTrend";
import { Product2CallHistoryRecentLabs } from "@/components/product2/Product2CallHistoryRecentLabs";
import { Product2CallHistoryRecentVitals } from "@/components/product2/Product2CallHistoryRecentVitals";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT2_CALL_HISTORY_A1C_TREND,
  PRODUCT2_CALL_HISTORY_ALLERGIES,
  PRODUCT2_CALL_HISTORY_CONDITIONS,
  PRODUCT2_CALL_HISTORY_HERO_DETAILS,
  PRODUCT2_CALL_HISTORY_HERO_NAME,
  PRODUCT2_CALL_HISTORY_MEDICATIONS,
  PRODUCT2_CALL_HISTORY_OPEN_TASKS,
  PRODUCT2_CALL_HISTORY_RECENT_VISITS,
  PRODUCT2_CALL_HISTORY_HEADER,
  PRODUCT2_CALL_HISTORY_VISIT_BOOKED,
  PRODUCT2_CALL_HISTORY_VISIT_TITLE,
} from "@/lib/product2/product2-copy";
import "@/lib/product2/product2-landing.css";
import { Product2CallHistoryOpenTaskIcon } from "@/components/product2/Product2CallHistoryOpenTaskIcon";
/** Call History workspace — blank canvas; whole-page brown gradient like Today tab. */
export function Product2CallHistoryPanel({ onBack }: { onBack?: () => void }) {
  const [rootCrumb, dateCrumb, patientCrumb] = PRODUCT2_CALL_HISTORY_HEADER.crumbs;

  return (
    <div className="product-call-history-panel product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="product-landing-console-shell shrink-0">
        <header className={`product-landing-header flex items-center gap-2 ${suisseIntl.className}`}>
          <button
            type="button"
            className="product-landing-header__back shrink-0"
            aria-label={PRODUCT2_CALL_HISTORY_HEADER.backAria}
            onClick={onBack}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="product-landing-header__back-icon"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="product-landing-header__title product-landing-header__trail m-0 min-w-0 font-normal tracking-tight">
            <span className="product-landing-header__crumb">{rootCrumb}</span>
            <span className="product-landing-header__crumb-separator" aria-hidden>
              /
            </span>
            <span className="product-landing-header__crumb">{dateCrumb}</span>
            <span className="product-landing-header__crumb-separator" aria-hidden>
              /
            </span>
            <span className="product-landing-header__crumb product-landing-header__crumb--current">{patientCrumb}</span>
          </h1>
        </header>
      </div>

      <div className="product-call-history-panel__body min-h-0 flex-1">
        <div className="product-call-history-panel__center-stage">
          <div className="product-call-history-panel__center-lines" aria-hidden>
            <div className="product-call-history-panel__center-lines-square">
              <span className="product-call-history-panel__center-lines-v product-call-history-panel__center-lines-v--left" />
              <span className="product-call-history-panel__center-lines-v product-call-history-panel__center-lines-v--right" />
              <span className="product-call-history-panel__center-lines-h product-call-history-panel__center-lines-h--top" />
              <span className="product-call-history-panel__center-lines-h product-call-history-panel__center-lines-h--bottom" />
            </div>
          </div>
        </div>
        <div className="product-call-history-panel__visit-header">
          <div
            className={`product-call-history-panel__visit-title ${suisseIntl.className}`}
            aria-label={`${PRODUCT2_CALL_HISTORY_VISIT_TITLE.topLine} ${PRODUCT2_CALL_HISTORY_VISIT_TITLE.bottomLine}`}
          >
            <p className="product-call-history-panel__visit-title-line m-0">
              {PRODUCT2_CALL_HISTORY_VISIT_TITLE.topLine}
            </p>
            <p className="product-call-history-panel__visit-title-line m-0">
              {PRODUCT2_CALL_HISTORY_VISIT_TITLE.bottomLine}
            </p>
          </div>
          <p className={`product-call-history-panel__visit-booked m-0 ${dmSans.className}`}>
            <span className="product-call-history-panel__visit-booked-prefix">
              {PRODUCT2_CALL_HISTORY_VISIT_BOOKED.prefix}
            </span>
            <span className="product-call-history-panel__visit-booked-datetime">
              {PRODUCT2_CALL_HISTORY_VISIT_BOOKED.datetime}
            </span>
          </p>
          <div className="product-call-history-panel__charts-row">
            <div className="product-call-history-panel__charts-col">
              <div
                className="product-call-history-panel__a1c-card product-landing-live-quote__chart-profile"
                aria-label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
              >
                <Product2ChartProfileA1cTrend
                  label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
                  readings={PRODUCT2_CALL_HISTORY_A1C_TREND.readings}
                  doseChanges={PRODUCT2_CALL_HISTORY_A1C_TREND.doseChanges}
                />
              </div>
              <div
                className="product-call-history-panel__meds-card product-landing-live-quote__chart-profile"
                aria-label={PRODUCT2_CALL_HISTORY_MEDICATIONS.label}
              >
                <div className="product-call-history-panel__meds-shell">
                  <p className={`product-call-history-panel__meds-label m-0 ${suisseIntl.className}`}>
                    {PRODUCT2_CALL_HISTORY_MEDICATIONS.label}
                  </p>
                  <ul className={`product-call-history-panel__meds-list m-0 ${dmSans.className}`}>
                    {PRODUCT2_CALL_HISTORY_MEDICATIONS.items.map((medication) => (
                      <li key={medication} className="product-call-history-panel__meds-item">
                        {medication}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className="product-call-history-panel__visits-card product-landing-live-quote__chart-profile"
                aria-label={PRODUCT2_CALL_HISTORY_RECENT_VISITS.label}
              >
                <div className="product-call-history-panel__visits-shell">
                  <p className={`product-call-history-panel__visits-label m-0 ${suisseIntl.className}`}>
                    {PRODUCT2_CALL_HISTORY_RECENT_VISITS.label}
                  </p>
                  <ul className={`product-call-history-panel__visits-list m-0 ${dmSans.className}`}>
                    {PRODUCT2_CALL_HISTORY_RECENT_VISITS.items.map((visit) => (
                      <li key={visit.title} className="product-call-history-panel__visits-item">
                        <div className="product-call-history-panel__visits-date" aria-hidden>
                          <span className="product-call-history-panel__visits-date-month">{visit.month}</span>
                          <span className="product-call-history-panel__visits-date-day">{visit.day}</span>
                          <span className="product-call-history-panel__visits-date-weekday">{visit.weekday}</span>
                        </div>
                        <div className="product-call-history-panel__visits-item-copy">
                          <span className="product-call-history-panel__visits-item-title">{visit.title}</span>
                          <span className="product-call-history-panel__visits-item-when">{visit.when}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className="product-call-history-panel__conditions-card product-landing-live-quote__chart-profile"
                aria-label={PRODUCT2_CALL_HISTORY_CONDITIONS.label}
              >
                <div className="product-call-history-panel__conditions-shell">
                  <p className={`product-call-history-panel__conditions-label m-0 ${suisseIntl.className}`}>
                    {PRODUCT2_CALL_HISTORY_CONDITIONS.label}
                  </p>
                  <ul className={`product-call-history-panel__conditions-list m-0 ${dmSans.className}`}>
                    {PRODUCT2_CALL_HISTORY_CONDITIONS.items.map((condition) => (
                      <li key={condition} className="product-call-history-panel__conditions-item">
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className="product-call-history-panel__allergies-card product-landing-live-quote__chart-profile"
                aria-label={PRODUCT2_CALL_HISTORY_ALLERGIES.label}
              >
                <div className="product-call-history-panel__allergies-shell">
                  <p className={`product-call-history-panel__allergies-label m-0 ${suisseIntl.className}`}>
                    {PRODUCT2_CALL_HISTORY_ALLERGIES.label}
                  </p>
                  <ul className={`product-call-history-panel__allergies-list m-0 ${dmSans.className}`}>
                    {PRODUCT2_CALL_HISTORY_ALLERGIES.items.map((allergy) => (
                      <li key={allergy} className="product-call-history-panel__allergies-item">
                        {allergy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="product-call-history-panel__charts-col product-call-history-panel__charts-col--aside">
              <div
                className="product-call-history-panel__vitals-card product-landing-live-quote__chart-profile"
                aria-label="Recent vitals"
              >
                <Product2CallHistoryRecentVitals />
              </div>
              <div
                className="product-call-history-panel__tasks-card product-landing-live-quote__chart-profile"
                aria-label={PRODUCT2_CALL_HISTORY_OPEN_TASKS.label}
              >
                <div className="product-call-history-panel__tasks-shell">
                  <p className={`product-call-history-panel__tasks-label m-0 ${suisseIntl.className}`}>
                    {PRODUCT2_CALL_HISTORY_OPEN_TASKS.label}
                  </p>
                  <ul className={`product-call-history-panel__tasks-list m-0 ${dmSans.className}`}>
                    {PRODUCT2_CALL_HISTORY_OPEN_TASKS.items.map((task) => (
                      <li
                        key={task.title}
                        className={`product-call-history-panel__tasks-item product-call-history-panel__tasks-item--${task.tone}`}
                      >
                        <span className="product-call-history-panel__tasks-item-icon" aria-hidden>
                          <Product2CallHistoryOpenTaskIcon kind={task.icon} />
                        </span>
                        <div className="product-call-history-panel__tasks-item-copy">
                          <span className="product-call-history-panel__tasks-item-title">{task.title}</span>
                          <span className="product-call-history-panel__tasks-item-badge">{task.when}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div
                className="product-call-history-panel__labs-card product-landing-live-quote__chart-profile"
                aria-label="Recent labs"
              >
                <Product2CallHistoryRecentLabs />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`product-call-history-panel__hero ${suisseIntl.className}`}
          aria-label={`${PRODUCT2_CALL_HISTORY_HERO_NAME.topLine} ${PRODUCT2_CALL_HISTORY_HERO_NAME.bottomLine}`}
        >
          <div className="product-call-history-panel__hero-name-block">
            <div className="product-call-history-panel__hero-name">
              <p className="product-call-history-panel__hero-line m-0">{PRODUCT2_CALL_HISTORY_HERO_NAME.topLine}</p>
              <p className="product-call-history-panel__hero-line m-0">{PRODUCT2_CALL_HISTORY_HERO_NAME.bottomLine}</p>
            </div>
            <div
              className={`product-call-history-panel__hero-details-row product-call-history-panel__hero-details-row--stats ${dmSans.className}`}
            >
              {PRODUCT2_CALL_HISTORY_HERO_DETAILS.map((detail, index) => (
                <Fragment key={detail.label}>
                  {index > 0 ? (
                    <span className="product-call-history-panel__hero-details-divider" aria-hidden />
                  ) : null}
                  <div className="product-call-history-panel__hero-details-col">
                    <p className="product-call-history-panel__hero-details-value m-0">{detail.value}</p>
                    <p className="product-call-history-panel__hero-details-label m-0">{detail.label}</p>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
