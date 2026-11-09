import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Logo } from "@/components/brand/Logo";
import { en } from "@/content/en";
import { pt } from "@/content/pt";
import { sans, serif } from "@/lib/fonts";

export const metadata: Metadata = { title: "404 · Vincit Capital", robots: { index: false } };

/** 404 bilíngue (PRD §5.8). */
export default function GlobalNotFound() {
  const links = [
    { en: "/", pt: "/pt", label: [en.notFound.home, pt.notFound.home] },
    { en: "/services", pt: "/pt/servicos", label: [en.nav.services, pt.nav.services] },
    { en: "/contact", pt: "/pt/contato", label: [en.nav.contact, pt.nav.contact] },
  ];
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="on-dark min-h-dvh bg-navy text-on-dark">
        <div className="texture-lines fixed inset-0" aria-hidden />
        <main className="relative mx-auto flex min-h-dvh max-w-5xl flex-col px-5 py-10 sm:px-8">
          <Link href="/" aria-label="Vincit Capital"><Logo onDark /></Link>
          <div className="my-auto grid gap-14 py-20 md:grid-cols-2">
            {(["en", "pt"] as const).map((l, i) => (
              <section key={l} lang={l === "pt" ? "pt-BR" : "en"}>
                <p className="eyebrow text-brass">404</p>
                <h1 className={i === 0 ? "h1 mt-4" : "h2 mt-4"}>{(l === "en" ? en : pt).notFound.title}</h1>
                <p className="mt-4 text-on-dark-2">{(l === "en" ? en : pt).notFound.body}</p>
                <ul className="mt-6 space-y-2">
                  {links.map((x) => (
                    <li key={x.en}>
                      <Link href={x[l]} className="link-arrow text-on-dark">
                        <span>{x.label[i]}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
