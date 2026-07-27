"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { weekSchedule } from "@/components/doe-schedules-app-mock";
import { ProductCallHistoryPanel } from "@/components/product/ProductCallHistoryPanel";
import { ProductCallHistoryRightRail } from "@/components/product/ProductCallHistoryRightRail";
import { ProductLandingPanel } from "@/components/product/ProductLandingPanel";
import type { CallHistoryConvoView } from "@/components/product2/Product2CallHistoryRightRail";
import { applyPhoneOverflowChrome } from "@/lib/doephone/phone-layout-viewport";
import { useDoePhoneLayoutViewport } from "@/lib/doephone/use-doe-phone-layout-viewport";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { dmSans, lora, suisseIntl } from "@/lib/home/fonts";
import {
  PRODUCT_MOBILE_INBOX_THREADS,
  PRODUCT_MOBILE_NAV_ITEMS,
  type ProductMobileTab,
} from "@/lib/product/product-mobile-nav";
import {
  PRODUCT2_CALL_HISTORY_CONVO_VIEW_AGENT_ONLY,
  PRODUCT2_CALL_HISTORY_CONVO_VIEW_FULL,
} from "@/lib/product2/product2-copy";
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
    className: "h-[1.25rem] w-[1.25rem]",
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

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="product-mobile-topbar__settings-icon">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.5v1.6M12 18.9v1.6M3.5 12h1.6M18.9 12h1.6M6.05 6.05l1.13 1.13M16.82 16.82l1.13 1.13M6.05 17.95l1.13-1.13M16.82 7.18l1.13-1.13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClinicChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="product-mobile-topbar__clinic-chevron">
      <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PRODUCT_MOBILE_CLINICS = [
  { name: "Northside Family Clinic", address: "1200 Oak Ave, Austin, TX" },
  { name: "Riverside Primary Care", address: "412 River St, Austin, TX" },
  { name: "Westlake Medical Group", address: "89 Lakeview Dr, Austin, TX" },
] as const;

function clinicInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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
  const [convoView, setConvoView] = useState<CallHistoryConvoView>("full");
  const [selectedClinic, setSelectedClinic] = useState<(typeof PRODUCT_MOBILE_CLINICS)[number]>(
    PRODUCT_MOBILE_CLINICS[0],
  );
  const [clinicMenuOpen, setClinicMenuOpen] = useState(false);
  const clinicMenuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    applyPhoneOverflowChrome("#1a1208");
    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!clinicMenuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!clinicMenuRef.current?.contains(event.target as Node)) {
        setClinicMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [clinicMenuOpen]);

  return (
    <div
      className={`product-mobile-root product-brown-mock${tab === "calls" ? " product-brown-call-history-mode" : ""} ${lora.className}`}
      data-product-mobile="true"
    >
      <header className="product-mobile-topbar">
        <p className={`product-mobile-topbar__wordmark ${lora.className}`}>Doe</p>
        <div className="product-mobile-topbar__end">
          <div className="product-mobile-topbar__clinic-wrap" ref={clinicMenuRef}>
            <button
              type="button"
              className={`product-mobile-topbar__clinic-btn ${suisseIntl.className}${
                clinicMenuOpen ? " product-mobile-topbar__clinic-btn--open" : ""
              }`}
              aria-haspopup="menu"
              aria-expanded={clinicMenuOpen}
              onClick={() => setClinicMenuOpen((open) => !open)}
            >
              <span className="product-mobile-topbar__clinic-avatar" aria-hidden>
                {clinicInitials(selectedClinic.name)}
              </span>
              <span className="product-mobile-topbar__clinic-copy">
                <span className="product-mobile-topbar__clinic-label">Clinic</span>
                <span className="product-mobile-topbar__clinic">{selectedClinic.name}</span>
              </span>
              <ClinicChevronIcon />
            </button>
            {clinicMenuOpen ? (
              <div className="product-mobile-topbar__clinic-menu" role="menu" aria-label="Select clinic">
                {PRODUCT_MOBILE_CLINICS.map((clinic) => {
                  const active = clinic.name === selectedClinic.name;
                  return (
                    <button
                      key={clinic.name}
                      type="button"
                      role="menuitem"
                      className={`product-mobile-topbar__clinic-option${
                        active ? " product-mobile-topbar__clinic-option--active" : ""
                      }`}
                      onClick={() => {
                        setSelectedClinic(clinic);
                        setClinicMenuOpen(false);
                      }}
                    >
                      <span className="product-mobile-topbar__clinic-avatar" aria-hidden>
                        {clinicInitials(clinic.name)}
                      </span>
                      <span className="product-mobile-topbar__clinic-option-copy">
                        <span className={`product-mobile-topbar__clinic-option-name ${dmSans.className}`}>
                          {clinic.name}
                        </span>
                        <span className={`product-mobile-topbar__clinic-option-address ${suisseIntl.className}`}>
                          {clinic.address}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <button type="button" className="product-mobile-topbar__settings" aria-label="Settings">
            <SettingsIcon />
          </button>
        </div>
      </header>

      {tab === "calls" ? (
        <div className={`product-mobile-calls-view-tabs ${dmSans.className}`}>
          <div
            className={`product-mobile-calls-view-tabs__segmented product-mobile-calls-view-tabs__segmented--${convoView}`}
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
        </div>
      ) : null}

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
              <ProductCallHistoryRightRail
                hideToolbar
                hideActions
                convoView={convoView}
                onConvoViewChange={setConvoView}
              />
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
