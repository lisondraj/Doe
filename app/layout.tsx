import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Doe",
  description: "Doe",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className={`${lora.className} antialiased`}>
        {children}
        <a
          href="https://inquisara.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto fixed bottom-5 right-5 z-[100] font-ui text-[12px] font-normal leading-none tracking-[0.06em] text-white/80 antialiased transition-colors hover:text-white sm:bottom-6 sm:right-6 sm:text-[13px] max-[480px]:bottom-4 max-[480px]:right-4 max-[480px]:text-[11px]"
        >
          Inquisara
        </a>
      </body>
    </html>
  );
}
