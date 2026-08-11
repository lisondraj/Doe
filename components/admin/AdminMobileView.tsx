"use client";

import { useState } from "react";

import { CampusAmbassadorAnalyticsPanel } from "@/components/admin/CampusAmbassadorAnalyticsPanel";
import { CampusAmbassadorSignupsPanel } from "@/components/admin/CampusAmbassadorSignupsPanel";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import type {
  AdminCampusAmbassadorApplication,
  CampusAmbassadorSignupStats,
} from "@/lib/admin/campus-ambassador-applications";
import { useAdminData } from "@/lib/admin/use-admin-data";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import "@/lib/admin/admin-page.css";
import "@/lib/product/product-brown-mock.css";
import "@/lib/product/product-mobile.css";
import { inter, lora } from "@/lib/home/fonts";

type AdminTab = "signups" | "analytics";

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
    <div className={`admin-mobile-root product-brown-mock ${inter.className}`}>
      <header className="admin-mobile-topbar">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[rgba(245,230,208,0.48)]">
            Doe Admin
          </p>
          <h1 className={`admin-mobile-topbar__title ${lora.className}`}>
            {activeTab === "signups" ? "Campus ambassador program" : "Analytics"}
          </h1>
        </div>
        <button type="button" onClick={() => void refresh()} disabled={loading} className="admin-panel-button">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <main className="admin-mobile-main">
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
      </main>

      <nav className="admin-mobile-tabbar" aria-label="Admin sections">
        <button
          type="button"
          onClick={() => setActiveTab("signups")}
          className={`admin-mobile-tabbar__btn ${activeTab === "signups" ? "admin-mobile-tabbar__btn--active" : ""}`}
        >
          <DoeBuildIcon className="h-5 w-5">
            <>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </>
          </DoeBuildIcon>
          <span className="truncate">Applications</span>
          <span className="admin-mobile-tabbar__badge">{stats.total}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`admin-mobile-tabbar__btn ${activeTab === "analytics" ? "admin-mobile-tabbar__btn--active" : ""}`}
        >
          <DoeBuildIcon className="h-5 w-5">
            <>
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 5-6" />
            </>
          </DoeBuildIcon>
          <span className="truncate">Analytics</span>
        </button>
      </nav>
    </div>
  );
}
