/**
 * Server-side fetch of the latest VPNRouter release.
 *
 * Why server-side: client-side fetch from /api.github.com leaves the SSR HTML
 * with placeholder/fallback links. If a user clicked the APK button before
 * the client fetch finished (or if api.github.com rate-limited the browser's
 * IP), the anchor's href was still `releases/latest` (the HTML page) instead
 * of the direct .apk download URL — so the click navigated to GitHub instead
 * of starting a download.
 *
 * Cached for 10 min on the server (next: revalidate). One fetch serves all
 * page views in that window.
 */

export interface ReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

export interface Release {
  tag_name: string;
  assets: ReleaseAsset[];
  stargazers_count?: number;
}

const REPO = "PavelLizunov/VPNRouter";

export async function getLatestRelease(): Promise<Release | null> {
  try {
    const r = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      { next: { revalidate: 600 } },
    );
    if (!r.ok) return null;
    return (await r.json()) as Release;
  } catch {
    return null;
  }
}

export async function getStarCount(): Promise<number | null> {
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}`, {
      next: { revalidate: 1800 },
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}
