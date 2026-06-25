"use client";

import { DoeAdminApp } from "@/components/admin/DoeAdminApp";
import type { AdminInternshipApplication, InternshipSignupStats } from "@/lib/admin/internship-applications";
import { inter, lora } from "@/lib/home/fonts";

export function AdminRouter({
  initialApplications,
  initialStats,
  initialError,
}: {
  initialApplications: AdminInternshipApplication[];
  initialStats: InternshipSignupStats;
  initialError: string | null;
}) {
  if (initialError) {
    return (
      <main className={`flex min-h-dvh items-center justify-center bg-[#F4F4F5] px-6 ${inter.className}`}>
        <div className="max-w-lg rounded-2xl border border-[#E8E8E8] bg-white p-8 shadow-sm">
          <p className={`text-3xl text-neutral-900 ${lora.className}`}>Doe Admin</p>
          <p className="mt-3 text-[15px] leading-relaxed text-[#BF593D]">{initialError}</p>
        </div>
      </main>
    );
  }

  return <DoeAdminApp initialApplications={initialApplications} initialStats={initialStats} />;
}
