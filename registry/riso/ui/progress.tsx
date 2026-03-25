"use client";

// registry/new-york/ui/progress.tsx — Risograph Progress Bar
//
// Visual system:
//   - Track: primary outline, paper background
//   - Fill: solid primary from 0 → value%
//   - Leading edge bleeds into secondary — creating the overlap color at the tip
//   - Halftone dot pattern in unfilled region (lighter-looking area)
//   - Secondary misreg shadow behind the entire track
//   - Label: print annotation above, value % inline at fill edge

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface ProgressProps extends RisoThemeProps {
  value: number;           // 0–100
  label?: string;
  showValue?: boolean;
  variant?: "default" | "ink-bleed" | "halftone";
  className?: string;
  style?: React.CSSProperties;
}

export function Progress({ value, label, showValue = true, variant = "default", className, theme, primary, secondary, overlap, paper, style }: ProgressProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)} style={{ ...risoStyle, ...style }}>
      {(label || showValue) && (
        <div className="flex justify-between items-baseline">
          {label && (
            <span className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.15em] text-[var(--riso-primary)]">
              {label}
            </span>
          )}
          {showValue && (
            <span className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[11px] text-[var(--riso-secondary)] [font-variant-numeric:tabular-nums]">
              {clamped}%
            </span>
          )}
        </div>
      )}

      {/* Track wrapper — misreg shadow behind */}
      <div className="relative">
        {/* Secondary offset shadow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--riso-secondary)] translate-x-[3px] translate-y-[3px] opacity-35" />

        {/* Track */}
        <div className="relative h-[18px] bg-[var(--riso-paper,#f7f0e2)] outline outline-2 outline-[var(--riso-primary)] overflow-hidden">
          {/* Halftone pattern in unfilled area */}
          {variant === "halftone" && (
            <div aria-hidden className="absolute inset-0 [background-image:radial-gradient(circle,var(--riso-primary)_1px,transparent_0)] [background-size:4px_4px] opacity-20" />
          )}

          {/* Fill bar */}
          <div
            className="absolute top-0 left-0 bottom-0 bg-[var(--riso-primary)] transition-[width] duration-[400ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
            style={{ width: `${clamped}%` }}
          >
            {/* Halftone overlay on fill for texture */}
            <div aria-hidden className="absolute inset-0 [background-image:radial-gradient(circle,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:3px_3px]" />

            {/* Ink bleed at leading edge — secondary color bleeds from the tip */}
            {clamped > 0 && clamped < 100 && (
              <div aria-hidden className="absolute top-0 -right-2 bottom-0 w-4 bg-[linear-gradient(90deg,var(--riso-primary),var(--riso-overlap,#7b4f7a))] opacity-80 mix-blend-multiply" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


