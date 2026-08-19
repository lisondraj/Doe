import { DoeLinkArrow } from "@/components/shared/DoeLinkArrow";
import { dmSans } from "@/lib/home/fonts";

/** /premed — styled like AboutStyleContactLink; navigation handled by PremedLinkGuard. */
export function PremedContactLink() {
  return (
    <a
      href="#contact"
      className={`inline-flex items-center font-medium text-[#E8C08E] underline decoration-[#E8C08E]/35 underline-offset-[0.28em] transition-colors hover:decoration-[#E8C08E]/70 ${dmSans.className}`}
    >
      Contact us
      <DoeLinkArrow className="ml-1 inline-block h-[0.85em] w-[0.85em] shrink-0 align-[-0.05em]" />
    </a>
  );
}
