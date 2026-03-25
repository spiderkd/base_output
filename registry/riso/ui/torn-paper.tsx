"use client";

// registry/new-york/ui/torn-paper.tsx — Torn Paper Divider ★
//
// Visual system:
//   - SVG <path> simulating a torn paper edge between sections
//   - Tear line generated from a seed using a deterministic PRNG (Mulberry32)
//   - Secondary shadow line 2px below the primary tear
//   - Above the tear: paper color
//   - Below the tear: optional fill (primary ink, secondary, or none)
//   - Seeds produce consistent unique tears

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type TearFill = "paper" | "primary" | "secondary" | "overlap" | "none";

interface TornPaperProps extends RisoThemeProps {
  seed?: number;
  height?: number;      // total height of the element (tear takes ~half)
  fill?: TearFill;
  flipY?: boolean;      // flip upside down
  className?: string;
  style?: React.CSSProperties;
}

// Mulberry32 PRNG — deterministic, zero deps
function mulberry32(seed: number) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateTearPath(seed: number, width: number, midY: number, roughness: number): string {
  const rand = mulberry32(seed);
  const POINTS = 40;
  const pts: [number, number][] = [];

  for (let i = 0; i <= POINTS; i++) {
    const x = (i / POINTS) * width;
    const noise = (rand() - 0.5) * roughness * 2;
    const base = midY + noise;
    pts.push([x, base]);
  }

  // Build cubic bezier path
  let d = `M 0 0 L 0 ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cpx = (x0 + x1) / 2;
    d += ` C ${cpx} ${y0} ${cpx} ${y1} ${x1} ${y1}`;
  }
  d += ` L ${width} 0 Z`;
  return d;
}

const FILL_COLORS: Record<TearFill, string> = {
  paper: "var(--riso-paper,#f7f0e2)",
  primary: "var(--riso-primary)",
  secondary: "var(--riso-secondary)",
  overlap: "var(--riso-overlap,#7b4f7a)",
  none: "transparent",
};

export function TornPaper({ seed = 42,
  height = 48,
  fill = "paper",
  flipY = false,
  className,
  style, theme, primary, secondary, overlap, paper }: TornPaperProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const midY = height * 0.5;
  const roughness = height * 0.35;

  const primaryPath = generateTearPath(seed, 1000, midY, roughness);
  const shadowPath = generateTearPath(seed, 1000, midY + 2, roughness);

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{
        ...risoStyle, ...({
          height,
          transform: flipY ? "scaleY(-1)" : undefined,
          ...style,
        })
      }}
      aria-hidden
    >
      <svg
        width="100%" height={height}
        viewBox={`0 0 1000 ${height}`}
        preserveAspectRatio="none"
      >
        {/* Secondary shadow tear — 2px below */}
        <path
          d={shadowPath}
          fill="var(--riso-secondary)"
          opacity="0.45"
        />

        {/* Primary tear */}
        <path
          d={primaryPath}
          fill={FILL_COLORS[fill]}
        />

        {/* Grain texture on the torn area */}
        <defs>
          <filter id={`torn-grain-${seed}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch" result="n" />
            <feColorMatrix type="saturate" values="0" in="n" result="g" />
            <feBlend in="SourceGraphic" in2="g" mode="multiply" result="b" />
            <feComposite in="b" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <path
          d={primaryPath}
          fill="var(--riso-paper,#f7f0e2)"
          filter={`url(#torn-grain-${seed})`}
          opacity="0.15"
        />
      </svg>
    </div>
  );
}


