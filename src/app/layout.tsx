import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Bangers, Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import Loader from "@/components/layout/Loader";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-comic",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = "https://mcu-universe.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MCU Universe — Кинематографическая вселенная Marvel",
    template: "%s | MCU Universe",
  },
  description:
    "Полный интерактивный портал по Кинематографической вселенной Marvel: таймлайн фаз, герои, злодеи, камни бесконечности, мультивселенная и карта миров в 3D.",
  keywords: [
    "Marvel",
    "MCU",
    "Кинематографическая вселенная Marvel",
    "Мстители",
    "Тор",
    "Железный человек",
    "Танос",
    "Камни бесконечности",
    "Мультивселенная",
  ],
  authors: [{ name: "MCU Universe" }],
  openGraph: {
    title: "MCU Universe — Кинематографическая вселенная Marvel",
    description:
      "Погрузись в цифровую вселенную Marvel: 3D-таймлайн, герои, злодеи, камни бесконечности и мультивселенная.",
    url: siteUrl,
    siteName: "MCU Universe",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCU Universe — Кинематографическая вселенная Marvel",
    description: "Интерактивный 3D-портал по вселенной Marvel.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${bebas.variable} ${bangers.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <Loader />
        <SmoothScrollProvider />
        <CustomCursor />
        <div className="fixed inset-0 -z-10 bg-marvel-black bg-grid-pattern bg-[size:48px_48px]" />
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
