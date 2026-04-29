import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LenisProvider } from "@/components/ui/LenisProvider";
import { ServiceWorkerRegister } from "@/components/ui/ServiceWorkerRegister";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Geist Sans — Vercel's typeface, the closest free analogue to Apple
// SF Pro Display. Same x-height proportions, same low-contrast strokes.
// Loaded with the variable axis so we can use weights 300–900 in CSS.
const display = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alialibrahimi.com"),
  title: {
    default: "Ali Alibrahimi",
    template: "%s · Ali Alibrahimi",
  },
  description:
    "Software designer and engineer. End-to-end builder of products and the systems that hold them up.",
  authors: [{ name: "Ali Alibrahimi" }],
  creator: "Ali Alibrahimi",
  openGraph: {
    type: "website",
    title: "Ali Alibrahimi",
    description:
      "Software designer and engineer. End-to-end builder of products and the systems that hold them up.",
    siteName: "Ali Alibrahimi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Alibrahimi",
    description:
      "Software designer and engineer. End-to-end builder of products and the systems that hold them up.",
  },
  robots: { index: true, follow: true },
  // PWA — these tags are what makes iOS treat the site as an
  // installable app when added to the home screen. Apple ignores
  // the standard PWA manifest and requires its own meta dialect.
  appleWebApp: {
    capable: true,
    title: "Ali",
    statusBarStyle: "black-translucent",
  },
  applicationName: "Ali Alibrahimi",
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // viewport-fit=cover is what makes iOS PWAs draw under the
  // notch + home indicator so the standalone app feels native.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <LenisProvider>
          <Nav />
          {children}
          <Footer />
        </LenisProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
