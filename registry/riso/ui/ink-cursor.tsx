
"use client";

// registry/new-york/ui/ink-cursor.tsx — Risograph Ink Spread Cursor Trail ★
//
// Fix: uses createPortal so the canvas is appended to document.body and never
// trapped by a parent element's filter/transform stacking context.
// CSS vars read each draw frame so theme switches apply live.

import * as React from "react";
import { createPortal } from "react-dom";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface InkDot {
  id: number;
  x: number;
  y: number;
  r: number;
  ink: "primary" | "secondary";
  born: number;
  life: number;
}

interface InkCursorProps extends RisoThemeProps {
  maxDots?: number;
  dotLife?: number;
  dotRadius?: number;
  density?: number;
  style?: React.CSSProperties;
}

let _inkId = 0;

function InkCursorCanvas({
  maxDots = 80,
  dotLife = 800,
  dotRadius = 5,
  density = 12,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: InkCursorProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const dotsRef = React.useRef<InkDot[]>([]);
  const lastPos = React.useRef<{ x: number; y: number } | null>(null);
  const rafRef = React.useRef<number>(0);

  // Size canvas to viewport
  React.useEffect(() => {
    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Deposit dots on mousemove
  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (
        lastPos.current &&
        Math.hypot(x - lastPos.current.x, y - lastPos.current.y) < density
      )
        return;
      lastPos.current = { x, y };
      const id = ++_inkId;
      dotsRef.current = [
        ...dotsRef.current.slice(-(maxDots - 1)),
        {
          id,
          x: x + (Math.random() - 0.5) * 3,
          y: y + (Math.random() - 0.5) * 3,
          r: dotRadius * (0.7 + Math.random() * 0.6),
          ink: id % 2 === 0 ? "primary" : "secondary",
          born: Date.now(),
          life: dotLife * (0.8 + Math.random() * 0.4),
        },
      ];
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [density, dotLife, dotRadius, maxDots]);

  // Draw loop
  React.useEffect(() => {
    const draw = () => {
      const c = canvasRef.current;
      if (!c) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, c.width, c.height);

      const now = Date.now();
      const rootStyle = getComputedStyle(c);
      const pColor =
        rootStyle.getPropertyValue("--riso-primary").trim() || "#ff5e7e";
      const sColor =
        rootStyle.getPropertyValue("--riso-secondary").trim() || "#00a99d";

      dotsRef.current = dotsRef.current.filter((d) => now - d.born < d.life);

      ctx.globalCompositeOperation = "source-over";
      dotsRef.current.forEach((dot) => {
        const age = (now - dot.born) / dot.life;
        const alpha = Math.max(0, 1 - age) * 0.72;
        const r = dot.r * (1 + age * 0.35);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = dot.ink === "primary" ? pColor : sColor;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[9998] mix-blend-multiply"
      style={{ ...risoStyle, ...style }}
    />
  );
}

export function InkCursor(props: InkCursorProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(<InkCursorCanvas {...props} />, document.body);
}


