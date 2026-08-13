import { LinkedIn2ProtoNav } from "@/components/linkedin/LinkedIn2ProtoNav";
import { LinkedIn2SandboxCard } from "@/components/linkedin/LinkedIn2SandboxCard";
import { LINKEDIN2_FOOTER_URL, LINKEDIN2_HEADLINE } from "@/lib/linkedin/linkedin2-copy";
import { PROTO_FONT_CLASS } from "@/lib/proto/proto-font";

/** Proto sandbox feature mock — nav, gradient card, headline, footer URL. */
export function LinkedIn2ProtoScene() {
  return (
    <div className={`linkedin2-scene ${PROTO_FONT_CLASS}`}>
      <LinkedIn2ProtoNav />
      <LinkedIn2SandboxCard />

      <h1 className="linkedin2-scene__headline">{LINKEDIN2_HEADLINE}</h1>

      <div className="linkedin2-scene__footer">
        <span className="linkedin2-scene__footer-url">{LINKEDIN2_FOOTER_URL}</span>
      </div>
    </div>
  );
}
