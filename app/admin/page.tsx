import type { Metadata } from "next";
import { headers } from "next/headers";

import { AdminRouter } from "@/components/admin/AdminRouter";
import {
  fetchInternshipApplications,
  summarizeInternshipApplications,
  type AdminInternshipApplication,
  type InternshipSignupStats,
} from "@/lib/admin/internship-applications";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export const metadata: Metadata = {
  title: "Admin · Doe",
  description: "Doe admin workspace",
};

export default async function AdminPage() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";

  let initialApplications: AdminInternshipApplication[] = [];
  let initialStats: InternshipSignupStats = {
    total: 0,
    withResume: 0,
    withLinkedIn: 0,
    withNotes: 0,
  };
  let initialError: string | null = null;

  try {
    initialApplications = await fetchInternshipApplications();
    initialStats = summarizeInternshipApplications(initialApplications);
  } catch (error) {
    initialError = error instanceof Error ? error.message : "Could not load admin data.";
  }

  return (
    <AdminRouter
      initialVariant={initialVariant}
      initialApplications={initialApplications}
      initialStats={initialStats}
      initialError={initialError}
    />
  );
}
