"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { CircleAlert, RotateCcw } from "lucide-react";
import { SendMark } from "./SendMark";
import { BrandSelect } from "./BrandSelect";
import { SuccessTakeover } from "./SuccessTakeover";
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
  const [takeover, setTakeover] = useState<{ stage: HTMLElement; origin: { x: number; y: number }; name?: string } | null>(null);
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
      setStatus("done"); // logo cheia → sai → "Enviado"
      track("form_submit", { topic: payload.topic ?? "" });
      await wait(1350);
      // o círculo de confirmação nasce do botão e cobre a seção inteira
      const btn = form.querySelector<HTMLElement>("button[type=submit]");
      const stage = (form.closest("[data-contact-stage]") as HTMLElement | null) ?? form.parentElement!;
      const sr = stage.getBoundingClientRect();
      const br = btn?.getBoundingClientRect();
      const origin = br ? { x: br.left + br.width / 2 - sr.left, y: br.top + br.height / 2 - sr.top } : { x: sr.width / 2, y: sr.height / 2 };
      setTakeover({ stage, origin, name: payload.name });
      setStatus("success");
      return;
    } catch {
      setStatus("error");
      track("form_error", { reason: "network" });
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
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
    <>
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
          <BrandSelect id={id("country")} name="country" defaultValue="US"
            options={(Object.keys(f.countries) as Array<keyof typeof f.countries>).map((c) => ({ value: c, label: f.countries[c] }))} />
        </div>

        <div>
          <label htmlFor={id("state")} className={label}>{f.state}</label>
          <input id={id("state")} name="state" autoComplete="address-level1" placeholder={f.statePlaceholder} className="field" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id("topic")} className={label}>{f.topic}{req}</label>
          <BrandSelect id={id("topic")} name="topic" required invalid={!!errors.topic} describedBy={describe("topic")}
            options={TOPICS.map((k) => ({ value: k, label: f.topics[k] }))} />
          {errorText("topic")}
        </div>

        <div>
          <label htmlFor={id("assets")} className={label}>{f.assets}</label>
          <BrandSelect id={id("assets")} name="assets"
            options={[{ value: "", label: "—" }, ...ASSETS.map((k) => ({ value: k, label: f.assetsOptions[k] }))]} />
        </div>

        <div>
          <label htmlFor={id("language")} className={label}>{f.language}</label>
          <BrandSelect id={id("language")} name="language" defaultValue={locale}
            options={(["pt", "en", "es"] as const).map((k) => ({ value: k, label: f.languages[k] }))} />
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
            <input type="checkbox" name="consent" className="bcheck mt-0.5 shrink-0"
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
            <input type="checkbox" name="consentWhatsapp" className="bcheck mt-0.5 shrink-0" />
            <span>{f.consentWhatsapp}</span>
          </label>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={id("required-note")} className="text-xs text-ink-3">* {f.required}</p>
        <Button
          type="submit"
          size="lg"
          disabled={busy || status === "success"}
          className={cn("lead-submit", (busy || status === "success") && "btn-sending", (status === "done" || status === "success") && "btn-sent")}
          icon={busy || status === "success" ? "none" : "arrow"}
        >
          {busy || status === "success" ? (
            <>
              {/* só a logo: enche em loop; ao concluir, pulsa e sai, e "Enviado" entra */}
              <span className="send-slot" aria-hidden>
                <SendMark state={status === "submitting" ? "sending" : "done"} />
              </span>
              <span className={status === "submitting" ? "sr-only" : "sent-label"}>{status === "submitting" ? f.sending : f.sent}</span>
            </>
          ) : (
            f.submit
          )}
        </Button>
        <span className="sr-only" role="status" aria-live="polite">{busy ? (status === "done" ? f.sent : f.sending) : ""}</span>
      </div>
    </form>
    {takeover ? (
      <SuccessTakeover
        stage={takeover.stage}
        origin={takeover.origin}
        name={takeover.name}
        locale={locale}
        t={t}
        onReset={() => {
          // volta ao formulário limpo, no topo da seção
          formRef.current?.reset();
          setErrors({});
          setMessageLen(0);
          setTakeover(null);
          setStatus("idle");
          requestAnimationFrame(() => {
            takeover.stage.scrollIntoView({ block: "start" });
            formRef.current?.querySelector<HTMLInputElement>("input[name=name]")?.focus({ preventScroll: true });
          });
        }}
      />
    ) : null}
    </>
  );
}
