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
          className="pointer-events-auto fixed bottom-4 right-4 z-[100] font-ui text-[11px] font-extralight tracking-[0.12em] text-white/80 antialiased transition-colors hover:text-white max-[480px]:bottom-3 max-[480px]:right-3 max-[480px]:text-[10px]"
        >
          Inquisara
        </a>
      </body>
    </html>
  );
}
