"use client";

import { useEffect, useRef } from "react";
import { CAXIAS_DO_SUL, GLOBE_EVENT, PORTO_ALEGRE, SAN_DIEGO, VIEWS, type GlobeTarget } from "./config";

type Rot = [number, number, number];
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const R = Math.PI / 180;

/**
 * Globo interativo em pontos (canvas), carregado sob demanda em aparelhos capazes.
 * - Terra como malha de pontos: Brasil em latão, EUA em tom quente claro, resto em grafite claro.
 * - Esfera em traço fino + um segundo anel deslocado (o círculo "offset" da marca).
 * - Arco San Diego → Porto Alegre com um pulso que percorre a rota; anéis respiram nos escritórios.
 * - Arrastar e setas giram; botões externos focam (com zoom) San Diego, Porto Alegre, Caxias do Sul.
 */
export default function GlobeInteractive({
  label,
  onReady,
  decorative = false,
}: {
  label: string;
  onReady: () => void;
  /** Só ambiente (ex.: Contato): gira sozinho, sem foco de teclado nem botões externos. */
  decorative?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [{ geoOrthographic, geoPath, geoInterpolate }, dotsMod] = await Promise.all([import("d3-geo"), import("./dots.json")]);
      if (disposed) return;
      const raw = ((dotsMod as { default?: number[] }).default ?? dotsMod) as number[];
      const n = raw.length / 3;
      // pré-cálculo em radianos
      const lam = new Float32Array(n), sinPhi = new Float32Array(n), cosPhi = new Float32Array(n), tag = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        const lon = raw[i * 3] / 10, lat = raw[i * 3 + 1] / 10;
        lam[i] = lon * R; sinPhi[i] = Math.sin(lat * R); cosPhi[i] = Math.cos(lat * R); tag[i] = raw[i * 3 + 2];
      }
      const interp = geoInterpolate(SAN_DIEGO, PORTO_ALEGRE);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const proj = geoOrthographic().clipAngle(90);
      const path = geoPath(proj, ctx);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let w = 0;
      let rot: Rot = [...VIEWS.reset.rotate];
      let zoom = 1;
      let active: GlobeTarget = "reset";
      let dragging = false;
      let lastInteract = 0;
      let tween: { from: Rot; to: Rot; z0: number; z1: number; t0: number; dur: number } | null = null;
      let visible = true;
      let raf = 0;
      let lastFrame = 0;
      const SPIN = 4; // graus por segundo

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = rect.width;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(w * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        proj.translate([w / 2, w / 2]);
      };

      const front = (lonlat: [number, number]) => {
        const [l0, p0] = [-rot[0] * R, -rot[1] * R];
        return Math.sin(p0) * Math.sin(lonlat[1] * R) + Math.cos(p0) * Math.cos(lonlat[1] * R) * Math.cos(lonlat[0] * R - l0) > 0;
      };

      const draw = (now: number) => {
        const radius = (w / 2 - 6) * zoom;
        proj.rotate(rot).scale(radius);
        ctx.clearRect(0, 0, w, w);
        const c = w / 2;
        ctx.save();
        ctx.beginPath(); ctx.arc(c, c, w / 2 - 4, 0, Math.PI * 2); ctx.clip();

        // pontos (projeção ortográfica direta, mais rápida que d3 por ponto)
        const l0 = -rot[0] * R, p0 = -rot[1] * R;
        const sp0 = Math.sin(p0), cp0 = Math.cos(p0);
        const dotR = Math.min(3, 1.25 * Math.pow(zoom, 0.7));
        const fills = ["rgba(176,178,186,0.62)", "#c2a263", "rgba(232,228,221,0.95)"];
        for (let pass = 0; pass < 3; pass++) {
          ctx.fillStyle = fills[pass];
          ctx.beginPath();
          for (let i = 0; i < n; i++) {
            if (tag[i] !== pass) continue;
            const dl = lam[i] - l0;
            const cosc = sp0 * sinPhi[i] + cp0 * cosPhi[i] * Math.cos(dl);
            if (cosc <= 0) continue;
            const x = c + radius * cosPhi[i] * Math.sin(dl);
            const y = c - radius * (cp0 * sinPhi[i] - sp0 * cosPhi[i] * Math.cos(dl));
            if (x < -4 || x > w + 4 || y < -4 || y > w + 4) continue;
            // pontos perto da borda encolhem: sensação de volume sem sombra
            const r = dotR * (0.45 + 0.55 * cosc);
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
          ctx.fill();
        }

        // arco + pulso que percorre a rota
        ctx.beginPath(); path({ type: "LineString", coordinates: [SAN_DIEGO, PORTO_ALEGRE] });
        ctx.strokeStyle = "rgba(194,162,99,0.6)"; ctx.lineWidth = 1.25; ctx.stroke();
        if (!reduced) {
          const t = ((now / 3600) % 1);
          const seg: [number, number][] = [];
          for (let k = 0; k <= 12; k++) seg.push(interp(Math.max(0, Math.min(1, t - 0.14 + (k / 12) * 0.14))) as [number, number]);
          ctx.beginPath(); path({ type: "LineString", coordinates: seg });
          ctx.strokeStyle = "#d4bc8b"; ctx.lineWidth = 2; ctx.stroke();
        }

        // escritórios: ponto + anel que respira
        const breathe = reduced ? 0.5 : (Math.sin(now / 700) + 1) / 2;
        const city = (ll: [number, number], main: boolean, on: boolean) => {
          if (!front(ll)) return;
          const p = proj(ll);
          if (!p) return;
          ctx.beginPath(); ctx.arc(p[0], p[1], (on ? 13 : 9) + breathe * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(194,162,99,${on ? 0.85 : 0.35 + 0.25 * (1 - breathe)})`; ctx.lineWidth = 1; ctx.stroke();
          ctx.beginPath(); ctx.arc(p[0], p[1], main ? 3.5 : 2.6, 0, Math.PI * 2);
          ctx.fillStyle = main ? "#c2a263" : "#f5f5f4"; ctx.fill();
        };
        city(SAN_DIEGO, true, active === "us");
        city(CAXIAS_DO_SUL, false, active === "cxs");
        city(PORTO_ALEGRE, true, active === "poa");
        ctx.restore();

        // esfera: traço fino + anel deslocado (o círculo "offset" da marca)
        ctx.beginPath(); ctx.arc(c, c, w / 2 - 4, 0, Math.PI * 2);
        ctx.strokeStyle = "#2a2e37"; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(c + w * 0.028, c - w * 0.022, w / 2 - 4, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(194,162,99,0.22)"; ctx.stroke();
      };

      const loop = (now: number) => {
        raf = 0;
        if (tween) {
          const k = Math.min(1, (now - tween.t0) / tween.dur);
          const e = easeInOut(k);
          rot = tween.from.map((v, i) => v + (tween!.to[i] - v) * e) as Rot;
          zoom = tween.z0 + (tween.z1 - tween.z0) * e;
          if (k >= 1) tween = null;
        } else if (!dragging && !reduced && now - lastInteract > 3500) {
          // rotação contínua e lenta; depois de um foco com zoom, volta devagar à vista inicial
          const dt = lastFrame ? Math.min(64, now - lastFrame) / 1000 : 0;
          if (zoom > 1.01) {
            zoom += (1 - zoom) * Math.min(1, dt * 1.2);
            rot = [rot[0], rot[1] + (VIEWS.reset.rotate[1] - rot[1]) * Math.min(1, dt * 1.2), 0];
            active = "reset";
          }
          rot = [rot[0] + SPIN * dt, rot[1], 0];
        }
        lastFrame = now;
        draw(now);
        if (visible && !disposed && !reduced) raf = requestAnimationFrame(loop);
        else if (visible && !disposed && (tween || dragging)) raf = requestAnimationFrame(loop);
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

      const goTo = (target: GlobeTarget) => {
        active = target;
        const v = VIEWS[target];
        // girar pelo caminho mais curto
        const to: Rot = [...v.rotate];
        to[0] = rot[0] + ((((to[0] - rot[0]) % 360) + 540) % 360) - 180;
        tween = { from: [...rot], to, z0: zoom, z1: v.zoom, t0: performance.now(), dur: reduced ? 1 : 1000 };
        lastInteract = performance.now() + (target === "reset" ? 0 : 6000);
        kick();
      };

      let start: { x: number; y: number; rot: Rot } | null = null;
      const onDown = (e: PointerEvent) => {
        dragging = true; tween = null;
        start = { x: e.clientX, y: e.clientY, rot: [...rot] };
        canvas.setPointerCapture(e.pointerId);
        canvas.style.cursor = "grabbing";
        kick();
      };
      const onMove = (e: PointerEvent) => {
        if (!start) return;
        const k = 90 / ((w / 2) * zoom);
        rot = [start.rot[0] + (e.clientX - start.x) * k, Math.max(-60, Math.min(60, start.rot[1] - (e.clientY - start.y) * k)), 0];
        kick();
      };
      const onUp = () => {
        dragging = false; start = null; lastInteract = performance.now();
        canvas.style.cursor = "grab";
      };
      const onKey = (e: KeyboardEvent) => {
        const step = 10;
        const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
        if (e.key === "Home") { e.preventDefault(); goTo("reset"); return; }
        const d = map[e.key];
        if (!d) return;
        e.preventDefault();
        tween = { from: [...rot], to: [rot[0] + d[0], Math.max(-60, Math.min(60, rot[1] + d[1])), 0], z0: zoom, z1: zoom, t0: performance.now(), dur: reduced ? 1 : 220 };
        lastInteract = performance.now();
        kick();
      };
      const onTarget = (e: Event) => goTo((e as CustomEvent<GlobeTarget>).detail);

      const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) kick(); });
      const ro = new ResizeObserver(() => { resize(); kick(); });

      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
      canvas.addEventListener("keydown", onKey);
      if (!decorative) window.addEventListener(GLOBE_EVENT, onTarget);
      io.observe(canvas);
      ro.observe(canvas);
      resize();
      draw(performance.now());
      canvas.dataset.ready = "";
      onReady();
      kick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect(); ro.disconnect();
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        canvas.removeEventListener("keydown", onKey);
        window.removeEventListener(GLOBE_EVENT, onTarget);
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [onReady, decorative]);

  return (
    <canvas
      ref={canvasRef}
      className="globe-canvas absolute inset-0 h-full w-full cursor-grab touch-none rounded-full"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : 0}
    />
  );
}
