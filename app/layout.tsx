import { DOE_PAGE_SURFACE } from "@/lib/home/doe-page-colors";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootChrome } from "@/components/RootChrome";
import { aboutRouteBootstrapScript } from "@/lib/about/about-route-bootstrap-script";
import { doeHealthLandingTouchBootstrapScript } from "@/lib/doehealth/doehealth-landing-bootstrap-script";
import { homeRouteBootstrapScript } from "@/lib/home/home-route-bootstrap-script";
import { DESIGNERS_SITE_HOST } from "@/lib/site-domains";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Doe AI",
  description: "Doe marketing and app prototypes",
  icons: {
    icon: "/images/Favicon.png",
    apple: "/images/Favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  /** iOS Safari chrome / safe-area gutters beside Dynamic Island */
  themeColor: DOE_PAGE_SURFACE,
};

const designersTouchBootstrap = doeHealthLandingTouchBootstrapScript(DESIGNERS_SITE_HOST);
const homeBootstrap = homeRouteBootstrapScript();
const aboutBootstrap = aboutRouteBootstrapScript();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-doeforvc-always-phone="true">
      <head>
        <script dangerouslySetInnerHTML={{ __html: designersTouchBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: homeBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: aboutBootstrap }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased wide-desktop:overflow-hidden`}>
        <RootChrome>{children}</RootChrome>
      </body>
    </html>
  );
}
