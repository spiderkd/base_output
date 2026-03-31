"use client";

// registry/riso/ui/avatar.tsx — Risograph Avatar
//
// Visual system:
//   - Two concentric circles — outer in primary, inner fill in secondary
//   - Offset between them creates the misregistration effect
//   - Initials rendered in primary color on paper background
//   - "stamp" variant: dashed circle border like a rubber stamp mark

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarVariant = "default" | "stamp" | "filled";

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>, RisoThemeProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
}

interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>, RisoThemeProps {}

// Tailwind size maps — outer, inner, font, offset encoded as classes
const sizeClasses: Record<
  AvatarSize,
  {
    wrapper: string; // w + h of outer+offset
    secondary: string; // w+h of outer circle, offset top/left
    primary: string; // w+h of outer circle at 0,0
    img: string; // inner img w+h
    font: string; // font-size class
    fallback: string; // fallback dot size
  }
> = {
  sm: {
    wrapper: "w-[33.5px] h-[33.5px]",
    secondary: "w-8 h-8 top-[1.5px] left-[1.5px]",
    primary: "w-8 h-8 top-0 left-0",
    img: "w-7 h-7",
    font: "text-[10px]",
    fallback: "w-[16px] h-[16px]",
  },
  md: {
    wrapper: "w-[42px] h-[42px]",
    secondary: "w-10 h-10 top-[2px] left-[2px]",
    primary: "w-10 h-10 top-0 left-0",
    img: "w-[35px] h-[35px]",
    font: "text-[13px]",
    fallback: "w-[21px] h-[21px]",
  },
  lg: {
    wrapper: "w-[58.5px] h-[58.5px]",
    secondary: "w-14 h-14 top-[2.5px] left-[2.5px]",
    primary: "w-14 h-14 top-0 left-0",
    img: "w-[50px] h-[50px]",
    font: "text-[17px]",
    fallback: "w-[30px] h-[30px]",
  },
  xl: {
    wrapper: "w-[83px] h-[83px]",
    secondary: "w-20 h-20 top-[3px] left-[3px]",
    primary: "w-20 h-20 top-0 left-0",
    img: "w-[72px] h-[72px]",
    font: "text-[24px]",
    fallback: "w-[43px] h-[43px]",
  },
};

export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  variant = "default",
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
  ...props
}: AvatarProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const sz = sizeClasses[size];

  return (
    <div
      className={cn(
        "relative inline-block flex-shrink-0",
        sz.wrapper,
        className,
      )}
      {...props}
      style={{ ...risoStyle, ...style }}
    >
      {/* Secondary ink circle — the misregistration layer, offset and behind */}
      <div
        aria-hidden
        className={cn(
          "absolute rounded-full opacity-75",
          sz.secondary,
          variant === "stamp"
            ? "border-2 border-dashed border-[var(--riso-secondary)]"
            : "border-2 border-[var(--riso-secondary)]",
          variant === "filled"
            ? "bg-[var(--riso-secondary)]"
            : "bg-transparent",
        )}
      />

      {/* Primary ink circle — foreground */}
      <div
        className={cn(
          "absolute flex items-center justify-center overflow-hidden rounded-full",
          sz.primary,
          variant === "stamp"
            ? "border-2 border-dashed border-[var(--riso-primary)]"
            : "border-2 border-[var(--riso-primary)]",
          variant === "filled"
            ? "bg-[var(--riso-primary)]"
            : "bg-[var(--riso-paper,#f7f0e2)]",
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={cn(
              "rounded-full object-cover [filter:grayscale(30%)] mix-blend-multiply",
              sz.img,
            )}
          />
        ) : initials ? (
          <span
            className={cn(
              "font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold uppercase tracking-[0.05em]",
              sz.font,
              variant === "filled"
                ? "text-white"
                : "text-[var(--riso-primary)]",
            )}
          >
            {initials.slice(0, 2)}
          </span>
        ) : (
          // Fallback icon — halftone circle
          <div
            className={cn(
              "rounded-full bg-[var(--riso-primary)] opacity-40",
              sz.fallback,
            )}
          />
        )}
      </div>
    </div>
  );
}

// AvatarGroup — stacks avatars with slight overlap and misreg offsets
export function AvatarGroup({
  children,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
  ...props
}: AvatarGroupProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  return (
    <div
      className={cn("flex items-center", className)}
      {...props}
      style={{ ...risoStyle, ...style }}
    >
      {React.Children.map(children, (child, i) => (
        <div
          key={i}
          className={cn("relative", i !== 0 && "-ml-3")}
          style={{ zIndex: React.Children.count(children) - i }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
