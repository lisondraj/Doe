"use client";

import { useCallback, useState, type ReactNode } from "react";

import { InternshipAnalyticsPanel } from "@/components/admin/InternshipAnalyticsPanel";
import { InternshipSignupsPanel } from "@/components/admin/InternshipSignupsPanel";
import { DoeBuildIcon } from "@/components/admin/doe-build-icon";
import type { AdminInternshipApplication, InternshipSignupStats } from "@/lib/admin/internship-applications";
import { inter, lora } from "@/lib/home/fonts";

type AdminTab = "signups" | "analytics";

function AdminTabButton({
  active,
  onClick,
  children,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
        active ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
      }`}
    >
      {children}
      {badge !== undefined ? (
        <span className="rounded-full bg-white px-1.5 py-0.5 text-[11px] font-medium text-neutral-600">{badge}</span>
      ) : null}
    </button>
  );
}

export function DoeAdminApp({
  initialApplications,
  initialStats,
}: {
  initialApplications: AdminInternshipApplication[];
  initialStats: InternshipSignupStats;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("signups");
  const [applications, setApplications] = useState(initialApplications);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplicationUpdated = useCallback((updated: AdminInternshipApplication) => {
    setApplications((current) => current.map((row) => (row.id === updated.id ? updated : row)));
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/internship-applications");
      const payload = (await response.json()) as {
        ok?: boolean;
        applications?: AdminInternshipApplication[];
        stats?: InternshipSignupStats;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.applications || !payload.stats) {
        throw new Error(payload.error || "Could not refresh applications.");
      }
      setApplications(payload.applications);
      setStats(payload.stats);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Could not refresh applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  const panel =
    activeTab === "signups" ? (
      <InternshipSignupsPanel
        applications={applications}
        stats={stats}
        loading={loading}
        error={error}
        onRefresh={() => void refresh()}
        onApplicationUpdated={handleApplicationUpdated}
      />
    ) : (
      <InternshipAnalyticsPanel applications={applications} loading={loading} onRefresh={() => void refresh()} />
    );

  return (
    <main className={`h-dvh min-h-0 w-full overflow-hidden bg-white ${inter.className}`}>
      <div className="flex h-full min-h-0 w-full flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F4F5]">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white lg:flex-row">
            {/* Mobile top bar */}
            <header className="flex shrink-0 items-center gap-2 border-b border-[#EFEFEF] px-4 py-3 lg:hidden">
              <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] shadow-sm" />
              <p className={`text-[1.15rem] font-normal leading-none tracking-tight text-neutral-900 ${lora.className}`}>
                Doe Admin
              </p>
            </header>

            {/* Mobile tab bar */}
            <div className="flex shrink-0 gap-1 border-b border-[#EFEFEF] px-3 py-2 lg:hidden">
              <AdminTabButton active={activeTab === "signups"} onClick={() => setActiveTab("signups")} badge={stats.total}>
                Signups
              </AdminTabButton>
              <AdminTabButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
                Analytics
              </AdminTabButton>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden h-full w-[220px] shrink-0 flex-col border-r border-[#EFEFEF] bg-white lg:flex">
              <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-[#E7A944] via-[#D2774C] to-[#1E343A] shadow-sm" />
                  <div className={`truncate text-[1.15rem] font-normal leading-none tracking-tight text-neutral-900 ${lora.className}`}>
                    Doe
                  </div>
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
                      activeTab === "signups" ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
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
                      activeTab === "analytics" ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"
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

            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">{panel}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
