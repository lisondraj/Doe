"use client";

import {
  IconApps,
  IconHome,
  IconMessages,
  IconPatients,
  IconSchedule,
  IconSun,
  PRODUCT_EMR_NAV,
} from "@/components/productemr/ProductEmrIcons";
import type { ProductEmrNavId } from "@/lib/productemr/types";

function NavIcon({ id, active }: { id: ProductEmrNavId; active: boolean }) {
  switch (id) {
    case "home":
      return <IconHome active={active} />;
    case "patients":
      return <IconPatients active={active} />;
    case "schedule":
      return <IconSchedule />;
    case "messages":
      return <IconMessages />;
  }
}

export function ProductEmrRail({
  expanded,
  activeNav,
  onToggleExpanded,
  onSelectNav,
  onCollapse,
}: {
  expanded: boolean;
  activeNav: ProductEmrNavId;
  onToggleExpanded: () => void;
  onSelectNav: (id: ProductEmrNavId) => void;
  onCollapse: () => void;
}) {
  return (
    <nav className="productemr-rail" aria-label="Main navigation">
      <div className="productemr-rail__inner">
        <button type="button" className="productemr-rail__mark" onClick={onToggleExpanded} aria-expanded={expanded}>
          <span className="productemr-rail__mark-d">D</span>
          <span className="productemr-rail__mark-label">Doe</span>
        </button>

        <div className="productemr-rail__nav">
          {PRODUCT_EMR_NAV.map((item) => {
            const navigable = item.id === "home" || item.id === "patients";
            return (
              <button
                key={item.id}
                type="button"
                className={`productemr-rail__btn${activeNav === item.id ? " productemr-rail__btn--active" : ""}`}
                aria-current={activeNav === item.id ? "page" : undefined}
                onClick={() => {
                  if (!navigable) return;
                  onSelectNav(item.id);
                  onCollapse();
                }}
              >
                <NavIcon id={item.id} active={activeNav === item.id} />
                <span className="productemr-rail__btn-label">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="productemr-rail__footer">
          <div className="productemr-rail__clinic">
            <button type="button" className="productemr-rail__clinic-item productemr-rail__clinic-item--active">
              Westfield
            </button>
            <button type="button" className="productemr-rail__clinic-item">
              Riverside
            </button>
            <button type="button" className="productemr-rail__clinic-item">
              Oak Park
            </button>
          </div>
          <div className="productemr-rail__signed-in">
            <span>Signed in</span>
            <span>Dr. Claire Roberts</span>
          </div>
          <button type="button" className="productemr-rail__util" onClick={onToggleExpanded} aria-label="Apps">
            <IconApps />
          </button>
          <button type="button" className="productemr-rail__util" aria-label="Theme">
            <IconSun />
          </button>
        </div>
      </div>
    </nav>
  );
}
