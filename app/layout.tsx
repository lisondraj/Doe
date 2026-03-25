import type { Metadata, Viewport } from "next";
import { Inter, Lora, Roboto } from "next/font/google";
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

const roboto = Roboto({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
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
          className={`${roboto.className} pointer-events-auto fixed bottom-4 right-4 z-[100] text-sm font-medium tracking-[0.1em] text-white/85 antialiased transition-colors hover:text-white max-[480px]:bottom-3 max-[480px]:right-3 max-[480px]:text-[13px]`}
        >
          Inquisara
        </a>
      </body>
    </html>
  );
}
