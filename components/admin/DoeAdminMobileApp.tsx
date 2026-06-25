"use client";

import { useState } from "react";

import { InternshipAnalyticsPanel } from "@/components/admin/InternshipAnalyticsPanel";
import { InternshipSignupsPanel } from "@/components/admin/InternshipSignupsPanel";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import type { AdminInternshipApplication, InternshipSignupStats } from "@/lib/admin/internship-applications";
import { useAdminData } from "@/lib/admin/use-admin-data";
import { inter, lora } from "@/lib/home/fonts";

type AdminTab = "signups" | "analytics";

export function DoeAdminMobileApp({
  initialApplications,
  initialStats,
}: {
  initialApplications: AdminInternshipApplication[];
  initialStats: InternshipSignupStats;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("signups");
  const { applications, stats, loading, error, refresh } = useAdminData(initialApplications, initialStats);

  return (
    <main
      className={`flex h-[100dvh] min-h-0 w-full flex-col bg-[#F4F4F5] ${inter.className}`}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-[#E8E8E8] bg-white px-4 py-3">
        <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] shadow-sm" />
        <div className="min-w-0 flex-1">
          <p className={`truncate text-[1.1rem] font-normal leading-none tracking-tight text-neutral-900 ${lora.className}`}>
            Doe Admin
          </p>
          <p className="mt-1 truncate text-[11px] font-medium text-neutral-500">
            {activeTab === "signups" ? "Internship signups" : "Signup analytics"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex h-9 shrink-0 items-center rounded-xl border border-[#E2E2E2] bg-white px-3 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
        >
          {loading ? "…" : "Refresh"}
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden">
        {activeTab === "signups" ? (
          <InternshipSignupsPanel
            variant="mobile"
            applications={applications}
            stats={stats}
            loading={loading}
            error={error}
            onRefresh={() => void refresh()}
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

      <nav
        className="flex shrink-0 border-t border-[#E8E8E8] bg-white px-2 pt-1"
        aria-label="Admin sections"
      >
        <button
          type="button"
          onClick={() => setActiveTab("signups")}
          className={`flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium ${
            activeTab === "signups" ? "bg-neutral-100 text-neutral-900" : "text-neutral-500"
          }`}
        >
          <DoeBuildIcon className="h-5 w-5">
            <>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </>
          </DoeBuildIcon>
          <span>Signups</span>
          <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-neutral-600">
            {stats.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium ${
            activeTab === "analytics" ? "text-neutral-900" : "text-neutral-500"
          }`}
        >
          <DoeBuildIcon className="h-5 w-5">
            <>
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 5-6" />
            </>
          </DoeBuildIcon>
          <span>Analytics</span>
        </button>
      </nav>
    </main>
  );
}
