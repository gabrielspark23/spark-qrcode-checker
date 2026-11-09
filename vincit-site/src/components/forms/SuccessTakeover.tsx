"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MARK_PATH, MARK_VIEWBOX } from "@/lib/brand-geometry";
import { href, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import type { Dict } from "@/content";

/**
 * Confirmação de envio em tela cheia: um círculo grafite nasce do botão e cobre a seção inteira
 * (as duas metades do Contato). Por cima: a logo em latão, o agradecimento e os próximos passos.
 * Montada por portal no palco da página ([data-contact-stage]); sem ele, cobre a própria coluna.
 */
export function SuccessTakeover({
  stage,
  origin,
  locale,
  t,
  onReset,
}: {
  onReset: () => void;
  stage: HTMLElement;
  origin: { x: number; y: number };
  locale: Locale;
  t: Dict;
}) {
  const s = t.form.success;
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 1) o círculo cobre a tela a partir do botão; 2) o formulário sai de vez e a seção vira só a confirmação
    const id = window.setTimeout(() => {
      stage.dataset.done = "";
      stage.scrollIntoView({ block: "start", behavior: "auto" });
      titleRef.current?.focus({ preventScroll: true });
      window.dispatchEvent(new Event("scroll")); // o header recalcula o tom sobre o grafite
    }, reduce ? 0 : 1100);
    return () => {
      window.clearTimeout(id);
      delete stage.dataset.done;
    };
  }, [stage]);

  return createPortal(
    <div
      className="takeover on-dark absolute inset-0 z-30 bg-navy text-on-dark"
      style={{ "--ox": `${origin.x}px`, "--oy": `${origin.y}px` } as React.CSSProperties}
      role="status"
      aria-live="polite"
    >
      <div className="sticky top-0 flex min-h-svh items-center px-5 py-28 sm:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <svg viewBox={MARK_VIEWBOX} className="tk-mark h-20 w-auto sm:h-24" aria-hidden>
            <path d={MARK_PATH} fill="var(--color-gold)" />
          </svg>
          <h2 ref={titleRef} tabIndex={-1} className="tk-in tk-1 display mt-10 max-w-[18ch] text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)] leading-[1.06] outline-none">
            {s.title}
          </h2>
          <p className="tk-in tk-2 mt-6 text-on-dark-2">{s.body}</p>
          <ol className="tk-in tk-3 mt-8 grid gap-px border-t border-navy-line sm:grid-cols-3">
            {s.steps.map((step, i) => (
              <li key={step} className="pt-6 sm:pr-8">
                <span className="text-xs tabular-nums text-brass">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-[1.0625rem] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <div className="tk-in tk-4 mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
            <button type="button" onClick={onReset} className="link-arrow text-on-dark">
              <span>{s.again}</span>
              <ArrowUpRight className="h-4 w-4 rotate-[225deg]" strokeWidth={1.75} aria-hidden />
            </button>
            <Link href={href("home", locale)} className="link-arrow text-on-dark-2 hover:text-on-dark">
              <span>{s.home}</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-arrow text-on-dark-2 hover:text-on-dark">
              <span>@vincit.capital</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </div>,
    stage,
  );
}
