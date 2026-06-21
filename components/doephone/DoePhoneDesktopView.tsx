"use client";

import { DesktopRouteLayout } from "@/components/DesktopRouteLayout";
import { inter, lora } from "@/lib/home/fonts";

export function DoePhoneDesktopView() {
  return (
    <DesktopRouteLayout>
      <div
        className="flex min-h-[100dvh] w-full items-center justify-center bg-[#F7F6F3] px-6"
        data-doeforvc-view="desktop"
      >
        <p
          className={`text-center text-[clamp(1.75rem,4vw,2.75rem)] font-normal tracking-tight text-gray-900 ${lora.className}`}
        >
          Under construction
        </p>
        <span className={`sr-only ${inter.className}`}>Doe Phone — desktop view</span>
      </div>
    </DesktopRouteLayout>
  );
}
