"use client";

import { useEffect, useRef, useState } from "react";

import {
  ProductNewShareDropdown,
  type ShareAccessMode,
} from "@/components/productnew/ProductNewShareDropdown";
import { ProductNewBillingView } from "@/components/productnew/ProductNewBillingView";
import { ProductNewCallHistoryView } from "@/components/productnew/ProductNewCallHistoryView";
import { ProductNewMorningView } from "@/components/productnew/ProductNewMorningView";
import { ProductNewNav } from "@/components/productnew/ProductNewNav";
import { ProductNewPatientsView } from "@/components/productnew/ProductNewPatientsView";
import { ProductNewScheduleView } from "@/components/productnew/ProductNewScheduleView";
import { ProductNewVoiceCanvas } from "@/components/productnew/ProductNewVoiceCanvas";
import { dmSans } from "@/lib/home/fonts";
import { PRODUCTNEW_CLINIC, PRODUCTNEW_PROFILE } from "@/lib/productnew/productnew-copy";
import { PRODUCTNEW_NAV_ITEMS } from "@/lib/productnew/productnew-nav-copy";

type NavId = (typeof PRODUCTNEW_NAV_ITEMS)[number]["id"];

const COMING_SOON_LABEL: Partial<Record<NavId, string>> = {};

function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2.2c-2 0-3.6 1.6-3.6 3.6v1.8l-.8 1.6h9.2l-.8-1.6V5.8c0-2-1.6-3.6-3.6-3.6zM6.6 11.8a1.4 1.4 0 0 0 2.8 0"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.2 10.2L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Clinic morning dashboard: front desk voice agent, appointments, and finances, with profile share dropdown. */
export function ProductNewDashboard() {
  const [shareOpen, setShareOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>("overview");
  const [accessMode, setAccessMode] = useState<ShareAccessMode>("full");
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shareOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setShareOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShareOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shareOpen]);

  return (
    <div className={`productnew-dashboard ${dmSans.className}`}>
      <ProductNewNav
        expanded={navExpanded}
        onToggle={() => setNavExpanded((open) => !open)}
        activeId={activeNav}
        onSelect={setActiveNav}
      />
      <div className="productnew-dashboard__main">
        <div className="productnew-dashboard__shell">
          <header className="productnew-dashboard__header">
            <div className="productnew-dashboard__header-left">
              <div className="productnew-dashboard__profile-wrap" ref={profileRef}>
                <button
                  type="button"
                  className={`productnew-dashboard__profile${shareOpen ? " productnew-dashboard__profile--open" : ""}`}
                  aria-expanded={shareOpen}
                  aria-haspopup="dialog"
                  onClick={() => setShareOpen((open) => !open)}
                >
                  <span className="productnew-dashboard__avatar" aria-hidden />
                  <span className="productnew-dashboard__profile-copy">
                    <span className="productnew-dashboard__profile-name">{PRODUCTNEW_PROFILE.name}</span>
                    <span className="productnew-dashboard__profile-company">
                      <span className="productnew-dashboard__company-mark" aria-hidden />
                      {PRODUCTNEW_PROFILE.company}
                    </span>
                  </span>
                  <IconChevronDown />
                </button>

                {shareOpen ? (
                  <div className="productnew-dashboard__share-popover">
                    <ProductNewShareDropdown accessMode={accessMode} onAccessModeChange={setAccessMode} />
                  </div>
                ) : null}
              </div>

              <button type="button" className="productnew-dashboard__icon-btn" aria-label="Notifications">
                <IconBell />
              </button>
              <button type="button" className="productnew-dashboard__icon-btn" aria-label="Search">
                <IconSearch />
              </button>
            </div>

            <div className="productnew-clinic-header">
              {activeNav === "overview" ? (
                <p className="productnew-clinic-header__greeting">Good morning, {PRODUCTNEW_CLINIC.doctor}</p>
              ) : null}
              <p className="productnew-clinic-header__meta">
                {PRODUCTNEW_CLINIC.date} · {PRODUCTNEW_CLINIC.time}
              </p>
            </div>

            <div className="productnew-dashboard__header-actions">
              {activeNav === "overview" ? (
                <>
                  <button type="button" className="productnew-dashboard__btn productnew-dashboard__btn--outline">
                    Check in
                  </button>
                  <button type="button" className="productnew-dashboard__btn productnew-dashboard__btn--solid">
                    New appointment
                  </button>
                </>
              ) : null}
            </div>
          </header>

          {activeNav === "overview" ? (
            <ProductNewMorningView
              onOpenVoiceAgent={() => setActiveNav("builder")}
              onOpenCallHistory={() => setActiveNav("convert")}
              onOpenSchedule={() => setActiveNav("transactions")}
              onOpenBilling={() => setActiveNav("reports")}
            />
          ) : null}
          {activeNav === "transactions" ? <ProductNewScheduleView /> : null}
          {activeNav === "convert" ? <ProductNewCallHistoryView /> : null}
          {activeNav === "builder" ? <ProductNewVoiceCanvas /> : null}
          {activeNav === "reports" ? <ProductNewBillingView /> : null}
          {activeNav === "cards" ? <ProductNewPatientsView /> : null}
          {COMING_SOON_LABEL[activeNav] ? (
            <div className="productnew-empty">
              <p className="productnew-empty__title">{COMING_SOON_LABEL[activeNav]}</p>
              <p className="productnew-empty__body">This section isn&rsquo;t built yet.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
