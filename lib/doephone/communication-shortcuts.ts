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
  "translate-x-[14%]",
  "-translate-x-[10%]",
  "-translate-x-[4%]",
] as const;

/** Doe orange panel gradient behind the shortcut array. */
export const DOEPHONE_COMMUNICATION_SHORTCUT_PANEL_GRADIENT =
  "radial-gradient(ellipse 118% 108% at 52% 44%, #E7A944 0%, #D49D4F 24%, #D2774C 52%, #C47A5A 74%, #9E5A42 92%, #6B4038 100%)";
