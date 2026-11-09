import { MessageCircle } from "lucide-react";
import { Button, ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { href, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";
import type { Dict } from "@/content";

/** Chamada final das páginas internas: objetiva, mesma família de botões da Home. */
export function FinalCta({ locale, t }: { locale: Locale; t: Dict }) {
  const wa = whatsappHref(t.common.talkWhatsApp);
  return (
    <section className="border-t border-line bg-app py-20 sm:py-28" aria-labelledby="final-title">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="rule-brass" aria-hidden />
            <h2 id="final-title" className="h1 mt-8">{t.home.final.title}</h2>
            <p className="lead mt-4 max-w-[46ch] text-ink-2">{t.home.final.body}</p>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
            <Button href={href("contact", locale)} variant="shield" size="lg" notch="strong" event="cta_schedule_click">
              {t.nav.schedule}
            </Button>
            {wa ? (
              <ModuleButton href={wa} event="cta_whatsapp_click">
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  {t.common.talkWhatsApp}
                </span>
              </ModuleButton>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
