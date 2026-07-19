import type { Metadata } from "next";
import Script from "next/script";

import { doeHealthLandingPageBootstrapScript } from "@/lib/doehealth/doehealth-landing-bootstrap-script";

import "@/lib/designers/designers-phone-canvas.css";

export const doeHealthLandingMetadata: Metadata = {
  title: "Doe AI",
};

const landingBootstrap = doeHealthLandingPageBootstrapScript();

export function DoeHealthLandingRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script
        id="doehealth-landing-bootstrap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: landingBootstrap }}
      />
      {children}
    </>
  );
}
