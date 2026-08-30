"use client";

import Link from "next/link";

import { DoeDtcWordmark } from "@/components/doedtc/DoeDtcWordmark";
import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";

const TABS: Array<{ id: DoeDtcProfileTab; label: string }> = [
  { id: "dashboard", label: DOEDTC_PROFILE.navDashboard },
  { id: "appointments", label: DOEDTC_PROFILE.navAppointments },
  { id: "results", label: DOEDTC_PROFILE.navResults },
  { id: "conditions", label: DOEDTC_PROFILE.navConditions },
  { id: "family", label: DOEDTC_PROFILE.navFamily },
  { id: "locker", label: DOEDTC_PROFILE.navLocker },
  { id: "share", label: DOEDTC_PROFILE.navShare },
];

type DoeDtcNavProps = {
  token: string;
  activeTab: DoeDtcProfileTab;
  onTabChange?: (tab: DoeDtcProfileTab) => void;
};

export function DoeDtcNav({ token, activeTab, onTabChange }: DoeDtcNavProps) {
  return (
    <nav className="doedtc-nav" aria-label="Profile">
      <Link className="doedtc-nav__wordmark" href={`/doedtc/app?t=${encodeURIComponent(token)}`}>
        <DoeDtcWordmark />
      </Link>
      <div className="doedtc-nav__tabs">
        {TABS.map((tab) =>
          onTabChange ? (
            <button
              key={tab.id}
              type="button"
              className={`doedtc-nav__tab${activeTab === tab.id ? " doedtc-nav__tab--active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ) : (
            <Link
              key={tab.id}
              className={`doedtc-nav__tab${activeTab === tab.id ? " doedtc-nav__tab--active" : ""}`}
              href={`/doedtc/app?t=${encodeURIComponent(token)}&tab=${tab.id}`}
            >
              {tab.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
