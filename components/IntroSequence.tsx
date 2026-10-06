"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * First-load startup sequence: a constellation/network forms, a status line
 * cycles, a progress bar fills, then the whole overlay fades into the hero.
 *
 * Performance contract:
 * - Pure declarative SVG + CSS animations (opacity / transform / stroke-dashoffset).
 *   No requestAnimationFrame, no canvas, no perpetual loop.
 * - The overlay fully UNMOUNTS when the sequence ends, so no animation work
 *   survives the intro.
 * - Rendered in the initial markup (state starts visible) so it covers the hero
 *   from first paint with no flash; the CSS exit also fades it even before the
 *   JS unmount runs, so a stalled hydration can never leave it stuck on screen.
 * - Honors prefers-reduced-motion: the network is shown already-formed and the
 *   overlay leaves almost immediately, with no motion.
 */

const STATUS = [
  "initializing interface",
  "loading systems",
  "building profile",
  "ready",
];

const OUTER = 10;
const CX = 300;
const CY = 200;

export default function IntroSequence() {
  const [phase, setPhase] = useState<"run" | "exit" | "done">("run");

  const { outer, spokes, ring } = useMemo(() => {
    const rx = 215;
    const ry = 118;
    const outer = Array.from({ length: OUTER }, (_, i) => {
      const a = ((-90 + i * (360 / OUTER)) * Math.PI) / 180;
      return { x: CX + rx * Math.cos(a), y: CY + ry * Math.sin(a) };
    });
    const spokes = outer.map((n) => ({ x1: CX, y1: CY, x2: n.x, y2: n.y }));
    const ring = outer.map((n, i) => {
      const m = outer[(i + 1) % OUTER];
      return { x1: n.x, y1: n.y, x2: m.x, y2: m.y };
    });
    return { outer, spokes, ring };
  }, []);

  useEffect(() => {
    const reduced =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitAt = reduced ? 650 : 3000;
    const doneAt = reduced ? 1050 : 3650;
    const t1 = setTimeout(() => setPhase("exit"), exitAt);
    const t2 = setTimeout(() => setPhase("done"), doneAt);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`intro-overlay${phase === "exit" ? " intro-overlay--exit" : ""}`}
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="intro-stage" aria-hidden="true">
        <svg
          className="intro-net"
          viewBox="0 0 600 400"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          {ring.map((l, i) => (
            <line
              key={`r${i}`}
              className="intro-edge"
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              pathLength={1}
              style={{ animationDelay: `${1.15 + i * 0.07}s` }}
            />
          ))}
          {spokes.map((l, i) => (
            <line
              key={`s${i}`}
              className="intro-edge intro-edge--spoke"
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              pathLength={1}
              style={{ animationDelay: `${0.6 + i * 0.08}s` }}
            />
          ))}
          <circle className="intro-halo" cx={CX} cy={CY} r={18} />
          {outer.map((n, i) => (
            <circle
              key={`n${i}`}
              className="intro-node"
              cx={n.x}
              cy={n.y}
              r={3.2}
              style={{ animationDelay: `${0.18 + i * 0.12}s` }}
            />
          ))}
          <circle
            className="intro-node intro-node--core"
            cx={CX}
            cy={CY}
            r={6.5}
            style={{ animationDelay: "0s" }}
          />
        </svg>

        <div className="intro-status">
          {STATUS.map((s, i) => (
            <span
              key={s}
              className={`intro-status__line${i === STATUS.length - 1 ? " intro-status__line--final" : ""}`}
              style={
                i === STATUS.length - 1
                  ? undefined
                  : { animationDelay: `${0.15 + i * 0.85}s` }
              }
            >
              {s}
            </span>
          ))}
        </div>

        <div className="intro-progress">
          <span className="intro-progress__fill" />
        </div>
      </div>
    </div>
  );
}
