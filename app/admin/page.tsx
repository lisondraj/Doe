import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminRouter } from "@/components/admin/AdminRouter";
import {
  fetchCampusAmbassadorApplications,
  summarizeCampusAmbassadorApplications,
  type AdminCampusAmbassadorApplication,
  type CampusAmbassadorSignupStats,
} from "@/lib/admin/campus-ambassador-applications";
import { requireAdminSession } from "@/lib/admin/require-admin-session";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export const metadata: Metadata = {
  title: "Admin · Doe",
  description: "Doe admin workspace",
};

export default async function AdminPage() {
  try {
    await requireAdminSession();
  } catch {
    redirect("/admin/login");
  }

  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";

  let initialApplications: AdminCampusAmbassadorApplication[] = [];
  let initialStats: CampusAmbassadorSignupStats = {
    total: 0,
    unitedStates: 0,
    canada: 0,
    withStatements: 0,
    multiProgram: 0,
  };
  let initialError: string | null = null;

  try {
    initialApplications = await fetchCampusAmbassadorApplications();
    initialStats = summarizeCampusAmbassadorApplications(initialApplications);
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
