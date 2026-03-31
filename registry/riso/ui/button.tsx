"use client";

// registry/riso/ui/button.tsx — Risograph Button
//
// Visual system:
//   - Primary: solid ink fill with hard offset shadow in secondary color
//   - Secondary: outline in primary, ghost secondary fill on hover
//   - Ghost: no fill, primary border only
//   - Hover: shadow compresses from 4px → 1px (plate pressing down)
//   - Active: shadow collapses to 0, slight translate to match

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

export type RisoButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type RisoButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, RisoThemeProps {
  variant?: RisoButtonVariant;
  size?: RisoButtonSize;
  loading?: boolean;
}

const sizeClasses: Record<RisoButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
  ...props
}: ButtonProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const isDisabled = disabled || loading;

  // Base: sharp corners (border-radius: 0), monospaced uppercase label feel
  const base = [
    "relative inline-flex items-center justify-center gap-2",
    "font-[family-name:var(--font-riso-label,_'Space_Grotesk',_sans-serif)]",
    "font-bold uppercase tracking-widest",
    "border-0 outline-none cursor-pointer select-none",
    "transition-all duration-150",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    // The misregistration shadow animates on hover/active
    "group",
  ].join(" ");

  const variants: Record<RisoButtonVariant, string> = {
    primary: [
      "bg-[var(--riso-primary)] text-white",
      // Hard offset shadow in secondary color — the "stacking principle"
      "[filter:drop-shadow(4px_4px_0px_var(--riso-secondary))]",
      "hover:[filter:drop-shadow(1px_1px_0px_var(--riso-secondary))]",
      "hover:translate-x-[3px] hover:translate-y-[3px]",
      "active:[filter:drop-shadow(0px_0px_0px_var(--riso-secondary))]",
      "active:translate-x-[4px] active:translate-y-[4px]",
    ].join(" "),

    secondary: [
      "bg-[var(--riso-paper,#f7f0e2)] text-[var(--riso-primary)]",
      "outline outline-2 outline-[var(--riso-primary)]",
      "[filter:drop-shadow(4px_4px_0px_var(--riso-primary))]",
      "hover:[filter:drop-shadow(1px_1px_0px_var(--riso-primary))]",
      "hover:translate-x-[3px] hover:translate-y-[3px]",
      "hover:bg-[var(--riso-primary-10,rgba(255,94,126,0.1))]",
      "active:[filter:drop-shadow(0px_0px_0px_var(--riso-primary))]",
      "active:translate-x-[4px] active:translate-y-[4px]",
    ].join(" "),

    ghost: [
      "bg-transparent text-[var(--riso-primary)]",
      "outline outline-2 outline-[var(--riso-primary)]",
      "hover:bg-[var(--riso-primary-10,rgba(255,94,126,0.1))]",
      "hover:[filter:drop-shadow(2px_2px_0px_var(--riso-secondary))]",
      "active:translate-x-[1px] active:translate-y-[1px]",
    ].join(" "),

    danger: [
      "bg-[#e8362a] text-white",
      "[filter:drop-shadow(4px_4px_0px_#1a1a1a)]",
      "hover:[filter:drop-shadow(1px_1px_0px_#1a1a1a)]",
      "hover:translate-x-[3px] hover:translate-y-[3px]",
      "active:[filter:drop-shadow(0px_0px_0px_#1a1a1a)]",
      "active:translate-x-[4px] active:translate-y-[4px]",
    ].join(" "),
  };

  return (
    <button
      disabled={isDisabled}
      className={cn(base, sizeClasses[size], variants[variant], className)}
      {...props}
      style={{ ...risoStyle, ...style }}
    >
      {/* Secondary ink misregistration ghost — sits behind the label */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0  group-hover:opacity-100 transition-opacity bg-[var(--riso-secondary)] mix-blend-multiply opacity-0"
      />

      {loading ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-1 h-1 bg-current animate-bounce [animation-delay:0ms]" />
          <span className="inline-block w-1 h-1 bg-current animate-bounce [animation-delay:150ms]" />
          <span className="inline-block w-1 h-1 bg-current animate-bounce [animation-delay:300ms]" />
        </span>
      ) : (
        children
      )}
    </button>
  );
}
