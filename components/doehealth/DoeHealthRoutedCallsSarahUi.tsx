"use client";

import { Fragment } from "react";

import { Product2ChartProfileA1cTrend } from "@/components/product2/Product2ChartProfileA1cTrend";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT2_CALL_HISTORY_A1C_TREND,
  PRODUCT2_CALL_HISTORY_HERO_DETAILS,
  PRODUCT2_CALL_HISTORY_HERO_NAME,
} from "@/lib/product2/product2-copy";
import "@/lib/product2/product2-landing.css";

/** First left-bleed overlay — centered Last A1C + bottom-right Sarah Westfield hero. */
export function DoeHealthRoutedCallsSarahUi() {
  return (
    <div className="doehealth-routed-calls-sarah">
      <div className="doehealth-routed-calls-sarah__center">
        <div
          className="doehealth-routed-calls-sarah__a1c product-landing-live-quote__chart-profile"
          aria-label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
        >
          <Product2ChartProfileA1cTrend
            label={PRODUCT2_CALL_HISTORY_A1C_TREND.label}
            readings={PRODUCT2_CALL_HISTORY_A1C_TREND.readings}
            doseChanges={PRODUCT2_CALL_HISTORY_A1C_TREND.doseChanges}
          />
        </div>
      </div>

      <div
        className={`doehealth-routed-calls-sarah__hero ${suisseIntl.className}`}
        aria-label={`${PRODUCT2_CALL_HISTORY_HERO_NAME.topLine} ${PRODUCT2_CALL_HISTORY_HERO_NAME.bottomLine}`}
      >
        <div className="doehealth-routed-calls-sarah__hero-name-block">
          <div className="doehealth-routed-calls-sarah__hero-name">
            <p className="doehealth-routed-calls-sarah__hero-line m-0">
              {PRODUCT2_CALL_HISTORY_HERO_NAME.topLine}
            </p>
            <p className="doehealth-routed-calls-sarah__hero-line m-0">
              {PRODUCT2_CALL_HISTORY_HERO_NAME.bottomLine}
            </p>
          </div>
          <div
            className={`doehealth-routed-calls-sarah__hero-details ${dmSans.className}`}
          >
            {PRODUCT2_CALL_HISTORY_HERO_DETAILS.map((detail, index) => (
              <Fragment key={detail.label}>
                {index > 0 ? (
                  <span className="doehealth-routed-calls-sarah__hero-divider" aria-hidden />
                ) : null}
                <div className="doehealth-routed-calls-sarah__hero-col">
                  <p className="doehealth-routed-calls-sarah__hero-value m-0">{detail.value}</p>
                  <p className="doehealth-routed-calls-sarah__hero-label m-0">{detail.label}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
