"use client";

// registry/new-york/ui/tooltip.tsx — Risograph Tooltip
//
// Visual system:
//   - Hard-offset speech bubble — zero blur, no rounded corners (except tip nub)
//   - Secondary shadow offset 2px behind the primary box
//   - Appears instantly on hover (ink doesn't fade in)
//   - Arrow pointer drawn as SVG, inherits ink color
//   - Four placement options: top, bottom, left, right

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps extends RisoThemeProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  children: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
}

const ARROW_SIZE = 7;

function TooltipArrow({ placement }: { placement: TooltipPlacement }) {
  const size = ARROW_SIZE;

  const arrows: Record<
    TooltipPlacement,
    React.CSSProperties & { svgStyle: React.CSSProperties }
  > = {
    bottom: {
      top: -size,
      left: "50%",
      transform: "translateX(-50%)",
      svgStyle: {},
    },
    top: {
      bottom: -size,
      left: "50%",
      transform: "translateX(-50%) rotate(180deg)",
      svgStyle: {},
    },
    right: {
      top: "50%",
      left: -size,
      transform: "translateY(-50%) rotate(90deg)",
      svgStyle: {},
    },
    left: {
      top: "50%",
      right: -size,
      transform: "translateY(-50%) rotate(-90deg)",
      svgStyle: {},
    },
  };

  const { svgStyle, ...pos } = arrows[placement];

  return (
    <div
      aria-hidden
      className="absolute"
      style={{ ...pos, width: size * 2, height: size }}
    >
      {/* Shadow arrow */}
      <svg
        width={size * 2}
        height={size}
        viewBox={`0 0 ${size * 2} ${size}`}
        className="absolute top-0.5 left-0.5"
      >
        <polygon
          points={`0,${size} ${size},0 ${size * 2},${size}`}
          fill="var(--riso-secondary)"
          opacity={0.5}
        />
      </svg>
      {/* Primary arrow */}
      <svg
        width={size * 2}
        height={size}
        viewBox={`0 0 ${size * 2} ${size}`}
        className="relative"
      >
        <polygon
          points={`0,${size} ${size},0 ${size * 2},${size}`}
          fill="var(--riso-primary)"
        />
      </svg>
    </div>
  );
}

export function Tooltip({ content,
  placement = "top",
  children,
  className, theme, primary, secondary, overlap, paper, style }: TooltipProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const [open, setOpen] = React.useState(false);

  const positionStyles: Record<TooltipPlacement, React.CSSProperties> = {
    top: {
      bottom: "calc(100% + 12px)",
      left: "50%",
      transform: "translateX(-50%)",
    },
    bottom: {
      top: "calc(100% + 12px)",
      left: "50%",
      transform: "translateX(-50%)",
    },
    left: {
      right: "calc(100% + 12px)",
      top: "50%",
      transform: "translateY(-50%)",
    },
    right: {
      left: "calc(100% + 12px)",
      top: "50%",
      transform: "translateY(-50%)",
    },
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)} style={{ ...risoStyle, ...style }}
    >
      {children}

      <div
        role="tooltip"
        className="absolute z-[1000] pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[80ms]"
        style={{
          ...positionStyles[placement],
          opacity: open ? 1 : 0,
          transform: `${positionStyles[placement].transform} ${open ? "scale(1)" : "scale(0.92)"}`,
        }}
      >
        {/* Shadow layer */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--riso-secondary)] translate-x-0.5 translate-y-0.5 opacity-55"
        />

        {/* Tooltip body */}
        <div
          className={cn(
            "relative bg-[var(--riso-primary)] text-white px-3 py-1.5 font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[10px] uppercase tracking-[0.12em]",
            className,
          )}
        >
          {content}
        </div>

        {/* Arrow pointer */}
        <TooltipArrow placement={placement} />
      </div>
    </span>
  );
}


