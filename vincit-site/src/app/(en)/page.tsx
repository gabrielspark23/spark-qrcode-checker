import { HomeView } from "@/views/HomeView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("home", "en");

export default function Page() {
  return <HomeView locale="en" />;
}
