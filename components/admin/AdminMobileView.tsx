"use client";

import { useState } from "react";

import { CampusAmbassadorAnalyticsPanel } from "@/components/admin/CampusAmbassadorAnalyticsPanel";
import { CampusAmbassadorSignupsPanel } from "@/components/admin/CampusAmbassadorSignupsPanel";
import type { AdminTab } from "@/components/admin/AdminSideNav";
import type {
  AdminCampusAmbassadorApplication,
  CampusAmbassadorSignupStats,
} from "@/lib/admin/campus-ambassador-applications";
import { useAdminData } from "@/lib/admin/use-admin-data";
import { ADMIN_AUTH_ENABLED } from "@/lib/admin/admin-auth";
import { signOutAdmin } from "@/lib/admin/sign-out-admin";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import "@/lib/admin/admin-page.css";
import "@/lib/product/product-brown-mock.css";
import "@/lib/product/product-mobile.css";
import "@/lib/product/product-landing.css";
import { lora, suisseIntl } from "@/lib/home/fonts";

const TAB_LABELS: Record<AdminTab, string> = {
  signups: "Applications",
  analytics: "Analytics",
};

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-[1.32rem] w-[1.32rem]">
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-[1.32rem] w-[1.32rem]">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AdminTabIcon({ tab, active }: { tab: AdminTab; active: boolean }) {
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

  if (tab === "signups") {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M3 3v18h18" />
      <path d="M7 16l4-4 4 4 5-6" />
    </svg>
  );
}

export function AdminMobileView({
  initialApplications,
  initialStats,
}: {
  initialApplications: AdminCampusAmbassadorApplication[];
  initialStats: CampusAmbassadorSignupStats;
}) {
  useDoePhoneStableViewport();
  const [activeTab, setActiveTab] = useState<AdminTab>("signups");
  const { applications, stats, loading, error, refresh } = useAdminData(initialApplications, initialStats);

  return (
    <div className={`product-mobile-root product-brown-mock product-brown-agents-mode ${lora.className}`}>
      <header className="product-mobile-topbar">
        <p className={`product-mobile-topbar__wordmark ${lora.className}`}>Doe</p>
        <div className="product-mobile-topbar__end">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="product-mobile-topbar__settings"
            aria-label={loading ? "Refreshing" : "Refresh"}
          >
            <RefreshIcon />
          </button>
          {ADMIN_AUTH_ENABLED ? (
            <button
              type="button"
              onClick={() => void signOutAdmin()}
              className="product-mobile-topbar__settings"
              aria-label="Sign out"
            >
              <SignOutIcon />
            </button>
          ) : null}
        </div>
      </header>

      <main className="product-mobile-main">
        <div className="product-mobile-embed admin-mobile-embed">
          {activeTab === "signups" ? (
            <CampusAmbassadorSignupsPanel
              variant="mobile"
              applications={applications}
              stats={stats}
              loading={loading}
              error={error}
              onRefresh={() => void refresh()}
            />
          ) : (
            <CampusAmbassadorAnalyticsPanel
              variant="mobile"
              applications={applications}
              loading={loading}
              onRefresh={() => void refresh()}
            />
          )}
        </div>
      </main>

      <nav className="product-mobile-tabbar admin-mobile-tabbar--two" aria-label="Admin sections">
        {(["signups", "analytics"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-current={isActive ? "page" : undefined}
              className={`product-mobile-tabbar__btn${isActive ? " product-mobile-tabbar__btn--active" : ""} ${suisseIntl.className}`}
            >
              <AdminTabIcon tab={tab} active={isActive} />
              <span>{TAB_LABELS[tab]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
