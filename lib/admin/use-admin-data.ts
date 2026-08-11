"use client";

import { useCallback, useState } from "react";

import type {
  AdminCampusAmbassadorApplication,
  CampusAmbassadorSignupStats,
} from "@/lib/admin/campus-ambassador-applications";

export function useAdminData(
  initialApplications: AdminCampusAmbassadorApplication[],
  initialStats: CampusAmbassadorSignupStats,
) {
  const [applications, setApplications] = useState(initialApplications);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/campus-ambassador-applications");
      const payload = (await response.json()) as {
        ok?: boolean;
        applications?: AdminCampusAmbassadorApplication[];
        stats?: CampusAmbassadorSignupStats;
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

  return { applications, stats, loading, error, refresh };
}
