import {
  DoeHomeIphoneStatTagline,
  DoeHomeProductWordmark,
} from "@/components/doehome/DoeHomeProductWordmark";
import { DOEHOME_IPHONE_GENOME_TAGLINE } from "@/lib/doehome/doehome-copy";
import { DOEHOME_GENOME_LANDING_IMAGE } from "@/lib/doehome/doehome-shaders";

/** Genome hero stat — gold mark, tagline, landing graphic (iPhone + desktop). */
export function DoeHomeGenomeStatBand({
  className,
  wordmarkAnchorStart = false,
}: {
  className?: string;
  wordmarkAnchorStart?: boolean;
}) {
  return (
    <div className={className} aria-label="Genome">
      <a
        className="doehome-stat-iphone-genome-link"
        href="#genome"
        aria-label={`Genome — ${DOEHOME_IPHONE_GENOME_TAGLINE.join(" ")}`}
      >
        <div className="doehome-stat-genome-copy">
          <DoeHomeProductWordmark product="genome" iphoneProductRow anchorStart={wordmarkAnchorStart} />
          <DoeHomeIphoneStatTagline label={DOEHOME_IPHONE_GENOME_TAGLINE} />
        </div>
        <div className="doehome-stat-iphone-genome-art" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DOEHOME_GENOME_LANDING_IMAGE}
            alt=""
            draggable={false}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </a>
    </div>
  );
}
