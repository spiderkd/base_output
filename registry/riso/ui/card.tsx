"use client";

// registry/riso/ui/card.tsx — Risograph Card
//
// Visual system:
//   - Base: paper background, primary color border (2px outline)
//   - Hard offset shadow in secondary/overlap color
//   - stacked variant: three layers at increasing misreg offsets, looks like a misprinted stack
//   - Hover: shadow compresses (plate shifting)
//   - Optional halftone fill background

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, RisoThemeProps {
  padding?: number;
  stacked?: boolean;
  filled?: boolean; // solid primary fill (inverse card)
  halftone?: boolean; // halftone dot pattern background
  interactive?: boolean; // adds hover shadow compression
}

export function Card({
  padding = 20,
  stacked = false,
  filled = false,
  halftone = false,
  interactive = false,
  className,
  children,
  style,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  ...props
}: CardProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const stackLayers = stacked ? (
    <>
      {/* Third layer — furthest back, most offset */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[var(--riso-secondary)] translate-x-2 translate-y-2 opacity-35"
      />
      {/* Second layer */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[var(--riso-overlap)] translate-x-1 translate-y-1 opacity-50"
      />
    </>
  ) : null;

  return (
    <div
      className={cn(
        "relative",
        // The primary visual border — 2px outline in primary ink
        filled
          ? "bg-[var(--riso-primary)] text-white"
          : "bg-[var(--riso-paper,#f7f0e2)] text-[var(--riso-overlap,#7b4f7a)]",
        " outline-2 outline-[var(--riso-primary)]",
        // Hard drop shadow default
        "[filter:drop-shadow(4px_4px_0px_var(--riso-secondary))]",
        interactive && [
          "cursor-pointer transition-all duration-150",
          "hover:[filter:drop-shadow(1px_1px_0px_var(--riso-secondary))]",
          "hover:translate-x-[3px] hover:translate-y-[3px]",
          "active:[filter:drop-shadow(0px_0px_0px_var(--riso-secondary))]",
          "active:translate-x-[4px] active:translate-y-[4px]",
        ],
        className,
      )}
      style={{ ...risoStyle, ...{ padding, ...style } }}
      {...props}
    >
      {stackLayers}

      {/* Optional halftone background overlay */}
      {halftone && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none [background-image:radial-gradient(circle,var(--riso-secondary)_1.5px,transparent_0)] [background-size:4px_4px] opacity-[0.15] mix-blend-multiply"
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Sub-components — match shadcn/crumble API surface
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black uppercase text-lg leading-tight",
        "text-[var(--riso-primary)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] uppercase tracking-wider",
        "text-[var(--riso-secondary)]",
        "mt-0.5",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-3", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 pt-3 flex items-center gap-2",
        // Double-rule separator (primary + secondary offset) above footer
        "border-t-2 border-[var(--riso-primary)]",
        className,
      )}
      {...props}
    />
  );
}
