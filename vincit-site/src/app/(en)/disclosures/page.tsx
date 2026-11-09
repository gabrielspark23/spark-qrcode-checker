import { LegalView } from "@/views/LegalView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("disclosures", "en");

export default function Page() {
  return <LegalView locale="en" kind="disclosures" />;
}
