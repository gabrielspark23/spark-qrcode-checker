import { CalendarDays, MessageCircle } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";
import { GlobeAmbient } from "@/components/globe/GlobeAmbient";
import { Button, ModuleButton } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { site, whatsappHref } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

/** Contato em tela dividida: painel grafite (globo + escritórios) e o formulário ao lado. */
export function ContactView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const c = t.contact;
  const wa = whatsappHref(t.common.talkWhatsApp);
  return (
    <section className="grid min-h-svh lg:grid-cols-2" aria-labelledby="page-title">
      <div className="on-dark relative flex flex-col overflow-hidden bg-navy px-5 pb-16 pt-32 text-on-dark sm:px-12 sm:pt-40 lg:sticky lg:top-0 lg:h-svh">
        <GlobeAmbient className="absolute -bottom-48 -right-48 w-[40rem] sm:-bottom-56 sm:w-[52rem]" />
        <div className="relative">
          <Eyebrow onDark>{c.eyebrow}</Eyebrow>
          <h1 id="page-title" className="h1 mt-6 max-w-[14ch]">{c.title}</h1>
          <p className="lead mt-6 max-w-[40ch] text-on-dark-2">{c.intro}</p>
        </div>
      </div>

      <div className="bg-app px-5 pb-20 pt-12 sm:px-12 lg:pt-40">
        <h2 className="h3 mb-6">{c.formTitle}</h2>
        <LeadForm locale={locale} t={t} />
        {site.scheduleUrl || wa ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {site.scheduleUrl ? (
              <div className="border border-line bg-surface p-6">
                <CalendarDays className="h-5 w-5" strokeWidth={1.25} aria-hidden />
                <p className="mt-4 font-serif text-xl">{c.scheduleTitle}</p>
                <div className="mt-5">
                  <Button href={site.scheduleUrl} external icon="external" notch="soft" event="cta_schedule_click">{c.pickTime}</Button>
                </div>
              </div>
            ) : null}
            {wa ? (
              <div id="whatsapp" className="scroll-mt-28 border border-line bg-surface p-6">
                <MessageCircle className="h-5 w-5" strokeWidth={1.25} aria-hidden />
                <p className="mt-4 font-serif text-xl">{c.whatsappTitle}</p>
                <div className="mt-5">
                  <ModuleButton href={wa} event="cta_whatsapp_click">{t.common.talkWhatsApp}</ModuleButton>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
