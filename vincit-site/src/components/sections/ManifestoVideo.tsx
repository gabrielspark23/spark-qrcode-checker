"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const VIDEO_ID = "wVIGLRQBq4U"; // "Nosso manifesto" — canal oficial da Vincit Capital no YouTube

/**
 * Vídeo do manifesto em "fachada": até o clique só existe a imagem de capa (servida pelo próprio site),
 * sem nenhum pedido ao YouTube. No clique troca pelo player youtube-nocookie já tocando.
 * Sem JS: o botão vira um link para o vídeo no YouTube.
 */
export function ManifestoVideo({
  title,
  playLabel,
  duration,
  note,
  captions = false,
  lens = false,
}: {
  title: string;
  playLabel: string;
  duration: string;
  note?: string;
  /** Liga as legendas (versão em inglês: o vídeo é falado em português). */
  captions?: boolean;
  /** Moldura "Offset Lens" (Home): o recorte vem do pai; controle de play que se expande e revela a legenda. */
  lens?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1${captions ? "&cc_load_policy=1" : ""}`;

  return (
    <div className={lens ? "lens-media relative aspect-video w-full overflow-hidden bg-[#0c0e13]" : "manifesto-frame relative aspect-video w-full overflow-hidden rounded-[6px] bg-[#0c0e13]"}>
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <a
          href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
          onClick={(e) => {
            e.preventDefault();
            setPlaying(true);
          }}
          className="manifesto-play group absolute inset-0 block"
          aria-label={`${playLabel}: ${title} (${duration})`}
          data-event="manifesto_play"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/manifesto-poster.webp"
            alt=""
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-[#0c0e13]/80 via-transparent to-transparent" aria-hidden />
          {lens ? (
            <>
              {/* controle: círculo que se expande em pílula e revela "Assistir ao manifesto" */}
              <span className="lens-play absolute bottom-5 left-5 flex items-center sm:bottom-7 sm:left-7" aria-hidden>
                <span className="lens-play-dot flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
                    <path d="M7 4.5v15l12.5-7.5z" />
                  </svg>
                </span>
                <span className="lens-play-label whitespace-nowrap text-sm font-medium">{playLabel}</span>
              </span>
              <span className="absolute right-6 top-5 text-sm tabular-nums text-on-dark-2 sm:right-9 sm:top-7" aria-hidden>
                {note ? <span className="mr-3 hidden sm:inline">{note}</span> : null}
                {duration}
              </span>
            </>
          ) : (
          <span className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 p-4 text-sm text-on-dark sm:p-7">
              <span className="flex items-center gap-4">
                {/* botão no canto: não cobre o título da capa ("O que é vencer?") */}
                <span className="manifesto-btn relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brass/70 bg-[#0c0e13]/40 backdrop-blur-[2px] sm:h-16 sm:w-16" aria-hidden>
                  <span className="manifesto-ring absolute inset-0 rounded-full border border-brass/35" />
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 text-on-dark" fill="currentColor">
                    <path d="M7 4.5v15l12.5-7.5z" />
                  </svg>
                </span>
                {playLabel}
              </span>
              <span className={cn("tabular-nums text-on-dark-2")}>
                {note ? <span className="mr-3 hidden sm:inline">{note}</span> : null}
                {duration}
              </span>
            </span>
          )}
        </a>
      )}
    </div>
  );
}
