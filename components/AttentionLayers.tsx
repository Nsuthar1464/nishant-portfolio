"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useAnimationActivity } from "./useAnimationActivity";
import { avatarLayers, type AvatarPose } from "@/data/avatarLayers";

// Aligned transparent layers use exactly the same canvas as the original image.
export default function AttentionLayers({ pose, children, onReady }: { pose: AvatarPose; children: ReactNode; onReady?: (ready: boolean) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const active = useAnimationActivity(host);
  const reduced = useReducedMotion();
  const layers = avatarLayers[pose];
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    onReady?.(false);
    if (!layers?.enabled) return;
    // Preload every configured layer. No broken image or partially loaded face
    // becomes visible. Only these one-time load transitions update React state.
    const paths = [layers.head, layers.leftPupil, layers.rightPupil,
      ...(layers.body ? [layers.body] : []), ...(layers.eyeMask ? [layers.eyeMask] : [])];
    Promise.all(paths.map(src => new Promise<void>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => {
        if (image.naturalWidth !== layers.canvas.width || image.naturalHeight !== layers.canvas.height) reject(new Error("Layer dimensions differ"));
        else resolve();
      };
      image.onerror = () => reject(new Error("Layer unavailable"));
      image.src = src;
    }))).then(() => {
      if (!cancelled) { setReady(true); onReady?.(true); }
    }).catch(() => { /* Keep the original fallback on missing/misaligned assets. */ });
    return () => { cancelled = true; };
  }, [layers, onReady]);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, layers?.spring ?? { stiffness: 110, damping: 24, mass: 1 });
  const sy = useSpring(y, layers?.spring ?? { stiffness: 110, damping: 24, mass: 1 });
  const headX = useTransform(sy, [-1, 1], [layers?.headLimit.pitch ?? 0, -(layers?.headLimit.pitch ?? 0)]);
  const headY = useTransform(sx, [-1, 1], [-(layers?.headLimit.yaw ?? 0), layers?.headLimit.yaw ?? 0]);
  const leftX = useMotionValue(0), leftY = useMotionValue(0);
  const rightX = useMotionValue(0), rightY = useMotionValue(0);
  const slx = useSpring(leftX, layers?.spring), sly = useSpring(leftY, layers?.spring);
  const srx = useSpring(rightX, layers?.spring), sry = useSpring(rightY, layers?.spring);
  const pupilX = useTransform(slx, [-1, 1], [-(layers?.pupilLimit.x ?? 0), layers?.pupilLimit.x ?? 0]);
  const pupilY = useTransform(sly, [-1, 1], [-(layers?.pupilLimit.y ?? 0), layers?.pupilLimit.y ?? 0]);
  const rightPupilX = useTransform(srx, [-1, 1], [-(layers?.pupilLimit.x ?? 0), layers?.pupilLimit.x ?? 0]);
  const rightPupilY = useTransform(sry, [-1, 1], [-(layers?.pupilLimit.y ?? 0), layers?.pupilLimit.y ?? 0]);
  useEffect(() => {
    const neutral = () => { x.set(0); y.set(0); leftX.set(0); leftY.set(0); rightX.set(0); rightY.set(0); };
    if (!ready || !layers || !active || reduced) { neutral(); return; }
    const el = host.current;
    if (!el || !matchMedia("(pointer: fine)").matches) return;
    let frame = 0, px = 0, py = 0;
    const reset = () => { cancelAnimationFrame(frame); frame = 0; neutral(); };
    const move = (e: PointerEvent) => {
      px = e.clientX; py = e.clientY;
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        x.set(Math.max(-1, Math.min(1, (px - r.left - r.width / 2) / (r.width / 2))));
        y.set(Math.max(-1, Math.min(1, (py - r.top - r.height / 2) / (r.height / 2))));
        // Each eye attends from its own neutral center, independently of head tilt.
        const aim = (mx: typeof x, my: typeof y, cx: number, cy: number) => {
          mx.set(Math.max(-1, Math.min(1, (px - r.left - r.width * cx) / (r.width / 2))));
          my.set(Math.max(-1, Math.min(1, (py - r.top - r.height * cy) / (r.height / 2))));
        };
        aim(leftX, leftY, 467 / 1254, 730 / 1254);
        aim(rightX, rightY, 775 / 1254, 712 / 1254);
      });
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => { reset(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", reset); window.removeEventListener("blur", reset); };
  }, [ready, layers, active, reduced, x, y, leftX, leftY, rightX, rightY]);
  return <div ref={host} className="attention-layers">
    {ready && layers ? <>
      {/* Retain the original image’s intrinsic layout without displaying it. */}
      <div aria-hidden="true" style={{ visibility: "hidden" }}>{children}</div>
      {layers.body && <img className="attention-base" src={layers.body} alt="" draggable={false} />}
      <motion.div className="attention-head" role="img" aria-label="Nishant’s character looking toward the cursor" style={{ rotateX: headX, rotateY: headY, transformOrigin: layers.headOrigin }}>
        <img src={layers.head} alt="" draggable={false} />
        {(["left", "right"] as const).map((eye) => {
          const offset = layers.pupilOffsets?.[eye] ?? [0, 0];
          const maskOffset = layers.maskOffsets?.[eye] ?? [0, 0];
          return <div key={eye} style={{ position: "absolute", inset: 0,
            transform: `translate(${maskOffset[0] / layers.canvas.width * 100}%, ${maskOffset[1] / layers.canvas.height * 100}%)`,
            clipPath: eye === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
            maskImage: layers.eyeMask ? `url("${layers.eyeMask}")` : undefined,
            WebkitMaskImage: layers.eyeMask ? `url("${layers.eyeMask}")` : undefined,
            maskSize: "100% 100%", WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskMode: "alpha" }}>
            <motion.img src={eye === "left" ? layers.leftPupil : layers.rightPupil} alt="" draggable={false}
              style={{ left: `${(offset[0] - maskOffset[0]) / layers.canvas.width * 100}%`,
                top: `${(offset[1] - maskOffset[1]) / layers.canvas.height * 100}%`,
                scale: pose === "hero" ? 0.78 : 1,
                transformOrigin: eye === "left" ? "38.96% 51.67%" : "40.79% 59.93%",
                x: eye === "left" ? pupilX : rightPupilX, y: eye === "left" ? pupilY : rightPupilY }} />
          </div>;
        })}
      </motion.div>
    </> : children}
  </div>;
}
