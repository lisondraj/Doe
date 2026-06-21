export type DoePhoneCommunicationShortcut = {
  key?: string;
  label: string;
};

/** Staggered keyboard shortcut rows — matches reference layout. */
export const DOEPHONE_COMMUNICATION_SHORTCUT_ROWS: readonly (readonly DoePhoneCommunicationShortcut[])[] = [
  [
    { key: "/", label: "Search" },
    { key: "K", label: "Command" },
    { key: "E", label: "Archive" },
  ],
  [
    { key: "T", label: "Trash" },
    { key: "R", label: "Reply" },
    { key: "C", label: "Compose" },
    { key: "L", label: "Label" },
  ],
  [
    { key: "H", label: "Snooze" },
    { label: "Remind me" },
    { key: "J", label: "Next" },
    { key: "F", label: "Forward" },
  ],
] as const;

/** Horizontal offsets per row — staggered, edge-clipped like reference. */
export const DOEPHONE_COMMUNICATION_SHORTCUT_ROW_OFFSETS = [
  "translate-x-[16%]",
  "-translate-x-[14%]",
  "-translate-x-[6%]",
] as const;

/** Translucent warm glass — outer shortcut chip. */
export const DOEPHONE_SHORTCUT_PILL_GRADIENT =
  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,228,196,0.08) 38%, rgba(210,119,76,0.06) 100%)";

/** Translucent warm glass — key badge fill. */
export const DOEPHONE_SHORTCUT_KEY_GRADIENT =
  "linear-gradient(145deg, rgba(255,255,255,0.34) 0%, rgba(255,236,205,0.22) 52%, rgba(232,169,68,0.14) 100%)";
