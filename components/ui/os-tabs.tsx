"use client";

import { useHtmlAttr } from "@/components/ui/use-html-attr";

export type Os = "win" | "mac" | "linux" | "android";

const TABS: { os: Os; label: string }[] = [
  { os: "win", label: "Windows" },
  { os: "mac", label: "macOS" },
  { os: "linux", label: "Linux" },
  { os: "android", label: "Android" },
];

/**
 * Operating system tabs of the download section. The chosen tab lives in
 * <html data-ostab> (set first by the boot script from the visitor's system);
 * globals.css shows the matching [data-os-panel].
 */
export function OsTabs() {
  const active = useHtmlAttr("data-ostab", "win");

  return (
    <div className="os-tabs" role="tablist" aria-label="Операционная система / Operating system">
      {TABS.map((tab) => (
        <button
          type="button"
          role="tab"
          key={tab.os}
          id={`os-tab-${tab.os}`}
          data-os-tab={tab.os}
          aria-selected={active === tab.os}
          aria-controls={`os-panel-${tab.os}`}
          data-umami-event={`os-tab-${tab.os}`}
          onClick={() => document.documentElement.setAttribute("data-ostab", tab.os)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** A link that switches the download section to one system and scrolls to it. */
export function OsLink({ os, children }: { os: Os; children: React.ReactNode }) {
  return (
    <a href="#download" onClick={() => document.documentElement.setAttribute("data-ostab", os)}>
      {children}
    </a>
  );
}
