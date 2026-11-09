import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { href, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";
import type { Dict } from "@/content";

export function FinalCta({ locale, t }: { locale: Locale; t: Dict }) {
  const wa = whatsappHref(t.common.talkWhatsApp);
  return (
    <section className="bg-app py-20 sm:py-28" aria-labelledby="final-title">
      <Container>
        <div className="relative border border-line bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
          <span className="rule-brass absolute left-1/2 top-0 -translate-x-1/2" aria-hidden />
          <h2 id="final-title" className="h2">{t.home.final.title}</h2>
          <p className="lead mx-auto mt-4 max-w-[46ch] text-ink-2">{t.home.final.body}</p>
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
        </div>
      </Container>
    </section>
  );
}
