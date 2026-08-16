import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ClinicalPartnersRouter } from "@/components/partners/ClinicalPartnersRouter";
import { ShaderBackdropPreloadLinks } from "@/components/shared/ShaderBackdropPreloadLinks";
import { BLOG_PARTNERS_PAGE_SHADER_BACKDROP_PATHS } from "@/lib/blog/blog-about-shader-backdrops";
import {
  CLINICAL_PARTNERS_OPENING_DESCRIPTION,
  CLINICAL_PARTNERS_PAGE_TITLE,
} from "@/lib/partners/clinical-partners-copy";
import { partnersPageHostAllowed } from "@/lib/partners/partners-page-path";
import { partnersPageUrl, requestHostFromHeaders } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

const pageTitle = `${CLINICAL_PARTNERS_PAGE_TITLE} · Doe`;

export const metadata: Metadata = {
  title: pageTitle,
  description: CLINICAL_PARTNERS_OPENING_DESCRIPTION,
  alternates: {
    canonical: partnersPageUrl(),
  },
};

export default function PartnersPage() {
  const host = requestHostFromHeaders(headers());

  if (!partnersPageHostAllowed(host)) {
    redirect(partnersPageUrl());
  }

  return (
    <>
      <ShaderBackdropPreloadLinks srcs={BLOG_PARTNERS_PAGE_SHADER_BACKDROP_PATHS} />
      <ClinicalPartnersRouter />
    </>
  );
}
