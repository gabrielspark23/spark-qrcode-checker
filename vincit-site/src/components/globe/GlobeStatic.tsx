import { geoCentroid, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { ISO_BRAZIL, ISO_USA, SAN_DIEGO, VIEW_INITIAL } from "./config";

/**
 * Globo estático em SVG, calculado no servidor (zero JS no cliente).
 * É a versão de mobile, de dispositivos modestos, de movimento reduzido e sem JS,
 * e o primeiro quadro no desktop antes do globo interativo carregar.
 */
export function GlobeStatic({ label }: { label: string }) {
  const size = 640;
  const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
  const countries = feature(topo, topo.objects.countries) as FeatureCollection<Geometry>;
  const brazil = countries.features.find((f) => String(f.id) === ISO_BRAZIL) as Feature<Geometry>;
  const usa = countries.features.find((f) => String(f.id) === ISO_USA) as Feature<Geometry>;
  const proj = geoOrthographic().scale(size / 2 - 4).translate([size / 2, size / 2]).rotate(VIEW_INITIAL).clipAngle(90);
  const path = geoPath(proj);
  const br = geoCentroid(brazil);
  const arc = path({ type: "LineString", coordinates: [SAN_DIEGO, br] }) ?? "";
  const sd = proj(SAN_DIEGO) ?? [0, 0];
  const brP = proj(br) ?? [0, 0];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" role="img" aria-label={label}>
      <path d={path({ type: "Sphere" }) ?? ""} fill="#1c1f25" stroke="var(--color-navy-line)" />
      <path d={path(geoGraticule10()) ?? ""} fill="none" stroke="#f5f5f4" strokeOpacity="0.05" />
      {countries.features.map((f) =>
        f === brazil || f === usa ? null : <path key={String(f.id)} d={path(f) ?? ""} fill="#2a2e37" stroke="#16181d" strokeWidth="0.5" />,
      )}
      <path d={path(usa) ?? ""} fill="#343843" stroke="#f5f5f4" strokeOpacity="0.35" strokeWidth="0.8" />
      <path d={path(brazil) ?? ""} fill="#c2a263" fillOpacity="0.28" stroke="#c2a263" strokeWidth="1" />
      <path d={arc} fill="none" stroke="#c2a263" strokeWidth="1.5" />
      <circle cx={sd[0]} cy={sd[1]} r="10" fill="none" stroke="#c2a263" strokeOpacity="0.6" />
      <circle cx={sd[0]} cy={sd[1]} r="4" fill="#c2a263" />
      <circle cx={brP[0]} cy={brP[1]} r="10" fill="none" stroke="#c2a263" strokeOpacity="0.6" />
    </svg>
  );
}
