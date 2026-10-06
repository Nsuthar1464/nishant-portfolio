"use client";

import { useRef } from "react";
import AttentionLayers from "./AttentionLayers";
import Image from "next/image";
import { useAnimationActivity } from "./useAnimationActivity";
import { motion, useReducedMotion } from "motion/react";

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
  const reduced = useReducedMotion();
  const active = useAnimationActivity(host);
  return (
    <div
      className={`interactive-scene ${variant}-character-scene `}
    >
      <div
        className="character-art-stage"
        ref={host}
        role="img"
        tabIndex={0}
        aria-label={
          variant === "work"
            ? "Nishant’s original seated cartoon character. Original character artwork."
            : "Nishant’s small cartoon character in front of a floating bars-and-chart panel. Original character artwork."
        }

      >
        <motion.div
          className="character-art-motion"
          style={{}}
        >
          <motion.div
            className="character-idle scene-idle"
            style={{ animationPlayState: active && !reduced ? "running" : "paused" }}
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
                <div className="small-tablet-character"><AttentionLayers pose="security"><Image
                  
                  src="/images/nishant-tablet-character.webp"
                  alt="Nishant’s original curly-haired character, small and standing with a tablet in front of blue bars and a chart"
                  width={800}
                  height={1200}
                  sizes="(max-width:600px) 50vw, 250px"
                  draggable={false}
                /></AttentionLayers></div>
              </div>
            ) : (
              <AttentionLayers pose="work"><Image
                src="/images/nishant-workspace.webp"
                alt="Nishant’s original curly-haired cartoon, seated on a purple stool with a laptop"
                width={900}
                height={1200}
                sizes="(max-width:600px) 85vw, (max-width:980px) 440px, 36vw"
                draggable={false}
              /></AttentionLayers>
            )}
          </motion.div>
        </motion.div>
      </div>
      <div className="scene-toolbar">
        <span>
          NISHANT · SECURITY IN MIND
        </span>

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
