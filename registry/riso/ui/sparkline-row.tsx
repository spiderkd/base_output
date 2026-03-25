"use client";

// registry/new-york/ui/sparkline-row.tsx — Risograph Sparkline Row
// Composable inline mini-chart for use inside tables or lists.

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface SparklineRowProps extends RisoThemeProps {
  data: number[];
  width?: number;
  height?: number;
  ink?: "primary" | "secondary";
  className?: string;
  style?: React.CSSProperties;
}

export function SparklineRow({ data,
  width = 80,
  height = 28,
  ink = "primary",
  className, theme, primary, secondary, overlap, paper, style }: SparklineRowProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  if (data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const PAD = 3;
  const pts = data.map((v, i) => {
    const x = PAD + (i / (data.length - 1)) * (width - PAD * 2);
    const y = height - PAD - ((v - min) / range) * (height - PAD * 2);
    return `${x},${y}`;
  }).join(" ");

  const color = ink === "primary" ? "var(--riso-primary)" : "var(--riso-secondary)";
  const shadow = ink === "primary" ? "var(--riso-secondary)" : "var(--riso-primary)";

  return (
    <svg
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn(className)}
      aria-hidden style={{ ...risoStyle, ...style }}
    >
      {/* Shadow line */}
      <polyline
        points={data.map((v, i) => {
          const x = PAD + (i / (data.length - 1)) * (width - PAD * 2) + 1.5;
          const y = height - PAD - ((v - min) / range) * (height - PAD * 2) + 1.5;
          return `${x},${y}`;
        }).join(" ")}
        fill="none" stroke={shadow} strokeWidth="1" strokeLinecap="square" opacity="0.45"
      />
      {/* Primary line */}
      <polyline
        points={pts}
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="square"
      />
      {/* Last point square */}
      {(() => {
        const last = data[data.length - 1];
        const lx = width - PAD - 3;
        const ly = height - PAD - ((last - min) / range) * (height - PAD * 2) - 3;
        return <rect x={lx} y={ly} width="6" height="6" fill={color} />;
      })()}
    </svg>
  );
}


