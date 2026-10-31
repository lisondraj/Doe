import type { Metadata } from "next";

import { DemoSharedForms, DemoShareUnavailable } from "@/components/demo/DemoSharedForms";
import { headers } from "next/headers";

import { isPreviewBot } from "@/lib/demo/demo-http";
import { openShare } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** A private copy of a patient's forms: never indexed, and the token never leaks to other sites as a referrer. */
export const metadata: Metadata = {
  title: "Your intake forms · Dr. Brooks' Migraine Clinic",
  description: "A read-only copy of the forms your agent filled in for you.",
  openGraph: { title: "Your intake forms · Dr. Brooks' Migraine Clinic", description: "A read-only copy of the forms your agent filled in for you.", siteName: "Doe" },
  twitter: { card: "summary_large_image" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default async function SharedFormsPage({ params }: { params: { token: string } }) {
  /** A link preview (iMessage builds one when the link is sent) isn't the patient opening it. */
  const r = await openShare(params.token, !isPreviewBot(headers().get("user-agent")));
  if ("error" in r) return <DemoShareUnavailable reason={r.error!} />;
  return <DemoSharedForms session={r.session} share={r.share} scores={r.scores} />;
}
