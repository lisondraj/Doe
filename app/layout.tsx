import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { RootChrome } from "@/components/RootChrome";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400"],
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
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  /** iOS Safari chrome / safe-area gutters beside Dynamic Island */
  themeColor: "#f7f6f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-doeforvc-always-phone="true">
      <body className={`${inter.variable} font-sans antialiased wide-desktop:overflow-hidden`}>
        <RootChrome loraClassName={lora.className} interClassName={inter.className}>
          {children}
        </RootChrome>
      </body>
    </html>
  );
}
