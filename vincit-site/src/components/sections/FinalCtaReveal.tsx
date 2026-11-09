import { MessageCircle } from "lucide-react";
import { CircleReveal } from "@/components/motion/CircleReveal";
import { ShieldMark } from "@/components/brand/Geometry";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { href, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

function Content({ locale, t, dark }: { locale: Locale; t: Dict; dark: boolean }) {
  const wa = whatsappHref(t.common.talkWhatsApp);
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="geo-item lg:col-span-7">
          <ShieldMark className="h-14 w-14" tone={dark ? "brass" : "ink"} />
          <h2 id={dark ? "final-title" : undefined} className="display mt-8 max-w-[14ch]">
            {t.home.final.title}
          </h2>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className={cn("lead", dark ? "text-on-dark-2" : "text-ink-2")}>{t.home.final.body}</p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row lg:flex-col lg:items-start">
            <Button href={href("contact", locale)} variant={dark ? "brass" : "primary"} size="lg" event={dark ? "cta_schedule_click" : undefined}>
              {t.nav.schedule}
            </Button>
            <Button
              href={wa ?? href("contact", locale, "whatsapp")}
              variant={dark ? "ghost-dark" : "secondary"}
              size="lg"
              icon="none"
              leading={<MessageCircle className="h-4 w-4" strokeWidth={1.75} />}
              event={dark ? "cta_whatsapp_click" : undefined}
            >
              {t.common.talkWhatsApp}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}

/** Chamada final da Home: a pedra se fecha em grafite e encosta no rodapé. */
export function FinalCtaReveal({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <CircleReveal
      labelledBy="final-title"
      length="210svh"
      light={<Content locale={locale} t={t} dark={false} />}
      dark={<Content locale={locale} t={t} dark />}
    />
  );
}
