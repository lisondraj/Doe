"use client";

import Link from "next/link";

import { DOEPHONE_FOOTER_CONTENT_INSET } from "@/lib/doephone/section-styles";
import { PROTO_FONT_CLASS } from "@/lib/proto/proto-font";
import { ProtoFooterWordmark } from "@/components/proto/ProtoFooterWordmark";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Clinical Agents" },
      { href: "/workflow", label: "Patient Inbox" },
      { href: "/features", label: "EMR Integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Proto" },
      { href: "/proto", label: "For Investors" },
      { href: "/join", label: "Careers" },
    ],
  },
] as const;

/** Footer — proto page background; horizontal rule + wordmark. */
export function ProtoFooter() {
  return (
    <footer className="proto-footer relative z-10 mt-0 w-full overflow-visible pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
      <div className="proto-footer-inner relative z-10 flex w-full flex-col">
        <div className={`proto-footer-main w-full ${DOEPHONE_FOOTER_CONTENT_INSET}`}>
          <div className={`proto-footer-contact min-w-0 text-left text-white ${PROTO_FONT_CLASS}`}>
            <p className="proto-footer-contact__brand font-semibold leading-[1.16]">Proto</p>
            <p className="proto-footer-contact__line mt-3 text-white/88">Delaware C-Corporation</p>
            <a
              href="mailto:ask@proto.jobs"
              className="proto-footer-contact__email proto-footer-contact__line mt-3 inline-block text-white/88 no-underline transition-colors hover:text-white"
            >
              ask@proto.jobs
            </a>

            <div className="proto-footer-columns grid grid-cols-2 gap-x-10 gap-y-6 iphone-page:gap-x-8">
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title} className="proto-footer-column min-w-0">
                  <p className="proto-footer-column__title font-semibold text-white">{column.title}</p>
                  <nav className="proto-footer-column__links mt-3 flex flex-col gap-2.5" aria-label={column.title}>
                    {column.links.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="proto-footer-column__link text-white/88 no-underline transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProtoFooterWordmark />
      </div>
    </footer>
  );
}
