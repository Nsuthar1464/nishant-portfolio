"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "motion/react";
import { HERO_MODEL_URL } from "@/data/character3D";

// Model path comes from the lightweight config module so Character can decide
// whether to load this (heavy) component at all. While null, a placeholder head
// renders so the 3D plumbing can be verified without an asset.
const MODEL_URL = HERO_MODEL_URL;

// Tuning — orientation/scale differ per generated model, so these are the knobs
// to adjust when the real .glb lands (sign flips if the head turns the wrong way).
const TARGET_SIZE = 2.2;   // world units the model's largest dimension fills
const MAX_YAW = 0.5;       // rad (~28°) left/right head turn at full cursor offset
const MAX_PITCH = 0.32;    // rad (~18°) up/down head tilt
const EASE = 0.14;         // per-frame approach to target (trailing follow)
const SETTLE = 1e-4;       // below this delta the on-demand loop stops rendering

function fit(object: THREE.Object3D) {
  const clone = object.clone(true);
  const box = new THREE.Box3().setFromObject(clone);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  clone.position.sub(center); // recenter so rotation pivots about the head's middle
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  clone.scale.setScalar(TARGET_SIZE / maxDim);
  return clone;
}

function HeadModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const fitted = useMemo(() => fit(scene), [scene]);
  return <primitive object={fitted} />;
}

function Placeholder() {
  // Stand-in head so the scene renders before a real model exists.
  return (
    <mesh>
      <icosahedronGeometry args={[1.1, 4]} />
      <meshStandardMaterial color="#8b7bd8" roughness={0.45} metalness={0.1} />
    </mesh>
  );
}

function Scene({ x, y, active, reduced }: {
  x: MotionValue<number>; y: MotionValue<number>; active: boolean; reduced: boolean | null;
}) {
  const pivot = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);

  // Kick the on-demand render loop when the cursor (spring) changes or activity flips.
  useEffect(() => {
    const kick = () => invalidate();
    const ux = x.on("change", kick), uy = y.on("change", kick);
    kick();
    return () => { ux(); uy(); };
  }, [x, y, active, reduced, invalidate]);

  useFrame(() => {
    const g = pivot.current;
    if (!g) return;
    const tracking = active && !reduced;
    const targetYaw = (tracking ? x.get() : 0) * MAX_YAW;
    const targetPitch = -(tracking ? y.get() : 0) * MAX_PITCH;
    g.rotation.y += (targetYaw - g.rotation.y) * EASE;
    g.rotation.x += (targetPitch - g.rotation.x) * EASE;
    // Keep rendering only while still easing; once settled the loop goes quiet.
    if (Math.abs(targetYaw - g.rotation.y) > SETTLE || Math.abs(targetPitch - g.rotation.x) > SETTLE) {
      invalidate();
    }
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[2, 3, 4]} intensity={1.6} />
      {/* Cool rim light to echo the blue edge-light in the artwork. */}
      <directionalLight position={[-3, 1, -2]} intensity={0.9} color="#6ea8ff" />
      <group ref={pivot}>
        {MODEL_URL
          ? <Suspense fallback={null}><HeadModel url={MODEL_URL} /></Suspense>
          : <Placeholder />}
      </group>
    </>
  );
}

export default function Character3D({ x, y, active, reduced }: {
  x: MotionValue<number>; y: MotionValue<number>; active: boolean; reduced: boolean | null;
}) {
  return (
    <Canvas
      frameloop="demand"               // render on invalidate only — no perpetual loop
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4.2], fov: 35 }}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <Scene x={x} y={y} active={active} reduced={reduced} />
    </Canvas>
  );
}

if (MODEL_URL) useGLTF.preload(MODEL_URL);
