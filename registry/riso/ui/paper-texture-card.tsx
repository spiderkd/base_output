"use client";

// registry/riso/ui/paper-texture-card.tsx — Risograph Paper Texture Card
//
// Unique to Riso — no Crumble equivalent.
//
// Visual system:
//   - feTurbulence at LOW frequency (0.04–0.12) produces visible paper fiber texture
//     rather than fine grain. Feels like coarse newsprint or recycled paper.
//   - Halftone dots at large size (6–8px) add visible print quality feel
//   - Slight color tint from secondary ink blended into the paper
//   - Optional "torn edge" simulation on one side via SVG clipPath
//   - No bright colors — this is purely about texture and materiality

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface PaperTextureCardProps
  extends React.HTMLAttributes<HTMLDivElement>, RisoThemeProps {
  grain?: "fine" | "medium" | "heavy" | "newsprint";
  tint?: boolean; // tint paper with secondary ink
  halftone?: boolean; // visible halftone dots
  children?: React.ReactNode;
  className?: string;
}

const GRAIN_PARAMS = {
  fine: { freq: "0.65", octaves: 3, opacity: 0.08 },
  medium: { freq: "0.40", octaves: 2, opacity: 0.12 },
  heavy: { freq: "0.25", octaves: 2, opacity: 0.18 },
  newsprint: { freq: "0.08", octaves: 1, opacity: 0.22 },
};

export function PaperTextureCard({
  grain = "medium",
  tint = false,
  halftone = false,
  children,
  className,
  style,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  ...props
}: PaperTextureCardProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const { freq, octaves, opacity } = GRAIN_PARAMS[grain];
  const filterId = `paper-grain-${grain}`;

  return (
    <>
      <svg
        className="absolute w-0 h-0"
        aria-hidden
        style={{ ...risoStyle, ...style }}
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={freq}
              numOctaves={octaves}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="gray"
            />
            <feBlend
              in="SourceGraphic"
              in2="gray"
              mode="multiply"
              result="blended"
            />
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <div
        className={cn("relative overflow-hidden", className)}
        style={{
          background: "var(--riso-paper, #f7f0e2)",
          outline: "2px solid var(--riso-primary)",
          filter: `url(#${filterId}) drop-shadow(4px 4px 0px var(--riso-secondary))`,
          padding: "20px",
          ...style,
        }}
        {...props}
      >
        {/* Tint overlay — secondary ink washed over paper */}
        {tint && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--riso-secondary)",
              opacity: 0.07,
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Visible halftone dots — large, newsprint style */}
        {halftone && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, var(--riso-primary) 2px, transparent 0)",
              backgroundSize: "8px 8px",
              opacity: 0.12,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Grain texture overlay div */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--riso-paper, #f7f0e2)",
            opacity,
            filter: `url(#${filterId})`,
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />

        <div className="relative z-[1]">{children}</div>
      </div>
    </>
  );
}
