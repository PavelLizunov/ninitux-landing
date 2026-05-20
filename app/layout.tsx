import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ninitux.com"),
  title: "ninitux.com ★ VPN Router — Virtual Penguin Network",
  description:
    "Process-based split-tunnel VPN router for Windows, macOS and Linux. Pick which apps go through the proxy — everything else stays direct.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFBEC",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
