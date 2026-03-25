"use client";

// registry/new-york/ui/stamp.tsx — Risograph Stamp
//
// Unique to Riso — no Crumble equivalent.
//
// Visual system:
//   - Circle with serrated dashed border — simulates rubber stamp impression
//   - Two concentric dashed circles: outer in primary, inner in secondary
//   - Hard drop shadow in overlap color (no blur)
//   - Inner content: uppercase label in headline font
//   - Status variant: uses ink bleed filter for slightly smeared look
//   - Slight rotation (-2° to +2°) feels hand-stamped

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type StampVariant = "default" | "approved" | "rejected" | "pending" | "draft";

interface StampProps extends RisoThemeProps {
  label?: string;
  sublabel?: string;
  variant?: StampVariant;
  size?: number;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
}

const variantConfig: Record<StampVariant, { color: string; shadow: string }> = {
  default: { color: "var(--riso-primary)", shadow: "var(--riso-secondary)" },
  approved: { color: "var(--riso-secondary)", shadow: "var(--riso-primary)" },
  rejected: { color: "#e8362a", shadow: "var(--riso-overlap, #7b4f7a)" },
  pending: { color: "var(--riso-overlap, #7b4f7a)", shadow: "var(--riso-secondary)" },
  draft: { color: "var(--riso-primary)", shadow: "var(--riso-secondary)" },
};

export function Stamp({ label,
  sublabel,
  variant = "default",
  size = 100,
  rotate = -2,
  className, theme, primary, secondary, overlap, paper, style }: StampProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const { color, shadow } = variantConfig[variant];
  const r1 = size / 2 - 3;    // outer circle radius
  const r2 = size / 2 - 10;   // inner circle radius
  const cx = size / 2;

  const displayLabel = label ?? {
    default: "RISO",
    approved: "APPROVED",
    rejected: "REJECTED",
    pending: "PENDING",
    draft: "DRAFT",
  }[variant];

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{
        ...risoStyle, ...({
          width: size + 4,
          height: size + 4,
          transform: `rotate(${rotate}deg)`,
          filter: `drop-shadow(3px 3px 0px ${shadow})`,
        })
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`Stamp: ${displayLabel}`}
        style={{ filter: "url(#riso-bleed-soft)" }}
      >
        {/* Outer dashed circle — primary ink */}
        <circle
          cx={cx} cy={cx} r={r1}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray="4 3"
          strokeLinecap="butt"
        />

        {/* Inner dashed circle — secondary ink (misreg) */}
        <circle
          cx={cx} cy={cx} r={r2}
          fill="none"
          stroke={shadow}
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeLinecap="butt"
          opacity="0.6"
        />

        {/* Horizontal rule across center */}
        {sublabel && (
          <>
            <line
              x1={cx - r2 * 0.75} y1={cx + 6}
              x2={cx + r2 * 0.75} y2={cx + 6}
              stroke={color} strokeWidth="1.5"
            />
            <line
              x1={cx - r2 * 0.7} y1={cx + 9}
              x2={cx + r2 * 0.7} y2={cx + 9}
              stroke={shadow} strokeWidth="0.8" opacity="0.6"
            />
          </>
        )}

        {/* Main label */}
        <text
          x={cx} y={sublabel ? cx + 2 : cx + 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={sublabel ? size * 0.16 : size * 0.18}
          fontFamily="var(--font-riso-headline, 'Epilogue', sans-serif)"
          fontWeight="900"
          style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          {displayLabel}
        </text>

        {/* Sub-label */}
        {sublabel && (
          <text
            x={cx} y={cx + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={shadow}
            fontSize={size * 0.1}
            fontFamily="var(--font-riso-label, 'Space Grotesk', sans-serif)"
            fontWeight="700"
            style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            {sublabel}
          </text>
        )}
      </svg>
    </div>
  );
}


