"use client";

// registry/riso/ui/plate-registration.tsx — Plate Registration Crosshair ★
//
// Visual system:
//   - Renders the corner crop marks and registration circles used in real riso printing
//   - Primary registration marks (larger, outer) + secondary offset (inner)
//   - Used as page ornament, section divider, or watermark overlay
//   - Supports: corner, full-bleed (all four corners), center cross, target
//   - Pure SVG — zero runtime cost

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type RegistrationVariant = "corner" | "target" | "cross" | "full-bleed";
type RegistrationCorner = "tl" | "tr" | "bl" | "br";

interface PlateRegistrationProps extends RisoThemeProps {
  variant?: RegistrationVariant;
  corner?: RegistrationCorner; // used with variant="corner"
  size?: number;
  primaryOpacity?: number;
  secondaryOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

function TargetMark({ size, p, s }: { size: number; p: number; s: number }) {
  const cx = size / 2;
  const r1 = size * 0.35;
  const r2 = size * 0.2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {/* Outer circles */}
      <circle
        cx={cx}
        cy={cx}
        r={r1}
        fill="none"
        stroke="var(--riso-primary)"
        strokeWidth="1.5"
        opacity={p}
      />
      <circle
        cx={cx + 2}
        cy={cx + 2}
        r={r1}
        fill="none"
        stroke="var(--riso-secondary)"
        strokeWidth="0.8"
        opacity={s}
      />

      {/* Inner circles */}
      <circle
        cx={cx}
        cy={cx}
        r={r2}
        fill="none"
        stroke="var(--riso-primary)"
        strokeWidth="1.5"
        opacity={p}
      />
      <circle
        cx={cx + 2}
        cy={cx + 2}
        r={r2}
        fill="none"
        stroke="var(--riso-secondary)"
        strokeWidth="0.8"
        opacity={s}
      />

      {/* Cross hairs — primary */}
      <line
        x1="0"
        y1={cx}
        x2={size}
        y2={cx}
        stroke="var(--riso-primary)"
        strokeWidth="0.8"
        opacity={p}
      />
      <line
        x1={cx}
        y1="0"
        x2={cx}
        y2={size}
        stroke="var(--riso-primary)"
        strokeWidth="0.8"
        opacity={p}
      />

      {/* Cross hairs — secondary offset */}
      <line
        x1="2"
        y1={cx + 2}
        x2={size}
        y2={cx + 2}
        stroke="var(--riso-secondary)"
        strokeWidth="0.5"
        opacity={s}
      />
      <line
        x1={cx + 2}
        y1="2"
        x2={cx + 2}
        y2={size}
        stroke="var(--riso-secondary)"
        strokeWidth="0.5"
        opacity={s}
      />
    </svg>
  );
}

function CornerMark({
  corner,
  size,
  p,
  s,
}: {
  corner: RegistrationCorner;
  size: number;
  p: number;
  s: number;
}) {
  const arm = size * 0.3;
  const gap = size * 0.12;
  const r = size * 0.08;
  const cx = size / 2;

  // Determine which quadrant of the corner lines to draw
  const hDir = corner.endsWith("l") ? -1 : 1; // left = -1, right = +1
  const vDir = corner.startsWith("t") ? -1 : 1; // top = -1, bottom = +1

  const hx1 = cx + hDir * gap;
  const hx2 = cx + hDir * (gap + arm);
  const vy1 = cx + vDir * gap;
  const vy2 = cx + vDir * (gap + arm);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {/* Primary corner lines */}
      <line
        x1={hx1}
        y1={cx}
        x2={hx2}
        y2={cx}
        stroke="var(--riso-primary)"
        strokeWidth="1.5"
        opacity={p}
      />
      <line
        x1={cx}
        y1={vy1}
        x2={cx}
        y2={vy2}
        stroke="var(--riso-primary)"
        strokeWidth="1.5"
        opacity={p}
      />

      {/* Secondary offset lines */}
      <line
        x1={hx1 + 2}
        y1={cx + 2}
        x2={hx2 + 2}
        y2={cx + 2}
        stroke="var(--riso-secondary)"
        strokeWidth="0.8"
        opacity={s}
      />
      <line
        x1={cx + 2}
        y1={vy1 + 2}
        x2={cx + 2}
        y2={vy2 + 2}
        stroke="var(--riso-secondary)"
        strokeWidth="0.8"
        opacity={s}
      />

      {/* Registration circle */}
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="var(--riso-primary)"
        strokeWidth="1.5"
        opacity={p}
      />
      <circle
        cx={cx + 2}
        cy={cx + 2}
        r={r}
        fill="none"
        stroke="var(--riso-secondary)"
        strokeWidth="0.8"
        opacity={s}
      />

      {/* Center dot */}
      <circle cx={cx} cy={cx} r={1.5} fill="var(--riso-primary)" opacity={p} />
    </svg>
  );
}

export function PlateRegistration({
  variant = "target",
  corner = "tl",
  size = 48,
  primaryOpacity = 0.8,
  secondaryOpacity = 0.55,
  className,
  style,
  theme,
  primary,
  secondary,
  overlap,
  paper,
}: PlateRegistrationProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  if (variant === "full-bleed") {
    return (
      <div
        className={cn("pointer-events-none absolute inset-0", className)}
        style={{ ...risoStyle, ...style }}
        aria-hidden
      >
        {(["tl", "tr", "bl", "br"] as RegistrationCorner[]).map((c) => {
          return (
            <div
              key={c}
              className={cn(
                "absolute",
                c.startsWith("t") ? "top-0" : "bottom-0",
                c.endsWith("l") ? "left-0" : "right-0",
              )}
            >
              <CornerMark
                corner={c}
                size={size}
                p={primaryOpacity}
                s={secondaryOpacity}
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "corner") {
    return (
      <div
        className={cn(className)}
        style={{ ...risoStyle, ...style }}
        aria-hidden
      >
        <CornerMark
          corner={corner}
          size={size}
          p={primaryOpacity}
          s={secondaryOpacity}
        />
      </div>
    );
  }

  if (variant === "cross") {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn(className)}
        style={{ ...risoStyle, ...style }}
        aria-hidden
      >
        <line
          x1="0"
          y1={size / 2}
          x2={size}
          y2={size / 2}
          stroke="var(--riso-primary)"
          strokeWidth="1"
          opacity={primaryOpacity}
        />
        <line
          x1={size / 2}
          y1="0"
          x2={size / 2}
          y2={size}
          stroke="var(--riso-primary)"
          strokeWidth="1"
          opacity={primaryOpacity}
        />
        <line
          x1="2"
          y1={size / 2 + 2}
          x2={size}
          y2={size / 2 + 2}
          stroke="var(--riso-secondary)"
          strokeWidth="0.5"
          opacity={secondaryOpacity}
        />
        <line
          x1={size / 2 + 2}
          y1="2"
          x2={size / 2 + 2}
          y2={size}
          stroke="var(--riso-secondary)"
          strokeWidth="0.5"
          opacity={secondaryOpacity}
        />
      </svg>
    );
  }

  // Default: target
  return (
    <div
      className={cn(className)}
      style={{ ...risoStyle, ...style }}
      aria-hidden
    >
      <TargetMark size={size} p={primaryOpacity} s={secondaryOpacity} />
    </div>
  );
}
