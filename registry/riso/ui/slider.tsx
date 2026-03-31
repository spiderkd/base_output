"use client";

// registry/riso/ui/slider.tsx — Risograph Slider
//
// Visual system:
//   - Track: double-rule (primary 2px + secondary 1px, offset 2px below)
//   - Fill: solid primary color from 0 to thumb position
//   - Thumb: solid secondary square — no border-radius
//   - Tick marks rendered as small SVG lines along the track
//   - Value label appears as a print annotation above the thumb

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface SliderProps extends RisoThemeProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  showTicks?: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  showValue = true,
  showTicks = false,
  label,
  className,
  disabled = false,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: SliderProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [value, setValue] = React.useState(defaultValue);
  const controlled = controlledValue !== undefined;
  const current = controlled ? controlledValue : value;

  const pct = ((current - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (!controlled) setValue(v);
    onChange?.(v);
  };

  const thumbSize = 16;
  const trackH = 4;
  const svgH = showTicks ? 32 : 20;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 w-full",
        disabled && "opacity-40",
        className,
      )}
      style={{ ...risoStyle, ...style }}
    >
      {(label || showValue) && (
        <div className="flex justify-between items-baseline">
          {label && (
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] text-[var(--riso-primary)]">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-xs font-bold tabular-nums font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] text-[var(--riso-secondary)]">
              {current}
            </span>
          )}
        </div>
      )}

      <div className="relative" style={{ height: svgH }}>
        {/* SVG track visualization */}
        <svg
          width="100%"
          height={svgH}
          className="absolute inset-0 overflow-visible pointer-events-none"
          aria-hidden
        >
          {/* Secondary misreg track line — offset 2px below primary */}
          <line
            x1="0"
            y1={trackH + 2 + 2}
            x2="100%"
            y2={trackH + 2 + 2}
            stroke="var(--riso-secondary)"
            strokeWidth={1.5}
            opacity={0.6}
          />

          {/* Primary track background */}
          <line
            x1="0"
            y1={trackH + 2}
            x2="100%"
            y2={trackH + 2}
            stroke="var(--riso-primary)"
            strokeWidth={trackH}
            opacity={0.2}
          />

          {/* Primary fill (0 → current value) */}
          <line
            x1="0"
            y1={trackH + 2}
            x2={`${pct}%`}
            y2={trackH + 2}
            stroke="var(--riso-primary)"
            strokeWidth={trackH}
          />

          {/* Tick marks */}
          {showTicks &&
            (() => {
              const steps = Math.floor((max - min) / step);
              return Array.from({ length: steps + 1 }, (_, i) => {
                const tickPct = (i / steps) * 100;
                return (
                  <line
                    key={i}
                    x1={`${tickPct}%`}
                    y1={svgH - 8}
                    x2={`${tickPct}%`}
                    y2={svgH - 2}
                    stroke={
                      tickPct <= pct
                        ? "var(--riso-primary)"
                        : "var(--riso-secondary)"
                    }
                    strokeWidth={1}
                    opacity={0.6}
                  />
                );
              });
            })()}

          {/* Thumb — secondary color square */}
          <rect
            x={`${pct}%`}
            y={trackH + 2 - thumbSize / 2}
            width={thumbSize}
            height={thumbSize}
            fill="var(--riso-secondary)"
            transform={`translate(-${thumbSize / 2}, 0)`}
            style={{ filter: "drop-shadow(2px 2px 0px var(--riso-primary))" }}
          />

          {/* Secondary shadow behind thumb */}
          <rect
            x={`${pct}%`}
            y={trackH + 2 - thumbSize / 2 + 2}
            width={thumbSize}
            height={thumbSize}
            fill="var(--riso-primary)"
            transform={`translate(-${thumbSize / 2 - 2}, 0)`}
            opacity={0.4}
          />
        </svg>

        {/* Native range input (invisible, handles interaction) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10"
        />
      </div>
    </div>
  );
}
