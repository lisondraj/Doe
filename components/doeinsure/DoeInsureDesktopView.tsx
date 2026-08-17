"use client";

import { DoeInsureFooter } from "@/components/doeinsure/DoeInsureFooter";
import { DoeInsureNav } from "@/components/doeinsure/DoeInsureNav";
import { DoeInsurePageContent } from "@/components/doeinsure/DoeInsurePageContent";
import { dmSans } from "@/lib/home/fonts";

export function DoeInsureDesktopView() {
  return (
    <div
      className={`doeinsure-root doeinsure-root--desktop ${dmSans.variable} ${dmSans.className}`}
      data-doeforvc-view="desktop"
    >
      <DoeInsureNav />
      <main>
        <DoeInsurePageContent />
      </main>
      <DoeInsureFooter />
    </div>
  );
}
