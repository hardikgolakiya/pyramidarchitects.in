import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import SiteNav from "@/components/layout/SiteNav";
import Preloader from "@/components/layout/Preloader";
import ContactOverlay from "@/components/layout/ContactOverlay";

const sans = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-familjen-grotesk", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pyramidarchitects-in.vercel.app"),
  title: "Pyramid Architects | Architecture, interiors and civil works, Surat",
  description: "Pyramid is an architecture and design research studio in Surat, Gujarat, led by Hardik Golakiya and Tejas Dabhi.",
  robots: { index: false, follow: false }, // TODO: enable at launch
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: { title: "Pyramid Architects", description: "Architecture, interiors and civil works from Surat, Gujarat.", images: ["/brand/og-image.jpg"], type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#EDE6D6" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>
          <Preloader />
          <SiteNav />
          {children}
          <ContactOverlay />
        </Providers>
      </body>
    </html>
  );
}
