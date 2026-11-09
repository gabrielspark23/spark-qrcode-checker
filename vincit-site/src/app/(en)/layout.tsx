import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Shell } from "@/components/layout/Shell";
import { baseMeta } from "@/lib/meta";

export const metadata: Metadata = baseMeta("en");
export const viewport: Viewport = { themeColor: "#16181d" };

export default function EnLayout({ children }: { children: ReactNode }) {
  return <Shell locale="en">{children}</Shell>;
}
