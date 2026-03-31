"use client";

// registry/riso/ui/checkbox.tsx — Risograph Checkbox
//
// Visual system:
//   - Plain SVG <rect> in primary, secondary offset layer behind it
//   - Checked: secondary fill floods the box with a halftone texture
//   - Check mark is drawn as two SVG <line> elements — each in different ink
//   - Hover: misreg offset shifts slightly (plate movement feel)

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface CheckboxProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    RisoThemeProps {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      className,
      onChange,
      checked,
      defaultChecked,
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
    const [isChecked, setIsChecked] = React.useState(defaultChecked ?? false);
    const controlled = checked !== undefined;
    const active = controlled ? checked : isChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!controlled) setIsChecked(e.target.checked);
      onChange?.(e);
    };

    const BOX = 18;

    return (
      <label
        className={cn(
          "inline-flex items-start gap-2.5 cursor-pointer select-none group",
          className,
        )}
        style={{ ...risoStyle, ...style }}
      >
        <div className="relative flex-shrink-0 mt-px w-[21px] h-[21px]">
          {/* Hidden native input for accessibility */}
          <input
            ref={ref}
            type="checkbox"
            checked={controlled ? checked : isChecked}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />

          {/* Secondary layer — misregistration offset behind */}
          <svg
            aria-hidden
            width={BOX}
            height={BOX}
            className="absolute top-[3px] left-[3px] transition-transform duration-150"
          >
            <rect
              x={0}
              y={0}
              width={BOX}
              height={BOX}
              fill={active ? "var(--riso-secondary)" : "transparent"}
              stroke="var(--riso-secondary)"
              strokeWidth={active ? 0 : 1.5}
              opacity={0.6}
            />
          </svg>

          {/* Primary layer — foreground box */}
          <svg
            aria-hidden
            width={BOX}
            height={BOX}
            className="absolute group-hover:[transform:translate(-0.5px,-0.5px)] transition-transform duration-150 top-0 left-0"
            filter="url(#riso-grain-border)"
          >
            <rect
              x={1}
              y={1}
              width={BOX - 2}
              height={BOX - 2}
              fill={
                active ? "var(--riso-primary)" : "var(--riso-paper, #f7f0e2)"
              }
              stroke="var(--riso-primary)"
              strokeWidth={2}
            />

            {/* Halftone fill overlay when checked */}
            {active && (
              <rect
                x={1}
                y={1}
                width={BOX - 2}
                height={BOX - 2}
                fill="url(#riso-check-halftone)"
                opacity={0.2}
              />
            )}

            {/* Check mark — two ink lines */}
            {active && (
              <g>
                {/* Primary ink arm */}
                <line
                  x1={3.5}
                  y1={9}
                  x2={7.5}
                  y2={13.5}
                  stroke="white"
                  strokeWidth={2.5}
                  strokeLinecap="square"
                />
                {/* Secondary ink arm */}
                <line
                  x1={7.5}
                  y1={13.5}
                  x2={14.5}
                  y2={5}
                  stroke="white"
                  strokeWidth={2.5}
                  strokeLinecap="square"
                />
              </g>
            )}
          </svg>
        </div>

        {(label || description) && (
          <div>
            {label && (
              <span className="block text-sm font-bold uppercase tracking-wide font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] text-[var(--riso-overlap,#7b4f7a)]">
                {label}
              </span>
            )}
            {description && (
              <span className="block text-[11px] mt-0.5 font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[var(--riso-secondary)]">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
