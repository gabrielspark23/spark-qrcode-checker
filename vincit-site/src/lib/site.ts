/**
 * Dados da firma. Campos vazios = decisão em aberto (PRD §14).
 * Enquanto vazios, os CTAs caem na página de contato em vez de um link quebrado.
 */
export const site = {
  name: "Vincit Capital", // D6 — nome único, igual ao wordmark
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vincitcapital.com", // D5
  osLoginUrl: process.env.NEXT_PUBLIC_OS_LOGIN_URL ?? "https://vincit-os.vercel.app/login",
  scheduleUrl: process.env.NEXT_PUBLIC_SCHEDULE_URL ?? "", // D9 — link de horários do GHL
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "16197630843", // publicado em vincitfinancial.com
  phone: "+16197630843", // publicado em vincitfinancial.com
  phoneDisplay: "+1 (619) 763-0843",
  email: "contato@vincitcapital.com.br", // publicado em vincitfinancial.com — confirmar e-mail com domínio americano
  address: { line1: "2535 Kettner Blvd", city: "San Diego", region: "CA", postal: "92101", country: "US" }, // publicado em vincitfinancial.com
  instagram: "https://www.instagram.com/vincit.capital",
  linkedin: "https://www.linkedin.com/company/vincit-financial",
} as const;

export function whatsappHref(text: string): string | null {
  if (!site.whatsappNumber) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
