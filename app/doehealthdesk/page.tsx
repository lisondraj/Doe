import { DoeHealthDeskPage } from "@/components/doehealth-desk/DoeHealthDeskPage";
import { doehealthDeskInitialVariant } from "@/lib/doehealth/doehealth-desk-initial-variant";

export const dynamic = "force-dynamic";

export default function DoeHealthDeskRoute() {
  return <DoeHealthDeskPage initialVariant={doehealthDeskInitialVariant()} />;
}
