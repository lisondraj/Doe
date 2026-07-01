import type { Metadata, Viewport } from "next";

import { protoPageBootstrapScript } from "@/lib/proto/proto-layout";

import "./proto.css";

export const metadata: Metadata = {
  title: "Proto",
  description: "Proto — startup draft landing page",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#121819",
};

const protoBootstrap = protoPageBootstrapScript();

export default function ProtoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: protoBootstrap }} />
      {children}
    </>
  );
}
