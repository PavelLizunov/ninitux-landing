/**
 * Latest VPNRouter release, resolved without api.github.com.
 *
 * The API is rate-limited to 60 requests an hour per IP and the whole homelab
 * shares one address, so the page never depends on it for downloads. Two plain
 * github.com redirects are enough:
 *
 *   GET /releases/latest                 -> 302 .../releases/tag/<TAG>
 *   GET /releases/download/<TAG>/<FILE>  -> 302 to the file
 *
 * The tag comes from the first redirect and every download link is built from
 * the tag and the known file names. Sizes come from HEAD requests on those
 * links and are optional: a failed probe leaves the size at 0 and the page
 * shows the link without it.
 */

const REPO = "PavelLizunov/VPNRouter";
const BASE = `https://github.com/${REPO}`;

export const REPO_URL = BASE;
export const RELEASES_URL = `${BASE}/releases`;

/** Used only when github.com cannot be reached while the page is rendered. */
const FALLBACK_TAG = "v2.50.2";

/** File names published by the VPNRouter release workflows, by tag. */
const FILES = {
  winSetup: (tag: string) => `VPNRouter-Setup-${tag}.exe`,
  winZip: (tag: string) => `VPNRouter-${tag}-win.zip`,
  macDmg: (tag: string) => `VPNRouter-${tag}-mac.dmg`,
  macZip: (tag: string) => `VPNRouter-${tag}-mac.zip`,
  deb: (tag: string) => `VPNRouter-${tag}-linux-amd64.deb`,
  appImage: (tag: string) => `VPNRouter-${tag}-linux-x86_64.AppImage`,
  tarGz: (tag: string) => `VPNRouter-${tag}-linux.tar.gz`,
  apk: (tag: string) => `VPNRouter-${tag}-android-arm64.apk`,
} as const;

export type AssetKey = keyof typeof FILES;

export interface ReleaseAsset {
  name: string;
  url: string;
  /** Bytes; 0 means the size is unknown. */
  size: number;
}

export interface Release {
  tag: string;
  /** The tag without the leading "v". */
  version: string;
  assets: Record<AssetKey, ReleaseAsset>;
}

async function resolveLatestTag(): Promise<string | null> {
  try {
    const response = await fetch(`${BASE}/releases/latest`, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "ninitux-landing" },
      next: { revalidate: 600 },
    });
    const location = response.headers.get("location") ?? "";
    const match = location.match(/\/releases\/tag\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

async function headSize(url: string): Promise<number> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": "ninitux-landing" },
      next: { revalidate: 600 },
    });
    const length = response.headers.get("content-length");
    return response.ok && length ? parseInt(length, 10) : 0;
  } catch {
    return 0;
  }
}

export function buildRelease(tag: string): Release {
  const assets = {} as Record<AssetKey, ReleaseAsset>;
  for (const key of Object.keys(FILES) as AssetKey[]) {
    const name = FILES[key](tag);
    assets[key] = { name, url: `${BASE}/releases/download/${tag}/${name}`, size: 0 };
  }
  return { tag, version: tag.replace(/^v/, ""), assets };
}

export async function getLatestRelease(): Promise<Release> {
  const release = buildRelease((await resolveLatestTag()) ?? FALLBACK_TAG);
  await Promise.all(
    Object.values(release.assets).map(async (asset) => {
      asset.size = await headSize(asset.url);
    }),
  );
  return release;
}

/** "52 MB"; empty when the size is unknown. */
export function formatSize(bytes: number, lang: "ru" | "en"): string {
  if (!bytes) return "";
  const megabytes = Math.max(1, Math.round(bytes / (1024 * 1024)));
  return lang === "ru" ? `${megabytes} МБ` : `${megabytes} MB`;
}
