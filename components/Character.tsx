"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useAnimationActivity } from "./useAnimationActivity";
import { profile } from "@/data/portfolio";
import { HERO_MODEL_URL } from "@/data/character3D";

// WebGL head is loaded only when a model exists — keeps three.js out of the main
// bundle. ssr:false is required (Canvas is client-only) and, per this Next
// version, must live inside a Client Component — which this file is.
const Character3D = dynamic(() => import("./Character3D"), { ssr: false });

export default function Character() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const active = useAnimationActivity(root);
  // Gate the WebGL head on a fine pointer (desktop) — computed after mount so SSR
  // and first paint always match the lightweight sprite/flat path.
  const [pointerFine, setPointerFine] = useState(false);
  useEffect(() => { setPointerFine(matchMedia("(pointer: fine)").matches); }, []);
  const use3D = !!HERO_MODEL_URL && !reduced && pointerFine;
  const x = useMotionValue(0),
    y = useMotionValue(0);
  // Smooth with a clear lag (matches the reference's trailing follow), but a
  // touch livelier than before so the larger rotation doesn't feel sluggish.
  const sx = useSpring(x, { stiffness: 70, damping: 20, mass: 1.1 });
  const sy = useSpring(y, { stiffness: 70, damping: 20, mass: 1.1 });
  // This CSS tilt is the whole head motion now (the flat art can't truly turn),
  // so give it enough to read as a lean toward the cursor, but stay moderate — a
  // flat image rotated too far just looks skewed. Perspective + preserve-3d are
  // on the stage in CSS, so this reads as depth rather than a 2D shear.
  const rotateY = useTransform(sx, [-1, 1], [-11, 11]);
  const rotateX = useTransform(sy, [-1, 1], [8, -8]);
  const rotateZ = useTransform(sx, [-1, 1], [-3, 3]);
  // Subtle lean-in: biggest when the cursor is over the face, easing to 1 at the
  // edges — the reference reads as the head coming slightly closer.
  const scale = useTransform(() => {
    const d = Math.min(1, Math.hypot(sx.get(), sy.get()));
    return 1.04 - 0.04 * d;
  });
  const travelX = useMotionValue(78), travelY = useMotionValue(45);
  // Clamp spring output too: no overshoot can escape the configured bounds.
  const tx = useTransform(() => Math.max(-1, Math.min(1, sx.get())) * travelX.get());
  const ty = useTransform(() => Math.max(-1, Math.min(1, sy.get())) * travelY.get());
  useEffect(() => {
    const hero = root.current?.closest("section");
    if (!hero) return;
    const resize = () => {
      travelX.set(Math.min(78, hero.clientWidth * 0.075));
      travelY.set(Math.min(45, hero.clientHeight * 0.06));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(hero); resize();
    return () => observer.disconnect();
  }, [travelX, travelY]);
  const [hello, setHello] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!active || reduced) { x.set(0); y.set(0); return; }
    if (!matchMedia("(pointer: fine)").matches) return;
    let pending = 0;
    let latest: PointerEvent;
    const apply = () => {
      pending = 0;
      const e = latest;
      const r = root.current?.closest("section")?.getBoundingClientRect();
      if (!r) return;
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { reset(); return; }
      x.set(
        Math.max(
          -1,
          Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 2)),
        ),
      );
      y.set(
        Math.max(
          -1,
          Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height / 2)),
        ),
      );
    };
    const reset = () => {
      cancelAnimationFrame(pending); pending = 0;
      x.set(0);
      y.set(0);
    };
    const move = (e: PointerEvent) => {
      latest = e;
      if (!pending) pending = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      cancelAnimationFrame(pending);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [active, reduced, x, y]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const greet = () => {
    setHello(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setHello(false), 2200);
  };
  return (
    <div className="character-stage" ref={root}>
      <motion.button
        className="character-portrait"
        style={
          reduced
            ? {}
            : use3D
              // The model turns in real 3D, so drop the CSS pseudo-3D rotation
              // (it would just skew the flat canvas) and keep the depth lean only.
              ? { scale, x: tx, y: ty, transformOrigin: "50% 60%" }
              : { rotateY, rotateX, rotateZ, scale, x: tx, y: ty, transformOrigin: "50% 60%" }
        }
        onClick={greet}
        aria-label="Say hello to Nishant’s character"
      >
        <motion.div
          className="character-idle hero-idle"
          style={{ animationPlayState: active && !reduced ? "running" : "paused" }}
        >
          {use3D ? (
            // True-3D head: a real model rotated toward the cursor in WebGL.
            // Square box (matches the source art) gives the canvas its height.
            <div style={{ width: "100%", aspectRatio: "1 / 1", maxHeight: "calc(100svh - 150px)" }}>
              <Character3D x={sx} y={sy} active={active} reduced={reduced} />
            </div>
          ) : (
            // Single flat head with continuous parallax. The lean/tilt toward the
            // cursor comes from the button transform above (rotate + translate +
            // scale, all spring-smoothed). Nothing is ever swapped, so there is no
            // frame where the image "cuts" — it reads as smooth motion rather than
            // photos changing. This is the interim until a 3D model is dropped in.
            <Image
              src={profile.avatar}
              alt="Nishant’s original floating cartoon head, with curly black hair and a beard"
              width={1100}
              height={1100}
              preload
              sizes="(max-width: 600px) 85vw, (max-width: 1000px) 55vw, 48vw"
            />
          )}
        </motion.div>
      </motion.button>
      {hello && (
        <motion.div
          className="character-hello"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
        >
          Hey! Glad you’re here.
        </motion.div>
      )}
    </div>
  );
}
