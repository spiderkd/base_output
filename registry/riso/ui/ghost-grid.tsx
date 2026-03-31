"use client";

// registry/riso/ui/ghost-grid.tsx — Ghost Grid Background ★
//
// Visual system:
//   - Full-bleed background that renders large ghost-text section numbers
//     (01, 02, 03…) as faint overlapping numerals in alternating primary/secondary
//   - Numbers are huge (20–40vw), semi-transparent, uppercase
//   - Secondary numbers offset 3px from primary — misreg on the texture itself
//   - Pure CSS ::before/::after approach via data attributes
//   - Zero JS — the numbers are derived from a count prop

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface GhostGridProps extends RisoThemeProps {
  count?: number; // how many section numbers to show (default 6)
  opacity?: number; // base opacity, default 0.05
  stagger?: boolean; // alternate primary/secondary per row
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GhostGrid({
  count = 6,
  opacity = 0.05,
  stagger = true,
  children,
  className,
  style,
  theme,
  primary,
  secondary,
  overlap,
  paper,
}: GhostGridProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const numbers = Array.from({ length: count }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  return (
    <div
      className={cn("relative", className)}
      style={{ ...risoStyle, ...{ ...style } }}
    >
      {/* Ghost number layer */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex flex-wrap content-start"
      >
        {numbers.map((n, i) => {
          const usePrimary = !stagger || i % 2 === 0;
          return (
            <div key={i} className="relative">
              {/* Secondary ghost offset */}
              <span
                className={cn(
                  "absolute top-[3px] left-[3px] font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black leading-[0.9] select-none tracking-[-0.02em] whitespace-nowrap",
                  usePrimary
                    ? "text-[var(--riso-secondary)]"
                    : "text-[var(--riso-primary)]",
                )}
                style={{
                  fontSize: "clamp(80px, 12vw, 180px)",
                  opacity: opacity * 0.6,
                }}
              >
                {n}
              </span>
              {/* Primary numeral */}
              <span
                className={cn(
                  "relative block font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black leading-[0.9] select-none tracking-[-0.02em] whitespace-nowrap",
                  usePrimary
                    ? "text-[var(--riso-primary)]"
                    : "text-[var(--riso-secondary)]",
                )}
                style={{ fontSize: "clamp(80px, 12vw, 180px)", opacity }}
              >
                {n}
              </span>
            </div>
          );
        })}
      </div>

      {/* Content layer */}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
