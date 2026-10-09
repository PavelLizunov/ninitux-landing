import { Home } from "@/components/home";
import { getLatestRelease } from "@/lib/github";

// Re-rendered on the server at most every 10 minutes, so the version and the
// download links follow new releases without a redeploy.
export const revalidate = 600;

export default async function Page() {
  return <Home release={await getLatestRelease()} />;
}
