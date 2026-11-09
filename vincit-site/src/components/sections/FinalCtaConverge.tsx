"use client";

import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { Convergence } from "@/components/motion/Convergence";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { href, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";
import type { Dict } from "@/content";

/** Chamada final da Home: as duas linhas convergem para a ação. Sobre pedra, emendando no rodapé. */
export function FinalCtaConverge({ locale, t }: { locale: Locale; t: Dict }) {
  const apex = useRef<HTMLSpanElement>(null);
  const wa = whatsappHref(t.common.talkWhatsApp);
  return (
    <section className="relative overflow-hidden bg-app pb-20 pt-40 sm:pb-28 sm:pt-56" aria-labelledby="final-title">
      <Convergence apexRef={apex} />
      <Container className="relative text-center">
        <span ref={apex} className="mx-auto block h-px w-px" aria-hidden />
        <h2 id="final-title" className="display mx-auto mt-10 max-w-[16ch]">
          {t.home.final.title}
        </h2>
        <p className="lead mx-auto mt-5 max-w-[46ch] text-ink-2">{t.home.final.body}</p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button href={href("contact", locale)} size="lg" event="cta_schedule_click">
            {t.nav.schedule}
          </Button>
          <Button
            href={wa ?? href("contact", locale, "whatsapp")}
            variant="secondary"
            size="lg"
            icon="none"
            leading={<MessageCircle className="h-4 w-4" strokeWidth={1.75} />}
            event="cta_whatsapp_click"
          >
            {t.common.talkWhatsApp}
          </Button>
        </div>
      </Container>
    </section>
  );
}
