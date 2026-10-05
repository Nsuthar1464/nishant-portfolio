"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

export type ScenePhase = "normal" | "alert" | "contained";
export default function CharacterScene({
  variant = "work",
  phase = "normal",
  showStatus = false,
}: {
  variant?: "work" | "security";
  phase?: ScenePhase;
  showStatus?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    angleX: number;
    angleY: number;
  } | null>(null);
  const reduced = useReducedMotion();
  const angleX = useMotionValue(0),
    angleY = useMotionValue(0);
  const sx = useSpring(angleX, { stiffness: 75, damping: 19, mass: 1.1 });
  const sy = useSpring(angleY, { stiffness: 75, damping: 19, mass: 1.1 });
  const shift = useTransform(sy, [-28, 28], [-8, 8]);
  const [dragging, setDragging] = useState(false);
  const clamp = (v: number) => Math.max(-28, Math.min(28, v));
  const reset = () => {
    angleX.set(0);
    angleY.set(0);
  };
  useEffect(() => {
    if (reduced || !matchMedia("(pointer:fine)").matches) return;
    const move = (e: PointerEvent) => {
      if (drag.current) return;
      const r = host.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > innerHeight) return;
      angleY.set(
        Math.max(
          -11,
          Math.min(11, ((e.clientX - r.left - r.width / 2) / innerWidth) * 23),
        ),
      );
      angleX.set(
        Math.max(
          -7,
          Math.min(7, (-(e.clientY - r.top - r.height / 2) / innerHeight) * 15),
        ),
      );
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, angleX, angleY]);
  const release = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    drag.current = null;
    setDragging(false);
  };
  return (
    <div
      className={`interactive-scene ${variant}-character-scene ${dragging ? "is-dragging" : ""}`}
    >
      <div
        className="character-art-stage"
        ref={host}
        role="img"
        tabIndex={0}
        aria-label={
          variant === "work"
            ? "Nishant’s original seated cartoon character. Drag to tilt the whole scene; arrow keys tilt; Home resets."
            : "Nishant’s small cartoon character in front of a floating bars-and-chart panel. Drag to tilt; arrow keys tilt; Home resets."
        }
        onPointerDown={(e) => {
          if (reduced || e.pointerType === "touch" || e.button !== 0) return;
          drag.current = {
            id: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            angleX: angleX.get(),
            angleY: angleY.get(),
          };
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.id !== e.pointerId) return;
          angleY.set(clamp(d.angleY + (e.clientX - d.x) * 0.12));
          angleX.set(clamp(d.angleX - (e.clientY - d.y) * 0.1));
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={() => {
          drag.current = null;
          setDragging(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Home") {
            e.preventDefault();
            reset();
          } else if (
            !reduced &&
            ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
          ) {
            e.preventDefault();
            if (e.key === "ArrowLeft") angleY.set(clamp(angleY.get() - 5));
            if (e.key === "ArrowRight") angleY.set(clamp(angleY.get() + 5));
            if (e.key === "ArrowUp") angleX.set(clamp(angleX.get() + 5));
            if (e.key === "ArrowDown") angleX.set(clamp(angleX.get() - 5));
          }
        }}
      >
        <motion.div
          className="character-art-motion"
          style={reduced ? {} : { rotateX: sx, rotateY: sy, x: shift }}
        >
          <motion.div
            animate={reduced ? {} : { y: [0, -9, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {variant === "security" ? (
              <div
                className={`chart-character-composition chart-phase-${phase}`}
              >
                <div className="floating-chart-board" aria-hidden="true">
                  <div className="chart-browser-window">
                    <div className="chart-window-dots">
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="chart-long-bar" />
                    <div className="chart-short-bars">
                      <i />
                      <i />
                    </div>
                  </div>
                  <svg
                    className="chart-trend"
                    viewBox="0 0 600 360"
                    fill="none"
                  >
                    <path
                      className="chart-line-shadow"
                      d="M190 310 L280 260 L405 340 L555 155"
                    />
                    <path
                      className="chart-line"
                      d="M190 310 L280 260 L405 340 L555 155"
                    />
                    {[
                      [190, 310],
                      [280, 260],
                      [405, 340],
                      [555, 155],
                    ].map(([x, y], i) => (
                      <g key={i}>
                        <circle
                          className="chart-node-shadow"
                          cx={x}
                          cy={y + 5}
                          r="13"
                        />
                        <circle className="chart-node" cx={x} cy={y} r="12" />
                        <circle
                          className="chart-node-hole"
                          cx={x}
                          cy={y}
                          r="5"
                        />
                      </g>
                    ))}
                  </svg>
                </div>
                <Image
                  className="small-tablet-character"
                  src="/images/nishant-tablet-character.webp"
                  alt="Nishant’s original curly-haired character, small and standing with a tablet in front of blue bars and a chart"
                  width={800}
                  height={1200}
                  sizes="(max-width:600px) 50vw, 250px"
                  draggable={false}
                />
              </div>
            ) : (
              <Image
                src="/images/nishant-workspace.webp"
                alt="Nishant’s original curly-haired cartoon, seated on a purple stool with a laptop"
                width={900}
                height={1200}
                sizes="(max-width:600px) 85vw, (max-width:980px) 440px, 36vw"
                draggable={false}
              />
            )}
          </motion.div>
        </motion.div>
      </div>
      <div className="scene-toolbar">
        <span>
          {dragging
            ? "MOVE TO TILT THE SCENE"
            : "DRAG TO TILT · CURSOR REACTIVE"}
        </span>
        <button onClick={reset} aria-label={`Reset ${variant} character view`}>
          <RotateCcw size={14} />
        </button>
      </div>
      {variant === "security" && showStatus && (
        <div className={`threat-terminal terminal-${phase}`} role="status">
          <span>THREAT WATCH / SIMULATED LAB</span>
          <strong>
            {phase === "alert"
              ? "Privilege escalation detected"
              : phase === "contained"
                ? "Incident contained"
                : "Identity telemetry online"}
          </strong>
          <code>
            {phase === "alert"
              ? "> unexpected IT-Security membership"
              : phase === "contained"
                ? "> account disabled · access removed"
                : "> audit logs → KQL → detection"}
          </code>
        </div>
      )}
    </div>
  );
}
