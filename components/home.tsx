import { Benefits } from "@/components/sections/benefits";
import { Download } from "@/components/sections/download";
import { Faq } from "@/components/sections/faq";
import { GuideSection } from "@/components/sections/guide";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import type { Release } from "@/lib/github";

/** The whole page below the top bar, given the latest release. */
export function Home({ release }: { release: Release }) {
  return (
    <>
      <Hero release={release} />
      <Download release={release} />
      <GuideSection />
      <Benefits />
      <Faq />
      <Trust />
    </>
  );
}
