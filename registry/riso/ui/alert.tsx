"use client";

// registry/riso/ui/alert.tsx — Risograph Alert / Banner
//
// Visual system:
//   - Full-width print block with white text for error/warning
//   - Outlined version with secondary shadow for info/success
//   - Danger variant: cross-hatch SVG pattern behind the fill
//   - Icon area: stamp-style left border section
//   - Dismissible with X button

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type AlertVariant = "info" | "success" | "warning" | "danger";

interface AlertProps extends RisoThemeProps {
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const VARIANTS: Record<
  AlertVariant,
  {
    wrapperFilter: string;
    innerClass: string;
    textColor: string; // kept as CSS var for SVG stroke usage
    accentBarClass: string;
    titleClass: string;
    bodyClass: string;
  }
> = {
  info: {
    wrapperFilter: "[filter:drop-shadow(4px_4px_0px_var(--riso-secondary))]",
    innerClass:
      "bg-[var(--riso-paper,#f7f0e2)] border-2 border-[var(--riso-secondary)]",
    textColor: "var(--riso-overlap,#7b4f7a)",
    accentBarClass: "bg-[var(--riso-secondary)]",
    titleClass: "text-[var(--riso-overlap,#7b4f7a)]",
    bodyClass: "text-[var(--riso-overlap,#7b4f7a)]",
  },
  success: {
    wrapperFilter: "[filter:drop-shadow(4px_4px_0px_var(--riso-secondary))]",
    innerClass:
      "bg-[var(--riso-paper,#f7f0e2)] border-2 border-[var(--riso-secondary)]",
    textColor: "var(--riso-overlap,#7b4f7a)",
    accentBarClass: "bg-[var(--riso-secondary)]",
    titleClass: "text-[var(--riso-overlap,#7b4f7a)]",
    bodyClass: "text-[var(--riso-overlap,#7b4f7a)]",
  },
  warning: {
    wrapperFilter: "[filter:drop-shadow(4px_4px_0px_var(--riso-primary))]",
    innerClass:
      "bg-[var(--riso-overlap,#7b4f7a)] border-2 border-[var(--riso-overlap,#7b4f7a)]",
    textColor: "white",
    accentBarClass: "bg-[var(--riso-primary)]",
    titleClass: "text-white",
    bodyClass: "text-white",
  },
  danger: {
    wrapperFilter: "[filter:drop-shadow(4px_4px_0px_#1a1a1a)]",
    innerClass: "bg-[#e8362a] border-2 border-[#e8362a]",
    textColor: "white",
    accentBarClass: "bg-[rgba(255,255,255,0.4)]",
    titleClass: "text-white",
    bodyClass: "text-white",
  },
};

export function Alert({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: AlertProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [dismissed, setDismissed] = React.useState(false);
  const cfg = VARIANTS[variant];

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={cn("relative w-full", cfg.wrapperFilter, className)}
      style={{ ...risoStyle, ...style }}
    >
      {/* Cross-hatch pattern for danger */}
      {variant === "danger" && (
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.12]"
        >
          <defs>
            <pattern
              id="hatch-alert"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="white"
                strokeWidth="3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hatch-alert)" />
        </svg>
      )}

      <div
        className={cn(
          "relative flex items-start gap-0 overflow-hidden",
          cfg.innerClass,
        )}
      >
        {/* Left accent bar */}
        <div
          aria-hidden
          className={cn("w-[5px] self-stretch shrink-0", cfg.accentBarClass)}
        />

        {/* Content */}
        <div className="px-4 pt-3 pb-3 pr-10 flex-1">
          {title && (
            <p
              className={cn(
                "font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[13px] uppercase tracking-[0.04em] mb-1 mt-0 mx-0",
                cfg.titleClass,
              )}
            >
              {title}
            </p>
          )}
          {children && (
            <div
              className={cn(
                "font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[12px]",
                cfg.bodyClass,
                title && "opacity-85",
              )}
            >
              {children}
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="absolute top-[10px] right-[10px] bg-transparent border-none cursor-pointer p-1"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden
            >
              <line
                x1="1"
                y1="1"
                x2="11"
                y2="11"
                stroke={cfg.textColor}
                strokeWidth="2"
                strokeLinecap="square"
              />
              <line
                x1="11"
                y1="1"
                x2="1"
                y2="11"
                stroke={cfg.textColor}
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
