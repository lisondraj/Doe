import { headers } from "next/headers";

import { BlogRouter } from "@/components/blog/BlogRouter";

export const dynamic = "force-dynamic";

const MOBILE_UA =
  /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i;

export default function BlogPage() {
  const ua = headers().get("user-agent") ?? "";
  const initialVariant = MOBILE_UA.test(ua) ? "phone" : "desktop";
  return <BlogRouter initialVariant={initialVariant} />;
}
