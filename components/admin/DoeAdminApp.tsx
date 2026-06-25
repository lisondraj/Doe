"use client";

import { useState } from "react";

import { InternshipAnalyticsPanel } from "@/components/admin/InternshipAnalyticsPanel";
import { InternshipSignupsPanel } from "@/components/admin/InternshipSignupsPanel";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import type { AdminInternshipApplication, InternshipSignupStats } from "@/lib/admin/internship-applications";
import { useAdminData } from "@/lib/admin/use-admin-data";
import { inter, lora } from "@/lib/home/fonts";

type AdminTab = "signups" | "analytics";

export function DoeAdminApp({
  initialApplications,
  initialStats,
}: {
  initialApplications: AdminInternshipApplication[];
  initialStats: InternshipSignupStats;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("signups");
  const { applications, stats, loading, error, refresh, handleApplicationUpdated } = useAdminData(
    initialApplications,
    initialStats,
  );

  return (
    <main className={`h-dvh min-h-0 w-full overflow-hidden bg-white ${inter.className}`}>
      <div className="flex h-full min-h-0 w-full flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-0 bg-[#F4F4F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="min-h-0 flex-1 overflow-hidden rounded-none bg-white">
            <div className="flex h-full min-h-[520px] w-full">
              <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-[#EFEFEF] bg-white">
                <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] shadow-sm" />
                    <div className={`truncate text-[1.15rem] font-normal leading-none tracking-tight text-neutral-900 ${lora.className}`}>
                      Doe
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                    aria-label="Collapse sidebar"
                  >
                    <DoeBuildIcon className="h-4 w-4">
                      <>
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 3v18" />
                      </>
                    </DoeBuildIcon>
                  </button>
                </div>

                <div className="px-3 pb-2">
                  <div className="flex h-9 items-center gap-2 rounded-lg border border-[#ECECEC] bg-[#FAFAFA] px-2.5">
                    <DoeBuildIcon className="h-4 w-4 text-neutral-400">
                      <>
                        <circle cx="11" cy="11" r="7" />
                        <path d="m21 21-4.35-4.35" />
                      </>
                    </DoeBuildIcon>
                    <span className="flex-1 text-[13px] text-neutral-400">Search</span>
                    <span className="rounded border border-[#E5E5E5] bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
                      ⌘
                    </span>
                  </div>
                </div>

                <div className="px-2 pb-1 pt-1">
                  <div className="flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    <span>Admin</span>
                  </div>
                  <div className="mt-1 flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab("signups")}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-medium ${
                        activeTab === "signups"
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <DoeBuildIcon className="h-[18px] w-[18px]">
                        <>
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </>
                      </DoeBuildIcon>
                      <span className="flex-1 truncate text-left">Internship signups</span>
                      <span className="rounded-full bg-white px-1.5 py-0.5 text-[11px] font-medium text-neutral-600">
                        {stats.total}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("analytics")}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-medium ${
                        activeTab === "analytics"
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <DoeBuildIcon className="h-[18px] w-[18px]">
                        <>
                          <path d="M3 3v18h18" />
                          <path d="M7 16l4-4 4 4 5-6" />
                        </>
                      </DoeBuildIcon>
                      <span className="flex-1 truncate text-left">Analytics</span>
                    </button>
                  </div>
                </div>

                <div className="mt-auto border-t border-[#EFEFEF] px-2 py-2">
                  <div className="rounded-lg border border-[#E6E6E6] bg-white px-2 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Workspace</p>
                    <p className="mt-1 text-[12px] font-medium text-neutral-700">Doe Admin</p>
                  </div>
                </div>
              </aside>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
                {activeTab === "signups" ? (
                  <InternshipSignupsPanel
                    variant="desktop"
                    applications={applications}
                    stats={stats}
                    loading={loading}
                    error={error}
                    onRefresh={() => void refresh()}
                    onApplicationUpdated={handleApplicationUpdated}
                  />
                ) : (
                  <InternshipAnalyticsPanel
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
    </main>
  );
}
