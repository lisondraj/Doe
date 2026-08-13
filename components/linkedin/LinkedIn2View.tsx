"use client";

import { LinkedIn2ProtoScene } from "@/components/linkedin/LinkedIn2ProtoScene";
import "@/lib/linkedin/linkedin2-page.css";

/** LinkedIn banner frame — 1200×627 Proto sandbox mock, dark brown + gold. */
export function LinkedIn2View() {
  return (
    <main className="linkedin2-page">
      <div className="linkedin2-page__frame">
        <LinkedIn2ProtoScene />
      </div>
    </main>
  );
}
