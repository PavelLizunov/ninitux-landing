import { Hero } from "@/components/sections/hero";
import { Install } from "@/components/sections/install";
import { Features } from "@/components/sections/features";
import { How } from "@/components/sections/how";
import { Screenshots } from "@/components/sections/screenshots";
import { Telemetry } from "@/components/sections/telemetry";
import { FAQ } from "@/components/sections/faq";
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
      <Telemetry />
      <FAQ />
      <Services />
      <Support />
    </>
  );
}
