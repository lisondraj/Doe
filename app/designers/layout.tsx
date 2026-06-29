import type { Metadata } from "next";
import Script from "next/script";

import { designersPageBootstrapScript } from "@/lib/designers/designers-touch-phone-bootstrap-script";

import "@/lib/designers/designers-phone-canvas.css";

export const metadata: Metadata = {
  title: "Doe AI",
};

const designersBootstrap = designersPageBootstrapScript();

export default function DesignersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script
        id="designers-page-bootstrap"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: designersBootstrap }}
      />
      {children}
    </>
  );
}
