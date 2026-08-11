import Link from "next/link";

import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { dmSans, inter } from "@/lib/home/fonts";
import {
  PREMED_CAMPUS_AMBASSADOR_CTA_LABEL,
  PREMED_CAMPUS_AMBASSADOR_DESCRIPTION,
  PREMED_CAMPUS_AMBASSADOR_HEADLINE,
} from "@/lib/premed/premed-copy";
import { JOIN_PATH } from "@/lib/site-domains";

/** /premed — campus ambassador CTA below the email invite panel. */
export function PremedCampusAmbassadorInvite() {
  return (
    <aside
      className={`premed-campus-ambassador-invite relative flex w-full flex-col items-center overflow-hidden border border-[rgba(212,165,116,0.28)] bg-[rgba(39,31,23,0.72)] text-center ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-label="Campus Ambassador Program"
    >
      <div className="relative z-10 flex w-full max-w-[34rem] flex-col items-center gap-4 px-6 py-7 iphone-page:gap-5 iphone-page:px-8 iphone-page:py-8">
        <p
          className={`premed-campus-ambassador-invite__headline m-0 font-medium leading-[1.14] tracking-[-0.02em] text-[clamp(1.28rem,1.08rem+0.9vmin,1.58rem)] iphone-page:text-[clamp(1.38rem,1.16rem+1vmin,1.72rem)] ${dmSans.className}`}
        >
          {PREMED_CAMPUS_AMBASSADOR_HEADLINE}
        </p>

        <p
          className={`premed-campus-ambassador-invite__description m-0 max-w-[32ch] font-normal leading-[1.42] tracking-[-0.01em] text-[clamp(0.98rem,0.88rem+0.42vmin,1.1rem)] iphone-page:text-[clamp(1.02rem,0.92rem+0.48vmin,1.14rem)] ${inter.className}`}
        >
          {PREMED_CAMPUS_AMBASSADOR_DESCRIPTION}
        </p>

        <Link
          href={JOIN_PATH}
          data-premed-allow-link
          className={`premed-campus-ambassador-invite__cta inline-flex items-center justify-center rounded-xl px-6 py-3.5 font-semibold leading-tight tracking-[-0.01em] no-underline text-[clamp(1.02rem,0.92rem+0.5vmin,1.16rem)] iphone-page:px-7 iphone-page:py-4 iphone-page:text-[clamp(1.08rem,0.96rem+0.55vmin,1.22rem)] ${dmSans.className}`}
        >
          {PREMED_CAMPUS_AMBASSADOR_CTA_LABEL}
        </Link>
      </div>
    </aside>
  );
}
