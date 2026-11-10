"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MARK_PATH, MARK_VIEWBOX } from "@/lib/brand-geometry";
import { SIGNATURE_FLOURISH, SIGNATURE_PATH, SIGNATURE_VIEWBOX } from "./signature";
import { href, type Locale } from "@/lib/i18n";
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
  name,
}: {
  name?: string;
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

  const first = name?.trim().split(/\s+/)[0];
  const date = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  return createPortal(
    <div
      className="takeover takeover-letter absolute inset-0 z-30"
      data-tone="light"
      style={{ "--ox": `${origin.x}px`, "--oy": `${origin.y}px` } as React.CSSProperties}
      role="status"
      aria-live="polite"
    >
      <span className="tk-stone" aria-hidden />

      <div className="relative flex min-h-svh flex-col items-center justify-center px-4 pb-16 pt-28 sm:px-8 sm:pt-32">
        {/* entrega: envelope chega, o selo rompe, a aba abre e a carta sobe */}
        <div className="tk-deliver relative w-full max-w-[52rem]">
        <div className="tk-env" aria-hidden>
          <span className="tk-env-back" />
          <span className="tk-env-pocket" />
          <span className="tk-env-flap" />
          <span className="tk-env-seal">
            <svg viewBox={MARK_VIEWBOX} className="h-7 w-auto">
              <path d={MARK_PATH} fill="#16181d" />
            </svg>
          </span>
        </div>
        <article className="tk-letter relative w-full">
          <span className="tk-letter-grain" aria-hidden />
          <span className="tk-letter-edge" aria-hidden />
          <div className="relative px-7 py-10 sm:px-16 sm:py-16 lg:px-20 lg:py-20">
            {/* timbre */}
            <header className="flex flex-col gap-5 border-b border-[#c2a263] pb-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <svg viewBox={MARK_VIEWBOX} className="h-12 w-auto" aria-hidden>
                  <path d={MARK_PATH} fill="var(--color-gold)" />
                </svg>
                <span className="text-[0.8125rem] font-semibold uppercase tracking-[0.28em]">Vincit Capital</span>
              </div>
              <span className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-ink-3">San Diego · {date}</span>
            </header>

            <h2 ref={titleRef} tabIndex={-1} className="tk-l1 mt-12 font-serif text-[clamp(2.5rem,1.8rem+2.4vw,3.75rem)] leading-tight outline-none">
              {first ? s.dear.replace("{name}", first) : s.dearNoName}
            </h2>
            <p className="tk-l2 mt-6 max-w-[40ch] font-serif text-[clamp(1.375rem,1.15rem+0.8vw,1.875rem)] leading-[1.5] text-[#3b3632]">
              {s.letter}
            </p>

            <p className="tk-l3 mt-12 font-serif text-[1.25rem] italic text-[#3b3632]">{s.closing}</p>
            <svg className="tk-sign mt-2 h-24 w-auto sm:h-32" viewBox={SIGNATURE_VIEWBOX} aria-hidden>
              {/* escrita: uma "caneta" larga percorre o traçado das letras e revela a tinta aos poucos */}
              <defs>
                <mask id="tk-sign-ink" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="-2000" y="-3000" width="8000" height="8000">
                  <path className="tk-sign-pen" d={SIGNATURE_PATH} pathLength={1} fill="none" stroke="#fff" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" />
                </mask>
              </defs>
              <path className="tk-sign-fill" d={SIGNATURE_PATH} fill="#a68545" mask="url(#tk-sign-ink)" />
              {/* a tinta assenta: a rubrica termina sólida */}
              <path className="tk-sign-solid" d={SIGNATURE_PATH} fill="#a68545" />
              <path className="tk-sign-flourish" d={SIGNATURE_FLOURISH} pathLength={1} fill="none" stroke="#a68545" strokeWidth="18" strokeLinecap="round" />
            </svg>
            <p className="tk-l3 mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-ink-3">{s.signature}</p>
          </div>
        </article>
        </div>

        {/* ações, fora da carta */}
        <div className="tk-actions mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          <Link href={href("home", locale)} className="link-arrow text-ink">
            <span>{s.home}</span>
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </Link>
          <button type="button" onClick={onReset} className="link-arrow text-ink-2 hover:text-ink">
            <span>{s.again}</span>
          </button>
        </div>
      </div>
    </div>,
    stage,
  );
}
