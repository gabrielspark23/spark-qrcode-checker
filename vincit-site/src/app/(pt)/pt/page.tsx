import { HomeView } from "@/views/HomeView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("home", "pt");

export default function Page() {
  return <HomeView locale="pt" />;
}
