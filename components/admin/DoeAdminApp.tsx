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
import "@/lib/admin/admin-page.css";
import "@/lib/product/product-brown-mock.css";
import { inter, lora } from "@/lib/home/fonts";

type AdminTab = "signups" | "analytics";

export function DoeAdminApp({
  initialApplications,
  initialStats,
}: {
  initialApplications: AdminCampusAmbassadorApplication[];
  initialStats: CampusAmbassadorSignupStats;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("signups");
  const { applications, stats, loading, error, refresh } = useAdminData(initialApplications, initialStats);

  return (
    <main className={`admin-page-root product-page-root h-dvh min-h-0 w-full overflow-hidden ${inter.className}`}>
      <div className="admin-brown-mock product-brown-mock admin-brown-shell h-full min-h-0">
        <div className="admin-brown-workspace-row h-full min-h-0">
          <aside className="admin-brown-sidebar">
            <div className="admin-brown-sidebar__brand">
              <div className="admin-brown-sidebar__mark" aria-hidden />
              <div className={`admin-brown-sidebar__title ${lora.className}`}>Doe</div>
            </div>

            <div className="admin-brown-sidebar__section-label">Admin</div>
            <div className="flex flex-col gap-1 px-1">
              <button
                type="button"
                onClick={() => setActiveTab("signups")}
                className={`admin-brown-nav-btn ${activeTab === "signups" ? "admin-brown-nav-btn--active" : ""}`}
              >
                <DoeBuildIcon className="h-[18px] w-[18px]">
                  <>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </>
                </DoeBuildIcon>
                <span className="truncate">Campus ambassador program</span>
                <span className="admin-brown-nav-btn__count">{stats.total}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`admin-brown-nav-btn ${activeTab === "analytics" ? "admin-brown-nav-btn--active" : ""}`}
              >
                <DoeBuildIcon className="h-[18px] w-[18px]">
                  <>
                    <path d="M3 3v18h18" />
                    <path d="M7 16l4-4 4 4 5-6" />
                  </>
                </DoeBuildIcon>
                <span className="truncate">Analytics</span>
              </button>
            </div>

            <div className="mt-auto px-3 pb-3">
              <div className="rounded-xl border border-[rgba(245,230,208,0.12)] bg-[rgba(255,255,255,0.04)] px-3 py-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--pl-nav-muted)]">
                  Workspace
                </p>
                <p className="mt-1 text-[0.78rem] font-medium text-[var(--pl-nav-soft)]">Doe Admin</p>
              </div>
            </div>
          </aside>

          <div className="admin-brown-content-panel min-h-0 min-w-0 flex-1">
            {activeTab === "signups" ? (
              <CampusAmbassadorSignupsPanel
                variant="desktop"
                applications={applications}
                stats={stats}
                loading={loading}
                error={error}
                onRefresh={() => void refresh()}
              />
            ) : (
              <CampusAmbassadorAnalyticsPanel
                variant="desktop"
                applications={applications}
                loading={loading}
                onRefresh={() => void refresh()}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
