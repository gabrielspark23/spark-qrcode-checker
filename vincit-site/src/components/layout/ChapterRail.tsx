"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Índice de capítulos da Home (≥ 1440 px): dá estrutura à narrativa e permite saltar entre
 * capítulos. Aparece depois do herói; o capítulo atual ganha o entalhe em V da marca.
 * `mix-blend-mode: difference` inverte a cor sobre seções claras e grafite.
 */
export function ChapterRail({ chapters, label }: { chapters: { id: string; label: string }[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id)?.closest("section"))
      .filter((s): s is HTMLElement => !!s);
    const update = () => {
      const mid = window.innerHeight * 0.45;
      let current: string | null = null;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= mid) current = chapters[i].id;
      });
      setActive(current);
      setShown(window.scrollY > window.innerHeight * 0.6);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [chapters]);

  const go = (id: string) => {
    const s = document.getElementById(id)?.closest("section");
    if (!s) return;
    window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 72, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <nav aria-label={label} className={cn("chapter-rail", shown && "is-shown")}>
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <button type="button" onClick={() => go(c.id)} aria-current={active === c.id ? "step" : undefined} tabIndex={shown ? 0 : -1}>
              <span className="chapter-num">{String(i + 1).padStart(2, "0")}</span>
              <svg className="chapter-v" viewBox="0 0 10 10" fill="none" aria-hidden>
                <path d="M1 1.5 5 9 9 1.5" stroke="currentColor" strokeWidth="1.4" pathLength={1} />
              </svg>
              <span className="chapter-label">{c.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
