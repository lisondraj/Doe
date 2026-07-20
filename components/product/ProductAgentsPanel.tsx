"use client";

import { useMemo, useState } from "react";

import { ProductVoiceAgentEditor } from "@/components/product/ProductVoiceAgentEditor";
import {
  PRODUCT_INTEGRATION_FILTERS,
  PRODUCT_INTEGRATIONS,
  filterProductIntegrations,
  type ProductIntegrationFilter,
} from "@/lib/product/product-integrations";
import "@/lib/product/product-landing.css";
import "@/lib/product/product-agents.css";
import { inter, suisseIntl } from "@/lib/home/fonts";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="9" cy="9" r="5.25" />
      <path d="m14 14 3.5 3.5" />
    </svg>
  );
}

/** Agents workspace — full-page builder canvas with integrations overlay. */
export function ProductAgentsPanel() {
  const [integrationFilter, setIntegrationFilter] = useState<ProductIntegrationFilter>("all");
  const [integrationQuery, setIntegrationQuery] = useState("");

  const filteredIntegrations = useMemo(
    () => filterProductIntegrations(PRODUCT_INTEGRATIONS, integrationFilter, integrationQuery),
    [integrationFilter, integrationQuery],
  );

  const activeFilterIndex = PRODUCT_INTEGRATION_FILTERS.findIndex((item) => item.id === integrationFilter);

  return (
    <div className="product-agents-panel">
      <header className="product-landing-header flex shrink-0 items-center px-4 py-3">
        <h1 className={`product-landing-header__title m-0 text-[15px] font-normal tracking-tight ${suisseIntl.className}`}>
          Agents
        </h1>
      </header>

      <div className="product-agents-panel__stage">
        <ProductVoiceAgentEditor />

        <aside className="product-agents-integrations" aria-label="Integrations">
          <div className="product-agents-integrations__box">
            <h2 className={`product-agents-integrations__title ${suisseIntl.className}`}>Integrations</h2>

            <label className="product-agents-integrations__search">
              <SearchIcon className="product-agents-integrations__search-icon h-3.5 w-3.5" />
              <input
                type="search"
                value={integrationQuery}
                onChange={(event) => setIntegrationQuery(event.target.value)}
                placeholder="Search integrations"
                className={`product-agents-integrations__search-input ${inter.className}`}
              />
            </label>

            <div className="product-agents-integrations__filter" role="tablist" aria-label="Integration filters">
              <span
                className="product-agents-integrations__filter-thumb"
                aria-hidden
                style={{
                  left: `calc(${(activeFilterIndex * 100) / 3}% + 0.18rem)`,
                  width: "calc(33.333% - 0.24rem)",
                }}
              />
              {PRODUCT_INTEGRATION_FILTERS.map((item) => {
                const isActive = integrationFilter === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setIntegrationFilter(item.id)}
                    className={`product-agents-integrations__filter-btn ${suisseIntl.className} ${
                      isActive ? "product-agents-integrations__filter-btn--active" : ""
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {filteredIntegrations.length > 0 ? (
              <ul className="product-agents-integrations__list">
                {filteredIntegrations.map((integration) => (
                  <li key={integration.id} className="product-agents-integrations__item">
                    <div className="min-w-0">
                      <p className={`product-agents-integrations__item-name ${suisseIntl.className}`}>
                        {integration.name}
                      </p>
                      <p className={`product-agents-integrations__item-category ${inter.className}`}>
                        {integration.category}
                      </p>
                    </div>
                    <div className="product-agents-integrations__item-badges">
                      {integration.saved ? (
                        <span className={`product-agents-integrations__badge ${suisseIntl.className}`} title="Saved">
                          S
                        </span>
                      ) : null}
                      {integration.usedBefore ? (
                        <span
                          className={`product-agents-integrations__badge ${suisseIntl.className}`}
                          title="Used before"
                        >
                          U
                        </span>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`product-agents-integrations__empty ${inter.className}`}>
                No integrations match this filter.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
