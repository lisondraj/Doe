import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootChrome } from "@/components/RootChrome";
import { designersTouchPhoneBootstrapScript } from "@/lib/designers/designers-touch-phone-bootstrap-script";
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
  themeColor: "#f7f6f3",
};

const designersTouchBootstrap = designersTouchPhoneBootstrapScript(DESIGNERS_SITE_HOST);
const homeBootstrap = homeRouteBootstrapScript();

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
      </head>
      <body className={`${inter.variable} font-sans antialiased wide-desktop:overflow-hidden`}>
        <RootChrome>{children}</RootChrome>
      </body>
    </html>
  );
}
