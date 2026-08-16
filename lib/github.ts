/**
 * VPNRouter release resolution — bulletproof against GitHub API rate limits.
 *
 * THE PROBLEM (recurring):
 *   Earlier versions hit `https://api.github.com/repos/.../releases/latest`.
 *   That endpoint rate-limits by IP at 60 req/h unauthenticated. Our entire
 *   homelab shares one egress IP (83.97.108.34 via the gost proxy), so the
 *   budget burns fast. When the API returned a 403 rate-limit body, the code
 *   fell through to a `releases/latest` *page* link — so the APK button (and
 *   version pill, and manual links) silently broke: clicking "Download .apk"
 *   opened the GitHub release page instead of downloading.
 *
 * THE FIX:
 *   Don't touch api.github.com for the critical path at all. Two facts make
 *   this possible — both are plain github.com HTTP redirects with NO API and
 *   NO rate limit:
 *
 *     1. GET https://github.com/{repo}/releases/latest
 *          -> 302 Location: .../releases/tag/<TAG>     (reveals the version)
 *
 *     2. GET https://github.com/{repo}/releases/latest/download/<FILENAME>
 *          -> 302 to the actual asset CDN URL          (direct download)
 *
 *   So we resolve the tag from redirect #1, then build every download URL
 *   deterministically from the tag + the known asset-name pattern. Asset
 *   sizes come from HEAD requests on those (non-API) download URLs.
 *
 *   Result: version + all download links are always correct and direct,
 *   even when api.github.com is fully throttled. Zero API dependency.
 *
 *   Star count is the ONE thing with no non-API source — it stays an
 *   optional API call with an honest fallback, and never blocks anything.
 */

const REPO = "PavelLizunov/VPNRouter";
const BASE = `https://github.com/${REPO}`;

export interface ReleaseAsset {
  name: string;
  size: number; // 0 if the size HEAD failed — callers must treat 0 as "unknown"
  browser_download_url: string;
}

export interface Release {
  tag_name: string;
  assets: ReleaseAsset[];
}

/**
 * Asset filename suffixes produced by the VPNRouter release CI. Each real
 * asset is named `VPNRouter-<tag>-<suffix>`. Kept in sync with the repo's
 * build workflows + README "Manual download" table.
 */
const ASSET_SUFFIXES = [
  "win.zip", // Windows full installer
  "mac.dmg", // macOS drag-install
  "mac.zip", // macOS raw .app
  "linux-amd64.deb", // Debian/Ubuntu
  "linux-x86_64.AppImage", // portable
  "linux.tar.gz", // raw tarball
  "android-arm64.apk", // Android sideload (the published APK is ARM64-only)
] as const;

/**
 * Last-known-good tag. Used only if the redirect resolution itself fails
 * (network down at render time). Guarantees we never emit a bare
 * `releases/latest` page link for a download. Bump on each review.
 */
const FALLBACK_TAG = "v2.49.3";

function buildAssets(tag: string): ReleaseAsset[] {
  return ASSET_SUFFIXES.map((suffix) => {
    const name = `VPNRouter-${tag}-${suffix}`;
    return {
      name,
      size: 0,
      browser_download_url: `${BASE}/releases/download/${tag}/${name}`,
    };
  });
}

/**
 * Resolve the latest tag via the github.com 302 redirect — NOT api.github.com.
 * No rate limit. Returns null only on a hard network error.
 */
async function resolveLatestTag(): Promise<string | null> {
  try {
    const r = await fetch(`${BASE}/releases/latest`, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "ninitux-landing" },
      next: { revalidate: 600 },
    });
    const loc = r.headers.get("location") ?? "";
    const m = loc.match(/\/releases\/tag\/(.+)$/);
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

/**
 * Best-effort asset size via HEAD on the (non-API) download URL. The CDN
 * sets Content-Length on the final asset response. Returns 0 on any failure
 * — callers render the link without a size rather than break.
 */
async function headSize(url: string): Promise<number> {
  try {
    const r = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "ninitux-landing" },
      next: { revalidate: 600 },
    });
    const len = r.headers.get("content-length");
    return len ? parseInt(len, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Latest release with direct download URLs for every platform. Never returns
 * a page-style link. Resolves entirely without api.github.com.
 */
export async function getLatestRelease(): Promise<Release> {
  const tag = (await resolveLatestTag()) ?? FALLBACK_TAG;
  const assets = buildAssets(tag);
  // Sizes are nice-to-have; fetch in parallel, never block the version/links.
  await Promise.all(
    assets.map(async (a) => {
      a.size = await headSize(a.browser_download_url);
    }),
  );
  return { tag_name: tag, assets };
}

/**
 * Star count — the only metric with no non-API source. Optional API call
 * (authenticated if GITHUB_TOKEN is set in the container env -> 5000 req/h),
 * honest fallback to the last-known real value. Never throws, never blocks.
 */
export async function getStarCount(): Promise<number | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const r = await fetch(`https://api.github.com/repos/${REPO}`, {
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "ninitux-landing",
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
