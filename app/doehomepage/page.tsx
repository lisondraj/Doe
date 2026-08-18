import type { Metadata } from "next";

import { DoeHomeRouter } from "@/components/doehome/DoeHomeRouter";
import { ShaderBackdropPreloadLinks } from "@/components/shared/ShaderBackdropPreloadLinks";
import {
  DOEHOME_PAGE_DESCRIPTION,
  DOEHOME_PAGE_TITLE,
} from "@/lib/doehome/doehome-copy";
import { DOEHOME_SHADER_PRELOAD } from "@/lib/doehome/doehome-shaders";
import { DOEHOME_PATH, primarySiteOrigin } from "@/lib/site-domains";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: DOEHOME_PAGE_TITLE,
  description: DOEHOME_PAGE_DESCRIPTION,
  alternates: {
    canonical: `${primarySiteOrigin()}${DOEHOME_PATH}`,
  },
};

export default function DoeHomepage() {
  return (
    <>
      <ShaderBackdropPreloadLinks srcs={DOEHOME_SHADER_PRELOAD} />
      <DoeHomeRouter />
    </>
  );
}
