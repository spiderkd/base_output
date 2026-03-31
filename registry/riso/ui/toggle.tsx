"use client";

// registry/riso/ui/toggle.tsx — Risograph Toggle Switch
//
// Visual system:
//   - Track is a plain rect with primary outline
//   - Thumb: solid secondary-color square that slides across
//   - When ON: track floods with halftone dots in primary color
//   - Misreg: a secondary shadow layer on the track, slightly offset
//   - Animation: CSS transform on the thumb, no JS animation needed

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface ToggleProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">,
    RisoThemeProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: {
    w: 36,
    h: 18,
    thumb: 12,
    travel: 16,
    font: "9px",
    wrapperClass: "w-[39px] h-[21px]",
  },
  md: {
    w: 48,
    h: 24,
    thumb: 16,
    travel: 22,
    font: "10px",
    wrapperClass: "w-[51px] h-[27px]",
  },
  lg: {
    w: 64,
    h: 32,
    thumb: 22,
    travel: 30,
    font: "11px",
    wrapperClass: "w-[67px] h-[35px]",
  },
};

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      size = "md",
      className,
      onChange,
      checked,
      defaultChecked,
      disabled,
      theme,
      primary,
      secondary,
      overlap,
      paper,
      style,
      ...props
    },
    ref,
  ) => {
    const risoStyle = resolveRisoVars({
      theme,
      primary,
      secondary,
      overlap,
      paper,
    });
    const [isOn, setIsOn] = React.useState(defaultChecked ?? false);
    const controlled = checked !== undefined;
    const active = controlled ? checked : isOn;
    const { w, h, thumb, travel, font, wrapperClass } = SIZES[size];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!controlled) setIsOn(e.target.checked);
      onChange?.(e);
    };

    const thumbX = active ? travel - 1 : h / 2 - thumb / 2 + 1;

    return (
      <label
        className={cn(
          "inline-flex items-center gap-3 cursor-pointer select-none",
          disabled && "opacity-40 cursor-not-allowed",
          className,
        )}
        style={{ ...risoStyle, ...style }}
      >
        <div className={cn("relative", wrapperClass)}>
          <input
            ref={ref}
            type="checkbox"
            checked={controlled ? checked : isOn}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />

          {/* Misreg shadow layer — secondary color offset behind track */}
          <svg
            aria-hidden
            width={w}
            height={h}
            className="absolute top-[3px] left-[3px] opacity-50"
          >
            <rect
              x={0}
              y={0}
              width={w}
              height={h}
              fill={active ? "var(--riso-secondary)" : "transparent"}
              stroke="var(--riso-secondary)"
              strokeWidth={1.5}
              rx={0}
            />
          </svg>

          {/* Primary track SVG */}
          <svg
            aria-hidden
            width={w}
            height={h}
            className="absolute top-0 left-0"
          >
            {/* Track background */}
            <rect
              x={1}
              y={1}
              width={w - 2}
              height={h - 2}
              fill={
                active ? "var(--riso-primary)" : "var(--riso-paper, #f7f0e2)"
              }
              stroke="var(--riso-primary)"
              strokeWidth={2}
              rx={0}
            />

            {/* Halftone overlay on active track */}
            {active && (
              <rect
                x={1}
                y={1}
                width={w - 2}
                height={h - 2}
                fill="none"
                stroke="none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 0)",
                  backgroundSize: "4px 4px",
                }}
                opacity={0.15}
              />
            )}

            {/* Thumb — square secondary-color block */}
            <rect
              x={thumbX}
              y={(h - thumb) / 2}
              width={thumb}
              height={thumb}
              fill={active ? "white" : "var(--riso-secondary)"}
              style={{ transition: "x 180ms cubic-bezier(0.4, 0, 0.2, 1)" }}
            />

            {/* ON / OFF labels */}
            {active ? (
              <text
                x={thumbX - 4}
                y={h / 2 + 4}
                textAnchor="end"
                fill="white"
                fontSize={font}
                fontFamily="var(--font-riso-label, 'Space Grotesk', sans-serif)"
                fontWeight="700"
              >
                ON
              </text>
            ) : (
              <text
                x={thumbX + thumb + 4}
                y={h / 2 + 4}
                textAnchor="start"
                fill="var(--riso-primary)"
                fontSize={font}
                fontFamily="var(--font-riso-label, 'Space Grotesk', sans-serif)"
                fontWeight="700"
              >
                OFF
              </text>
            )}
          </svg>
        </div>

        {label && (
          <span className="text-sm font-bold uppercase tracking-wider font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] text-[var(--riso-overlap,#7b4f7a)]">
            {label}
          </span>
        )}
      </label>
    );
  },
);

Toggle.displayName = "Toggle";
