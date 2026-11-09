// Gera a malha de pontos do globo (só terra) e o SVG estático de fallback.
// Rodar após mudar a vista inicial ou o espaçamento:  node scripts/build-globe.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { geoContains, geoOrthographic, geoPath, geoCircle } from "d3-geo";
import { feature } from "topojson-client";

const land = JSON.parse(readFileSync("node_modules/world-atlas/land-110m.json", "utf8"));
const countries = JSON.parse(readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"));
const landGeo = feature(land, land.objects.land);
const all = feature(countries, countries.objects.countries).features;
const BR = all.find((f) => String(f.id) === "076");
const US = all.find((f) => String(f.id) === "840");

const STEP = 1.25; // graus, área ~ constante
const pts = [];
for (let lat = -84; lat <= 84; lat += STEP) {
  const step = STEP / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  for (let lon = -180; lon < 180; lon += step) {
    const p = [lon, lat];
    if (!geoContains(landGeo, p)) continue;
    const tag = geoContains(BR, p) ? 1 : geoContains(US, p) ? 2 : 0;
    pts.push(Math.round(lon * 10), Math.round(lat * 10), tag);
  }
}
writeFileSync("src/components/globe/dots.json", JSON.stringify(pts));
console.log("dots:", pts.length / 3);

// ---- SVG estático (mesma vista inicial do globo interativo)
const ROT = [86, -2, 0];
const SIZE = 640;
const proj = geoOrthographic().scale(SIZE / 2 - 4).translate([SIZE / 2, SIZE / 2]).rotate(ROT).clipAngle(90);
const path = geoPath(proj);
const SD = [-117.1611, 32.7157], POA = [-51.2044, -30.0254], CXS = [-51.1794, -29.1678];
const visible = (lon, lat) => {
  const r = Math.PI / 180, [l, f] = [-ROT[0], -ROT[1]];
  return Math.sin(f * r) * Math.sin(lat * r) + Math.cos(f * r) * Math.cos(lat * r) * Math.cos((lon - l) * r) > 0.02;
};
const color = ["#9a9ca4", "#c2a263", "#e3dfd8"];
let dots = "";
for (let i = 0; i < pts.length; i += 3) {
  const lon = pts[i] / 10, lat = pts[i + 1] / 10, t = pts[i + 2];
  if (!visible(lon, lat)) continue;
  const [x, y] = proj([lon, lat]);
  dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${t ? 1.6 : 1.3}" fill="${color[t]}"${t ? "" : ' fill-opacity="0.75"'}/>`;
}
const arc = path({ type: "LineString", coordinates: [SD, POA] });
const ring = (c, r, o) => { const [x, y] = proj(c); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="none" stroke="#c2a263" stroke-opacity="${o}"/>`; };
const dot = (c, r, f) => { const [x, y] = proj(c); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${f}"/>`; };
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">` +
  `<circle cx="320" cy="320" r="316" fill="none" stroke="#2a2e37"/>` +
  `<circle cx="338" cy="306" r="316" fill="none" stroke="#c2a263" stroke-opacity="0.22"/>` +
  dots +
  `<path d="${arc}" fill="none" stroke="#c2a263" stroke-width="1.25"/>` +
  ring(SD, 9, 0.6) + dot(SD, 3.5, "#c2a263") + ring(POA, 9, 0.6) + dot(POA, 3.5, "#c2a263") + dot(CXS, 2.5, "#f5f5f4") +
  `</svg>`;
writeFileSync("public/globe-static.svg", svg);
console.log("static svg:", (svg.length / 1024).toFixed(0), "kB");
