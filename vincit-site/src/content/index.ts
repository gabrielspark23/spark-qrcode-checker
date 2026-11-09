import type { Locale } from "@/lib/i18n";
import { en, type Dict } from "./en";
import { pt } from "./pt";

const dicts: Record<Locale, Dict> = { en, pt };

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

export type { Dict };
