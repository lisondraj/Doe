import { OG_CONTENT_TYPE, OG_SIZE, demoOgImage } from "@/lib/demo/demo-og";

export const runtime = "edge";
export const alt = "Your intake forms, Dr. Brooks' Migraine Clinic";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** The private copy of a patient's forms. Nothing about the patient goes in the preview. */
export default function Image() {
  return demoOgImage({
    kicker: "Dr. Brooks' Migraine Clinic",
    title: "Your intake forms",
    sub: "A read-only copy of the forms your agent filled in for you.",
    chips: ["Intake", "4 assessments", "Signed consent"],
    tag: "Private copy",
  });
}
