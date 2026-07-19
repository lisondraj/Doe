"use client";

import { lora, suisseIntl } from "@/lib/home/fonts";
import { PRODUCT_CLINIC_LABEL, PRODUCT_NAV_SECTION_LABEL } from "@/lib/product/product-nav";
import type { ProductNavItem, ProductNavTab } from "@/lib/product/product-nav";

function NavIcon({ id }: { id: ProductNavTab }) {
  const paths: Record<ProductNavTab, React.ReactNode> = {
    landing: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" />,
    calls: (
      <path d="M5.5 4.5h2.75l1.25 2.75L8.5 9a11.5 11.5 0 0 0 5.5 5.5l1.75-1.25 2.75 1.25v2.75a1 1 0 0 1-1 1A13.5 13.5 0 0 1 4.5 5.5a1 1 0 0 1 1-1Z" />
    ),
    agents: (
      <>
        <circle cx="12" cy="8.5" r="3.25" />
        <path d="M5.5 18.5v-1.25a4.25 4.25 0 0 1 4.25-4.25h4.5A4.25 4.25 0 0 1 18.5 17.25V18.5" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="2.75" />
        <path d="M12 3.5v2M12 18.5v2M4.5 12h2M17.5 12h2M6.4 6.4l1.4 1.4M16.2 16.2l1.4 1.4M17.6 6.4l-1.4 1.4M7.8 16.2l-1.4 1.4" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[id]}
    </svg>
  );
}

export function ProductSideNav({
  items,
  activeTab,
  onSelect,
}: {
  items: readonly ProductNavItem[];
  activeTab: ProductNavTab;
  onSelect: (tab: ProductNavTab) => void;
}) {
  return (
    <aside className="product-side-nav flex h-full w-[clamp(15rem,16vw,17.5rem)] shrink-0 flex-col border-r border-[rgba(245,230,208,0.12)] bg-[#1a1208] text-[#f5e6d0]">
      <div className="flex items-center justify-between gap-2 px-[1.1rem] pt-[1.15rem] pb-[0.85rem]">
        <div className="min-w-0">
          <p
            className={`product-side-nav__wordmark m-0 font-normal leading-none tracking-[-0.04em] text-[#f5e6d0] ${lora.className}`}
            style={{ fontSize: "clamp(1.65rem, 1.35rem + 0.65vw, 2rem)" }}
          >
            Doe
          </p>
          <p
            className={`product-side-nav__section m-0 mt-[0.45rem] text-[0.62rem] font-medium uppercase leading-none tracking-[0.16em] text-[rgba(245,230,208,0.48)] ${suisseIntl.className}`}
          >
            {PRODUCT_NAV_SECTION_LABEL}
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-[0.25rem] px-[0.65rem] py-[0.35rem]" aria-label="Product navigation">
        {items.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`product-side-nav__item flex w-full items-center gap-[0.65rem] rounded-[0.45rem] px-[0.75rem] py-[0.62rem] text-left transition-colors duration-150 ${suisseIntl.className} ${
                isActive
                  ? "bg-[rgba(245,230,208,0.1)] text-[#f5e6d0]"
                  : "text-[rgba(245,230,208,0.62)] hover:bg-[rgba(245,230,208,0.06)] hover:text-[rgba(245,230,208,0.88)]"
              }`}
            >
              <span className={isActive ? "text-[#f5e6d0]" : "text-[rgba(245,230,208,0.42)]"}>
                <NavIcon id={item.id} />
              </span>
              <span className="text-[0.92rem] font-normal leading-none tracking-[-0.012em]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[rgba(245,230,208,0.1)] px-[0.85rem] py-[0.95rem]">
        <p
          className={`m-0 text-[0.62rem] font-medium uppercase leading-none tracking-[0.14em] text-[rgba(245,230,208,0.42)] ${suisseIntl.className}`}
        >
          Clinic
        </p>
        <p
          className={`m-0 mt-[0.4rem] truncate text-[0.88rem] font-normal leading-[1.2] tracking-[-0.01em] text-[rgba(245,230,208,0.78)] ${suisseIntl.className}`}
        >
          {PRODUCT_CLINIC_LABEL}
        </p>
      </div>
    </aside>
  );
}
