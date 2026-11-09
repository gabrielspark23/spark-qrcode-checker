import { WhoWeServeView } from "@/views/WhoWeServeView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("whoWeServe", "pt");

export default function Page() {
  return <WhoWeServeView locale="pt" />;
}
