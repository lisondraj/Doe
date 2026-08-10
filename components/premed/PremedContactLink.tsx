import { dmSans } from "@/lib/home/fonts";

function ContactArrow() {
  return (
    <svg
      className="ml-1 inline-block h-[0.85em] w-[0.85em] shrink-0 align-[-0.05em]"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 6h7M6.75 3.25 9.5 6 6.75 8.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** /premed — styled like AboutStyleContactLink; navigation handled by PremedLinkGuard. */
export function PremedContactLink() {
  return (
    <a
      href="#contact"
      className={`inline-flex items-center font-medium text-[#E8C08E] underline decoration-[#E8C08E]/35 underline-offset-[0.28em] transition-colors hover:decoration-[#E8C08E]/70 ${dmSans.className}`}
    >
      Contact us
      <ContactArrow />
    </a>
  );
}
