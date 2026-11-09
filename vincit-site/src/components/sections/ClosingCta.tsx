import { MessageCircle } from "lucide-react";
import { Button, ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { DrawOnView } from "@/components/motion/DrawOnView";
import { ShieldLine } from "@/components/brand/Shapes";
import { href, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";
import type { Dict } from "@/content";

/**
 * Fechamento: retoma o herói de forma abstrata — o círculo deslocado e o escudo,
 * agora maiores e cortados pela borda; as linhas se desenham ao entrar na tela.
 */
export function ClosingCta({ locale, t }: { locale: Locale; t: Dict }) {
  const wa = whatsappHref(t.common.talkWhatsApp);
  return (
    <section className="relative overflow-hidden bg-app py-28 sm:py-40" aria-labelledby="final-title">
      <DrawOnView className="pointer-events-none absolute -bottom-40 -right-32 h-[44rem] w-[44rem] sm:-right-16 lg:right-[-4rem]">
        <svg viewBox="0 0 700 700" fill="none" className="h-full w-full" aria-hidden>
          <circle className="draw-line" pathLength={1} cx="330" cy="370" r="300" stroke="var(--color-gold)" strokeOpacity="0.75" transform="rotate(-120 330 370)" />
          <circle className="draw-line d2" pathLength={1} cx="370" cy="350" r="300" stroke="var(--text-primary)" strokeOpacity="0.1" />
          <ShieldLine x={130} y={110} width={420} stroke="var(--text-primary)" opacity={0.22} className="draw-line d3" />
          <circle className="fade-node" cx="340" cy="597" r="6" fill="var(--color-gold)" />
        </svg>
      </DrawOnView>

      <Container className="relative">
        <div className="max-w-2xl">
          <h2 id="final-title" className="display text-[clamp(2.75rem,1.8rem+3.6vw,4.75rem)]">{t.home.final.title}</h2>
          <p className="lead mt-6 max-w-[42ch] text-ink-2">{t.home.final.body}</p>
          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
