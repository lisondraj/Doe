"use client";

import { useEffect, useState } from "react";

import { DoeAdminApp } from "@/components/admin/DoeAdminApp";
import type { AdminInternshipApplication, InternshipSignupStats } from "@/lib/admin/internship-applications";
import { inter, lora } from "@/lib/home/fonts";

const DESKTOP_QUERY = "(min-width: 1024px)";

export function AdminRouter({
  initialApplications,
  initialStats,
  initialError,
}: {
  initialApplications: AdminInternshipApplication[];
  initialStats: InternshipSignupStats;
  initialError: string | null;
}) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!isDesktop) {
    return (
      <main className={`flex min-h-dvh items-center justify-center bg-[#F4F4F5] px-6 ${inter.className}`}>
        <div className="max-w-md rounded-2xl border border-[#E8E8E8] bg-white p-8 text-center shadow-sm">
          <p className={`text-3xl text-neutral-900 ${lora.className}`}>Doe Admin</p>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
            Admin is available on desktop only. Open <span className="font-medium">/admin</span> on a wider screen.
          </p>
        </div>
      </main>
    );
  }

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
