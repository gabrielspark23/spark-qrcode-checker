import type { MetadataRoute } from "next";
import { routes, type RouteKey } from "@/lib/i18n";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(routes) as RouteKey[]).flatMap((k) =>
    (["en", "pt"] as const).map((l) => ({
      url: site.url + (routes[k][l] === "/" ? "" : routes[k][l]),
      changeFrequency: "monthly" as const,
      priority: k === "home" ? 1 : 0.7,
      alternates: {
        languages: { en: site.url + (routes[k].en === "/" ? "" : routes[k].en), "pt-BR": site.url + routes[k].pt },
      },
    })),
  );
}
