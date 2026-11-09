import { Compass, ShieldCheck, Landmark, Scale, Globe, ScrollText, type LucideIcon } from "lucide-react";

/** Ícones de linha, monocromáticos (PRD §8.6). */
export const serviceIcons: Record<string, LucideIcon> = {
  planning: Compass,
  protection: ShieldCheck,
  wealth: Landmark,
  tax: Scale,
  offshore: Globe,
  estate: ScrollText,
};
