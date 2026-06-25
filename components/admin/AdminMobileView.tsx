"use client";

import { useState } from "react";

import { InternshipAnalyticsPanel } from "@/components/admin/InternshipAnalyticsPanel";
import { InternshipSignupsPanel } from "@/components/admin/InternshipSignupsPanel";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import { BlogMobileShell } from "@/components/blog/BlogMobileShell";
import type { AdminInternshipApplication, InternshipSignupStats } from "@/lib/admin/internship-applications";
import {
  ADMIN_MOBILE_NAV_CLEARANCE,
  ADMIN_MOBILE_PAGE_TITLE_TW,
  ADMIN_MOBILE_SUBTITLE_TW,
  ADMIN_MOBILE_TAB_BAR_RESERVE,
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
        <header className="shrink-0 pb-5 iphone-page:pb-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] shadow-sm iphone-page:h-14 iphone-page:w-14 iphone-page:rounded-[1.1rem]" />
            <div className="min-w-0 flex-1 pt-0.5">
              <h1 className={ADMIN_MOBILE_PAGE_TITLE_TW}>Doe Admin</h1>
              <p className={`mt-2 ${ADMIN_MOBILE_SUBTITLE_TW}`}>{tabLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={loading}
              className="inline-flex h-12 shrink-0 items-center rounded-2xl border border-[#E2E2E2] bg-white px-5 text-[1.05rem] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-60 iphone-page:h-[3.35rem] iphone-page:px-6 iphone-page:text-[1.125rem]"
            >
              {loading ? "…" : "Refresh"}
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1">
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
        className="fixed inset-x-0 bottom-0 z-[80] border-t border-[#E8E8E8] bg-[#F7F6F3]/95 px-4 pt-2 backdrop-blur-md iphone-page:px-[max(2.35rem,calc(env(safe-area-inset-left,0px)+5.25vmin))]"
        style={{ paddingBottom: "max(0.85rem, env(safe-area-inset-bottom, 0px))" }}
        aria-label="Admin sections"
      >
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("signups")}
            className={`flex min-h-[4.25rem] flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-[0.98rem] font-medium iphone-page:min-h-[4.5rem] iphone-page:text-[1.0625rem] ${
              activeTab === "signups" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            <DoeBuildIcon className="h-6 w-6 iphone-page:h-[1.65rem] iphone-page:w-[1.65rem]">
              <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </>
            </DoeBuildIcon>
            <span>Signups</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.82rem] font-semibold tabular-nums text-neutral-600 iphone-page:text-[0.88rem]">
              {stats.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`flex min-h-[4.25rem] flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-[0.98rem] font-medium iphone-page:min-h-[4.5rem] iphone-page:text-[1.0625rem] ${
              activeTab === "analytics" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            <DoeBuildIcon className="h-6 w-6 iphone-page:h-[1.65rem] iphone-page:w-[1.65rem]">
              <>
                <path d="M3 3v18h18" />
                <path d="M7 16l4-4 4 4 5-6" />
              </>
            </DoeBuildIcon>
            <span>Analytics</span>
          </button>
        </div>
      </nav>
    </BlogMobileShell>
  );
}
