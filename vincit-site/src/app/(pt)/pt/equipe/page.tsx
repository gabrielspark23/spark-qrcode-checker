import { TeamView } from "@/views/TeamView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("team", "pt");

export default function Page() {
  return <TeamView locale="pt" />;
}
