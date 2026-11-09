import { AboutView } from "@/views/AboutView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("about", "pt");

export default function Page() {
  return <AboutView locale="pt" />;
}
