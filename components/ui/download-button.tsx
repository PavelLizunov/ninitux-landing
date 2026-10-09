"use client";

import type { Os } from "@/components/ui/os-tabs";

/**
 * The big download button. The link starts the download; the click also opens
 * the install steps for that system, so the visitor sees what to do with the
 * file while it downloads.
 */
export function DownloadButton({
  href,
  os,
  event,
  scroll = true,
  children,
}: {
  href: string;
  os: Os;
  event: string;
  /** Scroll to the install steps after the click (off inside the steps themselves). */
  scroll?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      className="btn btn-primary btn-big"
      href={href}
      data-umami-event={event}
      onClick={() => {
        const root = document.documentElement;
        root.setAttribute("data-ostab", os);
        root.setAttribute("data-downloading", os);
        if (scroll) {
          setTimeout(() => {
            document.getElementById("download")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 400);
        }
      }}
    >
      <svg className="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" />
      </svg>
      <span>{children}</span>
    </a>
  );
}
