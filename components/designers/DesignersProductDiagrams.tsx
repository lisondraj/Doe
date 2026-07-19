import { DESIGNERS_PRODUCT_VOICE_FEATURES } from "@/lib/designers/designers-product-copy";
import { suisseIntl } from "@/lib/home/fonts";

/** Voice agent capability grid. */
export function DesignersProductVoiceFeaturesDiagram() {
  return (
    <div className={`designers-product-voice-features ${suisseIntl.className}`} aria-hidden>
      <ul className="designers-product-voice-features__grid">
        {DESIGNERS_PRODUCT_VOICE_FEATURES.map((entry) => (
          <li key={entry.label} className="designers-product-voice-features__card">
            <span className="designers-product-voice-features__label">{entry.label}</span>
            <span className="designers-product-voice-features__note">{entry.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
