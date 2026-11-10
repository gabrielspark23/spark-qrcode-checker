import { PrivacyView } from "@/views/PrivacyView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("privacy", "pt");

export default function Page() {
  return <PrivacyView locale="pt" />;
}
