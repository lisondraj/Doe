import { JOIN_APPLY_SECTION_ID } from "@/lib/join/join-layout";

/** Smooth scroll to the build-your-applicant-card section. */
export function scrollToJoinApplySection() {
  const target = document.getElementById(JOIN_APPLY_SECTION_ID);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}
