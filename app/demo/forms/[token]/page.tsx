import type { Metadata } from "next";

import { DemoSharedForms, DemoShareUnavailable } from "@/components/demo/DemoSharedForms";
import { openShare } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** A private copy of a patient's forms: never indexed, and the token never leaks to other sites as a referrer. */
export const metadata: Metadata = {
  title: "Your forms · Doe",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export default async function SharedFormsPage({ params }: { params: { token: string } }) {
  const r = await openShare(params.token);
  if ("error" in r) return <DemoShareUnavailable reason={r.error!} />;
  return <DemoSharedForms session={r.session} share={r.share} scores={r.scores} />;
}
