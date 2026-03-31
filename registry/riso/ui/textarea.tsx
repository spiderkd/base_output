"use client";

// registry/riso/ui/textarea.tsx — Risograph Textarea
//
// Visual system:
//   - Extends Input's misreg shadow system
//   - On focus: grain filter opacity intensifies
//   - Resize handle redrawn as two SVG diagonal lines
//   - Same sharp-corner, no-radius rule

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, RisoThemeProps {
  label?: string;
  hint?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      showCount,
      maxLength,
      className,
      theme,
      primary,
      secondary,
      overlap,
      paper,
      style,
      ...props
    },
    ref,
  ) => {
    const risoStyle = resolveRisoVars({
      theme,
      primary,
      secondary,
      overlap,
      paper,
    });
    const [focused, setFocused] = React.useState(false);
    const [count, setCount] = React.useState(
      typeof props.defaultValue === "string" ? props.defaultValue.length : 0,
    );

    return (
      <div
        className="flex flex-col gap-1.5 w-full"
        style={{ ...risoStyle, ...style }}
      >
        {label && (
          <span
            className={cn(
              "font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.15em]",
              error ? "text-[#e8362a]" : "text-[var(--riso-primary)]",
            )}
          >
            {label}
          </span>
        )}

        <div className="relative">
          {/* Misreg shadow — intensifies on focus */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[var(--riso-secondary)] translate-x-0.5 translate-y-0.5 pointer-events-none transition-opacity duration-150"
            style={{ opacity: focused ? 0.35 : 0.22 }}
          />

          <textarea
            ref={ref}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setCount(e.target.value.length);
              props.onChange?.(e);
            }}
            maxLength={maxLength}
            className={cn(
              "relative z-[1] w-full px-3 py-[10px] bg-[var(--riso-paper,#f7f0e2)] border-none font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[13px] text-[var(--riso-overlap,#7b4f7a)] resize-y",
              className,
            )}
            style={{
              outline: `2px solid ${error ? "#e8362a" : focused ? "var(--riso-primary)" : "var(--riso-secondary)"}`,
              minHeight: 100,
              transition: "outline-color 150ms",
              // Override native resize handle via appearance
            }}
            {...props}
          />

          {/* Custom resize grip — two SVG lines in riso style */}
          <svg
            aria-hidden
            className="absolute bottom-[3px] right-[3px] pointer-events-none z-[2]"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <line
              x1="4"
              y1="11"
              x2="11"
              y2="4"
              stroke="var(--riso-primary)"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <line
              x1="7"
              y1="11"
              x2="11"
              y2="7"
              stroke="var(--riso-secondary)"
              strokeWidth="1"
              strokeLinecap="square"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="flex justify-between">
          {(error || hint) && (
            <span
              className={cn(
                "font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] text-[9px] uppercase tracking-[0.12em]",
                error ? "text-[#e8362a]" : "text-[var(--riso-secondary)]",
              )}
            >
              {error ?? hint}
            </span>
          )}
          {showCount && maxLength && (
            <span className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] text-[9px] text-[var(--riso-secondary)] ml-auto">
              {count}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
