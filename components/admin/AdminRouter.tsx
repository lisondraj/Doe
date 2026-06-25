"use client";

import { useEffect, useState } from "react";

import { DoeAdminApp } from "@/components/admin/DoeAdminApp";
import { DoeAdminMobileApp } from "@/components/admin/DoeAdminMobileApp";
import type { AdminInternshipApplication, InternshipSignupStats } from "@/lib/admin/internship-applications";
import { inter, lora } from "@/lib/home/fonts";

type Variant = "phone" | "desktop";
const DESKTOP_QUERY = "(min-width: 1024px)";

function AdminErrorState({ message }: { message: string }) {
  return (
    <main className={`flex min-h-dvh items-center justify-center bg-[#F4F4F5] px-6 ${inter.className}`}>
      <div className="max-w-lg rounded-2xl border border-[#E8E8E8] bg-white p-8 shadow-sm">
        <p className={`text-3xl text-neutral-900 ${lora.className}`}>Doe Admin</p>
        <p className="mt-3 text-[15px] leading-relaxed text-[#BF593D]">{message}</p>
      </div>
    </main>
  );
}

export function AdminRouter({
  initialVariant,
  initialApplications,
  initialStats,
  initialError,
}: {
  initialVariant: Variant;
  initialApplications: AdminInternshipApplication[];
  initialStats: InternshipSignupStats;
  initialError: string | null;
}) {
  const [variant, setVariant] = useState<Variant>(initialVariant);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setVariant(mq.matches ? "desktop" : "phone");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (variant === "desktop") {
      html.removeAttribute("data-doeforvc-always-phone");
      html.setAttribute("data-layout", "desktop");
      html.setAttribute("data-route-desktop", "true");
      body.classList.add("desktop-route");
    } else {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      html.removeAttribute("data-route-desktop");
      body.classList.remove("desktop-route");
    }

    return () => {
      html.setAttribute("data-doeforvc-always-phone", "true");
      html.removeAttribute("data-layout");
      html.removeAttribute("data-route-desktop");
      body.classList.remove("desktop-route");
    };
  }, [variant]);

  if (initialError) {
    return <AdminErrorState message={initialError} />;
  }

  return variant === "desktop" ? (
    <DoeAdminApp initialApplications={initialApplications} initialStats={initialStats} />
  ) : (
    <DoeAdminMobileApp initialApplications={initialApplications} initialStats={initialStats} />
  );
}
