import { CalendarDays, MapPin, MessageCircle, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { Button, ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { site, whatsappHref } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

export function ContactView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const c = t.contact;
  const wa = whatsappHref(t.common.talkWhatsApp);
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
      <section className="bg-app py-16 sm:py-24" aria-labelledby="form-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="form-title" className="h3 mb-6">{c.formTitle}</h2>
              <LeadForm locale={locale} t={t} />
            </div>

            <aside className="space-y-6 lg:col-span-4 lg:col-start-9">
              {site.scheduleUrl ? (
                <div className="border border-line bg-surface p-7">
                  <CalendarDays className="h-6 w-6" strokeWidth={1.25} aria-hidden />
                  <h2 className="h3 mt-5">{c.scheduleTitle}</h2>
                  <p className="mt-2 text-[0.9375rem] text-ink-2">{c.scheduleBody}</p>
                  <div className="mt-6">
                    <Button href={site.scheduleUrl} external icon="external" notch="soft" event="cta_schedule_click">{c.pickTime}</Button>
                  </div>
                </div>
              ) : null}

              {wa ? (
                <div id="whatsapp" className="scroll-mt-28 border border-line bg-surface p-7">
                  <MessageCircle className="h-6 w-6" strokeWidth={1.25} aria-hidden />
                  <h2 className="h3 mt-5">{c.whatsappTitle}</h2>
                  <p className="mt-2 text-[0.9375rem] text-ink-2">{c.whatsappBody}</p>
                  <div className="mt-6">
                    <ModuleButton href={wa} event="cta_whatsapp_click">{t.common.talkWhatsApp}</ModuleButton>
                  </div>
                </div>
              ) : null}

              <div className="on-dark border border-navy-line bg-navy p-7 text-on-dark">
                <MapPin className="h-6 w-6 text-brass" strokeWidth={1.25} aria-hidden />
                <h2 className="h3 mt-5">{c.visitTitle}</h2>
                <address className="mt-2 not-italic text-on-dark-2">
                  {site.address.line1 ? <>{site.address.line1}<br /></> : null}
                  {site.address.city}, {site.address.region}
                </address>
                <p className="mt-4 flex items-center gap-2 text-sm text-on-dark-2">
                  <Clock className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  {c.hours}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
