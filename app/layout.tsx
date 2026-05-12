import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DoeDev",
  description: "Doe marketing and app prototypes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F6F3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-layout="desktop">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script
          id="doeforvc-layout-detect"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var fm=sessionStorage.getItem("doeforvc-force-mobile")==="1";var fd=sessionStorage.getItem("doeforvc-force-desktop")==="1";var p=/iPhone/.test(navigator.userAgent||"");var m=window.matchMedia("(max-width: 480px), ((max-height: 500px) and (min-width: 500px) and (pointer: coarse))").matches;var natural=p||m;var isPhone=fm||(!fd&&natural);document.documentElement.setAttribute("data-layout",isPhone?"phone":"desktop");}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
