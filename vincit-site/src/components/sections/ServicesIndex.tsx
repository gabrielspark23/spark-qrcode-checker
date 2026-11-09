"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Índice lateral fixo da página de Serviços: acompanha a leitura (scroll-spy) e leva à âncora. */
export function ServicesIndex({ items, label }: { items: { id: string; title: string; brand: string }[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const update = () => {
      const mid = window.innerHeight * 0.4;
      let cur = items[0]?.id;
      els.forEach((e) => {
        if (e.getBoundingClientRect().top <= mid) cur = e.id;
      });
      setActive(cur);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [items]);

  return (
    <nav aria-label={label} className="sticky top-28">
      <p className="eyebrow mb-5 text-ink-3">{label}</p>
      <ol className="border-l border-line-soft">
        {items.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "location" : undefined}
              className={cn(
                "group relative -ml-px flex items-baseline gap-3 border-l-2 py-3 pl-5 transition-colors duration-150",
                active === s.id ? "border-brass text-ink" : "border-transparent text-ink-3 hover:text-ink",
              )}
            >
              <span className="text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-serif text-lg leading-snug">{s.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
