"use client";

// registry/riso/ui/ink-blot-loader.tsx — Risograph Ink Blot Loader ★
//
// Visual system:
//   - Two organic SVG blobs (primary + secondary) that expand/contract
//   - mix-blend-mode: multiply on overlap creates the third ink color
//   - CSS-only animation via @keyframes on SVG path d attribute (morph)
//   - No spinner, no dots — purely organic ink behavior
//   - Size variants: sm / md / lg

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type LoaderSize = "sm" | "md" | "lg";

interface InkBlotLoaderProps extends RisoThemeProps {
  size?: LoaderSize;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE: Record<LoaderSize, number> = { sm: 48, md: 80, lg: 120 };

// Pre-computed blob keyframe paths (organic shapes, same viewBox)
// Each blob morphs between 3 states. Paths are on a 100x100 grid.
const BLOB_A = {
  k0: "M50,20 C70,15 85,30 82,50 C79,70 65,82 50,80 C35,78 20,65 22,50 C24,35 30,25 50,20 Z",
  k1: "M50,15 C75,18 88,38 85,55 C82,72 68,85 50,82 C32,79 18,65 20,48 C22,31 25,12 50,15 Z",
  k2: "M50,22 C68,12 88,25 86,48 C84,71 62,88 46,82 C30,76 16,60 20,44 C24,28 32,32 50,22 Z",
};

const BLOB_B = {
  k0: "M52,22 C72,20 84,38 80,55 C76,72 60,82 45,78 C30,74 22,58 26,44 C30,30 32,24 52,22 Z",
  k1: "M48,18 C70,14 86,34 82,52 C78,70 62,84 46,80 C30,76 18,56 24,42 C30,28 26,22 48,18 Z",
  k2: "M54,18 C76,16 90,35 84,54 C78,73 58,86 44,80 C30,74 18,54 24,40 C30,26 32,20 54,18 Z",
};

export function InkBlotLoader({
  size = "md",
  label,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: InkBlotLoaderProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const px = SIZE[size];
  const styleId = `ibl-${size}`;

  return (
    <div
      className={cn("flex flex-col items-center gap-3", className)}
      role="status"
      aria-label={label ?? "Loading…"}
      style={{ ...risoStyle, ...style }}
    >
      <style>{`
        @keyframes ${styleId}-a {
          0%,100% { d: path("${BLOB_A.k0}"); }
          33%      { d: path("${BLOB_A.k1}"); }
          66%      { d: path("${BLOB_A.k2}"); }
        }
        @keyframes ${styleId}-b {
          0%,100% { d: path("${BLOB_B.k0}"); }
          33%      { d: path("${BLOB_B.k1}"); }
          66%      { d: path("${BLOB_B.k2}"); }
        }
        .${styleId}-path-a {
          animation: ${styleId}-a 2.4s ease-in-out infinite;
        }
        .${styleId}-path-b {
          animation: ${styleId}-b 2.8s ease-in-out infinite 0.4s;
        }
        @media (prefers-reduced-motion: reduce) {
          .${styleId}-path-a, .${styleId}-path-b { animation: none; }
        }
      `}</style>

      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        aria-hidden
        style={{ overflow: "visible" }}
      >
        {/* Primary blob */}
        <path
          className={`${styleId}-path-a`}
          d={BLOB_A.k0}
          fill="var(--riso-primary)"
          style={{ mixBlendMode: "multiply" }}
        />

        {/* Secondary blob — offset slightly, multiply blend */}
        <path
          className={`${styleId}-path-b`}
          d={BLOB_B.k0}
          fill="var(--riso-secondary)"
          style={{ mixBlendMode: "multiply" }}
          transform="translate(5,5)"
        />

        {/* Grain overlay */}
        <defs>
          <filter
            id={`${styleId}-grain`}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="n"
            />
            <feColorMatrix type="saturate" values="0" in="n" result="g" />
            <feBlend in="SourceGraphic" in2="g" mode="multiply" result="b" />
            <feComposite in="b" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <rect
          x="-5"
          y="-5"
          width="115"
          height="115"
          fill="transparent"
          filter={`url(#${styleId}-grain)`}
          style={{ pointerEvents: "none" }}
        />
      </svg>

      {label && (
        <span
          aria-live="polite"
          className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.18em] text-[var(--riso-secondary)]"
        >
          {label}
        </span>
      )}
    </div>
  );
}
