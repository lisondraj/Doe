"use client";

import { suisseIntl } from "@/lib/home/fonts";
import { PRODUCT2_AGENT_BUILDER_TAB_LABEL } from "@/lib/product2/product2-copy";
import "@/lib/product2/product2-landing.css";

/** Agent Builder workspace — blank brown canvas with Today-style top tab. */
export function Product2AgentBuilderPanel() {
  return (
    <div className="product-landing-panel flex min-h-0 flex-1 flex-col overflow-hidden">
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <h1 className="product-landing-header__title m-0 font-normal tracking-tight">
            {PRODUCT2_AGENT_BUILDER_TAB_LABEL}
          </h1>
        </header>
      </div>
    </div>
  );
}
