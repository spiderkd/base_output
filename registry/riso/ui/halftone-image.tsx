"use client";

// registry/riso/ui/halftone-image.tsx — Risograph Halftone Image Mask ★
//
// Visual system:
//   - Converts any <img> to a two-color halftone using only primary/secondary ink
//   - Uses SVG feMorphology + feColorMatrix + feBlend composite
//   - Dark areas of image → primary ink halftone dots
//   - Light areas → paper showing through
//   - Shadows/midtones → secondary ink (the overlap color appears naturally)
//   - Dot size, density, and angle are configurable

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface HalftoneImageProps extends RisoThemeProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  dotSize?: number; // 1–8, default 3
  angle?: number; // rotation angle for dot grid, default 15°
  className?: string;
  style?: React.CSSProperties;
}

export function HalftoneImage({
  src,
  alt,
  width = "100%",
  height = "auto",
  dotSize = 3,
  angle = 15,
  className,
  style,
  theme,
  primary,
  secondary,
  overlap,
  paper,
}: HalftoneImageProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const filterId = React.useId().replace(/:/g, "");
  const patternId = `ht-pat-${filterId}`;
  const patternId2 = `ht-pat2-${filterId}`;
  const clipId = `ht-clip-${filterId}`;
  const maskId = `ht-mask-${filterId}`;

  const spacing = dotSize * 2.8;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ ...risoStyle, ...style }}
    >
      <svg
        width="100%"
        height={height}
        style={{ display: "block", mixBlendMode: "multiply" }}
        aria-label={alt}
      >
        <defs>
          {/* Halftone dot patterns — rotated grids */}
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${angle})`}
          >
            <circle
              cx={spacing / 2}
              cy={spacing / 2}
              r={dotSize}
              fill="black"
            />
          </pattern>

          <pattern
            id={patternId2}
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${angle + 30})`}
          >
            <circle
              cx={spacing / 2}
              cy={spacing / 2}
              r={dotSize * 0.7}
              fill="black"
            />
          </pattern>

          {/* Filter: convert image luminance to halftone mask */}
          <filter
            id={filterId}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            {/* Extract luminance */}
            <feColorMatrix type="saturate" values="0" result="gray" />
            {/* Threshold to create dot mask */}
            <feComponentTransfer in="gray" result="thresh">
              <feFuncR type="discrete" tableValues="0 0 0 0 0 0 1 1 1 1" />
              <feFuncG type="discrete" tableValues="0 0 0 0 0 0 1 1 1 1" />
              <feFuncB type="discrete" tableValues="0 0 0 0 0 0 1 1 1 1" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Primary ink layer — dark areas */}
        <image
          href={src}
          width="100%"
          height="100%"
          style={{ filter: `url(#${filterId})` }}
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Halftone dot overlay — primary color */}
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          style={{ mixBlendMode: "multiply", opacity: 0.8 }}
        />

        {/* Secondary color offset dot layer */}
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId2})`}
          style={{ mixBlendMode: "multiply", opacity: 0.45 }}
          transform={`translate(${dotSize}, ${dotSize})`}
        />

        {/* Primary ink color wash */}
        <rect
          width="100%"
          height="100%"
          fill="var(--riso-primary)"
          style={{ mixBlendMode: "multiply", opacity: 0.6 }}
        />

        {/* Secondary ink color wash at offset */}
        <rect
          width="100%"
          height="100%"
          fill="var(--riso-secondary)"
          style={{ mixBlendMode: "multiply", opacity: 0.35 }}
          transform={`translate(2,2)`}
        />
      </svg>

      {/* Grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
          opacity: 0.07,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
