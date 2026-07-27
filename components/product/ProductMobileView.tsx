"use client";

import { useLayoutEffect, useState } from "react";

import { weekSchedule } from "@/components/doe-schedules-app-mock";
import { ProductCallHistoryPanel } from "@/components/product/ProductCallHistoryPanel";
import { ProductCallHistoryRightRail } from "@/components/product/ProductCallHistoryRightRail";
import { ProductLandingPanel } from "@/components/product/ProductLandingPanel";
import { applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { dmSans, lora, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT_MOBILE_INBOX_THREADS,
  PRODUCT_MOBILE_NAV_ITEMS,
  type ProductMobileTab,
} from "@/lib/product/product-mobile-nav";
import "@/lib/product/product-brown-mock.css";
import "@/lib/product/product-landing.css";
import "@/lib/product/product-mobile.css";

function TabIcon({ id, active }: { id: ProductMobileTab; active: boolean }) {
  const stroke = active ? "#f5e6d0" : "rgba(245,230,208,0.48)";
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-[1.35rem] w-[1.35rem]",
    "aria-hidden": true as const,
  };

  if (id === "today") {
    return (
      <svg {...common}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    );
  }
  if (id === "calls") {
    return (
      <svg {...common}>
        <path d="M5.5 4.5h2.75l1.25 2.75L8.5 9a11.5 11.5 0 0 0 5.5 5.5l1.75-1.25 2.75 1.25v2.75a1 1 0 0 1-1 1A13.5 13.5 0 0 1 4.5 5.5a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }
  if (id === "schedule") {
    return (
      <svg {...common}>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function ProductMobileSchedulePanel() {
  const day = weekSchedule[0];

  return (
    <section className="product-mobile-panel product-mobile-schedule" aria-label="Schedule">
      <header className={`product-mobile-panel__header ${suisseIntl.className}`}>
        <h1 className="product-mobile-panel__title">Schedule</h1>
        <p className={`product-mobile-panel__meta ${dmSans.className}`}>
          {day.day} · {day.date}
        </p>
      </header>
      <ul className="product-mobile-schedule__list">
        {day.events.map((event) => (
          <li key={`${event.time}-${event.label}`} className="product-mobile-schedule__row">
            <span className={`product-mobile-schedule__time ${suisseIntl.className}`}>{event.time}</span>
            <span className={`product-mobile-schedule__label ${dmSans.className}`}>{event.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProductMobileInboxPanel() {
  return (
    <section className="product-mobile-panel product-mobile-inbox" aria-label="Inbox">
      <header className={`product-mobile-panel__header ${suisseIntl.className}`}>
        <h1 className="product-mobile-panel__title">Inbox</h1>
        <p className={`product-mobile-panel__meta ${dmSans.className}`}>Email · clinic queue</p>
      </header>
      <ul className="product-mobile-inbox__list">
        {PRODUCT_MOBILE_INBOX_THREADS.map((thread) => (
          <li
            key={thread.id}
            className={`product-mobile-inbox__row${thread.unread ? " product-mobile-inbox__row--unread" : ""}`}
          >
            <div className="product-mobile-inbox__row-top">
              <span className={`product-mobile-inbox__from ${dmSans.className}`}>{thread.from}</span>
              <span className={`product-mobile-inbox__time ${suisseIntl.className}`}>{thread.time}</span>
            </div>
            <p className={`product-mobile-inbox__subject ${dmSans.className}`}>{thread.subject}</p>
            <p className={`product-mobile-inbox__preview ${suisseIntl.className}`}>{thread.preview}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** iPhone /product — bottom-tab shell; desktop mock stays untouched. */
export function ProductMobileView() {
  useDoePhoneLayoutViewport();
  useDoePhoneStableViewport(true);
  const [tab, setTab] = useState<ProductMobileTab>("today");

  useLayoutEffect(() => {
    applyPhoneOverflowChrome("#1a1208");
    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div
      className={`product-mobile-root product-brown-mock${tab === "calls" ? " product-brown-call-history-mode" : ""} ${lora.className}`}
      data-product-mobile="true"
    >
      <header className="product-mobile-topbar">
        <p className={`product-mobile-topbar__wordmark ${lora.className}`}>Doe</p>
        <p className={`product-mobile-topbar__clinic ${suisseIntl.className}`}>Westside Family Clinic</p>
      </header>

      <main className="product-mobile-main">
        {tab === "today" ? (
          <div className="product-mobile-embed product-mobile-embed--landing">
            <ProductLandingPanel />
          </div>
        ) : null}
        {tab === "calls" ? (
          <div className="product-mobile-embed product-mobile-embed--calls">
            <section
              className="product-mobile-calls-pane product-mobile-calls-pane--transcript"
              aria-label="Call transcript"
            >
              <ProductCallHistoryRightRail />
            </section>
            <section
              className="product-mobile-calls-pane product-mobile-calls-pane--chart"
              aria-label="Patient chart"
            >
              <ProductCallHistoryPanel onBack={() => setTab("today")} />
            </section>
          </div>
        ) : null}
        {tab === "schedule" ? <ProductMobileSchedulePanel /> : null}
        {tab === "inbox" ? <ProductMobileInboxPanel /> : null}
      </main>

      <nav className="product-mobile-tabbar" aria-label="Product">
        {PRODUCT_MOBILE_NAV_ITEMS.map((item) => {
          const active = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => setTab(item.id)}
              className={`product-mobile-tabbar__btn${active ? " product-mobile-tabbar__btn--active" : ""} ${suisseIntl.className}`}
            >
              <TabIcon id={item.id} active={active} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
