import localFont from "next/font/local";

/** Fontes self-hosted via next/font: preload automático + fallback com métricas ajustadas (sem salto). */
export const serif = localFont({
  src: [
    // Newsreader estático: peso 400, tamanho óptico 40, latim (EN/PT). ~20 kB cada (era ~140 kB).
    { path: "../fonts/newsreader-400.woff2", style: "normal", weight: "400" },
    { path: "../fonts/newsreader-400-italic.woff2", style: "italic", weight: "400" },
  ],
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const sans = localFont({
  src: [{ path: "../fonts/inter-latin-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
