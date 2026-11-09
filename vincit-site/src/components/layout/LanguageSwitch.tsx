"use client";

import { usePathname } from "next/navigation";
import { alternatePath, localeFromPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** EN | PT — mantém a página e a âncora (de /services#tax para /pt/servicos#tax). */
export function LanguageSwitch({ label, className, onDark = true }: { label: string; className?: string; onDark?: boolean }) {
  const pathname = usePathname() ?? "/";
  const current = localeFromPath(pathname);

  function go(target: Locale, e: React.MouseEvent<HTMLAnchorElement>) {
    if (target === current) {
      e.preventDefault();
      return;
    }
    // Âncora só existe no cliente: acrescenta no clique.
    if (window.location.hash) {
      e.preventDefault();
      window.location.assign(alternatePath(pathname, target) + window.location.hash);
    }
  }

  return (
    <nav aria-label={label} className={cn("flex items-center text-[0.8125rem] font-semibold tracking-[0.08em]", className)}>
      {(["en", "pt"] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 ? <span className={cn("mx-1.5", onDark ? "text-on-dark-3" : "text-line-rule")} aria-hidden>|</span> : null}
          <a
            href={alternatePath(pathname, l)}
            hrefLang={l === "pt" ? "pt-BR" : "en"}
            lang={l === "pt" ? "pt-BR" : "en"}
            aria-current={l === current ? "true" : undefined}
            data-event={l === current ? undefined : "lang_switch"}
            onClick={(e) => go(l, e)}
            className={cn(
              "rounded-[2px] px-1 py-1 transition-colors duration-150",
              l === current
                ? onDark ? "text-on-dark" : "text-ink"
                : onDark ? "text-on-dark-3 hover:text-on-dark" : "text-ink-3 hover:text-ink",
            )}
          >
            {l.toUpperCase()}
          </a>
        </span>
      ))}
    </nav>
  );
}
