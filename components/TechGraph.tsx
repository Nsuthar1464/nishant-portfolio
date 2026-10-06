"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimationActivity } from "./useAnimationActivity";
import { useReducedMotion } from "motion/react";

const technologies = [
  ["Microsoft Sentinel", 0],
  ["Entra ID", 0],
  ["Azure", 0],
  ["KQL", 0],
  ["Log Analytics", 0],
  ["MITRE ATT&CK", 0],
  ["AWS", 0],
  ["Terraform", 1],
  ["GitHub Actions", 1],
  ["tfsec", 1],
  ["Checkov", 1],
  ["RBAC", 1],
  ["Least privilege", 1],
  ["Access reviews", 1],
  ["Linux", 2],
  ["TCP/IP", 2],
  ["DNS", 2],
  ["DHCP", 2],
  ["VLANs", 2],
  ["Cisco", 2],
  ["SSH", 2],
  ["UFW", 2],
  ["Tailscale", 2],
  ["JavaScript", 3],
  ["HTML", 3],
  ["CSS", 3],
  ["Web Crypto API", 3],
  ["REST APIs", 3],
  ["Git", 3],
  ["Docker", 3],
  ["GitHub Pages", 3],
] as const;
const colors = ["#c9abff", "#eeabc7", "#aebded", "#d3c5ef"];
const aliases: Record<string, string> = {
  "microsoft entra id": "Entra ID",
  "html / css": "HTML",
  "ufw / fail2ban": "UFW",
  ubuntu: "Linux",
  haveibeenpwned: "REST APIs",
};
export default function TechGraph({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const active = useAnimationActivity(canvas);
  const activeRef = useRef(active);
  activeRef.current = active;
  const redraw = useRef<() => void>(() => {});
  useEffect(() => redraw.current(), [active]);
  const selectedRef = useRef(selected);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  useEffect(() => redraw.current(), [selected]);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  selectedRef.current = selected;

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    let width = 700,
      height = 600,
      angle = 0.3,
      tilt = -0.18,
      zoom = 1,
      frame = 0,
      visible = true;
    let last = 0,
      pointer: { x: number; y: number } | null = null,
      dragging = false,
      moved = false;
    let pointerId: number | null = null,
      hoverIndex = -1;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const nodes = technologies.map(([label, group], i) => {
      const y = 1 - (i / (technologies.length - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      return {
        label,
        group,
        x: Math.cos(golden * i) * radius,
        y,
        z: Math.sin(golden * i) * radius,
      };
    });
    const edges: [number, number][] = [];
    nodes.forEach((node, i) => {
      const neighbors = nodes
        .map((n, j) => ({
          j,
          d: Math.hypot(node.x - n.x, node.y - n.y, node.z - n.z),
        }))
        .filter((n) => n.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      neighbors.forEach((n) => {
        if (i < n.j) edges.push([i, n.j]);
      });
    });
    let projected: { x: number; y: number; z: number; scale: number }[] = [];
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const radius = Math.min(width * 0.31, height * 0.38) * zoom;
      projected = nodes.map((n) => {
        const x = n.x * Math.cos(angle) + n.z * Math.sin(angle);
        const z = -n.x * Math.sin(angle) + n.z * Math.cos(angle);
        const y = n.y * Math.cos(tilt) - z * Math.sin(tilt);
        const depth = n.y * Math.sin(tilt) + z * Math.cos(tilt);
        const scale = 3 / (3 - depth);
        return {
          x: width / 2 + x * radius * scale,
          y: height / 2 + y * radius * scale,
          z: depth,
          scale,
        };
      });
      const value = selectedRef.current;
      const target = aliases[value?.toLowerCase() || ""] || value;
      const selectedIndex = nodes.findIndex(
        (n) => n.label.toLowerCase() === target?.toLowerCase(),
      );
      const focus = hoverIndex >= 0 ? hoverIndex : selectedIndex;
      const connected = new Set<number>();
      edges.forEach(([a, b]) => {
        if (a === focus || b === focus) {
          connected.add(a);
          connected.add(b);
        }
      });
      edges.forEach(([a, b]) => {
        const pa = projected[a],
          pb = projected[b];
        const highlighted = a === focus || b === focus;
        const alpha = highlighted
          ? 0.8
          : focus >= 0
            ? 0.055
            : 0.14 + (pa.z + pb.z + 2) * 0.075;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = highlighted ? "#f1c4ff" : colors[nodes[a].group];
        ctx.lineWidth = highlighted ? 1.9 : 1.2;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });
      [...nodes.keys()]
        .sort((a, b) => projected[a].z - projected[b].z)
        .forEach((i) => {
          const p = projected[i],
            n = nodes[i],
            hot = i === focus;
          const dim = focus >= 0 && !connected.has(i) && !hot;
          ctx.globalAlpha = dim ? 0.16 : 0.35 + (p.z + 1) * 0.31;
          ctx.fillStyle = hot ? "#fff" : colors[n.group];
          ctx.shadowColor = colors[n.group];
          ctx.shadowBlur = hot ? 8 : 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, hot ? 5 : 2 * p.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.font = `${hot ? 600 : 400} ${Math.max(10, (width < 450 ? 10 : 12) * p.scale)}px 'IBM Plex Mono', monospace`;
          ctx.fillStyle = hot ? "#f5edff" : "#d5cce1";
          ctx.globalAlpha = dim ? 0.15 : hot ? 1 : 0.26 + (p.z + 1) * 0.3;
          const textWidth = ctx.measureText(n.label).width;
          const tx = Math.min(
            width - textWidth - 8,
            Math.max(8, p.x - textWidth / 2),
          );
          ctx.fillText(n.label, tx, p.y + (p.y < height / 2 ? -12 : 19));
        });
      ctx.globalAlpha = 1;
    };
    const resize = () => {
      const rect = el.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      el.width = width * dpr;
      el.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    let dirty = true;
    const invalidate = () => {
      dirty = true;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const tick = (now: number) => {
      frame = 0;
      const rotating = activeRef.current && !reduced && visible && !dragging && hoverIndex < 0;
      if (rotating && now - last < 1000 / 30) {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (rotating) angle += Math.min(now - last || 33, 50) * 0.000065;
      if (visible && !document.hidden && (dirty || rotating)) draw();
      dirty = false;
      last = now;
      if (rotating) frame = requestAnimationFrame(tick);
    };
    redraw.current = invalidate;
    const hover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left,
        py = e.clientY - r.top;
      if (dragging && pointer) {
        const dx = e.clientX - pointer.x;
        const dy = e.clientY - pointer.y;
        angle += dx * 0.006;
        tilt = Math.max(-1, Math.min(1, tilt + dy * 0.006));
        if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
        pointer = { x: e.clientX, y: e.clientY };
        invalidate();
        return;
      }
      let distance = 23,
        index = -1;
      projected.forEach((p, i) => {
        const d = Math.hypot(px - p.x, py - p.y);
        if (d < distance) {
          distance = d;
          index = i;
        }
      });
      if (index === hoverIndex) return;
      hoverIndex = index;
      el.style.cursor = index >= 0 ? "pointer" : "grab";
      setHovered(index >= 0 ? nodes[index].label : null);
      invalidate();
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      dragging = true;
      moved = false;
      pointer = { x: e.clientX, y: e.clientY };
      pointerId = e.pointerId;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const up = () => {
      if (!moved && hoverIndex >= 0) onSelectRef.current(nodes[hoverIndex].label);
      dragging = false;
      pointer = null;
      if (pointerId !== null && el.hasPointerCapture(pointerId))
        el.releasePointerCapture(pointerId);
      pointerId = null;
      invalidate();
    };
    const leave = () => {
      if (!dragging) {
        hoverIndex = -1;
        setHovered(null);
        invalidate();
      }
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom = Math.min(1.38, Math.max(0.65, zoom - e.deltaY * 0.0008));
      invalidate();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") angle -= 0.12;
      else if (e.key === "ArrowRight") angle += 0.12;
      else if (e.key === "ArrowUp") tilt -= 0.1;
      else if (e.key === "ArrowDown") tilt += 0.1;
      else if (e.key === "+" || e.key === "=")
        zoom = Math.min(1.38, zoom + 0.08);
      else if (e.key === "-") zoom = Math.max(0.65, zoom - 0.08);
      else return;
      e.preventDefault();
      invalidate();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) invalidate();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    intersection.observe(el);
    el.addEventListener("pointermove", hover);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("keydown", key);
    resize();
    invalidate();
    return () => {
      redraw.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      el.removeEventListener("pointermove", hover);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("keydown", key);
    };
  }, [reduced]);

  return (
    <div className="tech-network">
      <canvas
        ref={canvas}
        role="img"
        tabIndex={0}
        aria-label="Interactive rotating network of Nishant’s technologies. Drag to rotate, scroll to zoom, or use arrow keys and plus/minus. A text list follows."
      />
      <div className="network-status" role="status">
        {hovered || selected ? (
          <>
            <span>{hovered || selected}</span>
            <button
              onClick={() => onSelect(null)}
              aria-label="Clear technology selection"
            >
              ×
            </button>
          </>
        ) : (
          "CLOUD · SECURITY · SYSTEMS · WEB"
        )}
      </div>
      <details className="technology-list">
        <summary>View all technologies</summary>
        <div>
          {technologies.map(([t]) => (
            <button
              key={t}
              onClick={() => onSelect(t)}
              aria-pressed={selected === t}
            >
              {t}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
