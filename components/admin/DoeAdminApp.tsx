"use client";

import { useState } from "react";

import { AdminSideNav, type AdminTab } from "@/components/admin/AdminSideNav";
import { CampusAmbassadorAnalyticsPanel } from "@/components/admin/CampusAmbassadorAnalyticsPanel";
import { CampusAmbassadorSignupsPanel } from "@/components/admin/CampusAmbassadorSignupsPanel";
import type {
  AdminCampusAmbassadorApplication,
  CampusAmbassadorSignupStats,
} from "@/lib/admin/campus-ambassador-applications";
import { useAdminData } from "@/lib/admin/use-admin-data";
import "@/lib/admin/admin-page.css";
import "@/lib/product/product-brown-mock.css";
import { suisseIntl } from "@/lib/home/fonts";

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
    <main className={`admin-page-root product-page-root h-dvh min-h-0 w-full overflow-hidden ${suisseIntl.className}`}>
      <div className="product-brown-mock product-brown-admin-mode flex h-full min-h-0 flex-col">
        <div className="product-brown-shell flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-0">
          <div className="product-brown-frame product-brown-layered-layout min-h-0 flex-1 overflow-hidden">
            <div className="product-brown-workspace-row h-full max-w-none">
              <AdminSideNav
                activeTab={activeTab}
                onSelect={setActiveTab}
                totalApplications={stats.total}
              />

              <div className="product-brown-inner-row">
                <div className="product-brown-inner-row__content h-full min-w-0 overflow-hidden">
                  <div className="admin-content-panel h-full min-h-0">
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
