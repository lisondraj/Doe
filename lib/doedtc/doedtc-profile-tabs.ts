import { DOEDTC_PROFILE } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcProfileTab } from "@/lib/doedtc/doedtc-types";

export type DoeDtcProfileTabConfig = {
  id: DoeDtcProfileTab;
  label: string;
  icon: DoeDtcProfileTabIcon;
};

export type DoeDtcProfileTabIcon =
  | "dashboard"
  | "calendar"
  | "results"
  | "conditions"
  | "family"
  | "locker"
  | "trackers"
  | "guides"
  | "feedback";

export const DOEDTC_PROFILE_TABS: DoeDtcProfileTabConfig[] = [
  { id: "dashboard", label: DOEDTC_PROFILE.navDashboard, icon: "dashboard" },
  { id: "appointments", label: DOEDTC_PROFILE.navAppointments, icon: "calendar" },
  { id: "results", label: DOEDTC_PROFILE.navResults, icon: "results" },
  { id: "conditions", label: DOEDTC_PROFILE.navConditions, icon: "conditions" },
  { id: "family", label: DOEDTC_PROFILE.navFamily, icon: "family" },
  { id: "locker", label: DOEDTC_PROFILE.navLocker, icon: "locker" },
  { id: "trackers", label: DOEDTC_PROFILE.navTrackers, icon: "trackers" },
  { id: "guides", label: DOEDTC_PROFILE.navGuides, icon: "guides" },
  { id: "feedback", label: DOEDTC_PROFILE.navFeedback, icon: "feedback" },
];

const HIDDEN_PROFILE_TABS = new Set<DoeDtcProfileTab>(["share", "accountability"]);

export function doeDtcVisibleProfileTab(tab: DoeDtcProfileTab): DoeDtcProfileTab {
  return HIDDEN_PROFILE_TABS.has(tab) ? "dashboard" : tab;
}

export function doeDtcProfileTabLabel(tab: DoeDtcProfileTab): string {
  return DOEDTC_PROFILE_TABS.find((row) => row.id === tab)?.label ?? tab;
}
