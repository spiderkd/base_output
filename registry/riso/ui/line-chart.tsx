"use client";

// registry/riso/ui/line-chart.tsx — Risograph Line Chart
//
// Visual system:
//   - Two-layer SVG polyline: primary 2px + secondary 1px offset 1.5px right/down
//   - Area fill under primary line: halftone radial-gradient dots (not alpha)
//   - Data points: small squares (not circles — riso has no circles for data)
//   - Double-rule X axis, single-line Y axis
//   - Dotted secondary horizontal grid lines
//   - Hover: vertical guide line + tooltip

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps extends RisoThemeProps {
  data: DataPoint[];
  height?: number;
  showArea?: boolean;
  showGrid?: boolean;
  showDots?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function LineChart({
  data,
  height = 180,
  showArea = true,
  showGrid = true,
  showDots = true,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: LineChartProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const PAD_L = 36,
    PAD_B = 28,
    PAD_T = 16,
    PAD_R = 16;
  const W = 400,
    H = height;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const vals = data.map((d) => d.value);
  const minV = Math.min(...vals),
    maxV = Math.max(...vals);
  const range = maxV - minV || 1;

  const toX = (i: number) => PAD_L + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => PAD_T + chartH - ((v - minV) / range) * chartH;

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.value), ...d }));
  const ptStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div
      className={cn("w-full relative", className)}
      style={{ ...risoStyle, ...style }}
    >
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <pattern
            id="lc-ht"
            x="0"
            y="0"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="1"
              fill="var(--riso-primary)"
              opacity="0.25"
            />
          </pattern>
          <clipPath id="lc-clip">
            <rect x={PAD_L} y={PAD_T} width={chartW} height={chartH} />
          </clipPath>
        </defs>

        {/* Grid */}
        {showGrid &&
          [0.25, 0.5, 0.75].map((pct) => {
            const y = PAD_T + chartH * (1 - pct);
            return (
              <line
                key={pct}
                x1={PAD_L}
                y1={y}
                x2={W - PAD_R}
                y2={y}
                stroke="var(--riso-secondary)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.35"
              />
            );
          })}

        {/* Y axis */}
        <line
          x1={PAD_L}
          y1={PAD_T}
          x2={PAD_L}
          y2={PAD_T + chartH}
          stroke="var(--riso-primary)"
          strokeWidth="2"
        />

        {/* X axis double-rule */}
        <line
          x1={PAD_L}
          y1={PAD_T + chartH}
          x2={W - PAD_R}
          y2={PAD_T + chartH}
          stroke="var(--riso-primary)"
          strokeWidth="2"
        />
        <line
          x1={PAD_L}
          y1={PAD_T + chartH + 3}
          x2={W - PAD_R}
          y2={PAD_T + chartH + 3}
          stroke="var(--riso-secondary)"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Halftone area fill */}
        {showArea && (
          <polygon
            points={`${PAD_L},${PAD_T + chartH} ${ptStr} ${W - PAD_R},${PAD_T + chartH}`}
            fill="url(#lc-ht)"
            clipPath="url(#lc-clip)"
          />
        )}

        {/* Secondary offset line */}
        <polyline
          points={points.map((p) => `${p.x + 1.5},${p.y + 1.5}`).join(" ")}
          fill="none"
          stroke="var(--riso-secondary)"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity="0.55"
          clipPath="url(#lc-clip)"
        />

        {/* Primary line */}
        <polyline
          points={ptStr}
          fill="none"
          stroke="var(--riso-primary)"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          clipPath="url(#lc-clip)"
        />

        {/* Data point squares */}
        {showDots &&
          points.map((p, i) => (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredIdx(i)}
            >
              {/* Shadow square */}
              <rect
                x={p.x - 3 + 2}
                y={p.y - 3 + 2}
                width="6"
                height="6"
                fill="var(--riso-secondary)"
                opacity="0.5"
              />
              {/* Primary square */}
              <rect
                x={p.x - 3}
                y={p.y - 3}
                width="6"
                height="6"
                fill={
                  hoveredIdx === i
                    ? "var(--riso-secondary)"
                    : "var(--riso-primary)"
                }
                style={{ transition: "fill 100ms" }}
              />
            </g>
          ))}

        {/* Hover guide + value label */}
        {hoveredIdx !== null && (
          <>
            <line
              x1={points[hoveredIdx].x}
              y1={PAD_T}
              x2={points[hoveredIdx].x}
              y2={PAD_T + chartH}
              stroke="var(--riso-overlap,#7b4f7a)"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.5"
            />
            <text
              x={points[hoveredIdx].x}
              y={points[hoveredIdx].y - 10}
              textAnchor="middle"
              fill="var(--riso-primary)"
              fontSize="10"
              fontFamily="var(--font-riso-label,'Space Grotesk',sans-serif)"
              fontWeight="700"
            >
              {data[hoveredIdx].value}
            </text>
          </>
        )}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={PAD_T + chartH + 16}
            textAnchor="middle"
            fill="var(--riso-overlap,#7b4f7a)"
            fontSize="8"
            fontFamily="var(--font-riso-label,'Space Grotesk',sans-serif)"
            fontWeight="700"
          >
            {p.label.toUpperCase()}
          </text>
        ))}

        {/* Invisible hover zones */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - chartW / data.length / 2}
            y={PAD_T}
            width={chartW / data.length}
            height={chartH}
            fill="transparent"
            onMouseEnter={() => setHoveredIdx(i)}
          />
        ))}
      </svg>
    </div>
  );
}
