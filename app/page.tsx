import { Hero } from "@/components/sections/hero";
import { Install } from "@/components/sections/install";
import { Features } from "@/components/sections/features";
import { How } from "@/components/sections/how";
import { Screenshots } from "@/components/sections/screenshots";
import { Comparison } from "@/components/sections/comparison";
import { Telemetry } from "@/components/sections/telemetry";
import { FAQ } from "@/components/sections/faq";
import { Roadmap } from "@/components/sections/roadmap";
import { Services } from "@/components/sections/services";
import { Support } from "@/components/sections/support";

export default function Home() {
  return (
    <>
      <Hero />
      <Install />
      <Features />
      <How />
      <Screenshots />
      <Comparison />
      <Telemetry />
      <FAQ />
      <Roadmap />
      <Services />
      <Support />
    </>
  );
}
