"use client";

/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { capable } from "./GlobeSection";
import { cn } from "@/lib/cn";

const GlobeInteractive = dynamic(() => import("./GlobeInteractive"), { ssr: false });

/** Globo de ambiente (ex.: Contato): começa como SVG estático e vira o globo girando quando carrega. */
export function GlobeAmbient({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    if (!ref.current || !capable()) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setLoad(true);
        io.disconnect();
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("pointer-events-auto aspect-square", className)} aria-hidden>
      <img src="/globe-static.svg" alt="" width={640} height={640} className={cn("absolute inset-0 h-full w-full transition-opacity duration-500", ready && "opacity-0")} />
      {load ? <GlobeInteractive label="" onReady={onReady} decorative /> : null}
    </div>
  );
}
