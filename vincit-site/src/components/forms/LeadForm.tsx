"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CircleAlert, RotateCcw } from "lucide-react";
import { SendMark } from "./SendMark";
import { Button } from "@/components/ui/Button";
import { track } from "@/components/layout/EventDelegate";
import { ASSETS, CONSENT_TEXT_VERSION, TOPICS, validateLead, type FieldErrors, type LeadPayload } from "@/lib/lead";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "done" | "success" | "error";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function utm(): LeadPayload["source"]["utm"] {
  const q = new URLSearchParams(window.location.search);
  return {
    source: q.get("utm_source") ?? "",
    medium: q.get("utm_medium") ?? "",
    campaign: q.get("utm_campaign") ?? "",
    content: q.get("utm_content") ?? "",
  };
}

export function LeadForm({ locale, t }: { locale: Locale; t: Dict }) {
  const f = t.form;
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const successRef = useRef<HTMLDivElement>(null);
  // a confirmação ocupa o lugar do formulário: leva a leitura até ela
  useEffect(() => {
    if (status !== "success") return;
    const el = successRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, [status]);
  const [started, setStarted] = useState(false);
  const [messageLen, setMessageLen] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function onFirstInput() {
    if (!started) {
      setStarted(true);
      track("form_start", { page: window.location.pathname });
    }
  }

  async function submit(form: HTMLFormElement) {
    const d = new FormData(form);
    const s = (k: string) => String(d.get(k) ?? "").trim();
    const payload: Partial<LeadPayload> = {
      locale,
      name: s("name"),
      email: s("email"),
      phone: s("phone") || undefined,
      residence: { country: s("country"), state: s("state") || undefined },
      topic: s("topic") as LeadPayload["topic"],
      investableAssets: (s("assets") || null) as LeadPayload["investableAssets"],
      message: s("message") || undefined,
      preferredLanguage: (s("language") || locale) as LeadPayload["preferredLanguage"],
      consent: {
        contact: d.get("consent") === "on",
        whatsapp: d.get("consentWhatsapp") === "on",
        textVersion: CONSENT_TEXT_VERSION,
        acceptedAt: new Date().toISOString(),
      },
      source: { page: window.location.pathname, referrer: document.referrer || undefined, utm: utm() },
      website: s("website"),
    };

    const errs = validateLead(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      track("form_error", { reason: "validation" });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("submitting");
    try {
      // tempo mínimo de envio: a animação precisa ser percebida, mesmo com resposta instantânea
      const [res] = await Promise.all([
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        wait(900),
      ]);
      if (res.status === 400) {
        const data = (await res.json().catch(() => ({}))) as { errors?: FieldErrors };
        setErrors(data.errors ?? {});
        setStatus("idle");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done"); // escudo se preenche: confirmação visual
      track("form_submit", { topic: payload.topic ?? "" });
      await wait(950);
      setStatus("success");
      return;
    } catch {
      setStatus("error");
      track("form_error", { reason: "network" });
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className="border border-line bg-surface p-8 outline-none sm:p-10" role="status" aria-live="polite">
        <span className="success-mark inline-flex h-14 w-14 items-center justify-center rounded-full border border-brass/50 text-ink">
          <SendMark state="done" />
        </span>
        <h3 className="h3 mt-6">{f.success.title}</h3>
        <p className="mt-3 text-ink-2">{f.success.body}</p>
        <ol className="mt-6 space-y-4">
          {f.success.steps.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="text-sm tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[0.9375rem]">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const busy = status === "submitting" || status === "done";
  const errorCount = Object.keys(errors).length;
  const describe = (name: keyof FieldErrors, hint?: string) =>
    [errors[name] ? id(`${name}-error`) : null, hint ? id(`${name}-hint`) : null].filter(Boolean).join(" ") || undefined;

  const label = "mb-2 block text-sm font-medium text-ink";
  const req = <span className="ml-1 text-ink-3" aria-hidden>*</span>;
  const errorText = (name: keyof FieldErrors) =>
    errors[name] ? (
      <p id={id(`${name}-error`)} className="mt-2 flex items-start gap-1.5 text-sm text-danger">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
        {f.errors[name]}
      </p>
    ) : null;

  return (
    <form
      ref={formRef}
      noValidate
      onInput={onFirstInput}
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
      className="relative border border-line bg-surface p-6 sm:p-10"
      aria-describedby={id("required-note")}
    >
      <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {status === "error" ? (
          <div className="mb-8 flex flex-col gap-4 border border-danger/40 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm text-danger">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              {f.errors.network}
            </p>
            <button
              type="button"
              onClick={() => formRef.current && submit(formRef.current)}
              className="link-arrow self-start text-sm text-ink"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              <span>{f.errors.retry}</span>
            </button>
          </div>
        ) : errorCount > 0 ? (
          <p className="mb-8 flex items-start gap-2 border border-danger/40 bg-danger/5 p-4 text-sm text-danger">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
            {f.errors.summary}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={id("name")} className={label}>{f.name}{req}</label>
          <input id={id("name")} name="name" autoComplete="name" required className="field"
            aria-invalid={errors.name || undefined} aria-describedby={describe("name")} />
          {errorText("name")}
        </div>

        <div>
          <label htmlFor={id("email")} className={label}>{f.email}{req}</label>
          <input id={id("email")} name="email" type="email" autoComplete="email" inputMode="email" required className="field"
            aria-invalid={errors.email || undefined} aria-describedby={describe("email")} />
          {errorText("email")}
        </div>

        <div>
          <label htmlFor={id("phone")} className={label}>{f.phone}</label>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+1" className="field"
            aria-invalid={errors.phone || undefined} aria-describedby={describe("phone", f.phoneHint)} />
          <p id={id("phone-hint")} className="mt-2 text-xs text-ink-3">{f.phoneHint}</p>
          {errorText("phone")}
        </div>

        <div>
          <label htmlFor={id("country")} className={label}>{f.country}</label>
          <select id={id("country")} name="country" className="field" defaultValue="US">
            {(Object.keys(f.countries) as Array<keyof typeof f.countries>).map((c) => (
              <option key={c} value={c}>{f.countries[c]}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={id("state")} className={label}>{f.state}</label>
          <input id={id("state")} name="state" autoComplete="address-level1" placeholder={f.statePlaceholder} className="field" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id("topic")} className={label}>{f.topic}{req}</label>
          <select id={id("topic")} name="topic" required className="field" defaultValue=""
            aria-invalid={errors.topic || undefined} aria-describedby={describe("topic")}>
            <option value="" disabled>—</option>
            {TOPICS.map((k) => (
              <option key={k} value={k}>{f.topics[k]}</option>
            ))}
          </select>
          {errorText("topic")}
        </div>

        <div>
          <label htmlFor={id("assets")} className={label}>{f.assets}</label>
          <select id={id("assets")} name="assets" className="field" defaultValue="">
            <option value="">—</option>
            {ASSETS.map((k) => (
              <option key={k} value={k}>{f.assetsOptions[k]}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={id("language")} className={label}>{f.language}</label>
          <select id={id("language")} name="language" className="field" defaultValue={locale}>
            {(["pt", "en", "es"] as const).map((k) => (
              <option key={k} value={k}>{f.languages[k]}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor={id("message")} className="block text-sm font-medium text-ink">{f.message}</label>
            <span className={cn("text-xs tabular-nums", messageLen > 1000 ? "text-danger" : "text-ink-3")} aria-hidden>
              {messageLen}/1000
            </span>
          </div>
          <textarea id={id("message")} name="message" rows={5} maxLength={1200} className="field"
            onChange={(e) => setMessageLen(e.target.value.length)}
            aria-invalid={errors.message || undefined} aria-describedby={describe("message", f.messageHint)} />
          <p id={id("message-hint")} className="mt-2 text-xs text-ink-3">{f.messageHint}</p>
          {errorText("message")}
        </div>

        {/* Honeypot: invisível para pessoas */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
          <label htmlFor={id("website")}>Website</label>
          <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <fieldset className="space-y-4 border-t border-line pt-6 sm:col-span-2">
          <legend className="sr-only">Consent</legend>
          <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-ink-2">
            <input type="checkbox" name="consent" className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
              aria-invalid={errors.consent || undefined} aria-describedby={describe("consent")} />
            <span>
              {f.consent.replace(/(Privacy Policy|Política de Privacidade)\.$/, "")}
              <Link href={href("privacy", locale)} className="font-medium text-ink underline underline-offset-4">
                {locale === "pt" ? "Política de Privacidade" : "Privacy Policy"}
              </Link>
              .{req}
            </span>
          </label>
          {errorText("consent")}
          <label className="flex cursor-pointer gap-3 text-sm text-ink-2">
            <input type="checkbox" name="consentWhatsapp" className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]" />
            <span>{f.consentWhatsapp}</span>
          </label>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={id("required-note")} className="text-xs text-ink-3">* {f.required}</p>
        <Button
          type="submit"
          size="lg"
          disabled={busy}
          className={cn("lead-submit", busy && "btn-sending", status === "done" && "btn-sent")}
          icon={busy ? "none" : "arrow"}
          leading={busy ? <SendMark state={status === "done" ? "done" : "sending"} /> : undefined}
        >
          {status === "done" ? f.sent : busy ? f.sending : f.submit}
        </Button>
        <span className="sr-only" role="status" aria-live="polite">{busy ? (status === "done" ? f.sent : f.sending) : ""}</span>
      </div>
    </form>
  );
}
