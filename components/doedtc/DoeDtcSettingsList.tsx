"use client";

import { DoeDtcProfileTabIconGlyph } from "@/components/doedtc/DoeDtcProfileTabIcon";
import { DoeDtcWordmark } from "@/components/doedtc/DoeDtcWordmark";
import { DOEDTC_PROFILE_TABS } from "@/lib/doedtc/doedtc-profile-tabs";
import type { DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";

type DoeDtcSettingsListProps = {
  activeTab: DoeDtcProfileTab;
  onSelect: (tab: DoeDtcProfileTab) => void;
  variant: "overlay" | "sidebar";
  onClose?: () => void;
};

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoeDtcSettingsList({ activeTab, onSelect, variant, onClose }: DoeDtcSettingsListProps) {
  const isOverlay = variant === "overlay";

  return (
    <div className={`doedtc-settings${isOverlay ? " doedtc-settings--overlay" : " doedtc-settings--sidebar"}`}>
      {isOverlay && onClose ? (
        <div className="doedtc-settings__overlay-nav">
          <div className="doedtc-topbar doedtc-nav--phone doedtc-topbar--compact">
            <span className="doedtc-nav__wordmark doedtc-settings__wordmark" aria-hidden>
              <DoeDtcWordmark compact />
            </span>
            <button type="button" className="doedtc-nav-icon" aria-label="Close settings" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
      <div className="doedtc-settings__group" role="list">
        {DOEDTC_PROFILE_TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="listitem"
              className={`doedtc-settings__row${active ? " doedtc-settings__row--active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={() => onSelect(tab.id)}
            >
              <span className="doedtc-settings__icon">
                <DoeDtcProfileTabIconGlyph icon={tab.icon} />
              </span>
              <span className="doedtc-settings__label">{tab.label}</span>
              <span className="doedtc-settings__chevron">
                <ChevronRightIcon />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
