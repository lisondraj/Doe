import type { Metadata } from "next";

import { LandingLaunchPage } from "@/components/landinglaunch/LandingLaunchPage";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Doe | Preparing for launch",
  description: "We're preparing for launch. Leave your email to keep up to date.",
};

export default function LandingLaunchRoute() {
  return <LandingLaunchPage initialVariant={doehealthDesk2InitialVariant()} />;
}
