"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { doeDtcProfileTabLabel } from "@/lib/doedtc/doedtc-profile-tabs";
import type { DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";
import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";

type DoeDtcAvatarMenuProps = {
  displayName?: string | null;
  subtitle?: string | null;
  activeTab?: DoeDtcProfileTab;
  onOpenSettings: () => void;
  onSelectTab: (tab: DoeDtcProfileTab) => void;
};

function NavMenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 2.4c-.9 0-1.7.35-2.3.95-.62.62-.95 1.48-.95 2.4v1.55c0 1.28-.42 2.53-1.2 3.52L3.4 12.2c-.22.28-.03.7.32.7h10.56c.35 0 .54-.42.32-.7l-1.15-1.38A5.7 5.7 0 0 1 12.25 7.3V5.75c0-.92-.33-1.78-.95-2.4A3.2 3.2 0 0 0 9 2.4Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path d="M7.2 13.7a1.9 1.9 0 0 0 3.6 0" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  );
}

export function DoeDtcAvatarMenu({
  displayName,
  subtitle,
  activeTab,
  onOpenSettings,
  onSelectTab,
}: DoeDtcAvatarMenuProps) {
  const { variant, ready } = useDoeDtcPageVariant();
  const isPhone = !ready || variant === "phone";
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open || isPhone) return undefined;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, isPhone, open]);

  const quickLinks: DoeDtcProfileTab[] = ["dashboard", "family", "appointments", "feedback"];

  function handleNavClick() {
    if (isPhone) {
      onOpenSettings();
      return;
    }
    setOpen((current) => !current);
  }

  return (
    <div className="doedtc-nav-actions">
      <button type="button" className="doedtc-nav-icon" aria-label="Notifications">
        <NotificationIcon />
      </button>
      <div className="doedtc-avatar-menu" ref={rootRef}>
        <button
          type="button"
          className="doedtc-nav-icon"
          aria-haspopup={isPhone ? undefined : "menu"}
          aria-expanded={isPhone ? undefined : open}
          aria-label="Open navigation"
          onClick={handleNavClick}
        >
          <NavMenuIcon />
        </button>
        {!isPhone && open ? (
          <div className="doedtc-avatar-menu__panel" role="menu">
            <div className="doedtc-avatar-menu__identity">
              {displayName ? <strong>{displayName}</strong> : null}
              {subtitle ? <span className="doedtc-muted">{subtitle}</span> : null}
            </div>
            <div className="doedtc-avatar-menu__section">
              {quickLinks.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="menuitem"
                  className={`doedtc-avatar-menu__item${activeTab === tab ? " doedtc-avatar-menu__item--active" : ""}`}
                  onClick={() => {
                    onSelectTab(tab);
                    close();
                  }}
                >
                  {doeDtcProfileTabLabel(tab)}
                </button>
              ))}
            </div>
            <button
              type="button"
              role="menuitem"
              className="doedtc-avatar-menu__item doedtc-avatar-menu__item--settings"
              onClick={() => {
                onOpenSettings();
                close();
              }}
            >
              Settings
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
