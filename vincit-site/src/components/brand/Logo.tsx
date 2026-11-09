import { BrandMark } from "./BrandMark";
import { cn } from "@/lib/cn";

/** Logo horizontal: escudo + wordmark. `onDark` = versão clara (sobre grafite). */
export function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BrandMark className="h-9 w-9" tone={onDark ? "brass" : "ink"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-[1.375rem] tracking-[0.18em]",
            onDark ? "text-on-dark" : "text-ink",
          )}
        >
          VINCIT
        </span>
        <span
          className={cn(
            "mt-1 text-[0.625rem] font-semibold tracking-[0.42em]",
            onDark ? "text-brass" : "text-ink-2",
          )}
        >
          CAPITAL
        </span>
      </span>
    </span>
  );
}
