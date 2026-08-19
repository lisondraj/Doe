import type { Metadata } from "next";

import { LinkedIn4View } from "@/components/linkedin/LinkedIn4View";
import { primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const LINKEDIN4_PATH = "/linkedin4";

export const metadata: Metadata = {
  title: "LinkedIn 4 · Doe",
  description:
    "Doe LinkedIn banner — Plastic Surgery, Dermatology & Aesthetic Clinics, with Diagnostic Imaging and Endocrine & Weight Management.",
  alternates: {
    canonical: `${primarySiteOrigin()}${LINKEDIN4_PATH}`,
  },
};

export default function LinkedIn4Page() {
  return <LinkedIn4View />;
}
