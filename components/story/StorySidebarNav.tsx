"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  FundraiseNavIcon,
  ProductNavIcon,
  StoryTabIcon,
} from "@/components/story/StoryTabIcon";
import type { StoryTabId } from "@/lib/story/story-nav";
import {
  STORY_CONTACT_EMAIL,
  STORY_CONTACT_LINKEDIN_HANDLE,
  STORY_CONTACT_LINKEDIN_URL,
} from "@/lib/story/story-copy";
import {
  isStoryFundraiseTab,
  isStoryGoldNavTab,
  isStoryProductTab,
  STORY_FUNDRAISE_SECTION_LABEL,
  STORY_FUNDRAISE_TABS,
  STORY_PRIMARY_TABS_AFTER_FUNDRAISE,
  STORY_PRIMARY_TABS_BEFORE_FUNDRAISE,
  STORY_PRIMARY_TABS_BEFORE_PRODUCT,
  STORY_PRODUCT_SECTION_LABEL,
  STORY_PRODUCT_TABS,
  type StoryNavTab,
} from "@/lib/story/story-nav";

function StorySidebarSearch() {
  return (
    <div className="story-sidebar-search">
      <div className="story-sidebar-search__field" role="search" aria-label="Search story">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="story-sidebar-search__icon"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="story-sidebar-search__placeholder">Search</span>
        <kbd className="story-sidebar-search__kbd">⌘</kbd>
      </div>
    </div>
  );
}

function StorySidebarContact() {
  return (
    <div className="story-sidebar-contact">
      <div className="story-sidebar-contact__box">
        <a href={`mailto:${STORY_CONTACT_EMAIL}`} className="story-sidebar-contact__row">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="story-sidebar-search__icon"
          >
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <span className="story-sidebar-contact__label truncate">{STORY_CONTACT_EMAIL}</span>
        </a>
        <a
          href={STORY_CONTACT_LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="story-sidebar-contact__row"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="story-sidebar-search__icon"
          >
            <rect width="18" height="18" x="3" y="3" rx="3" />
            <path d="M8 10v7" />
            <path d="M8 7h.01" />
            <path d="M12 17v-4a2 2 0 0 1 4 0v4" />
          </svg>
          <span className="story-sidebar-contact__label truncate">{STORY_CONTACT_LINKEDIN_HANDLE}</span>
        </a>
      </div>
    </div>
  );
}

function NavChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`story-nav-item__chevron shrink-0${open ? " story-nav-item__chevron--open" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function navButtonClass(isActive: boolean, subItem = false, gold = false) {
  if (subItem) {
    return [
      "story-nav-item story-nav-item--subpage story-nav-subitem inline-flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] whitespace-nowrap transition-colors",
      isActive ? "story-nav-item--active font-medium" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    "story-nav-item inline-flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] whitespace-nowrap transition-colors",
    gold ? "story-nav-item--gold" : "",
    isActive
      ? "story-nav-item--active bg-[rgba(245,230,208,0.12)] font-medium text-[#f5e6d0]"
      : "text-[rgba(245,230,208,0.78)] hover:bg-[rgba(245,230,208,0.08)]",
  ]
    .filter(Boolean)
    .join(" ");
}

function navGroupClass(isOpen: boolean, hasActiveChild: boolean) {
  return [
    "story-nav-item story-nav-item--group story-nav-item--section inline-flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] whitespace-nowrap transition-colors",
    isOpen ? "story-nav-item--group-open" : "",
    hasActiveChild ? "story-nav-item--group-active font-medium" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function StoryNavTabButton({
  item,
  isActive,
  subItem = false,
  onSelect,
}: {
  item: StoryNavTab;
  isActive: boolean;
  subItem?: boolean;
  onSelect: (tab: StoryTabId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-current={isActive ? "page" : undefined}
      className={navButtonClass(isActive, subItem, isStoryGoldNavTab(item.id))}
    >
      <StoryTabIcon tab={item.id} />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

function StoryNavGroup({
  sectionClassName,
  subnavId,
  label,
  icon,
  items,
  open,
  onToggle,
  hasActiveChild,
  activeTab,
  onSelect,
}: {
  sectionClassName: string;
  subnavId: string;
  label: string;
  icon: ReactNode;
  items: readonly StoryNavTab[];
  open: boolean;
  onToggle: () => void;
  hasActiveChild: boolean;
  activeTab: StoryTabId;
  onSelect: (tab: StoryTabId) => void;
}) {
  return (
    <div className={sectionClassName}>
      <button
        type="button"
        className={navGroupClass(open, hasActiveChild)}
        aria-expanded={open}
        aria-controls={subnavId}
        onClick={onToggle}
      >
        {icon}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <NavChevron open={open} />
      </button>

      {open ? (
        <div id={subnavId} className="story-nav-subitems mt-0.5 flex flex-col gap-0.5">
          {items.map((item) => (
            <StoryNavTabButton
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              subItem
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function StorySidebarNav({
  activeTab,
  onSelect,
}: {
  activeTab: StoryTabId;
  onSelect: (tab: StoryTabId) => void;
}) {
  const hasActiveProduct = isStoryProductTab(activeTab);
  const hasActiveFundraise = isStoryFundraiseTab(activeTab);
  const [productOpen, setProductOpen] = useState(true);
  const [fundraiseOpen, setFundraiseOpen] = useState(true);

  useEffect(() => {
    if (hasActiveProduct) {
      setProductOpen(true);
    }
  }, [hasActiveProduct]);

  useEffect(() => {
    if (hasActiveFundraise) {
      setFundraiseOpen(true);
    }
  }, [hasActiveFundraise]);

  return (
    <div className="story-sidebar-shell flex min-h-0 flex-1 flex-col overflow-hidden">
      <StorySidebarSearch />
      <nav className="story-sidebar-nav flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
      {STORY_PRIMARY_TABS_BEFORE_PRODUCT.map((item) => (
        <StoryNavTabButton key={item.id} item={item} isActive={activeTab === item.id} onSelect={onSelect} />
      ))}

      <StoryNavGroup
        sectionClassName="story-sidebar-product"
        subnavId="story-product-subnav"
        label={STORY_PRODUCT_SECTION_LABEL}
        icon={<ProductNavIcon />}
        items={STORY_PRODUCT_TABS}
        open={productOpen}
        onToggle={() => setProductOpen((open) => !open)}
        hasActiveChild={hasActiveProduct}
        activeTab={activeTab}
        onSelect={onSelect}
      />

      {STORY_PRIMARY_TABS_BEFORE_FUNDRAISE.map((item) => (
        <StoryNavTabButton key={item.id} item={item} isActive={activeTab === item.id} onSelect={onSelect} />
      ))}

      <StoryNavGroup
        sectionClassName="story-sidebar-fundraise"
        subnavId="story-fundraise-subnav"
        label={STORY_FUNDRAISE_SECTION_LABEL}
        icon={<FundraiseNavIcon />}
        items={STORY_FUNDRAISE_TABS}
        open={fundraiseOpen}
        onToggle={() => setFundraiseOpen((open) => !open)}
        hasActiveChild={hasActiveFundraise}
        activeTab={activeTab}
        onSelect={onSelect}
      />

      {STORY_PRIMARY_TABS_AFTER_FUNDRAISE.map((item) => (
        <StoryNavTabButton key={item.id} item={item} isActive={activeTab === item.id} onSelect={onSelect} />
      ))}
      </nav>
      <StorySidebarContact />
    </div>
  );
}
