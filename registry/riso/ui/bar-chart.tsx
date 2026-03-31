"use client";

// registry/riso/ui/bar-chart.tsx — Risograph Bar Chart
//
// Visual system:
//   - Bars are flat solid ink colors — no gradient, no hachure
//   - Alternates between primary and secondary ink per bar
//   - Where bars would overlap (grouped): multiply blend creates third color
//   - Double-rule baseline (X axis) — primary 2px + secondary 1px offset
//   - Y axis: single primary line
//   - Grid lines: dotted secondary at low opacity (replaces standard grey lines)
//   - Hover: bar gets secondary hard shadow offset (drops in front)
//   - Value labels: Space Grotesk uppercase above bars

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface BarDatum {
  label: string;
  value: number;
  ink?: "primary" | "secondary" | "overlap";
}

interface BarChartProps extends RisoThemeProps {
  data: BarDatum[];
  width: number;
  height?: number;
  margin?: Partial<Margin>;
  showValues?: boolean;
  showGrid?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BarChart({
  data,
  height = 180,
  width = 400,
  showValues = true,
  margin,
  showGrid = true,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: BarChartProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const defaultMargin: Margin = {
    top: showValues ? 24 : 8,
    right: 16,
    bottom: 28,
    left: 32,
  };

  const m = { ...defaultMargin, ...margin };
  const [hovered, setHovered] = React.useState<number | null>(null);
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  const chartH = height;
  const barAreaH = chartH - m.top - m.bottom;

  const inkFor = (d: BarDatum, idx: number): string => {
    if (d.ink === "overlap") return "var(--riso-overlap, #7b4f7a)";
    if (d.ink === "secondary") return "var(--riso-secondary)";
    if (d.ink === "primary") return "var(--riso-primary)";
    return idx % 2 === 0 ? "var(--riso-primary)" : "var(--riso-secondary)";
  };

  const shadowFor = (idx: number): string =>
    idx % 2 === 0 ? "var(--riso-secondary)" : "var(--riso-primary)";

  return (
    <div
      className={cn("w-full relative select-none", className)}
      style={{ ...risoStyle, ...style }}
    >
      <svg
        width="100%"
        height={chartH}
        viewBox={`0 0 ${width} ${chartH}`}
        preserveAspectRatio="none"
        aria-label="Bar chart"
      >
        {/* Grid lines — dotted secondary */}
        {showGrid &&
          [0.25, 0.5, 0.75].map((pct) => {
            const y = m.top + barAreaH * (1 - pct);
            return (
              <line
                key={pct}
                x1={m.left}
                y1={y}
                x2={width}
                y2={y}
                stroke="var(--riso-secondary)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.35"
              />
            );
          })}

        {/* Y axis — primary line */}
        <line
          x1={m.left}
          y1={m.top}
          x2={m.left}
          y2={m.top + barAreaH}
          stroke="var(--riso-primary)"
          strokeWidth="2"
        />

        {/* X axis — double rule */}
        <line
          x1={m.left}
          y1={m.top + barAreaH}
          x2="400"
          y2={m.top + barAreaH}
          stroke="var(--riso-primary)"
          strokeWidth="2"
        />
        <line
          x1={m.left}
          y1={m.top + barAreaH + 3}
          x2="400"
          y2={m.top + barAreaH + 3}
          stroke="var(--riso-secondary)"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Bars */}
        {data.map((d, idx) => {
          const totalW = width - m.left;
          const slotW = totalW / data.length;
          const barW = slotW * 0.55;
          const x = m.left + idx * slotW + (slotW - barW) / 2;
          const barH = (d.value / maxVal) * barAreaH;
          const y = m.top + barAreaH - barH;
          const isHovered = hovered === idx;
          const color = inkFor(d, idx);
          const shadow = shadowFor(idx);

          return (
            <g
              key={idx}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Hard shadow behind bar — appears on hover */}
              <rect
                x={x + (isHovered ? 3 : 0)}
                y={y + (isHovered ? 3 : 0)}
                width={barW}
                height={barH}
                fill={shadow}
                opacity={isHovered ? 0.45 : 0}
                style={{ transition: "opacity 120ms, x 120ms, y 120ms" }}
              />

              {/* Halftone texture overlay on bar */}
              <defs>
                <pattern
                  id={`ht-${idx}`}
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.2)" />
                </pattern>
              </defs>

              {/* Bar body */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={color}
                style={{ transition: "y 300ms, height 300ms" }}
              />

              {/* Halftone overlay */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={`url(#ht-${idx})`}
              />

              {/* Value label above bar */}
              {showValues && (
                <text
                  x={x + barW / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fill={color}
                  fontSize="10"
                  fontFamily="var(--font-riso-label, 'Space Grotesk', sans-serif)"
                  fontWeight="700"
                >
                  {d.value}
                </text>
              )}

              {/* X axis label */}
              <text
                x={x + barW / 2}
                y={m.top + barAreaH + 16}
                textAnchor="middle"
                fill="var(--riso-overlap, #7b4f7a)"
                fontSize="8"
                fontFamily="var(--font-riso-label, 'Space Grotesk', sans-serif)"
                fontWeight="700"
                style={{ textTransform: "uppercase", letterSpacing: 1 }}
              >
                {d.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
