import { ContactView } from "@/views/ContactView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("contact", "en");

export default function Page() {
  return <ContactView locale="en" />;
}
