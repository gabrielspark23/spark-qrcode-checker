/**
 * Dados da firma. Campos vazios = decisão em aberto (PRD §14).
 * Enquanto vazios, os CTAs caem na página de contato em vez de um link quebrado.
 */
export const site = {
  name: "Vincit Capital", // D6 — nome único, igual ao wordmark
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vincitcapital.com", // D5
  osLoginUrl: process.env.NEXT_PUBLIC_OS_LOGIN_URL ?? "https://vincit-os.vercel.app/login",
  scheduleUrl: process.env.NEXT_PUBLIC_SCHEDULE_URL ?? "", // D9 — link de horários do GHL
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", // D10 — E.164 sem "+", ex.: 16195550100
  phone: "", // D8
  phoneDisplay: "", // D8
  email: "", // D5/D6
  address: { line1: "", city: "San Diego", region: "CA", postal: "", country: "US" }, // D8
  instagram: "https://www.instagram.com/vincit.capital",
  linkedin: "https://www.linkedin.com/company/vincit-financial",
} as const;

export function whatsappHref(text: string): string | null {
  if (!site.whatsappNumber) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
