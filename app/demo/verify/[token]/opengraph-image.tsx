import { OG_CONTENT_TYPE, OG_SIZE, demoOgImage } from "@/lib/demo/demo-og";

export const runtime = "edge";
export const alt = "Confirm it's you, Dr. Brooks' Migraine Clinic";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** The identity-check link an agent sends its user. Nothing about the user goes in the preview. */
export default function Image() {
  return demoOgImage({
    kicker: "Dr. Brooks' Migraine Clinic",
    title: "Confirm it's you",
    sub: "Check your date of birth, add your driver's licence and confirm with Face ID.",
    chips: ["Face ID", "Date of birth", "Driver's licence"],
    tag: "Identity check",
    disc: "#9DBF8A",
  });
}
