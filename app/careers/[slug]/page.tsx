import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DoeHealthCareersRolePage } from "@/components/doehealth-careers/DoeHealthCareersRolePage";
import { CAREERS_LOCATION, careersRole } from "@/lib/doehealth/doehealth-careers";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

type RouteProps = { params: { slug: string } };

export function generateMetadata({ params }: RouteProps): Metadata {
  const role = careersRole(params.slug);
  if (!role) return {};
  return {
    title: `${role.title} · Careers · Doe`,
    description: `${role.summary} ${CAREERS_LOCATION}, full time.`,
  };
}

export default function CareersRoleRoute({ params }: RouteProps) {
  const role = careersRole(params.slug);
  if (!role) notFound();
  return <DoeHealthCareersRolePage role={role} initialVariant={doehealthDesk2InitialVariant()} />;
}
