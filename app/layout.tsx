import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BootScript } from "@/components/boot-script";
import { Marquee } from "@/components/layout/marquee";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";

// Self-hosted by next/font at build time, no runtime CDN. All three have a
// Cyrillic subset, which the Russian text needs.
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-mono-loaded",
  display: "swap",
});

const TITLE = "VPNRouter: VPN только для нужных приложений";
const DESCRIPTION =
  "Бесплатное приложение с открытым кодом: через VPN идут только выбранные программы, остальное работает напрямую. Windows, macOS, Linux, Android. A free open-source split-tunnel VPN app: only the apps you choose use the VPN.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ninitux.com"),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "VPNRouter",
  authors: [{ name: "Pavel Lizunov", url: "https://github.com/PavelLizunov" }],
  keywords: [
    "VPNRouter",
    "VPN для отдельных приложений",
    "раздельное туннелирование",
    "split tunnel VPN",
    "vless",
    "sing-box",
    "open source VPN client",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ninitux.com",
    title: TITLE,
    description:
      "Через VPN идут только выбранные программы, остальное работает напрямую. Бесплатно, открытый код.",
    url: "https://ninitux.com",
    locale: "ru_RU",
    alternateLocale: ["en_US"],
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "VPNRouter" }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description:
      "Через VPN идут только выбранные программы, остальное работает напрямую. Бесплатно, открытый код.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-32-dark.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFBEC",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fontVars = `${unbounded.variable} ${manrope.variable} ${jetbrainsMono.variable}`;

  return (
    // The boot script rewrites lang, data-lang, data-os and data-ostab before
    // hydration, hence suppressHydrationWarning.
    <html lang="ru" data-lang="ru" suppressHydrationWarning className={fontVars}>
      <head>
        <BootScript />
      </head>
      <body>
        <a className="skip-link" href="#main">
          К содержанию / Skip to content
        </a>
        <Marquee />
        <Topbar />
        <div className="wrap">
          <main id="main">{children}</main>
          <Footer />
        </div>
        {/* Umami analytics: self-hosted, no cookies, no third parties. */}
        <Script
          src="https://analytics.ninitux.com/script.js"
          data-website-id="7bbe4baf-47b2-4683-b3f4-dd9c1b734909"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
