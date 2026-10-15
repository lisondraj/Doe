import { DoeHealthDesk2Page } from "@/components/doehealth-desk2/DoeHealthDesk2Page";
import { doehealthDesk2InitialVariant } from "@/lib/doehealthdesk2/doehealthdesk2-initial-variant";

export const dynamic = "force-dynamic";

export default function DoeHealthDesk2Route() {
  return <DoeHealthDesk2Page initialVariant={doehealthDesk2InitialVariant()} />;
}
