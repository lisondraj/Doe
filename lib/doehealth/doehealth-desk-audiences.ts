export const DOEHEALTH_DESK_AUDIENCES = [
  {
    id: "practices",
    title: "For Practices",
    lines: ["Your model runs the front desk and the workflows this clinic already uses."],
  },
  {
    id: "providers",
    title: "For Providers",
    lines: ["Your model writes the note", "and the auth this chart uses."],
  },
  {
    id: "patients",
    title: "For Patients",
    lines: ["Your model knows the visit, so the reminder is for this appointment."],
  },
  {
    id: "students",
    title: "For Students",
    lines: ["Your model cites the chart", "in the room with the patient."],
  },
] as const;

export type DoeHealthDeskAudienceId = (typeof DOEHEALTH_DESK_AUDIENCES)[number]["id"];
