import { Container } from "@/components/ui/Layout";
import { cn } from "@/lib/cn";
import { ManifestoLens } from "./ManifestoLens";
import { ManifestoVideo } from "./ManifestoVideo";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/content";

export type ManifestoVariant = "editorial" | "structural";

/**
 * Contornos orgânicos da lente, em coordenadas 0–1 (objectBoundingBox): retângulo largo com bordas
 * levemente onduladas e cantos de curvaturas diferentes — nunca oval. Esticam com o vídeo sem distorcê-lo.
 */
const LENS_PATH: Record<ManifestoVariant, string> = {
  editorial:
    "M0.17 0.022C0.42 0.004 0.70 0.016 0.925 0.032C0.972 0.036 0.994 0.072 0.995 0.15C0.999 0.40 0.992 0.62 0.986 0.75C0.979 0.905 0.90 0.984 0.79 0.987C0.55 0.994 0.30 0.986 0.065 0.976C0.022 0.973 0.006 0.94 0.007 0.875C0.004 0.62 0.011 0.42 0.013 0.29C0.016 0.10 0.075 0.028 0.17 0.022Z",
  structural:
    "M0.11 0.016C0.40 0.004 0.70 0.009 0.965 0.013C0.988 0.014 0.996 0.032 0.996 0.065C0.999 0.40 0.997 0.70 0.994 0.93C0.993 0.972 0.979 0.988 0.95 0.989C0.65 0.995 0.35 0.990 0.045 0.986C0.017 0.985 0.005 0.969 0.005 0.935C0.002 0.70 0.003 0.40 0.007 0.21C0.009 0.075 0.042 0.020 0.11 0.016Z",
};

/**
 * Fechamento da Home: o Manifesto em "Offset Lens".
 * - Leitura em três tempos: as duas frases de abertura (alto, à esquerda) → o vídeo (protagonista, largo,
 *   deslocado à direita) → a frase de fechamento (abaixo, alinhada à direita, como legenda editorial).
 * - Moldura: contorno orgânico (bordas levemente onduladas, cantos de curvaturas diferentes) recortando o 16:9;
 *   uma lâmina em pedra deslocada atrás e um filete de latão repetem o contorno em offset. O vídeo não distorce
 *   e a tela cheia do player (camada superior) não é afetada pelo recorte.
 * - Fundo: pedra clara com um grande plano tonal em curva, parcialmente fora da seção.
 * A faixa sobe sobre o grafite com cantos superiores arredondados (transição da seção anterior).
 *
 * "editorial" (A): dois cantos amplos em diagonal, deslocamento mais visível.
 * "structural" (B): um único canto amplo, raios menores, alinhamentos mais rígidos.
 */
export function HomeManifesto({ locale, t, variant = "editorial" }: { locale: Locale; t: Dict; variant?: ManifestoVariant }) {
  const m = t.about.manifesto;
  return (
    <ManifestoLens
      className={cn(
        "manifesto-lens relative z-10 -mt-7 overflow-hidden rounded-t-[1.75rem] bg-app pb-24 pt-20 sm:-mt-10 sm:rounded-t-[2.5rem] sm:pb-36 sm:pt-28",
        variant === "editorial" ? "lens-a" : "lens-b",
      )}
    >
      {/* plano tonal em curva, parcialmente fora da seção */}
      <span className="lens-canvas" aria-hidden />

      <Container className="relative">
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          {/* tempo 1: abertura */}
          <div className="lens-copy lg:col-span-6 lg:col-start-1">
            <h2 id="manifesto-home-title" className="eyebrow flex items-center gap-3 text-ink-3">
              <span className="h-px w-6 bg-brass" aria-hidden />
              {m.eyebrow}
            </h2>
            <p className="mt-7 max-w-[24ch] font-serif text-[clamp(1.75rem,1.2rem+1.9vw,2.875rem)] leading-[1.15] text-ink-2">
              {m.lines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </p>
          </div>

          {/* tempo 2: o vídeo, protagonista */}
          <div className={cn("lens-stage relative", variant === "editorial" ? "lg:col-span-9 lg:col-start-3" : "lg:col-span-9 lg:col-start-4")}>
            <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
              <clipPath id={`lens-clip-${variant}`} clipPathUnits="objectBoundingBox">
                <path d={LENS_PATH[variant]} />
              </clipPath>
            </svg>
            <span className="lens-plate" style={{ clipPath: `url(#lens-clip-${variant})` }} aria-hidden />
            <svg className="lens-rule" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden focusable="false">
              <path d={LENS_PATH[variant]} vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="lens-frame relative" style={{ clipPath: `url(#lens-clip-${variant})` }}>
              <div className="lens-reveal">
                <ManifestoVideo lens title={m.title} playLabel={m.play} duration={m.duration} note={m.note || undefined} captions={locale === "en"} />
              </div>
            </div>
          </div>

          {/* tempo 3: fechamento, como legenda editorial à direita */}
          <p className="lens-close font-serif text-[clamp(1.5rem,1.1rem+1.3vw,2.25rem)] leading-snug text-ink lg:col-span-5 lg:col-start-8">
            {m.closing}
          </p>
        </div>
      </Container>
    </ManifestoLens>
  );
}
