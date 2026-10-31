import { OG_CONTENT_TYPE, OG_SIZE, demoOgImage } from "@/lib/demo/demo-og";

export const runtime = "edge";
export const alt = "Clinic dashboard, Dr. Brooks' Migraine Clinic";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** The clinic's own dashboard. */
export default function Image() {
  return demoOgImage({
    kicker: "Dr. Brooks' Migraine Clinic",
    title: "Clinic dashboard",
    sub: "Every agent that connects, what it does, and what needs you.",
    chips: ["Live agents", "Bookings", "Forms"],
    tag: "Clinic view",
    disc: "#C2A987",
  });
}
