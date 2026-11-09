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
  return createPortal(
    <div
      className="takeover takeover-gold absolute inset-0 z-30"
      data-tone="dark"
      style={{ "--ox": `${origin.x}px`, "--oy": `${origin.y}px` } as React.CSSProperties}
      role="status"
      aria-live="polite"
    >
      {/* segunda onda: o latão nasce do centro sobre o grafite */}
      <span className="tk-gold" aria-hidden />
      {/* faixa grafite sob o header: o logo (escudo em latão) continua visível */}
      <span className="tk-cap on-dark" aria-hidden />
      {/* filetes finos em moldura, como um cartão de agradecimento */}
      <span className="tk-frame" aria-hidden />

      <div className="relative flex min-h-svh items-center px-6 py-28 sm:px-14">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <svg viewBox={MARK_VIEWBOX} className="tk-mark h-16 w-auto sm:h-20" aria-hidden>
                <path className="tk-mark-line" d={SHIELD_OUTLINE_PATH} pathLength={1} fill="none" stroke="#16181d" strokeWidth="6" />
                <path className="tk-mark-fill" d={MARK_PATH} fill="#16181d" />
              </svg>
              <p className="tk-in tk-1 eyebrow mt-10 flex items-center gap-3 text-[#16181d]/70">
                <span className="h-px w-8 bg-[#16181d]/60" aria-hidden />
                Vincit Capital
              </p>
              <h2 ref={titleRef} tabIndex={-1} className="tk-title display mt-6 text-[clamp(3rem,1.8rem+5vw,6.5rem)] leading-[0.98] outline-none">
                <span className="tk-line block">{first ? s.thanksName.replace("{name}", first) : s.thanks}</span>
                <span className="tk-line tk-line-2 block text-[#16181d]/70">{s.received}</span>
              </h2>
            </div>
            <p className="tk-in tk-2 max-w-[30ch] border-l border-[#16181d]/30 pl-6 font-serif text-[1.375rem] italic leading-snug lg:col-span-4">
              {s.note}
              <span className="mt-4 block font-sans text-sm not-italic tracking-wide text-[#16181d]/70">{s.signature}</span>
            </p>
          </div>

          <p className="tk-in tk-3 eyebrow mt-16 text-[#16181d]/70">{s.body}</p>
          <ol className="tk-in tk-3 mt-5 grid border-t border-[#16181d]/25 sm:grid-cols-3">
            {s.steps.map((step, i) => (
              <li key={step} className="border-b border-[#16181d]/15 py-6 sm:border-b-0 sm:pr-8">
                <span className="font-serif text-2xl tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-[1rem] leading-relaxed text-[#16181d]/85">{step}</p>
              </li>
            ))}
          </ol>

          <div className="tk-in tk-4 mt-12 flex flex-wrap items-center gap-x-10 gap-y-5 text-[#16181d]">
            <button type="button" onClick={onReset} className="tk-btn">
              <span>{s.again}</span>
            </button>
            <Link href={href("home", locale)} className="link-arrow">
              <span>{s.home}</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-arrow">
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
