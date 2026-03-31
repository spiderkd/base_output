"use client";

// registry/riso/ui/radio-group.tsx — Risograph Radio Group
//
// Visual system:
//   - Two concentric circles (like Avatar but small, 20×20)
//   - Outer ring: primary border
//   - Inner fill: primary when selected, paper when not
//   - Secondary shadow ring offset 2px behind outer circle
//   - Group label: uppercase print label
//   - Same interactive pattern as Checkbox

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps extends RisoThemeProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
  style?: React.CSSProperties;
}

function RadioCircle({
  checked,
  disabled,
}: {
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="relative w-[22px] h-[22px] shrink-0">
      {/* Secondary shadow ring */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        aria-hidden
        className="absolute top-0 left-0"
      >
        <circle
          cx="12.5"
          cy="12.5"
          r="9"
          fill="none"
          stroke="var(--riso-secondary)"
          strokeWidth="1.5"
          opacity={checked ? 0.55 : 0.35}
        />
      </svg>

      {/* Primary ring */}
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <circle
          cx="10"
          cy="10"
          r="9"
          fill={checked ? "var(--riso-primary)" : "var(--riso-paper,#f7f0e2)"}
          stroke="var(--riso-primary)"
          strokeWidth="2"
          style={{ transition: "fill 150ms" }}
        />

        {/* Inner dot when selected — white on primary */}
        {checked && <circle cx="10" cy="10" r="3.5" fill="white" />}
      </svg>
    </div>
  );
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onChange,
  label,
  orientation = "vertical",
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: RadioGroupProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [selected, setSelected] = React.useState<string | undefined>(
    value ?? defaultValue,
  );
  const currentValue = value !== undefined ? value : selected;

  const handleChange = (val: string) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex flex-col gap-2", className)}
      style={{ ...risoStyle, ...style }}
    >
      {label && (
        <span
          style={{
            fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--riso-primary)",
            marginBottom: 4,
          }}
        >
          {label}
        </span>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: orientation === "horizontal" ? "row" : "column",
          gap: orientation === "horizontal" ? 20 : 10,
          flexWrap: "wrap",
        }}
      >
        {options.map((opt) => {
          const isChecked = opt.value === currentValue;
          return (
            <label
              key={opt.value}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                cursor: opt.disabled ? "not-allowed" : "pointer",
                opacity: opt.disabled ? 0.4 : 1,
                userSelect: "none",
              }}
              onClick={() => !opt.disabled && handleChange(opt.value)}
            >
              <input
                type="radio"
                value={opt.value}
                checked={isChecked}
                disabled={opt.disabled}
                onChange={() => handleChange(opt.value)}
                className="absolute opacity-0 w-0 h-0"
                aria-checked={isChecked}
              />

              <RadioCircle checked={isChecked} disabled={opt.disabled} />

              <div className="pt-0.5">
                <span
                  style={{
                    fontFamily:
                      "var(--font-riso-label,'Space Grotesk',sans-serif)",
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--riso-overlap,#7b4f7a)",
                    display: "block",
                  }}
                >
                  {opt.label}
                </span>
                {opt.description && (
                  <span
                    style={{
                      fontFamily:
                        "var(--font-riso-body,'Work Sans',sans-serif)",
                      fontSize: 11,
                      color: "var(--riso-secondary)",
                      display: "block",
                      marginTop: 1,
                    }}
                  >
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
