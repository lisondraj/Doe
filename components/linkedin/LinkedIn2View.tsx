"use client";

import { LinkedIn2BlockGrid } from "@/components/linkedin/LinkedIn2BlockGrid";
import { LinkedIn2Caption } from "@/components/linkedin/LinkedIn2Caption";
import { LinkedIn2ModelDropdown } from "@/components/linkedin/LinkedIn2ModelDropdown";
import { LINKEDIN2_BG } from "@/lib/linkedin/linkedin2-colors";
import "@/lib/linkedin/linkedin2-page.css";

/** LinkedIn banner frame — 1200×627, brown-tinted canvas with 3D block grid. */
export function LinkedIn2View() {
  return (
    <main className="linkedin2-page">
      <div className="linkedin2-page__frame" style={{ backgroundColor: LINKEDIN2_BG }}>
        <LinkedIn2BlockGrid />
        <LinkedIn2Caption />
        <div className="linkedin2-model-picker-rail" aria-hidden>
          <LinkedIn2ModelDropdown />
        </div>
      </div>
    </main>
  );
}
