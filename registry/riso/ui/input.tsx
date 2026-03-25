"use client";

// registry/new-york/ui/input.tsx — Risograph Input
//
// Visual system:
//   - Sharp rectangular frame — NO border-radius
//   - Normal: 2px primary outline, paper background
//   - Focus: misreg offset increases 1px → 3px, frame shifts from secondary → primary
//   - Error: flood filter effect — red ink frame
//   - Halftone dot background texture (optional)
//   - Label is styled as a technical print spec annotation

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, RisoThemeProps {
  label?: string;
  error?: string;
  hint?: string;
  halftone?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, halftone = false, className, id, theme, primary, secondary, overlap, paper, style, ...props }, ref) => {
    const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
    const inputId =
      id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="relative flex flex-col gap-1.5 w-full" style={{ ...risoStyle, ...style }}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              " block text-[10px] font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)]",
              error ? "text-[#e8362a]" : "text-[var(--riso-primary)]",
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Misreg shadow layer — sits behind input, offset by ~2px */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none transition-transform duration-150 bg-[var(--riso-secondary)] translate-x-0.5 translate-y-0.5 opacity-30"
          />

          {/* Halftone background texture */}
          {halftone && (
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none z-0 [background-image:radial-gradient(circle,var(--riso-secondary)_1px,transparent_0)] [background-size:4px_4px] opacity-[0.12]"
            />
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "relative z-10 w-full",
              "px-3 py-2.5",
              "text-sm",
              "bg-[var(--riso-paper,#f7f0e2)]",
              "text-[var(--riso-overlap,#7b4f7a)]",
              "outline ",
              error
                ? "outline-[#e8362a] focus:outline-[#e8362a]"
                : "outline-[var(--riso-secondary)] focus:outline-[var(--riso-primary)]",
              // On focus: misreg offset shifts via parent hover trick
              "focus:[filter:drop-shadow(0px_0px_0px_transparent)]",
              "placeholder:text-[var(--riso-overlap)] placeholder:opacity-30",
              "transition-all duration-150",
              // Sharp corners
              "rounded-none",
              // Font
              "font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)]",
              className,
            )}
            {...props}
          />
        </div>

        {(error || hint) && (
          <p
            className={cn(
              "text-[10px] uppercase tracking-wider font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)]",
              error ? "text-[#e8362a]" : "text-[var(--riso-secondary)]",
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";


