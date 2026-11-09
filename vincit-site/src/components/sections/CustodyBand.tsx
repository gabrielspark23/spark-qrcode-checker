import { Container, DraftNote, Eyebrow } from "@/components/ui/Layout";
import type { Dict } from "@/content";

/** Faixa de custódia: só texto até haver autorização de logo (PRD §11.4). */
export function CustodyBand({ t }: { t: Dict }) {
  const c = t.home.custody;
  return (
    <section className="border-y border-line bg-surface py-16 sm:py-20" aria-labelledby="custody-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 id="custody-title" className="h3 mt-5 max-w-[28ch] sm:text-[1.75rem]">{c.title}</h2>
            <p className="mt-4 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-2">{c.body}</p>
          </div>
          <div className="lg:col-span-6">
            <ul className="grid grid-cols-2 border border-line">
              {c.partners.map((p, i) => (
                <li
                  key={p}
                  className={`flex min-h-28 items-center justify-center px-6 text-center font-serif text-xl text-ink sm:text-2xl ${i > 0 ? "border-l border-line" : ""}`}
                >
                  {p}
                </li>
              ))}
            </ul>
            <DraftNote className="mt-4" code="§11.4">{c.note}</DraftNote>
          </div>
        </div>
      </Container>
    </section>
  );
}
