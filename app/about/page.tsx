import { redirect } from "next/navigation";

import { INVESTORS_PATH } from "@/lib/site-domains";

export default function AboutRedirectPage() {
  redirect(INVESTORS_PATH);
}
