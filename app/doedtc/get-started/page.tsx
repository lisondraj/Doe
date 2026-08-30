import type { Metadata } from "next";

import { DoeDtcGetStartedRouter } from "@/components/doedtc/DoeDtcGetStartedRouter";
import { getDoeDtcUserByOnboardingToken, isValidOnboardingUser } from "@/lib/doedtc/doedtc-db";
import { DOEDTC_GET_STARTED } from "@/lib/doedtc/doedtc-copy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${DOEDTC_GET_STARTED.title} · Doe`,
};

type PageProps = {
  searchParams: Promise<{ t?: string }>;
};

export default async function DoeDtcGetStartedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t?.trim() ?? "";
  let valid = false;

  if (token) {
    try {
      const user = await getDoeDtcUserByOnboardingToken(token);
      valid = isValidOnboardingUser(user);
    } catch {
      valid = false;
    }
  }

  return <DoeDtcGetStartedRouter token={token} valid={valid} />;
}
