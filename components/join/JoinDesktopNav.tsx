"use client";

import { lora } from "@/lib/home/fonts";

/** Beige post-hero desktop nav — Doe left, Apply right, no center links. */
export function JoinDesktopNav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#E6E6E6]"
      style={{ backgroundColor: "#F7F6F3" }}
      aria-label="Site"
    >
      <div className="relative flex items-center justify-between px-8 py-6">
        <h1 className={`text-4xl font-normal text-black ${lora.className}`}>Doe</h1>

        <a
          href="#"
          className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
        >
          Apply
        </a>
      </div>
    </nav>
  );
}
