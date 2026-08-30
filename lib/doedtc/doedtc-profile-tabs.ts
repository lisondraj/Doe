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
  | "share"
  | "trackers"
  | "guides"
  | "accountability"
  | "feedback";

export const DOEDTC_PROFILE_TABS: DoeDtcProfileTabConfig[] = [
  { id: "dashboard", label: DOEDTC_PROFILE.navDashboard, icon: "dashboard" },
  { id: "appointments", label: DOEDTC_PROFILE.navAppointments, icon: "calendar" },
  { id: "results", label: DOEDTC_PROFILE.navResults, icon: "results" },
  { id: "conditions", label: DOEDTC_PROFILE.navConditions, icon: "conditions" },
  { id: "family", label: DOEDTC_PROFILE.navFamily, icon: "family" },
  { id: "locker", label: DOEDTC_PROFILE.navLocker, icon: "locker" },
  { id: "share", label: DOEDTC_PROFILE.navShare, icon: "share" },
  { id: "trackers", label: DOEDTC_PROFILE.navTrackers, icon: "trackers" },
  { id: "guides", label: DOEDTC_PROFILE.navGuides, icon: "guides" },
  { id: "accountability", label: DOEDTC_PROFILE.navAccountability, icon: "accountability" },
  { id: "feedback", label: DOEDTC_PROFILE.navFeedback, icon: "feedback" },
];

export function doeDtcProfileTabLabel(tab: DoeDtcProfileTab): string {
  return DOEDTC_PROFILE_TABS.find((row) => row.id === tab)?.label ?? tab;
}
