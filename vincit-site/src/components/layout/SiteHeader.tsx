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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "on-dark fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-200",
        solid ? "border-navy-line bg-navy" : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-brass focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy"
      >
        {nav.skip}
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link href={href("home", locale)} className="rounded-[2px]" aria-label="Vincit Capital — Home">
          <Logo onDark />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.9375rem] text-on-dark-2">
            {NAV.map((k) => (
              <li key={k}>
                <Link
                  href={href(k, locale)}
                  aria-current={active === k ? "page" : undefined}
                  className={cn("nav-link hover:text-on-dark", active === k && "text-on-dark")}
                >
                  {labels[k]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4 lg:ml-0">
          <LanguageSwitch label={nav.language} className="hidden sm:flex" />
          <Button href={href("contact", locale)} variant="brass" size="sm" event="cta_schedule_click" className="hidden sm:inline-flex">
            {nav.schedule}
          </Button>
          <Button href={href("contact", locale)} variant="brass" size="sm" icon="none" event="cta_schedule_click" className="sm:hidden">
            {nav.scheduleShort}
          </Button>
          <a
            href={site.osLoginUrl}
            data-event="login_click"
            title={nav.clientLoginHint}
            className="hidden items-center gap-1 text-[0.8125rem] text-on-dark-3 transition-colors duration-150 hover:text-on-dark xl:inline-flex"
          >
            {nav.clientLogin}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-[2px] text-on-dark lg:hidden"
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
        className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto border-t border-navy-line bg-navy lg:hidden"
      >
        <div className="flex min-h-full flex-col px-5 pb-10 pt-6 sm:px-8">
          <LanguageSwitch label={nav.language} className="mb-6" />
          <nav aria-label="Mobile">
            <ul className="divide-y divide-navy-line border-y border-navy-line">
              {NAV.map((k, i) => (
                <li key={k}>
                  <Link
                    href={href(k, locale)}
                    aria-current={active === k ? "page" : undefined}
                    className="enter flex items-center justify-between py-4 font-serif text-2xl text-on-dark"
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
            <Button href={href("contact", locale)} variant="brass" size="lg" event="cta_schedule_click">
              {nav.schedule}
            </Button>
            {wa ? (
              <Button href={wa} variant="ghost-dark" size="lg" icon="none" leading={<MessageCircle className="h-4 w-4" />} event="cta_whatsapp_click">
                WhatsApp
              </Button>
            ) : null}
            {site.phone ? (
              <Button href={`tel:${site.phone}`} variant="ghost-dark" size="lg" icon="none" leading={<Phone className="h-4 w-4" />}>
                {site.phoneDisplay}
              </Button>
            ) : null}
          </div>
          <a href={site.osLoginUrl} data-event="login_click" className="mt-auto inline-flex items-center gap-1 pt-10 text-sm text-on-dark-3">
            {nav.clientLoginHint}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </header>
  );
}
