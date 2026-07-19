import { DesignersPage } from "@/components/designers/DesignersPage";

export const dynamic = "force-dynamic";

/** Legacy preview route — desktop hero gradient; phone redirects to doehealth.care. */
export default function DesignersRoute() {
  return <DesignersPage />;
}
