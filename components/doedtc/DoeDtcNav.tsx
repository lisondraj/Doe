"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";
import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";

const PROFILE_TABS: Array<{ id: DoeDtcProfileTab; label: string }> = [
  { id: "dashboard", label: DOEDTC_PROFILE.navDashboard },
  { id: "appointments", label: DOEDTC_PROFILE.navAppointments },
  { id: "results", label: DOEDTC_PROFILE.navResults },
  { id: "conditions", label: DOEDTC_PROFILE.navConditions },
  { id: "family", label: DOEDTC_PROFILE.navFamily },
  { id: "locker", label: DOEDTC_PROFILE.navLocker },
  { id: "share", label: DOEDTC_PROFILE.navShare },
  { id: "trackers", label: DOEDTC_PROFILE.navTrackers },
  { id: "feedback", label: DOEDTC_PROFILE.navFeedback },
];

type DoeDtcNavProps = {
  token: string;
  activeTab: DoeDtcProfileTab;
  onTabChange?: (tab: DoeDtcProfileTab) => void;
};

function tabClassName(active: boolean): string {
  return `doedtc-nav__tab${active ? " doedtc-nav__tab--active" : ""}`;
}

function MenuIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      <path d="M1 1.5h20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M1 8h20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M1 14.5h20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function DoeDtcNav({ token, activeTab, onTabChange }: DoeDtcNavProps) {
  const { variant, ready } = useDoeDtcPageVariant();
  const isPhone = !ready || variant === "phone";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebar();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeSidebar, sidebarOpen]);

  useEffect(() => {
    closeSidebar();
  }, [activeTab, closeSidebar]);

  const selectTab = (tab: DoeDtcProfileTab) => {
    onTabChange?.(tab);
    closeSidebar();
  };

  const renderTabControl = (tab: { id: DoeDtcProfileTab; label: string }, active: boolean) =>
    onTabChange ? (
      <button
        key={tab.id}
        type="button"
        className={tabClassName(active)}
        onClick={() => selectTab(tab.id)}
        aria-current={active ? "page" : undefined}
      >
        {tab.label}
      </button>
    ) : (
      <Link
        key={tab.id}
        className={tabClassName(active)}
        href={`/doedtc/app?t=${encodeURIComponent(token)}&tab=${tab.id}`}
        aria-current={active ? "page" : undefined}
        onClick={closeSidebar}
      >
        {tab.label}
      </Link>
    );

  return (
    <>
      <nav className={`doedtc-nav${isPhone ? " doedtc-nav--phone" : ""}`} aria-label="Profile">
        <DoeDtcTopBar
          href={`/doedtc/app?t=${encodeURIComponent(token)}`}
          trailing={
            isPhone ? (
              <button
                type="button"
                className="doedtc-nav__menu"
                aria-label="Open menu"
                aria-expanded={sidebarOpen}
                aria-controls="doedtc-nav-sidebar"
                onClick={() => setSidebarOpen(true)}
              >
                <MenuIcon />
              </button>
            ) : null
          }
        />
        {!isPhone ? (
          <div className="doedtc-nav__tabs">{PROFILE_TABS.map((tab) => renderTabControl(tab, activeTab === tab.id))}</div>
        ) : null}
      </nav>

      {isPhone && sidebarOpen ? (
        <>
          <button
            type="button"
            className="doedtc-sidebar__backdrop"
            aria-label="Close menu"
            onClick={closeSidebar}
          />
          <aside
            id="doedtc-nav-sidebar"
            className="doedtc-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Profile menu"
          >
            <div className="doedtc-sidebar__header">
              <p className="doedtc-sidebar__title">Menu</p>
              <button type="button" className="doedtc-sidebar__close" aria-label="Close menu" onClick={closeSidebar}>
                Close
              </button>
            </div>
            <div className="doedtc-sidebar__list">
              {PROFILE_TABS.map((tab) => renderTabControl(tab, activeTab === tab.id))}
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
