"use client";

import { useEffect, useState } from "react";

import { AdminMobileView } from "@/components/admin/AdminMobileView";
import { DoeAdminApp } from "@/components/admin/DoeAdminApp";
import type {
  AdminCampusAmbassadorApplication,
  CampusAmbassadorSignupStats,
} from "@/lib/admin/campus-ambassador-applications";
import { inter, lora } from "@/lib/home/fonts";

type Variant = "phone" | "desktop";
const DESKTOP_QUERY = "(min-width: 1024px)";

function AdminErrorState({ message }: { message: string }) {
  return (
    <main className={`admin-page-root flex min-h-dvh items-center justify-center px-6 ${inter.className}`}>
      <div className="admin-error-card">
        <p className={`text-3xl ${lora.className}`}>Doe Admin</p>
        <p className="admin-error-card__message">{message}</p>
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
  initialApplications: AdminCampusAmbassadorApplication[];
  initialStats: CampusAmbassadorSignupStats;
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
    html.setAttribute("data-admin-page", "true");
    html.setAttribute("data-product-page", "true");
    html.removeAttribute("data-home-page");
    html.removeAttribute("data-about-page");

    return () => {
      html.removeAttribute("data-admin-page");
      html.removeAttribute("data-product-page");
    };
  }, []);

  useEffect(() => {
    if (variant !== "phone") return;

    const html = document.documentElement;
    const meta = document.querySelector('meta[name="viewport"]');
    const prevViewport = meta?.getAttribute("content") ?? "";
    const pinchViewport =
      "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover";

    html.setAttribute("data-doephone-pinching", "true");
    meta?.setAttribute("content", pinchViewport);

    return () => {
      html.removeAttribute("data-doephone-pinching");
      if (meta) {
        if (prevViewport) meta.setAttribute("content", prevViewport);
        else meta.removeAttribute("content");
      }
    };
  }, [variant]);

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
    <AdminMobileView initialApplications={initialApplications} initialStats={initialStats} />
  );
}
