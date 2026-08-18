import { DOE_PAGE_SURFACE } from "@/lib/home/doe-page-colors";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootChrome } from "@/components/RootChrome";
import { aboutRouteBootstrapScript } from "@/lib/about/about-route-bootstrap-script";
import { doeHealthLandingTouchBootstrapScript } from "@/lib/doehealth/doehealth-landing-bootstrap-script";
import { homeRouteBootstrapScript } from "@/lib/home/home-route-bootstrap-script";
import { premedRouteBootstrapScript } from "@/lib/premed/premed-route-bootstrap-script";
import { doeHomeRouteBootstrapScript } from "@/lib/doehome/doehome-route-bootstrap-script";
import { doeInsureRouteBootstrapScript } from "@/lib/doeinsure/doeinsure-route-bootstrap-script";
import { productRouteBootstrapScript } from "@/lib/product/product-route-bootstrap-script";
import { storyRouteBootstrapScript } from "@/lib/story/story-route-bootstrap-script";
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

const premedBootstrap = premedRouteBootstrapScript();
const aboutBootstrap = aboutRouteBootstrapScript();
const designersTouchBootstrap = doeHealthLandingTouchBootstrapScript(DESIGNERS_SITE_HOST);
const homeBootstrap = homeRouteBootstrapScript();
const productBootstrap = productRouteBootstrapScript();
const storyBootstrap = storyRouteBootstrapScript();
const doeInsureBootstrap = doeInsureRouteBootstrapScript();
const doeHomeBootstrap = doeHomeRouteBootstrapScript();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-doeforvc-always-phone="true" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: premedBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: aboutBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: designersTouchBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: homeBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: productBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: storyBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: doeInsureBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: doeHomeBootstrap }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased wide-desktop:overflow-hidden`}>
        <RootChrome>{children}</RootChrome>
      </body>
    </html>
  );
}
