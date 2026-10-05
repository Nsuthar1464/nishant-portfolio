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
import { profile } from "@/data/portfolio";

export default function Character() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 62, damping: 17, mass: 1.3 });
  const sy = useSpring(y, { stiffness: 62, damping: 17, mass: 1.3 });
  const rotateY = useTransform(sx, [-1, 1], [-18, 18]);
  const rotateX = useTransform(sy, [-1, 1], [12, -12]);
  const rotateZ = useTransform(sx, [-1, 1], [-4, 4]);
  const tx = useTransform(sx, [-1, 1], [-12, 12]);
  const [hello, setHello] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (reduced || !matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = root.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > innerHeight) return;
      x.set(
        Math.max(
          -1,
          Math.min(1, (e.clientX - r.left - r.width / 2) / (innerWidth / 2)),
        ),
      );
      y.set(
        Math.max(
          -1,
          Math.min(1, (e.clientY - r.top - r.height / 2) / (innerHeight / 2)),
        ),
      );
    };
    const reset = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, [reduced, x, y]);
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
        style={reduced ? {} : { rotateY, rotateX, rotateZ, x: tx }}
        onClick={greet}
        aria-label="Say hello to Nishant’s character"
      >
        <motion.div
          animate={reduced ? {} : { y: [0, -12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={profile.avatar}
            alt="Nishant’s original floating cartoon head, with curly black hair and a beard"
            width={1100}
            height={1100}
            preload
            sizes="(max-width: 600px) 85vw, (max-width: 1000px) 55vw, 48vw"
          />
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
