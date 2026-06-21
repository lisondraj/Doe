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
