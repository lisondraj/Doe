import Link from "next/link";

import { AboutContactRingsGraphic } from "@/components/about/AboutContactRingsGraphic";
import { ABOUT_CONTACT_EMAIL } from "@/lib/about/about-contact";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import {
  BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
} from "@/lib/blog/broader-doe-vision-article";
import { dmSans, inter } from "@/lib/home/fonts";

/** iPhone blog — raised brown panel inviting readers to email James. */
export function BroaderDoeVisionEmailInvite() {
  return (
    <aside
      className={`broader-doe-email-invite relative flex min-h-[clamp(13.5rem,38vw,17.5rem)] w-full items-center justify-center overflow-hidden border border-[rgba(212,165,116,0.28)] bg-[#271F17] ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
      aria-label="Contact James Lisondra"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[min(88%,14rem)]" aria-hidden>
        <AboutContactRingsGraphic />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center gap-5 px-6 py-8 text-center iphone-page:gap-6 iphone-page:px-8 iphone-page:py-10">
        <p
          className={`font-medium leading-[1.12] tracking-[-0.02em] text-[#F2E8DA] text-[clamp(1.55rem,1.28rem+1.05vmin,1.95rem)] iphone-page:text-[clamp(1.72rem,1.42rem+1.2vmin,2.15rem)] ${dmSans.className}`}
        >
          {BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE}
        </p>

        <p
          className={`font-medium tracking-[-0.02em] text-[#E8C08E] text-[clamp(1.18rem,1rem+0.82vmin,1.42rem)] iphone-page:text-[clamp(1.28rem,1.08rem+0.95vmin,1.55rem)] ${inter.className}`}
        >
          {ABOUT_CONTACT_EMAIL}
        </p>

        <Link
          href={`mailto:${ABOUT_CONTACT_EMAIL}?subject=The%20Broader%20Doe%20Vision`}
          className={`inline-flex items-center gap-2.5 rounded-xl border border-[rgba(212,165,116,0.28)] bg-[rgba(39,31,23,0.72)] px-5 py-3 font-medium leading-tight tracking-[-0.01em] text-[#F2E8DA] transition-colors hover:border-[rgba(232,192,142,0.45)] hover:text-white text-[clamp(1.05rem,0.92rem+0.55vmin,1.22rem)] iphone-page:px-6 iphone-page:py-3.5 iphone-page:text-[clamp(1.12rem,0.98rem+0.62vmin,1.28rem)] ${dmSans.className}`}
        >
          {BROADER_DOE_VISION_EMAIL_INVITE_LABEL}
        </Link>
      </div>
    </aside>
  );
}
