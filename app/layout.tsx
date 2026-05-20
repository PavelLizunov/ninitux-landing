import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/i18n/lang-provider";
import { Marquee } from "@/components/layout/marquee";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";

// Self-hosted by next/font at build time — no runtime CDN.
// Все три шрифта имеют кириллицу (важно для русского контента).
// Space Grotesk / Bricolage Grotesque / Space Mono — НЕ имеют кириллицы,
// поэтому в основе берём Unbounded (display) + Manrope (body) + JetBrains Mono.
const unbounded = Unbounded({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ninitux.com"),
  title: "ninitux.com ★ VPN Router — Virtual Penguin Network",
  description:
    "Process-based split-tunnel VPN router for Windows, macOS and Linux. Pick which apps go through the proxy — everything else stays direct.",
  applicationName: "ninitux.com",
  authors: [{ name: "Pavel Lizunov", url: "https://ninitux.com" }],
  keywords: [
    "vpn",
    "split-tunnel",
    "vless",
    "sing-box",
    "reality",
    "process-routing",
    "open source",
  ],
  openGraph: {
    type: "website",
    siteName: "ninitux.com",
    title: "ninitux.com ★ VPN Router",
    description:
      "Pick which apps go through the proxy. Everything else stays direct.",
    url: "https://ninitux.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "ninitux.com ★ VPN Router",
    description:
      "Pick which apps go through the proxy. Everything else stays direct.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      {
        url: "/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-32-dark.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFBEC",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = `${unbounded.variable} ${manrope.variable} ${jetbrainsMono.variable}`;

  return (
    <html lang="en" data-lang="en" suppressHydrationWarning className={fontVars}>
      <body>
        <LangProvider>
          {/* Marquee is full-width — rendered OUTSIDE .wrap so its black
              background stretches edge-to-edge. */}
          <Marquee />
          <div className="wrap">
            <Topbar />
            <main>{children}</main>
            <Footer />
          </div>
        </LangProvider>
        {/* Umami analytics — self-hosted, no cookies, no third parties. */}
        <Script
          src="https://analytics.ninitux.com/script.js"
          data-website-id="7bbe4baf-47b2-4683-b3f4-dd9c1b734909"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
