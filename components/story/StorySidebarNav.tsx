"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  DocumentsNavIcon,
  FundraiseNavIcon,
  ProductNavIcon,
  StoryTabIcon,
} from "@/components/story/StoryTabIcon";
import type { StoryTabId } from "@/lib/story/story-nav";
import {
  isStoryDocumentTab,
  isStoryFundraiseTab,
  isStoryProductTab,
  STORY_DOCUMENTS_SECTION_LABEL,
  STORY_DOCUMENT_TABS,
  STORY_FUNDRAISE_SECTION_LABEL,
  STORY_FUNDRAISE_TABS,
  STORY_PRIMARY_TABS_AFTER_FUNDRAISE,
  STORY_PRIMARY_TABS_BEFORE_FUNDRAISE,
  STORY_PRIMARY_TABS_BEFORE_PRODUCT,
  STORY_PRODUCT_SECTION_LABEL,
  STORY_PRODUCT_TABS,
  type StoryNavTab,
} from "@/lib/story/story-nav";

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

function navButtonClass(isActive: boolean, subItem = false) {
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
      className={navButtonClass(isActive, subItem)}
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
  const hasActiveDocument = isStoryDocumentTab(activeTab);
  const [productOpen, setProductOpen] = useState(true);
  const [fundraiseOpen, setFundraiseOpen] = useState(true);
  const [documentsOpen, setDocumentsOpen] = useState(true);

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

  useEffect(() => {
    if (hasActiveDocument) {
      setDocumentsOpen(true);
    }
  }, [hasActiveDocument]);

  return (
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

      <StoryNavGroup
        sectionClassName="story-sidebar-documents"
        subnavId="story-documents-subnav"
        label={STORY_DOCUMENTS_SECTION_LABEL}
        icon={<DocumentsNavIcon />}
        items={STORY_DOCUMENT_TABS}
        open={documentsOpen}
        onToggle={() => setDocumentsOpen((open) => !open)}
        hasActiveChild={hasActiveDocument}
        activeTab={activeTab}
        onSelect={onSelect}
      />
    </nav>
  );
}
