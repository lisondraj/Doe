import { AdminRouter } from "@/components/admin/AdminRouter";
import {
  fetchInternshipApplications,
  summarizeInternshipApplications,
  type AdminInternshipApplication,
  type InternshipSignupStats,
} from "@/lib/admin/internship-applications";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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
      initialApplications={initialApplications}
      initialStats={initialStats}
      initialError={initialError}
    />
  );
}
