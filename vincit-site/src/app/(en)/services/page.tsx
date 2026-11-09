import { ServicesView } from "@/views/ServicesView";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("services", "en");

export default function Page() {
  return <ServicesView locale="en" />;
}
