import { AboutView } from "@/views/AboutView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("about", "en");

export default function Page() {
  return <AboutView locale="en" />;
}
