import { Hero } from "@/components/sections/hero";
import { Install } from "@/components/sections/install";
import { Features } from "@/components/sections/features";
import { How } from "@/components/sections/how";
import { Screenshots } from "@/components/sections/screenshots";
import { Telemetry } from "@/components/sections/telemetry";
import { FAQ } from "@/components/sections/faq";
import { Services } from "@/components/sections/services";
import { Support } from "@/components/sections/support";
import { getLatestRelease, getStarCount } from "@/lib/github";

// Force this page to be rendered at request time so the GitHub release data
// (with revalidate 10min) is fetched on the server. SSR'd HTML will carry the
// real direct-download URLs in href attributes — no race between user click
// and the now-removed client-side fetch.
export const revalidate = 600;

export default async function Home() {
  const [release, stars] = await Promise.all([
    getLatestRelease(),
    getStarCount(),
  ]);

  return (
    <>
      <Hero release={release} />
      <Install release={release} />
      {/* release is always non-null now (deterministic from redirect/fallback) */}
      <Features />
      <How />
      <Screenshots />
      <Telemetry />
      <FAQ />
      <Services />
      <Support stars={stars} />
    </>
  );
}
