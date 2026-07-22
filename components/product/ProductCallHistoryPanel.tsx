"use client";

import { Fragment } from "react";

import { ProductChartProfileA1cTrend } from "@/components/product/ProductChartProfileA1cTrend";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT_CALL_HISTORY_A1C_TREND,
  PRODUCT_CALL_HISTORY_HERO_DETAILS,
  PRODUCT_CALL_HISTORY_HERO_NAME,
  PRODUCT_CALL_HISTORY_TAB_LABEL,
  PRODUCT_CALL_HISTORY_VISIT_BOOKED,
  PRODUCT_CALL_HISTORY_VISIT_TITLE,
} from "@/lib/product/product-copy";
import "@/lib/product/product-landing.css";

/** Call History workspace — blank canvas; whole-page brown gradient like Today tab. */
export function ProductCallHistoryPanel() {
  return (
    <div className="product-call-history-panel product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="product-landing-console-shell shrink-0">
        <header className={`product-landing-header flex items-center gap-2 ${suisseIntl.className}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="product-landing-header__icon shrink-0"
          >
            <path d="M5.5 4.5h2.75l1.25 2.75L8.5 9a11.5 11.5 0 0 0 5.5 5.5l1.75-1.25 2.75 1.25v2.75a1 1 0 0 1-1 1A13.5 13.5 0 0 1 4.5 5.5a1 1 0 0 1 1-1Z" />
          </svg>
          <h1 className="product-landing-header__title m-0 font-normal tracking-tight">
            {PRODUCT_CALL_HISTORY_TAB_LABEL}
          </h1>
        </header>
      </div>

      <div className="product-call-history-panel__body min-h-0 flex-1">
        <div className="product-call-history-panel__center-stage">
          <div
            className="product-call-history-panel__a1c-card product-landing-live-quote__chart-profile"
            aria-label={PRODUCT_CALL_HISTORY_A1C_TREND.label}
          >
            <ProductChartProfileA1cTrend
              label={PRODUCT_CALL_HISTORY_A1C_TREND.label}
              readings={PRODUCT_CALL_HISTORY_A1C_TREND.readings}
              doseChanges={PRODUCT_CALL_HISTORY_A1C_TREND.doseChanges}
            />
          </div>
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
            aria-label={`${PRODUCT_CALL_HISTORY_VISIT_TITLE.topLine} ${PRODUCT_CALL_HISTORY_VISIT_TITLE.bottomLine}`}
          >
            <p className="product-call-history-panel__visit-title-line m-0">
              {PRODUCT_CALL_HISTORY_VISIT_TITLE.topLine}
            </p>
            <p className="product-call-history-panel__visit-title-line m-0">
              {PRODUCT_CALL_HISTORY_VISIT_TITLE.bottomLine}
            </p>
          </div>
          <p className={`product-call-history-panel__visit-booked m-0 ${dmSans.className}`}>
            <span className="product-call-history-panel__visit-booked-prefix">
              {PRODUCT_CALL_HISTORY_VISIT_BOOKED.prefix}
            </span>
            <span className="product-call-history-panel__visit-booked-datetime">
              {PRODUCT_CALL_HISTORY_VISIT_BOOKED.datetime}
            </span>
          </p>
        </div>
        <div
          className={`product-call-history-panel__hero ${suisseIntl.className}`}
          aria-label={`${PRODUCT_CALL_HISTORY_HERO_NAME.topLine} ${PRODUCT_CALL_HISTORY_HERO_NAME.bottomLine}`}
        >
          <div className="product-call-history-panel__hero-name-block">
            <div className="product-call-history-panel__hero-name">
              <p className="product-call-history-panel__hero-line m-0">{PRODUCT_CALL_HISTORY_HERO_NAME.topLine}</p>
              <p className="product-call-history-panel__hero-line m-0">{PRODUCT_CALL_HISTORY_HERO_NAME.bottomLine}</p>
            </div>
            <div
              className={`product-call-history-panel__hero-details-row product-call-history-panel__hero-details-row--stats ${dmSans.className}`}
            >
              {PRODUCT_CALL_HISTORY_HERO_DETAILS.map((detail, index) => (
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
