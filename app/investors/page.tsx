import { redirect } from "next/navigation";

import { ABOUT_PATH } from "@/lib/site-domains";

export default function InvestorsRedirectPage() {
  redirect(ABOUT_PATH);
}
