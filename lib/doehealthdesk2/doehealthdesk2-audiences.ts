/** Animated cards only. The brown "For Patients" card is a static empty block in the section component. */
export const DOEHEALTH_DESK2_AUDIENCES = [
  {
    id: "students",
    title: "For Students",
    lines: ["Your model cites the chart", "in the room with the patient."],
  },
] as const;

export type DoeHealthDesk2AudienceId = (typeof DOEHEALTH_DESK2_AUDIENCES)[number]["id"];
