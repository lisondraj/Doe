"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { doeDtcProfileTabLabel } from "@/lib/doedtc/doedtc-profile-tabs";
import type { DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";

type DoeDtcAvatarMenuProps = {
  displayName?: string | null;
  subtitle?: string | null;
  activeTab?: DoeDtcProfileTab;
  onOpenSettings: () => void;
  onSelectTab: (tab: DoeDtcProfileTab) => void;
};

function initialsFromName(name?: string | null): string {
  const trimmed = name?.trim();
  if (!trimmed) return "D";
  const parts = trimmed.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "D";
}

export function DoeDtcAvatarMenu({
  displayName,
  subtitle,
  activeTab,
  onOpenSettings,
  onSelectTab,
}: DoeDtcAvatarMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

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
  }, [close, open]);

  const quickLinks: DoeDtcProfileTab[] = ["dashboard", "family", "appointments", "feedback"];

  return (
    <div className="doedtc-avatar-menu" ref={rootRef}>
      <button
        type="button"
        className="doedtc-avatar"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="doedtc-avatar__initials">{initialsFromName(displayName)}</span>
      </button>
      {open ? (
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
  );
}
