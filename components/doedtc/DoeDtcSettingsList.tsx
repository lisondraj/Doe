"use client";

import { DoeDtcProfileTabIconGlyph } from "@/components/doedtc/DoeDtcProfileTabIcon";
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
      {isOverlay ? (
        <div className="doedtc-settings__header">
          <h2 className="doedtc-settings__title">Settings</h2>
          {onClose ? (
            <button type="button" className="doedtc-settings__close" aria-label="Close settings" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 4l8 8M12 4 4 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>
      ) : (
        <p className="doedtc-settings__eyebrow">Settings</p>
      )}
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
