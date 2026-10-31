import type { Metadata, Viewport } from "next";

import { DemoVerify } from "@/components/demo/DemoVerify";
import { headers } from "next/headers";

import { isPreviewBot } from "@/lib/demo/demo-http";
import { openVerify } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** The identity check an agent sends its user: never indexed, and the token never leaks as a referrer. */
export const metadata: Metadata = {
  title: "Confirm it's you · Dr. Brooks' Migraine Clinic",
  description: "Check your date of birth, add your driver's licence and confirm with Face ID.",
  openGraph: { title: "Confirm it's you · Dr. Brooks' Migraine Clinic", description: "Check your date of birth, add your driver's licence and confirm with Face ID.", siteName: "Doe" },
  twitter: { card: "summary_large_image" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const viewport: Viewport = { themeColor: "#3A2516" };

export default async function VerifyPage({ params }: { params: { token: string } }) {
  /** A link preview isn't the patient opening the link. */
  const r = await openVerify(params.token, !isPreviewBot(headers().get("user-agent")));
  return <DemoVerify token={params.token} state={r} />;
}
