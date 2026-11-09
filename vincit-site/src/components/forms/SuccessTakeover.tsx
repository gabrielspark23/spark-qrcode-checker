"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MARK_PATH, MARK_VIEWBOX, SHIELD_OUTLINE_PATH } from "@/lib/brand-geometry";
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
  const thanksWord = s.thanks.replace(/[.!]$/, first ? "," : ".");
  return createPortal(
    <div
      className="takeover takeover-card absolute inset-0 z-30"
      data-tone="light"
      style={{ "--ox": `${origin.x}px`, "--oy": `${origin.y}px` } as React.CSSProperties}
      role="status"
      aria-live="polite"
    >
      {/* a pedra cobre o latão de cima para baixo; o latão "se recolhe" e fica só o cartão */}
      <span className="tk-stone" aria-hidden />

      <div className="relative flex min-h-svh items-center px-5 pb-20 pt-28 sm:px-12 sm:pt-32">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* esquerda: o agradecimento */}
          <div className="lg:col-span-6">
            <p className="tk-in tk-1 eyebrow flex items-center gap-3 text-ink-3">
              <span className="h-px w-8 bg-brass" aria-hidden />
              {s.receivedOn} · {date}
            </p>
            <h2 ref={titleRef} tabIndex={-1} className="tk-title display mt-8 leading-[0.92] outline-none">
              <span className="tk-line block text-[clamp(3.5rem,2rem+6vw,7.5rem)]">{thanksWord}</span>
              {first ? <span className="tk-line tk-line-2 block text-[clamp(3.5rem,2rem+6vw,7.5rem)] text-[#8a6d3b]">{first}.</span> : null}
            </h2>
            <p className="tk-in tk-2 mt-8 max-w-[36ch] text-[1.125rem] leading-relaxed text-ink-2">{s.received}</p>

            <div className="tk-in tk-4 mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
              <button type="button" onClick={onReset} className="tk-btn">
                <span>{s.again}</span>
              </button>
              <Link href={href("home", locale)} className="link-arrow text-ink">
                <span>{s.home}</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Link>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-arrow text-ink-2 hover:text-ink">
                <span>@vincit.capital</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </div>

          {/* direita: o cartão em latão */}
          <div className="relative lg:col-span-5 lg:col-start-8">
            <span className="tk-card-rule" aria-hidden />
            <div className="tk-card relative p-8 text-[#16181d] sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <svg viewBox={MARK_VIEWBOX} className="tk-mark h-14 w-auto" aria-hidden>
                  <path className="tk-mark-line" d={SHIELD_OUTLINE_PATH} pathLength={1} fill="none" stroke="#16181d" strokeWidth="7" />
                  <path className="tk-mark-fill" d={MARK_PATH} fill="#16181d" />
                </svg>
                <span className="text-right text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#16181d]/70">Vincit<br />Capital</span>
              </div>
              <p className="mt-10 font-serif text-[1.5rem] leading-snug">{s.note}</p>
              <p className="mt-5 text-sm tracking-wide text-[#16181d]/75">{s.signature}</p>

              <p className="mt-10 border-t border-[#16181d]/25 pt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#16181d]/70">{s.body}</p>
              <ol className="mt-5 space-y-4">
                {s.steps.map((step, i) => (
                  <li key={step} className="flex gap-4 text-[0.9375rem] leading-relaxed">
                    <span className="font-serif text-lg tabular-nums leading-snug">{String(i + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>,
    stage,
  );
}
