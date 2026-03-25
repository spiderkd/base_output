"use client";

// registry/new-york/ui/ink-density-meter.tsx — Ink Density Meter ★
//
// Visual system:
//   - Vertical thermometer-style component
//   - Fill shown by INCREASING halftone dot density (not solid bar)
//   - At 0%: all paper — sparse 1px dots barely visible
//   - At 50%: medium density — the overlap color appears naturally from dot crowding
//   - At 100%: solid ink coverage
//   - Animated fill change via SVG pattern scaling

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface InkDensityMeterProps extends RisoThemeProps {
  value: number;          // 0–100
  label?: string;
  height?: number;
  width?: number;
  showValue?: boolean;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function InkDensityMeter({ value,
  label,
  height = 160,
  width = 44,
  showValue = true,
  animated = true,
  className, theme, primary, secondary, overlap, paper, style }: InkDensityMeterProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const clamped = Math.max(0, Math.min(100, value));
  const [current, setCurrent] = React.useState(animated ? 0 : clamped);
  const patId = React.useId().replace(/:/g, "");

  React.useEffect(() => {
    if (!animated) { setCurrent(clamped); return; }
    const start = current;
    const end = clamped;
    const dur = 600;
    const startTs = Date.now();
    const raf = () => {
      const t = Math.min(1, (Date.now() - startTs) / dur);
      const ease = 1 - Math.pow(1 - t, 3);
      setCurrent(start + (end - start) * ease);
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [clamped]); // eslint-disable-line

  // Map density level to dot radius (0–100 → 0.8–5px)
  const NUM_STEPS = 12;
  const fillH = (current / 100) * height;

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)} style={{ ...risoStyle, ...style }}>
      {label && (
        <span style={{
          fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
          fontWeight: 700, fontSize: 8, textTransform: "uppercase",
          letterSpacing: "0.18em", color: "var(--riso-primary)",
          writingMode: "vertical-rl", textOrientation: "mixed",
          transform: "rotate(180deg)",
        }}>
          {label}
        </span>
      )}

      <div className="relative">
        {/* Shadow */}
        <div aria-hidden className="absolute inset-0 bg-[var(--riso-secondary)] translate-x-1 translate-y-1 opacity-45" />

        {/* Meter body */}
        <svg
          width={width} height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="relative overflow-hidden"
        >
          <defs>
            {Array.from({ length: NUM_STEPS }, (_, i) => {
              const density = i / (NUM_STEPS - 1);   // 0 → 1
              const r = 0.8 + density * 4.2;
              const spacing = Math.max(r * 2 + 1, 5);
              return (
                <pattern
                  key={i}
                  id={`${patId}-${i}`}
                  x="0" y="0"
                  width={spacing} height={spacing}
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx={spacing / 2} cy={spacing / 2} r={r} fill="var(--riso-primary)" />
                </pattern>
              );
            })}
          </defs>

          {/* Paper background */}
          <rect x="0" y="0" width={width} height={height}
            fill="var(--riso-paper,#f7f0e2)"
            stroke="var(--riso-primary)" strokeWidth="2"
          />

          {/* Density bands (bottom-up) */}
          {Array.from({ length: NUM_STEPS }, (_, i) => {
            const bandH = height / NUM_STEPS;
            const bandY = height - (i + 1) * bandH;
            const bandTop = bandY;

            // Is this band within the fill level?
            const inFill = height - bandY <= fillH;
            if (!inFill) return null;

            const density = i / (NUM_STEPS - 1);

            return (
              <g key={i} style={{ mixBlendMode: "multiply" }}>
                <rect
                  x="1" y={bandTop} width={width - 2} height={bandH + 1}
                  fill={`url(#${patId}-${Math.round(density * (NUM_STEPS - 1))})`}
                />
              </g>
            );
          })}

          {/* Tick marks */}
          {[25, 50, 75].map(pct => {
            const y = height - (pct / 100) * height;
            return (
              <g key={pct}>
                <line x1={width - 8} y1={y} x2={width} y2={y}
                  stroke="var(--riso-secondary)" strokeWidth="1" opacity="0.6" />
                <line x1={width - 6} y1={y + 2} x2={width} y2={y + 2}
                  stroke="var(--riso-primary)" strokeWidth="0.5" opacity="0.4" />
              </g>
            );
          })}

          {/* Outline on top */}
          <rect x="0.5" y="0.5" width={width - 1} height={height - 1}
            fill="none" stroke="var(--riso-primary)" strokeWidth="2" />
        </svg>
      </div>

      {showValue && (
        <span style={{
          fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
          fontWeight: 700, fontSize: 10,
          color: "var(--riso-secondary)",
          fontVariantNumeric: "tabular-nums",
        }}>
          {Math.round(current)}%
        </span>
      )}
    </div>
  );
}


