"use client";

// registry/new-york/ui/separator.tsx — Risograph Separator
//
// Visual system:
//   - Double-rule: two parallel lines in primary and secondary colors
//   - The gap and offset simulate misregistration of two printing passes
//   - "heavy" variant: 3px primary + 1.5px secondary, wider gap
//   - "dotted" variant: dashed secondary line

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type SeparatorVariant = "default" | "heavy" | "dotted" | "single";
type SeparatorOrientation = "horizontal" | "vertical";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement>, RisoThemeProps {
  variant?: SeparatorVariant;
  orientation?: SeparatorOrientation;
}

export function Separator({ variant = "default",
  orientation = "horizontal",
  className, theme, primary, secondary, overlap, paper, style, ...props }: SeparatorProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const isHorizontal = orientation === "horizontal";

  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "relative inline-flex flex-row items-stretch w-3 self-stretch",
          className,
        )}
        {...props} style={{ ...risoStyle, ...style }}
      >
        {/* Primary vertical line */}
        <div
          className={cn(
            "absolute top-0 bottom-0 left-[3px] bg-[var(--riso-primary)]",
            variant === "heavy" ? "w-[3px]" : "w-[2px]",
          )}
        />
        {/* Secondary offset vertical line */}
        {variant !== "single" && (
          <div
            className={cn(
              "absolute top-0 bottom-0 left-[7px] opacity-85",
              variant === "heavy" ? "w-[1.5px]" : "w-[1px]",
              variant === "dotted"
                ? "border-l border-dashed border-[var(--riso-secondary)]"
                : "bg-[var(--riso-secondary)]",
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full",
        variant === "heavy" ? "h-[10px]" : "h-[7px]",
        className,
      )}
      {...props} style={{ ...risoStyle, ...style }}
    >
      {/* Primary line (top) */}
      <div
        className={cn(
          "absolute left-0 right-0 top-0 bg-[var(--riso-primary)]",
          variant === "heavy" ? "h-[3px]" : "h-[2px]",
        )}
      />
      {/* Secondary offset line (below) — misregistration */}
      {variant !== "single" && (
        <div
          className={cn(
            "absolute left-0 right-0 opacity-85",
            variant === "heavy" ? "top-[6px] h-[1.5px]" : "top-1 h-[1px]",
            variant === "dotted"
              ? "border-b border-dashed border-[var(--riso-secondary)]"
              : "bg-[var(--riso-secondary)]",
          )}
        />
      )}
    </div>
  );
}


