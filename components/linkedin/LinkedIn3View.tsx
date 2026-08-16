"use client";

import { LinkedIn2BlockGrid } from "@/components/linkedin/LinkedIn2BlockGrid";
import { LinkedIn2ModelDropdown } from "@/components/linkedin/LinkedIn2ModelDropdown";
import { LinkedIn3Caption } from "@/components/linkedin/LinkedIn3Caption";
import { LINKEDIN2_BG } from "@/lib/linkedin/linkedin2-colors";
import "@/lib/linkedin/linkedin3-page.css";

/** LinkedIn banner frame — duplicate of /linkedin2 with Doe Intelligence Inc. copy. */
export function LinkedIn3View() {
  return (
    <main className="linkedin2-page linkedin3-page">
      <div className="linkedin2-page__frame" style={{ backgroundColor: LINKEDIN2_BG }}>
        <LinkedIn2BlockGrid />
        <LinkedIn3Caption />
        <div className="linkedin2-model-picker-rail" aria-hidden>
          <LinkedIn2ModelDropdown />
        </div>
      </div>
    </main>
  );
}
