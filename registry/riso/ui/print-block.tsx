"use client";

// registry/riso/ui/print-block.tsx — Risograph Print Block
//
// Unique to Riso — no Crumble equivalent.
//
// Visual system:
//   - Solid flat primary ink fill, NO border or outline
//   - Heavy grain filter applied to the fill surface
//   - Typography in white (substrate) on the ink
//   - Looks like a single-color block print — woodblock / letterpress aesthetic
//   - Optional: rotated 1-2° to feel hand-placed on paper

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface PrintBlockProps
  extends React.HTMLAttributes<HTMLDivElement>, RisoThemeProps {
  ink?: "primary" | "secondary" | "overlap";
  rotate?: number; // slight rotation in degrees
  children?: React.ReactNode;
  className?: string;
}

export function PrintBlock({
  ink = "primary",
  rotate = 0,
  children,
  className,
  style,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  ...props
}: PrintBlockProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const bg = {
    primary: "var(--riso-primary)",
    secondary: "var(--riso-secondary)",
    overlap: "var(--riso-overlap, #7b4f7a)",
  }[ink];

  return (
    <div
      className={cn("relative overflow-hidden px-6 py-5", className)}
      style={{
        ...risoStyle,
        ...{
          background: bg,
          transform: rotate ? `rotate(${rotate}deg)` : undefined,
          ...style,
        },
      }}
      {...props}
    >
      {/* Heavy grain filter overlay — the defining texture of block print */}
      <div
        aria-hidden
        style={{ filter: "url(#riso-grain-fill)", background: bg }}
        className="absolute inset-0 mix-blend-multiply opacity-60 pointer-events-none"
      />

      {/* Halftone dot texture at mid-opacity */}
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(circle,rgba(255,255,255,0.18)_1.5px,transparent_0)] [background-size:4px_4px] pointer-events-none"
      />

      {/* Content — white on ink */}
      <div className="relative z-[1] text-white font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)]">
        {children}
      </div>
    </div>
  );
}
