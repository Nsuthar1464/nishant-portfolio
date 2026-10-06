"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { MotionValue } from "motion/react";
import { heroDirections, heroSpritePath, heroSpriteSettings, neighboringHeroDirection, selectHeroDirection, type HeroDirection } from "@/data/heroDirections";

export default function DirectionalHead({ x, y, active, reduced, children }: {
  x: MotionValue<number>; y: MotionValue<number>; active: boolean; reduced: boolean | null; children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLImageElement>(null), second = useRef<HTMLImageElement>(null);
  const decoded = useRef<HTMLImageElement[]>([]);
  const activity = useRef({ active, reduced });
  const sampleRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    activity.current = { active, reduced };
    sampleRef.current?.();
  }, [active, reduced]);
  useEffect(() => {
    // Preserve mobile/reduced-motion fallback; do not download unused angles.
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    Promise.all(heroDirections.map(d => new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => image.naturalWidth === 1254 && image.naturalHeight === 1254
        ? image.decode().then(() => resolve(image), reject) : reject(new Error("Invalid hero sprite dimensions"));
      image.onerror = reject;
      image.src = heroSpritePath(d);
    }))).then(images => {
      if (!disposed) { decoded.current = images; setReady(true); }
    }).catch(() => {}); // A missing sprite keeps the original artwork visible.
    return () => { disposed = true; decoded.current = []; };
  }, []);
  useEffect(() => {
    if (!ready || !first.current || !second.current) return;
    const layers = [first.current, second.current];
    let current: HeroDirection = "center", visible = 0;
    let candidate: HeroDirection = "center", candidateSince = performance.now();
    let busy = false, disposed = false;
    let dwell: ReturnType<typeof setTimeout> | undefined;
    let finish: ReturnType<typeof setTimeout> | undefined;
    const sample = () => {
      if (disposed) return;
      const tracking = activity.current.active && !activity.current.reduced && matchMedia("(pointer: fine)").matches;
      const target = tracking ? selectHeroDirection(x.get(), y.get(), current) : "center";
      const now = performance.now();
      if (target !== candidate) { candidate = target; candidateSince = now; }
      if (dwell) { clearTimeout(dwell); dwell = undefined; }
      if (busy || target === current) return;
      const remaining = tracking ? heroSpriteSettings.dwellMs - (now - candidateSince) : 0;
      if (remaining > 0) {
        dwell = setTimeout(sample, remaining);
        return;
      }
      const next = tracking ? neighboringHeroDirection(current, target, x.get(), y.get()) : "center";
      const outgoing = visible, incoming = 1 - visible;
      busy = true;
      // Only the fully hidden persistent layer changes src. Decode before displaying it.
      layers[incoming].src = heroSpritePath(next);
      layers[incoming].decode().then(() => {
        if (disposed) return;
        const duration = activity.current.reduced || document.hidden || !document.hasFocus()
          ? 0 : heroSpriteSettings.crossfadeMs;
        // Cover-first crossfade: the incoming pose fades in ON TOP while the
        // outgoing one stays fully opaque beneath it, so total coverage never
        // dips below 100%. A symmetric dissolve (both at ~50% mid-fade) let the
        // dark background bleed through the head for a frame — the "black
        // flicker". Here the face is always covered by at least the outgoing
        // layer; once the incoming is fully opaque it occludes the outgoing,
        // which we then hide instantly (invisible, as it's completely behind).
        layers[incoming].style.zIndex = "2";
        layers[outgoing].style.zIndex = "1";
        layers[incoming].style.transition = `opacity ${duration}ms ease-out`;
        layers[outgoing].style.transition = "none";
        // Flush its hidden starting opacity once per switch, never on every frame.
        void layers[incoming].offsetWidth;
        layers[incoming].style.opacity = "1";
        current = next;
        visible = incoming;
        if (root.current) root.current.dataset.heroDirection = next;
        finish = setTimeout(() => {
          if (disposed) return;
          layers[outgoing].style.opacity = "0"; // occluded already — instant hide is invisible
          busy = false;
          sample();
        }, duration);
      }).catch(() => {
        // Keep the outgoing image if an unexpected decode fails; retry on new input.
        busy = false;
      });
    };
    sampleRef.current = sample;
    const stopX = x.on("change", sample), stopY = y.on("change", sample);
    sample();
    return () => {
      disposed = true;
      stopX(); stopY();
      clearTimeout(dwell); clearTimeout(finish);
      sampleRef.current = null;
    };
  }, [ready, x, y]);
  const layerStyle = { position: "absolute", inset: 0, width: "100%", height: "100%", maxHeight: "none", objectFit: "contain", objectPosition: "50% 50%", pointerEvents: "none" } as const;
  return <div ref={root} style={{ position: "relative" }} data-hero-direction={ready ? "center" : "fallback"}>
    <div style={{ visibility: ready ? "hidden" : "visible" }}>{children}</div>
    {ready && <>
      {/* These two DOM elements persist; neither remounts during a transition. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={first} src={heroSpritePath("center")} alt="Nishant’s cartoon head" style={{ ...layerStyle, opacity: 1 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={second} src={heroSpritePath("center")} alt="" aria-hidden style={{ ...layerStyle, opacity: 0 }} />
    </>}
  </div>;
}
