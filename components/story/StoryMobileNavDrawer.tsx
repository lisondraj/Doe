"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import { StorySidebarNav } from "@/components/story/StorySidebarNav";
import { lora } from "@/lib/home/fonts";
import type { StoryTabId } from "@/lib/story/story-nav";

function StoryMobileNavCloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
      className="h-5 w-5"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

/** iPhone /story — full-screen navigation overlay. */
export function StoryMobileNavDrawer({
  open,
  activeTab,
  onSelect,
  onClose,
}: {
  open: boolean;
  activeTab: StoryTabId;
  onSelect: (tab: StoryTabId) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="story-mobile-nav-drawer product-brown-mock product-brown-story-mode product-brown-story-mode--mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Story navigation"
    >
      <header className="story-mobile-nav-drawer__header">
        <p className={`story-mobile-nav-drawer__wordmark ${lora.className}`}>Doe</p>
        <button
          type="button"
          className="story-mobile-nav-drawer__close"
          aria-label="Close navigation"
          onClick={onClose}
        >
          <StoryMobileNavCloseIcon />
        </button>
      </header>
      <StorySidebarNav
        activeTab={activeTab}
        onSelect={(tab) => {
          onSelect(tab);
          onClose();
        }}
      />
    </div>,
    document.body,
  );
}
