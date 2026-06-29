import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { RootChrome } from "@/components/RootChrome";
import { isDesignersRequest } from "@/lib/site-domains";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const dynamic = "force-dynamic";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const designersSite = isDesignersRequest(headers());

  return (
    <html
      lang="en"
      data-doeforvc-always-phone="true"
      data-doe-designers-site={designersSite ? "true" : undefined}
    >
      <body className={`${inter.variable} font-sans antialiased wide-desktop:overflow-hidden`}>
        <RootChrome>{children}</RootChrome>
      </body>
    </html>
  );
}
