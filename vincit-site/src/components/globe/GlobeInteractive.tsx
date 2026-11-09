"use client";

import { useEffect, useRef } from "react";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeoPermissibleObjects } from "d3-geo";
import { GLOBE_EVENT, ISO_BRAZIL, ISO_USA, SAN_DIEGO, VIEW_BR, VIEW_INITIAL, VIEW_US, type GlobeTarget } from "./config";

type Rot = [number, number, number];
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Globo interativo (canvas). Carregado sob demanda, só em dispositivos capazes.
 * - Arrastar gira; setas do teclado giram; botões externos focam EUA/Brasil ou voltam à vista inicial.
 * - Movimento automático muito sutil (oscila ±7°), pausado durante a interação e fora da tela.
 */
export default function GlobeInteractive({ label, onReady }: { label: string; onReady: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [{ geoOrthographic, geoPath, geoGraticule10, geoCentroid }, { feature }, worldMod] = await Promise.all([
        import("d3-geo"),
        import("topojson-client"),
        import("world-atlas/countries-110m.json"),
      ]);
      if (disposed) return;
      const world = (worldMod as { default?: unknown }).default ?? worldMod;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const topo = world as any;
      const countries = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry>;
      const brazil = countries.features.find((f) => String(f.id) === ISO_BRAZIL) as Feature<Geometry>;
      const usa = countries.features.find((f) => String(f.id) === ISO_USA) as Feature<Geometry>;
      const others = countries.features.filter((f) => f !== brazil && f !== usa);
      const brC = geoCentroid(brazil) as [number, number];
      const arc: GeoPermissibleObjects = { type: "LineString", coordinates: [SAN_DIEGO, brC] };
      const graticule = geoGraticule10();

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const proj = geoOrthographic().clipAngle(90);
      const path = geoPath(proj, ctx);

      let w = 0;
      let rot: Rot = [...VIEW_INITIAL];
      let base: Rot = [...VIEW_INITIAL];
      let active: GlobeTarget = "reset";
      let dragging = false;
      let lastInteract = 0;
      let tween: { from: Rot; to: Rot; t0: number; dur: number } | null = null;
      let visible = true;
      let raf = 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = rect.width;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(w * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        proj.scale(w / 2 - 4).translate([w / 2, w / 2]);
      };

      const draw = () => {
        proj.rotate(rot);
        ctx.clearRect(0, 0, w, w);
        ctx.beginPath(); path({ type: "Sphere" }); ctx.fillStyle = "#1c1f25"; ctx.fill();
        ctx.strokeStyle = "#2a2e37"; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); path(graticule); ctx.strokeStyle = "rgba(245,245,244,0.05)"; ctx.stroke();
        ctx.beginPath(); others.forEach((f) => path(f)); ctx.fillStyle = "#2a2e37"; ctx.fill();
        ctx.strokeStyle = "#16181d"; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); path(usa); ctx.fillStyle = active === "us" ? "#3d414d" : "#343843"; ctx.fill();
        ctx.strokeStyle = active === "us" ? "rgba(245,245,244,0.7)" : "rgba(245,245,244,0.35)"; ctx.lineWidth = active === "us" ? 1.2 : 0.8; ctx.stroke();
        ctx.beginPath(); path(brazil); ctx.fillStyle = active === "br" ? "rgba(194,162,99,0.42)" : "rgba(194,162,99,0.28)"; ctx.fill();
        ctx.strokeStyle = "#c2a263"; ctx.lineWidth = active === "br" ? 1.5 : 1; ctx.stroke();
        ctx.beginPath(); path(arc); ctx.strokeStyle = "#c2a263"; ctx.lineWidth = 1.5; ctx.stroke();
        const ring = (lonlat: [number, number], dot: boolean) => {
          const [lam, phi] = proj.rotate();
          // visível só no hemisfério da frente
          const toRad = Math.PI / 180;
          const cosc = Math.sin(-phi * toRad) * Math.sin(lonlat[1] * toRad) + Math.cos(-phi * toRad) * Math.cos(lonlat[1] * toRad) * Math.cos((lonlat[0] + lam) * toRad);
          if (cosc < 0) return;
          const p = proj(lonlat);
          if (!p) return;
          ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, Math.PI * 2); ctx.strokeStyle = "rgba(194,162,99,0.6)"; ctx.lineWidth = 1; ctx.stroke();
          if (dot) { ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, Math.PI * 2); ctx.fillStyle = "#c2a263"; ctx.fill(); }
        };
        ring(SAN_DIEGO, true);
        ring(brC, false);
      };

      const loop = (now: number) => {
        raf = 0;
        if (tween) {
          const k = Math.min(1, (now - tween.t0) / tween.dur);
          const e = easeInOut(k);
          rot = tween.from.map((v, i) => v + (tween!.to[i] - v) * e) as Rot;
          if (k >= 1) { base = [...tween.to]; tween = null; }
        } else if (!dragging && !reduced && now - lastInteract > 3500) {
          // deriva muito sutil em torno da vista atual
          rot = [base[0] + Math.sin(now / 5200) * 7, base[1], 0];
        }
        draw();
        if (visible && !disposed && (!reduced || tween || dragging)) raf = requestAnimationFrame(loop);
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

      const goTo = (target: GlobeTarget) => {
        active = target;
        const to: Rot = target === "us" ? [...VIEW_US] : target === "br" ? [...VIEW_BR] : [...VIEW_INITIAL];
        tween = { from: [...rot], to, t0: performance.now(), dur: reduced ? 1 : 900 };
        lastInteract = performance.now();
        kick();
      };

      // Arrastar
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
        const k = 90 / (w / 2);
        rot = [start.rot[0] + (e.clientX - start.x) * k, Math.max(-60, Math.min(60, start.rot[1] - (e.clientY - start.y) * k)), 0];
        kick();
      };
      const onUp = () => {
        dragging = false; start = null; base = [...rot]; lastInteract = performance.now();
        canvas.style.cursor = "grab";
      };
      const onKey = (e: KeyboardEvent) => {
        const step = 10;
        const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
        if (e.key === "Home") { e.preventDefault(); goTo("reset"); return; }
        const d = map[e.key];
        if (!d) return;
        e.preventDefault();
        tween = { from: [...rot], to: [rot[0] + d[0], Math.max(-60, Math.min(60, rot[1] + d[1])), 0], t0: performance.now(), dur: reduced ? 1 : 220 };
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
      window.addEventListener(GLOBE_EVENT, onTarget);
      io.observe(canvas);
      ro.observe(canvas);
      resize();
      draw();
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
  }, [onReady]);

  return (
    <canvas
      ref={canvasRef}
      className="globe-canvas absolute inset-0 h-full w-full cursor-grab touch-none rounded-full"
      role="img"
      aria-label={label}
      tabIndex={0}
    />
  );
}
