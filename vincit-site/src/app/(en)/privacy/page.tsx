import { LegalView } from "@/views/LegalView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("privacy", "en");

export default function Page() {
  return <LegalView locale="en" kind="privacy" />;
}
