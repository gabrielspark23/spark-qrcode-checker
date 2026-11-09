import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content";

/** Cartões de segmento com foto 4:5 (Home: 3; página Who We Serve usa o bloco completo). */
export function SegmentCards({ locale, t, limit = 3 }: { locale: Locale; t: Dict; limit?: number }) {
  return (
    <ul className="grid gap-8 md:grid-cols-3">
      {t.segments.slice(0, limit).map((s) => (
        <li key={s.id}>
          <Link href={href("whoWeServe", locale, s.id)} className="group block rounded-[2px]">
            <div className="overflow-hidden">
              <div className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-[1.015]">
                <ImageSlot ratio="4/5" label={t.common.photoPending} />
              </div>
            </div>
            <h3 className="h3 mt-6">{s.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{s.short}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
              {t.common.learnMore}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
