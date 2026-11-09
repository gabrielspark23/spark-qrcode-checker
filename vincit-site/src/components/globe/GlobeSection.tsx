"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Crosshair, RotateCcw } from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { GLOBE_EVENT, type GlobeTarget } from "./config";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

const GlobeInteractive = dynamic(() => import("./GlobeInteractive"), { ssr: false });

/** Quem recebe o globo animado: qualquer tela, desde que sem economia de dados nem movimento reduzido. */
export function capable() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !nav.connection?.saveData &&
    (nav.hardwareConcurrency ?? 4) >= 4 &&
    (nav.deviceMemory ?? 4) >= 2
  );
}

export function GlobeSection({ t, staticGlobe }: { t: Dict; staticGlobe: ReactNode }) {
  const g = t.home.globe;
  const stage = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<GlobeTarget>("reset");
  const onReady = useCallback(() => setReady(true), []);

  // Carrega o 3D só quando a seção se aproxima e o aparelho comporta.
  useEffect(() => {
    const el = stage.current;
    if (!el || !capable()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (target: GlobeTarget) => {
    setActive(target);
    window.dispatchEvent(new CustomEvent(GLOBE_EVENT, { detail: target }));
  };

  return (
    <section className="on-dark relative overflow-hidden bg-navy pb-24 pt-8 text-on-dark sm:pb-32" aria-labelledby="globe-title">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="relative z-10 lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-brass">
              <span className="h-px w-6 bg-brass" aria-hidden />
              {g.eyebrow}
            </p>
            <h2 id="globe-title" className="h1 mt-6 max-w-[16ch]">{g.title}</h2>
            <p className="lead mt-6 max-w-[34ch] text-on-dark-2">{g.short}</p>

            <ul className="mt-10 border-t border-navy-line">
              {g.locations.map((l) => (
                <li key={l.id} className="flex flex-col items-start gap-3 border-b border-navy-line py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div>
                    <p className="font-serif text-xl">{l.name}</p>
                    <p className="mt-1 text-sm text-on-dark-2">{l.role}</p>
                  </div>
                  {ready ? (
                    <button
                      type="button"
                      onClick={() => go(l.id as GlobeTarget)}
                      aria-pressed={active === l.id}
                      className={cn(
                        "vn-link shrink-0 gap-2 text-sm",
                        active === l.id && "text-on-dark",
                      )}
                    >
                      <Crosshair className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      {g.focus}
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
            {ready ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-on-dark-3">
                <p>{g.hint}</p>
                <button type="button" onClick={() => go("reset")} className="vn-link gap-2 text-sm">
                  <RotateCcw className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  {g.reset}
                </button>
              </div>
            ) : null}
          </div>

          <div className="relative lg:col-span-7">
            {/* parte do globo ultrapassa a área visível */}
            <div ref={stage} data-globe-stage className="relative mx-auto aspect-square w-full max-w-[34rem] lg:-mr-40 lg:ml-0 lg:w-[46rem] lg:max-w-none xl:-mr-24">
              <div className={cn("absolute inset-0 transition-opacity duration-500", ready && "opacity-0")}>{staticGlobe}</div>
              {load ? <GlobeInteractive label={g.label} onReady={onReady} /> : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
