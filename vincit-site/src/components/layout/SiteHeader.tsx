"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { LanguageSwitch } from "./LanguageSwitch";
import { href, routeKeyFromPath, type Locale, type RouteKey } from "@/lib/i18n";
import { site, whatsappHref } from "@/lib/site";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

const NAV: RouteKey[] = ["services", "whoWeServe", "team", "about", "contact"];

export function SiteHeader({ locale, nav, whatsappText }: { locale: Locale; nav: Dict["nav"]; whatsappText: string }) {
  const pathname = usePathname() ?? "/";
  const active = routeKeyFromPath(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Tom do header segue a seção que está por baixo dele (clara ou grafite)
  const [overDark, setOverDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let raf = 0;
    const probe = () => {
      raf = 0;
      setScrolled(window.scrollY > 12);
      const header = headerRef.current;
      const y = (header?.offsetHeight ?? 72) - 6;
      let dark = 0;
      for (const fx of [0.2, 0.5, 0.8]) {
        const stack = document.elementsFromPoint(window.innerWidth * fx, y);
        const under = stack.find((el) => !header?.contains(el));
        if (under?.closest(".on-dark, [data-tone='dark']")) dark++;
      }
      const headerDark = dark >= 2;
      setOverDark(headerDark);
      // Header transparente: cada item segue o fundo exatamente abaixo dele (telas divididas).
      // Header sólido: todos seguem o tom da barra.
      const isSolid = window.scrollY > 12;
      header?.querySelectorAll<HTMLElement>("[data-tone-item]").forEach((item) => {
        let tone = headerDark ? "dark" : "light";
        if (!isSolid) {
          const r = item.getBoundingClientRect();
          const under = document
            .elementsFromPoint(r.left + r.width / 2, y)
            .find((el) => !header.contains(el));
          tone = under?.closest(".on-dark, [data-tone='dark']") ? "dark" : "light";
        }
        item.dataset.tone = tone;
      });
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, [pathname]);

  // Fecha o menu ao navegar (ajuste de estado durante o render, sem efeito)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // Folha móvel: trava o scroll, Esc fecha, foco entra e volta
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const btn = menuBtn.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  const labels: Record<RouteKey, string> = {
    home: "Home",
    services: nav.services,
    whoWeServe: nav.whoWeServe,
    team: nav.team,
    about: nav.about,
    contact: nav.contact,
    disclosures: "",
    privacy: "",
  };
  const wa = whatsappHref(whatsappText);
  const dark = overDark && !open;
  const solid = scrolled || open;

  return (
    <header
      ref={headerRef}
      data-tone={dark ? "dark" : "light"}
      className={cn(
        "site-header fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-300",
        dark
          ? cn("on-dark", solid ? "border-navy-line bg-navy/88 backdrop-blur-md" : "border-transparent bg-transparent")
          : solid
            ? "border-line bg-app/92 backdrop-blur-md"
            : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-brass focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy"
      >
        {nav.skip}
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link href={href("home", locale)} data-tone-item className="tone-item rounded-[2px]" aria-label="Vincit Capital — Home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-0.5 text-[0.9375rem]">
            {NAV.map((k) => (
              <li key={k} data-tone-item className="tone-item">
                <Link
                  href={href(k, locale)}
                  aria-current={active === k ? "page" : undefined}
                  className="nav-v"
                >
                  {labels[k]}
                  <svg className="nav-v-mark" viewBox="0 0 9 9" fill="none" aria-hidden>
                    <path d="M0.5 1 4.5 8 8.5 1" stroke="var(--color-gold)" strokeWidth="1.5" pathLength={1} />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4 lg:ml-0">
          <span data-tone-item className="tone-item hidden sm:flex">
            <LanguageSwitch label={nav.language} inherit />
          </span>
          <span data-tone-item className="tone-item hidden sm:inline-flex">
          <Button href={href("contact", locale)} variant="shield" size="sm" notch="strong" event="cta_schedule_click">
            {nav.schedule}
          </Button>
          </span>
          <span data-tone-item className="tone-item sm:hidden">
          <Button href={href("contact", locale)} variant="shield" size="sm" notch="soft" icon="none" event="cta_schedule_click">
            {nav.scheduleShort}
          </Button>
          </span>
          <a
            href={site.osLoginUrl}
            data-event="login_click"
            title={nav.clientLoginHint}
            data-tone-item
            className="tone-item top-link top-link-light hidden text-[0.8125rem] xl:inline-flex"
          >
            {nav.clientLogin}
            <span className="arrow-pass" aria-hidden>
              <ArrowUpRight strokeWidth={1.75} />
              <ArrowUpRight strokeWidth={1.75} />
            </span>
          </a>
          <button
            ref={menuBtn}
            type="button"
            data-tone-item
            className="tone-item menu-btn -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-[2px] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.close : nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Folha móvel */}
      <div
        id="mobile-menu"
        ref={panel}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto border-t border-line bg-app lg:hidden"
      >
        <div className="flex min-h-full flex-col px-5 pb-10 pt-6 sm:px-8">
          <LanguageSwitch label={nav.language} onDark={false} className="mb-6" />
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line border-y border-line">
              {NAV.map((k, i) => (
                <li key={k}>
                  <Link
                    href={href(k, locale)}
                    aria-current={active === k ? "page" : undefined}
                    className="enter flex items-center justify-between py-4 font-serif text-2xl text-ink"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    {labels[k]}
                    {active === k ? <span className="h-0.5 w-6 bg-brass" aria-hidden /> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <Button href={href("contact", locale)} size="lg" notch="strong" event="cta_schedule_click">
              {nav.schedule}
            </Button>
            {wa ? (
              <Button href={wa} variant="secondary" size="lg" icon="none" leading={<MessageCircle className="h-4 w-4" />} event="cta_whatsapp_click">
                WhatsApp
              </Button>
            ) : null}
            {site.phone ? (
              <Button href={`tel:${site.phone}`} variant="secondary" size="lg" icon="none" leading={<Phone className="h-4 w-4" />}>
                {site.phoneDisplay}
              </Button>
            ) : null}
          </div>
          <a href={site.osLoginUrl} data-event="login_click" className="mt-auto inline-flex items-center gap-1 pt-10 text-sm text-ink-2">
            {nav.clientLoginHint}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </header>
  );
}
