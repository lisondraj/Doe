"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { DoeDtcWordmark } from "@/components/doedtc/DoeDtcWordmark";
import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";
import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";

const DESKTOP_TABS: Array<{ id: DoeDtcProfileTab; label: string }> = [
  { id: "dashboard", label: DOEDTC_PROFILE.navDashboard },
  { id: "appointments", label: DOEDTC_PROFILE.navAppointments },
  { id: "results", label: DOEDTC_PROFILE.navResults },
  { id: "conditions", label: DOEDTC_PROFILE.navConditions },
  { id: "family", label: DOEDTC_PROFILE.navFamily },
  { id: "locker", label: DOEDTC_PROFILE.navLocker },
  { id: "share", label: DOEDTC_PROFILE.navShare },
];

const PHONE_PRIMARY_TABS: Array<{ id: DoeDtcProfileTab; label: string }> = [
  { id: "dashboard", label: "Home" },
  { id: "appointments", label: "Appts" },
  { id: "conditions", label: "Conditions" },
  { id: "family", label: "Family" },
];

const PHONE_MORE_TABS: Array<{ id: DoeDtcProfileTab; label: string }> = [
  { id: "results", label: DOEDTC_PROFILE.navResults },
  { id: "locker", label: DOEDTC_PROFILE.navLocker },
  { id: "share", label: DOEDTC_PROFILE.navShare },
];

const PHONE_MORE_TAB_IDS = new Set<DoeDtcProfileTab>(PHONE_MORE_TABS.map((tab) => tab.id));

type DoeDtcNavProps = {
  token: string;
  activeTab: DoeDtcProfileTab;
  onTabChange?: (tab: DoeDtcProfileTab) => void;
};

function tabClassName(active: boolean): string {
  return `doedtc-nav__tab${active ? " doedtc-nav__tab--active" : ""}`;
}

export function DoeDtcNav({ token, activeTab, onTabChange }: DoeDtcNavProps) {
  const { variant, ready } = useDoeDtcPageVariant();
  const isPhone = !ready || variant === "phone";
  const [moreOpen, setMoreOpen] = useState(false);
  const moreSheetRef = useRef<HTMLDivElement>(null);

  const closeMore = useCallback(() => setMoreOpen(false), []);

  useEffect(() => {
    if (!moreOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMore();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMore, moreOpen]);

  useEffect(() => {
    closeMore();
  }, [activeTab, closeMore]);

  const selectTab = (tab: DoeDtcProfileTab) => {
    onTabChange?.(tab);
    closeMore();
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
        onClick={closeMore}
      >
        {tab.label}
      </Link>
    );

  const moreActive = PHONE_MORE_TAB_IDS.has(activeTab);

  return (
    <>
      <nav className={`doedtc-nav${isPhone ? " doedtc-nav--phone" : ""}`} aria-label="Profile">
        <Link className="doedtc-nav__wordmark" href={`/doedtc/app?t=${encodeURIComponent(token)}`}>
          <DoeDtcWordmark />
        </Link>
        {!isPhone ? (
          <div className="doedtc-nav__tabs">{DESKTOP_TABS.map((tab) => renderTabControl(tab, activeTab === tab.id))}</div>
        ) : null}
      </nav>

      {isPhone ? (
        <>
          {moreOpen ? (
            <button
              type="button"
              className="doedtc-tabbar__backdrop"
              aria-label="Close menu"
              onClick={closeMore}
            />
          ) : null}

          {moreOpen ? (
            <div
              ref={moreSheetRef}
              className="doedtc-tabbar__sheet"
              role="dialog"
              aria-modal="true"
              aria-label="More tabs"
            >
              <p className="doedtc-tabbar__sheet-title">More</p>
              <div className="doedtc-tabbar__sheet-list">
                {PHONE_MORE_TABS.map((tab) => renderTabControl(tab, activeTab === tab.id))}
              </div>
            </div>
          ) : null}

          <div className="doedtc-tabbar" role="tablist" aria-label="Profile tabs">
            {PHONE_PRIMARY_TABS.map((tab) => renderTabControl(tab, activeTab === tab.id))}
            <button
              type="button"
              className={`doedtc-nav__tab doedtc-tabbar__more${moreActive ? " doedtc-nav__tab--active" : ""}`}
              aria-expanded={moreOpen}
              aria-haspopup="dialog"
              onClick={() => setMoreOpen((open) => !open)}
            >
              More
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
