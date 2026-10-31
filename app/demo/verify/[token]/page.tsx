import type { Metadata, Viewport } from "next";

import { DemoVerify } from "@/components/demo/DemoVerify";
import { openVerify } from "@/lib/demo/demo-service";

export const dynamic = "force-dynamic";

/** The identity check an agent sends its user: never indexed, and the token never leaks as a referrer. */
export const metadata: Metadata = {
  title: "Confirm it's you · Doe",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const viewport: Viewport = { themeColor: "#3A2516" };

export default async function VerifyPage({ params }: { params: { token: string } }) {
  const r = await openVerify(params.token);
  return <DemoVerify token={params.token} state={r} />;
}
