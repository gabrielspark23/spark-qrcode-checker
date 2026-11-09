import { Container } from "@/components/ui/Layout";
import { ManifestoVideo } from "./ManifestoVideo";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/content";

/** Fechamento da Home: o manifesto da Vincit sobre o fundo claro — frase à esquerda, vídeo oficial à direita. */
export function HomeManifesto({ locale, t }: { locale: Locale; t: Dict }) {
  const m = t.about.manifesto;
  return (
    <section className="bg-app py-24 sm:py-32" aria-labelledby="manifesto-home-title">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 id="manifesto-home-title" className="eyebrow flex items-center gap-3 text-ink-3">
              <span className="h-px w-6 bg-brass" aria-hidden />
              {m.eyebrow}
            </h2>
            <p className="mt-8 font-serif text-[clamp(1.625rem,1.2rem+1.4vw,2.25rem)] leading-snug">
              {m.lines.map((l) => (
                <span key={l} className="block text-ink-3">{l}</span>
              ))}
              <span className="mt-3 block text-ink">{m.closing}</span>
            </p>
          </div>
          <div className="lg:col-span-8">
            <ManifestoVideo title={m.title} playLabel={m.play} duration={m.duration} note={m.note || undefined} captions={locale === "en"} />
          </div>
        </div>
      </Container>
    </section>
  );
}
