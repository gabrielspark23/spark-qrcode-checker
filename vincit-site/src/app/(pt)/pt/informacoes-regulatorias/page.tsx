import { LegalView } from "@/views/LegalView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("disclosures", "pt");

export default function Page() {
  return <LegalView locale="pt" kind="disclosures" />;
}
