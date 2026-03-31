"use client";

// registry/riso/ui/badge.tsx — Risograph Badge
//
// Visual system:
//   - Rectangular (0px radius) — sharp press print feel
//   - Hard offset shadow in secondary acts as misregistration indicator
//   - "stamp" variant: dashed border like a rubber stamp
//   - "overprint" variant: two rectangles overlapping with multiply blend = third color

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type BadgeVariant = "default" | "secondary" | "outline" | "stamp" | "overprint";

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, RisoThemeProps {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "default",
  className,
  children,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
  ...props
}: BadgeProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const base = [
    "relative inline-flex items-center",
    "px-2.5 py-0.5",
    "font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)]",
    "text-[10px] font-bold uppercase tracking-[0.15em]",
  ].join(" ");

  const variants: Record<BadgeVariant, string> = {
    default: [
      "bg-[var(--riso-primary)] text-white",
      "[filter:drop-shadow(2px_2px_0px_var(--riso-secondary))]",
    ].join(" "),

    secondary: [
      "bg-[var(--riso-secondary)] text-white",
      "[filter:drop-shadow(2px_2px_0px_var(--riso-primary))]",
    ].join(" "),

    outline: [
      "bg-transparent text-[var(--riso-primary)]",
      "outline outline-2 outline-[var(--riso-primary)]",
      "[filter:drop-shadow(2px_2px_0px_var(--riso-secondary))]",
    ].join(" "),

    stamp: [
      "bg-[var(--riso-paper,#f7f0e2)] text-[var(--riso-primary)]",
      "border-[2px] border-dashed border-[var(--riso-primary)]",
      // Stamp has serrated inner — achieved via dashed border with px spacing
    ].join(" "),

    overprint: "", // handled specially below
  };

  if (variant === "overprint") {
    // Two overlapping rectangles at different positions with multiply blend
    // The overlap area becomes the "third ink" color automatically
    return (
      <span
        className={cn("relative inline-flex", className)}
        {...props}
        style={{ ...risoStyle, ...style }}
      >
        <span className="absolute inset-0  bg-[var(--riso-primary)] -translate-x-0.5 -translate-y-px opacity-85 mix-blend-multiply" />
        <span className="relative px-2.5 py-0.5 z-10 bg-[var(--riso-secondary)] mix-blend-multiply font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] text-[10px] font-bold uppercase tracking-[0.15em] text-white">
          {children}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(base, variants[variant], className)}
      {...props}
      style={{ ...risoStyle, ...style }}
    >
      {children}
    </span>
  );
}
