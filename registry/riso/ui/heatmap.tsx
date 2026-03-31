"use client";

// registry/riso/ui/heatmap.tsx — Risograph Heatmap
//
// Visual system:
//   - Intensity shown by HALFTONE DOT DENSITY, not color alpha
//   - Low value = sparse small dots, High value = overlapping large dots
//   - The overlap region produces the third ink color naturally
//   - Cell outline: primary 1px border
//   - Hover: secondary shadow behind cell

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface HeatmapProps extends RisoThemeProps {
  data: number[][]; // 2D array of 0–1 values
  rowLabels?: string[];
  colLabels?: string[];
  cellSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Heatmap({
  data,
  rowLabels,
  colLabels,
  cellSize = 36,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: HeatmapProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [hovered, setHovered] = React.useState<[number, number] | null>(null);

  // Map 0–1 value to dot radius and spacing
  const dotParams = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    if (clamped <= 0.15) return { r: 0.8, spacing: 5 };
    if (clamped <= 0.35) return { r: 1.2, spacing: 4 };
    if (clamped <= 0.55) return { r: 1.6, spacing: 4 };
    if (clamped <= 0.75) return { r: 2.2, spacing: 4 };
    return { r: 3, spacing: 4 };
  };

  return (
    <div
      className={cn("inline-block", className)}
      style={{ ...risoStyle, ...style }}
    >
      {/* Column labels */}
      {colLabels && (
        <div className={`flex mb-1 ${rowLabels ? "ml-16" : "ml-0"}`}>
          {colLabels.map((lbl, i) => (
            <div
              key={i}
              className="text-center font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.1em] text-[var(--riso-secondary)]"
              style={{ width: cellSize }}
            >
              {lbl}
            </div>
          ))}
        </div>
      )}

      {data.map((row, ri) => (
        <div key={ri} className="flex items-center">
          {/* Row label */}
          {rowLabels && (
            <div className="w-[60px] text-right pr-2 font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.1em] text-[var(--riso-secondary)] shrink-0">
              {rowLabels[ri] ?? ""}
            </div>
          )}

          {row.map((val, ci) => {
            const { r, spacing } = dotParams(val);
            const isHovered = hovered?.[0] === ri && hovered?.[1] === ci;
            const patId = `hm-${ri}-${ci}`;

            return (
              <div
                key={ci}
                className="relative shrink-0"
                style={{ width: cellSize, height: cellSize }}
                onMouseEnter={() => setHovered([ri, ci])}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Hover shadow */}
                {isHovered && (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[var(--riso-secondary)] translate-x-0.5 translate-y-0.5 opacity-35 z-0"
                  />
                )}

                <svg
                  width={cellSize}
                  height={cellSize}
                  viewBox={`0 0 ${cellSize} ${cellSize}`}
                  className="relative z-[1]"
                >
                  <defs>
                    <pattern
                      id={patId}
                      x="0"
                      y="0"
                      width={spacing}
                      height={spacing}
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx={spacing / 2}
                        cy={spacing / 2}
                        r={r}
                        fill="var(--riso-primary)"
                      />
                    </pattern>
                  </defs>

                  {/* Background paper */}
                  <rect
                    x="0.5"
                    y="0.5"
                    width={cellSize - 1}
                    height={cellSize - 1}
                    fill="var(--riso-paper,#f7f0e2)"
                    stroke="var(--riso-primary)"
                    strokeWidth={isHovered ? "2" : "1"}
                    strokeOpacity="0.4"
                  />

                  {/* Halftone fill */}
                  <rect
                    x="0"
                    y="0"
                    width={cellSize}
                    height={cellSize}
                    fill={`url(#${patId})`}
                  />

                  {/* Hover value label */}
                  {isHovered && (
                    <text
                      x={cellSize / 2}
                      y={cellSize / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="var(--riso-overlap,#7b4f7a)"
                      fontSize="9"
                      fontFamily="var(--font-riso-label,'Space Grotesk',sans-serif)"
                      fontWeight="700"
                    >
                      {Math.round(val * 100)}
                    </text>
                  )}
                </svg>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
