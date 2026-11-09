// Mapa pontilhado (equiretangular) das Américas para o fundo de "Onde estamos" (Sobre).
// Usa os mesmos pontos do globo (src/components/globe/dots.json). Gera public/where-map.svg.
import { readFileSync, writeFileSync } from "node:fs";
const raw = JSON.parse(readFileSync("src/components/globe/dots.json", "utf8"));
const LON0 = -150, LON1 = 10, LAT0 = 58, LAT1 = -48; // recorte
const W = 1600, H = Math.round((W * (LAT0 - LAT1)) / (LON1 - LON0));
const x = (lon) => ((lon - LON0) / (LON1 - LON0)) * W;
const y = (lat) => ((LAT0 - lat) / (LAT0 - LAT1)) * H;
let land = "", br = "", us = "";
for (let i = 0; i < raw.length; i += 3) {
  const lon = raw[i] / 10, lat = raw[i + 1] / 10, tag = raw[i + 2];
  if (lon < LON0 || lon > LON1 || lat > LAT0 || lat < LAT1) continue;
  const d = `M${x(lon).toFixed(1)} ${y(lat).toFixed(1)}h0`;
  if (tag === 1) br += d; else if (tag === 2) us += d; else land += d;
}
const SD = [-117.1611, 32.7157], POA = [-51.2044, -30.0254], CXS = [-51.1794, -29.1678];
const [sx, sy] = [x(SD[0]), y(SD[1])], [px, py] = [x(POA[0]), y(POA[1])], [cx, cy] = [x(CXS[0]), y(CXS[1])];
// arco: curva quadrática por cima do Atlântico/Pacífico, discreta
const mx = (sx + px) / 2 + 160, my = (sy + py) / 2 - 40;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none">
<style>
.ping{opacity:0;transform-box:fill-box;transform-origin:center}
@media (prefers-reduced-motion:no-preference){
.ping{animation:ping 2.8s cubic-bezier(.2,.7,.2,1) infinite}
.route{animation:route 3s linear infinite}
}
@keyframes ping{0%{opacity:.75;transform:scale(1)}100%{opacity:0;transform:scale(5.5)}}
@keyframes route{to{stroke-dashoffset:-36}}
</style>
<g stroke-linecap="round" stroke-width="6.4">
<path d="${land}" stroke="#1c1917" stroke-opacity=".17"/>
<path d="${us}" stroke="#1c1917" stroke-opacity=".26"/>
<path d="${br}" stroke="#c2a263" stroke-opacity=".6"/>
</g>
<path d="M${sx.toFixed(1)} ${sy.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}" stroke="#c2a263" stroke-opacity=".85" stroke-width="3.5" stroke-dasharray="6 12" stroke-linecap="round" class="route"/>
${[[sx, sy, 0], [px, py, 0.9], [cx, cy, 1.8]].map(([a, b, d]) => `<g transform="translate(${a.toFixed(1)} ${b.toFixed(1)})"><circle class="ping" r="12" stroke="#c2a263" stroke-width="3" style="animation-delay:${d}s"/><circle class="ping" r="12" stroke="#c2a263" stroke-width="3" style="animation-delay:${d + 1.4}s"/><circle r="26" stroke="#c2a263" stroke-opacity=".45" stroke-width="3"/><circle r="10" fill="#c2a263"/></g>`).join("")}
</svg>`;
writeFileSync("public/where-map.svg", svg);
console.log(W, H, (svg.length / 1024).toFixed(1) + " kB");
