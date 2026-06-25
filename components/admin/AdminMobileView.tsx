"use client";

import { useState } from "react";

import { InternshipAnalyticsPanel } from "@/components/admin/InternshipAnalyticsPanel";
import { InternshipSignupsPanel } from "@/components/admin/InternshipSignupsPanel";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import type { AdminInternshipApplication, InternshipSignupStats } from "@/lib/admin/internship-applications";
import {
  ADMIN_MOBILE_BUTTON_TW,
  ADMIN_MOBILE_CONTENT_STACK,
  ADMIN_MOBILE_INPUT_H,
  ADMIN_MOBILE_NAV_CLEARANCE,
  ADMIN_MOBILE_PAGE_TITLE_TW,
  ADMIN_MOBILE_SUBTITLE_TW,
  ADMIN_MOBILE_TAB_BAR_INSET,
  ADMIN_MOBILE_TAB_BAR_RESERVE,
  ADMIN_MOBILE_TAB_BUTTON_TW,
  ADMIN_MOBILE_TAB_ICON_TW,
} from "@/lib/admin/admin-layout";
import { useAdminData } from "@/lib/admin/use-admin-data";
import { useDoePhoneStableViewport } from "@/lib/doephone/use-doe-phone-stable-viewport";
import { inter } from "@/lib/home/fonts";

type AdminTab = "signups" | "analytics";

export function AdminMobileView({
  initialApplications,
  initialStats,
}: {
  initialApplications: AdminInternshipApplication[];
  initialStats: InternshipSignupStats;
}) {
  useDoePhoneStableViewport();
  const [activeTab, setActiveTab] = useState<AdminTab>("signups");
  const { applications, stats, loading, error, refresh, handleApplicationUpdated } = useAdminData(
    initialApplications,
    initialStats,
  );

  const tabLabel = activeTab === "signups" ? "Internship signups" : "Signup analytics";

  return (
    <BlogMobileShell
      showJoinCta={false}
      logoLink={false}
      footerLinksDisabled
      showMenu={false}
      showFooter={false}
      shellMinHeightClass="min-h-[var(--app-vh,100lvh)]"
    >
      <div
        className={`flex min-h-[var(--app-vh,100lvh)] flex-col ${ADMIN_MOBILE_NAV_CLEARANCE} ${ADMIN_MOBILE_TAB_BAR_RESERVE} ${inter.className}`}
      >
        <header className="shrink-0">
          <div className="flex items-center gap-4 iphone-page:gap-5">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] shadow-sm iphone-page:h-14 iphone-page:w-14 iphone-page:rounded-[1.1rem]" />
            <div className="min-w-0 flex-1">
              <h1 className={ADMIN_MOBILE_PAGE_TITLE_TW}>Doe Admin</h1>
              <p className={`mt-1.5 iphone-page:mt-2 ${ADMIN_MOBILE_SUBTITLE_TW}`}>{tabLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={loading}
              className={`${ADMIN_MOBILE_BUTTON_TW} ${ADMIN_MOBILE_INPUT_H} shrink-0 self-center`}
            >
              {loading ? "…" : "Refresh"}
            </button>
          </div>
        </header>

        <div className={`min-h-0 flex-1 ${ADMIN_MOBILE_CONTENT_STACK} pt-5 iphone-page:pt-6`}>
          {activeTab === "signups" ? (
            <InternshipSignupsPanel
              variant="mobile"
              applications={applications}
              stats={stats}
              loading={loading}
              error={error}
              onRefresh={() => void refresh()}
              onApplicationUpdated={handleApplicationUpdated}
            />
          ) : (
            <InternshipAnalyticsPanel
              variant="mobile"
              applications={applications}
              loading={loading}
              onRefresh={() => void refresh()}
            />
          )}
        </div>
      </div>

      <nav
        className={`fixed inset-x-0 bottom-0 z-[80] border-t border-[#E8E8E8] bg-[#F7F6F3]/95 backdrop-blur-md ${ADMIN_MOBILE_TAB_BAR_INSET}`}
        style={{ paddingBottom: "max(1.15rem, env(safe-area-inset-bottom, 0px))" }}
        aria-label="Admin sections"
      >
        <div className="flex gap-3 iphone-page:gap-3.5">
          <button
            type="button"
            onClick={() => setActiveTab("signups")}
            className={`${ADMIN_MOBILE_TAB_BUTTON_TW} ${
              activeTab === "signups" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            <DoeBuildIcon className={ADMIN_MOBILE_TAB_ICON_TW}>
              <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </>
            </DoeBuildIcon>
            <span className="truncate">Signups</span>
            <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[0.86rem] font-semibold tabular-nums text-neutral-600 iphone-page:text-[0.92rem]">
              {stats.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`${ADMIN_MOBILE_TAB_BUTTON_TW} ${
              activeTab === "analytics" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            <DoeBuildIcon className={ADMIN_MOBILE_TAB_ICON_TW}>
              <>
                <path d="M3 3v18h18" />
                <path d="M7 16l4-4 4 4 5-6" />
              </>
            </DoeBuildIcon>
            <span className="truncate">Analytics</span>
          </button>
        </div>
      </nav>
    </BlogMobileShell>
  );
}
