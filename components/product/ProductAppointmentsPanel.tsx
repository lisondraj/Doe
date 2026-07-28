"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { PRODUCT_APPOINTMENTS_HEADER } from "@/lib/product/product-appointments-copy";
import "@/lib/product/product-landing.css";

/** /product Appointments — blank canvas with Today-style top bar. */
export function ProductAppointmentsPanel() {
  return (
    <div className="product-appointments-panel product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="product-landing-console-shell shrink-0">
        <header className={`product-landing-header flex items-center gap-2 ${suisseIntl.className}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="product-landing-header__icon shrink-0"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
            <path d="m9 16 2 2 4-4" />
          </svg>
          <h1 className="product-landing-header__title m-0 font-normal tracking-tight">
            {PRODUCT_APPOINTMENTS_HEADER.title}
          </h1>
        </header>
      </div>
    </div>
  );
}
