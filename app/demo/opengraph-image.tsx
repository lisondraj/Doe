import { OG_CONTENT_TYPE, OG_SIZE, demoOgImage } from "@/lib/demo/demo-og";

export const runtime = "edge";
export const alt = "Dr. Brooks' Migraine Clinic on Doe";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** The link agents get for the clinic: who it is and how to book. */
export default function Image() {
  return demoOgImage({
    kicker: "Doe · Toronto, Ontario",
    title: "Dr. Brooks' Migraine Clinic",
    sub: "Botox for chronic migraine. Personal agents book directly through Doe.",
    chips: ["Botox from $1,377", "Dr. Sarah Brooks · 4.9", "MCP · API · Browser"],
    tag: "Agents welcome",
  });
}
