"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    va?: (event: "event", props: { name: string; data?: Record<string, string> }) => void;
  }
}

/** Rastreia CTAs via atributo data-event (PRD §7.6). Sem PII. Vercel Analytics entra no deploy. */
export function track(name: string, data?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.va?.("event", { name, data });
  if (process.env.NODE_ENV === "development") console.debug("[track]", name, data ?? "");
}

export function EventDelegate() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-event]");
      if (el?.dataset.event) track(el.dataset.event, { page: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
