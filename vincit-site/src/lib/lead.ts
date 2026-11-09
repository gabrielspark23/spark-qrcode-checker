/** Contrato do lead (PRD §7.1). O site valida e repassa; não guarda nada. */
export const TOPICS = ["planning", "protection", "wealth", "tax", "offshore", "estate", "other"] as const;
export const ASSETS = ["prefer_not", "under_250k", "250k_500k", "500k_1m", "1m_5m", "over_5m"] as const;
export const CONSENT_TEXT_VERSION = "2026-11-v1";

export type Topic = (typeof TOPICS)[number];
export type Assets = (typeof ASSETS)[number];

export type LeadPayload = {
  locale: "en" | "pt";
  name: string;
  email: string;
  phone?: string;
  residence: { country: string; state?: string };
  topic: Topic;
  investableAssets: Assets | null;
  message?: string;
  preferredLanguage: "en" | "pt" | "es";
  consent: { contact: boolean; whatsapp: boolean; textVersion: string; acceptedAt: string };
  source: { page: string; referrer?: string; utm: Record<"source" | "medium" | "campaign" | "content", string> };
  turnstileToken?: string;
  website?: string; // honeypot
};

export type FieldErrors = Partial<Record<"name" | "email" | "phone" | "topic" | "consent" | "message", true>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const E164 = /^\+[1-9]\d{7,14}$/;

export function normalizePhone(raw: string) {
  return raw.replace(/[\s().-]/g, "");
}

export function validateLead(p: Partial<LeadPayload>): FieldErrors {
  const e: FieldErrors = {};
  if (!p.name || p.name.trim().length < 2) e.name = true;
  if (!p.email || !EMAIL.test(p.email.trim())) e.email = true;
  if (p.phone && !E164.test(normalizePhone(p.phone))) e.phone = true;
  if (!p.topic || !TOPICS.includes(p.topic)) e.topic = true;
  if (!p.consent?.contact) e.consent = true;
  if (p.message && p.message.length > 1000) e.message = true;
  return e;
}
