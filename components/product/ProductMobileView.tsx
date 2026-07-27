"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

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
  PRODUCT2_CALL_HISTORY_HEADER,
} from "@/lib/product2/product2-copy";
import "@/lib/product/product-brown-mock.css";
import "@/lib/product/product-landing.css";
import "@/lib/product/product-mobile.css";

function PageHeaderBackIcon() {
  return (
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
  );
}

/** Shared Calls / Schedule / Inbox page chrome — scaled crumb bar under the app topbar. */
function ProductMobilePageHeader({
  crumbs,
  backAria,
  onBack,
}: {
  crumbs: readonly string[];
  backAria: string;
  onBack: () => void;
}) {
  return (
    <div className="product-mobile-page-header product-landing-console-shell shrink-0">
      <header className={`product-landing-header product-mobile-page-header__bar flex items-center gap-2 ${suisseIntl.className}`}>
        <button
          type="button"
          className="product-landing-header__back product-mobile-page-header__back shrink-0"
          aria-label={backAria}
          onClick={onBack}
        >
          <PageHeaderBackIcon />
        </button>
        <h1 className="product-landing-header__title product-landing-header__trail product-mobile-page-header__trail m-0 min-w-0 font-normal tracking-tight">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <Fragment key={`${crumb}-${index}`}>
                {index > 0 ? (
                  <span className="product-landing-header__crumb-separator" aria-hidden>
                    /
                  </span>
                ) : null}
                <span
                  className={`product-landing-header__crumb${
                    isLast ? " product-landing-header__crumb--current" : ""
                  }`}
                >
                  {crumb}
                </span>
              </Fragment>
            );
          })}
        </h1>
      </header>
    </div>
  );
}

function TabIcon({ id, active }: { id: ProductMobileTab; active: boolean }) {
  const stroke = active ? "#f5e6d0" : "rgba(245,230,208,0.48)";
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-[1.45rem] w-[1.45rem]",
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
export function ProductMobileView({ embed = false }: { embed?: boolean } = {}) {
  useDoePhoneLayoutViewport(!embed);
  useDoePhoneStableViewport(!embed);
  const [tab, setTab] = useState<ProductMobileTab>("today");
  const [convoView, setConvoView] = useState<CallHistoryConvoView>("full");
  const [showFableComposer, setShowFableComposer] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<(typeof PRODUCT_MOBILE_CLINICS)[number]>(
    PRODUCT_MOBILE_CLINICS[0],
  );
  const [clinicMenuOpen, setClinicMenuOpen] = useState(false);
  const clinicMenuRef = useRef<HTMLDivElement>(null);
  const activeTab = embed ? "today" : tab;

  useLayoutEffect(() => {
    if (embed) return;
    applyPhoneOverflowChrome("#1a1208");
    try {
      sessionStorage.removeItem(`doephone-app-viewport-lock:${location.hostname}`);
    } catch {
      /* ignore */
    }
  }, [embed]);

  useEffect(() => {
    if (embed || !clinicMenuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!clinicMenuRef.current?.contains(event.target as Node)) {
        setClinicMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [clinicMenuOpen, embed]);

  return (
    <div
      className={`product-mobile-root product-brown-mock${
        activeTab === "calls" ? " product-brown-call-history-mode" : ""
      }${embed ? " product-mobile-root--embed" : ""} ${lora.className}`}
      data-product-mobile="true"
      data-product-mobile-embed={embed ? "true" : undefined}
      aria-hidden={embed || undefined}
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

      {activeTab === "calls" ? (
        <ProductMobilePageHeader
          crumbs={PRODUCT2_CALL_HISTORY_HEADER.crumbs}
          backAria={PRODUCT2_CALL_HISTORY_HEADER.backAria}
          onBack={() => setTab("today")}
        />
      ) : null}
      {activeTab === "schedule" ? (
        <ProductMobilePageHeader
          crumbs={["Schedule", weekSchedule[0].day, weekSchedule[0].date]}
          backAria="Back"
          onBack={() => setTab("today")}
        />
      ) : null}
      {activeTab === "inbox" ? (
        <ProductMobilePageHeader
          crumbs={["Inbox", "Email", "Clinic queue"]}
          backAria="Back"
          onBack={() => setTab("today")}
        />
      ) : null}

      {activeTab === "calls" ? (
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
        {activeTab === "today" ? (
          <div className="product-mobile-embed product-mobile-embed--landing">
            <ProductLandingPanel />
          </div>
        ) : null}
        {activeTab === "calls" ? (
          <div className="product-mobile-embed product-mobile-embed--calls">
            <section
              className="product-mobile-calls-pane product-mobile-calls-pane--transcript"
              aria-label="Call transcript"
            >
              <ProductCallHistoryRightRail
                hideToolbar
                hideActions={false}
                composerCollapsed={!showFableComposer}
                onComposerExpand={() => setShowFableComposer(true)}
                hideComposer={false}
                convoView={convoView}
                onConvoViewChange={setConvoView}
              />
            </section>
            <section
              className="product-mobile-calls-pane product-mobile-calls-pane--chart"
              aria-label="Patient chart"
            >
              <ProductCallHistoryPanel hideHeader onBack={() => setTab("today")} />
            </section>
          </div>
        ) : null}
        {activeTab === "schedule" ? <ProductMobileSchedulePanel /> : null}
        {activeTab === "inbox" ? <ProductMobileInboxPanel /> : null}
      </main>

      <nav className="product-mobile-tabbar" aria-label="Product">
        {PRODUCT_MOBILE_NAV_ITEMS.map((item) => {
          const active = item.id === activeTab;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? "page" : undefined}
              tabIndex={embed ? -1 : undefined}
              onClick={
                embed
                  ? undefined
                  : () => {
                      setTab(item.id);
                      if (item.id !== "calls") setShowFableComposer(false);
                    }
              }
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
