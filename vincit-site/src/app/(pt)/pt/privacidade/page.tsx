import { LegalView } from "@/views/LegalView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("privacy", "pt");

export default function Page() {
  return <LegalView locale="pt" kind="privacy" />;
}
