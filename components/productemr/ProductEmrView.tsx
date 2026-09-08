"use client";

import { useCallback, useState } from "react";

import { ProductEmrCanvasScaler } from "@/components/productemr/ProductEmrCanvasScaler";
import { ProductEmrChartInteractive } from "@/components/productemr/ProductEmrChartInteractive";
import { ProductEmrDashboard } from "@/components/productemr/ProductEmrDashboard";
import { ProductEmrPatients } from "@/components/productemr/ProductEmrPatients";
import { ProductEmrRail } from "@/components/productemr/ProductEmrRail";
import { inter, lora } from "@/lib/home/fonts";
import type {
  ProductEmrChartTab,
  ProductEmrNavId,
  ProductEmrRoute,
} from "@/lib/productemr/types";
import "@/lib/productemr/productemr.css";

export function ProductEmrView() {
  const [route, setRoute] = useState<ProductEmrRoute>("dashboard");
  const [navExpanded, setNavExpanded] = useState(false);
  const [activeNav, setActiveNav] = useState<ProductEmrNavId>("home");
  const [chartTab, setChartTab] = useState<ProductEmrChartTab>("prep");
  const [chatOpen, setChatOpen] = useState(false);
  const [a1cOpen, setA1cOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const openElenaChart = useCallback(() => {
    setRoute("chart");
    setActiveNav("patients");
    setChartTab("prep");
    setChatOpen(false);
    setA1cOpen(false);
    setNoteOpen(false);
    setNavExpanded(false);
  }, []);

  const handleSelectNav = useCallback((id: ProductEmrNavId) => {
    setActiveNav(id);
    if (id === "home") {
      setRoute("dashboard");
      setChatOpen(false);
      setA1cOpen(false);
    } else if (id === "patients") {
      setRoute("patients");
      setChatOpen(false);
      setA1cOpen(false);
    }
  }, []);

  return (
    <main
      className={`productemr ${inter.className} ${lora.variable}`}
      data-route={route}
      data-nav-expanded={navExpanded ? "true" : "false"}
      data-chart-tab={chartTab}
      data-chat-open={chatOpen ? "true" : "false"}
      data-a1c-open={a1cOpen ? "true" : "false"}
      data-note-open={noteOpen ? "true" : "false"}
    >
      <ProductEmrCanvasScaler>
        <ProductEmrRail
          expanded={navExpanded}
          activeNav={activeNav}
          onToggleExpanded={() => setNavExpanded((v) => !v)}
          onSelectNav={handleSelectNav}
          onCollapse={() => setNavExpanded(false)}
        />

        <button
          type="button"
          className="productemr-nav-dim"
          aria-label="Collapse navigation"
          onClick={() => setNavExpanded(false)}
        />

        <div className="productemr-gutter">
          <div className={`productemr-page${route === "dashboard" ? "" : " productemr-route--hidden"}`}>
            <ProductEmrDashboard onOpenElena={openElenaChart} />
          </div>
          <div className={`productemr-page productemr-page--patients${route === "patients" ? "" : " productemr-route--hidden"}`}>
            <ProductEmrPatients onOpenElena={openElenaChart} />
          </div>
          <div className={`productemr-page productemr-page--chart${route === "chart" ? "" : " productemr-route--hidden"}`}>
            <ProductEmrChartInteractive
              chartTab={chartTab}
              noteOpen={noteOpen}
              onChartTabChange={setChartTab}
              onChatOpenChange={setChatOpen}
              onA1cOpenChange={setA1cOpen}
              onNoteOpenChange={setNoteOpen}
            />
          </div>
        </div>
      </ProductEmrCanvasScaler>
    </main>
  );
}
