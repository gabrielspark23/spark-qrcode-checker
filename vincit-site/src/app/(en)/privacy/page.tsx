import { PrivacyView } from "@/views/PrivacyView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("privacy", "en");

export default function Page() {
  return <PrivacyView locale="en" />;
}
