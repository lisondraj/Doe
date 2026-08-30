"use client";

import { DoeDtcAvatarMenu } from "@/components/doedtc/DoeDtcAvatarMenu";
import { DoeDtcPageHeader } from "@/components/doedtc/DoeDtcPageHeader";
import { DoeDtcSettingsList } from "@/components/doedtc/DoeDtcSettingsList";
import { DoeDtcTopBar } from "@/components/doedtc/DoeDtcTopBar";
import { doeDtcProfileTabLabel } from "@/lib/doedtc/doedtc-profile-tabs";
import type { DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";
import { useDoeDtcPageVariant } from "@/lib/doedtc/use-doedtc-page-variant";
import { useCallback, useEffect, useState } from "react";

type DoeDtcNavProps = {
  token: string;
  activeTab: DoeDtcProfileTab;
  onTabChange?: (tab: DoeDtcProfileTab) => void;
  displayName?: string | null;
  subtitle?: string | null;
  children?: React.ReactNode;
  homeHref?: string;
};

export function DoeDtcNav({
  token,
  activeTab,
  onTabChange,
  displayName,
  subtitle,
  children,
  homeHref,
}: DoeDtcNavProps) {
  const { variant, ready } = useDoeDtcPageVariant();
  const isPhone = !ready || variant === "phone";
  const [settingsOpen, setSettingsOpen] = useState(false);

  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  useEffect(() => {
    if (!settingsOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSettings();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeSettings, settingsOpen]);

  useEffect(() => {
    closeSettings();
  }, [activeTab, closeSettings]);

  const selectTab = (tab: DoeDtcProfileTab) => {
    onTabChange?.(tab);
    closeSettings();
  };

  const showStackedHeader = isPhone && activeTab !== "dashboard";

  return (
    <div className={`doedtc-profile-layout${isPhone ? " doedtc-profile-layout--phone" : " doedtc-profile-layout--desktop"}`}>
      {!isPhone ? (
        <aside className="doedtc-profile-layout__sidebar" aria-label="Settings">
          <DoeDtcSettingsList activeTab={activeTab} variant="sidebar" onSelect={selectTab} />
        </aside>
      ) : null}

      <div className="doedtc-profile-layout__main">
        <nav className={`doedtc-nav${isPhone ? " doedtc-nav--phone" : ""}`} aria-label="Profile">
          <DoeDtcTopBar
            href={homeHref ?? `/doedtc/app?t=${encodeURIComponent(token)}`}
            compact
            trailing={
              <DoeDtcAvatarMenu
                displayName={displayName}
                subtitle={subtitle}
                activeTab={activeTab}
                onOpenSettings={() => setSettingsOpen(true)}
                onSelectTab={selectTab}
              />
            }
          />
        </nav>

        {showStackedHeader ? <DoeDtcPageHeader title={doeDtcProfileTabLabel(activeTab)} /> : null}

        {children}
      </div>

      {isPhone && settingsOpen ? (
        <>
          <button
            type="button"
            className="doedtc-settings__backdrop"
            aria-label="Close settings"
            onClick={closeSettings}
          />
          <div className="doedtc-settings__sheet" role="dialog" aria-modal="true" aria-label="Settings">
            <DoeDtcSettingsList
              activeTab={activeTab}
              variant="overlay"
              onSelect={selectTab}
              onClose={closeSettings}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
