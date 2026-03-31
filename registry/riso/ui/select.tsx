"use client";

// registry/riso/ui/select.tsx — Risograph Select / Dropdown
//
// Visual system:
//   - Same misreg shadow as Input (secondary color, 2px offset behind)
//   - Riso chevron from Accordion reused in trigger
//   - Dropdown list: primary outline with secondary shadow
//   - Hover on option: secondary fill at 15%
//   - Selected option: primary fill, white text
//   - No border-radius anywhere

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends RisoThemeProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  label,
  disabled = false,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: SelectProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(
    value ?? defaultValue,
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Controlled / uncontrolled
  const currentValue = value !== undefined ? value : selected;
  const currentLabel = options.find((o) => o.value === currentValue)?.label;

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return;
    setSelected(opt.value);
    onChange?.(opt.value);
    setOpen(false);
  };

  return (
    <div
      className={cn("flex flex-col gap-1.5", className)}
      ref={containerRef}
      style={{ ...risoStyle, ...style }}
    >
      {label && (
        <span className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.15em] text-[var(--riso-primary)]">
          {label}
        </span>
      )}

      <div className="relative">
        {/* Misreg shadow */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--riso-secondary)] translate-x-0.5 translate-y-0.5 pointer-events-none transition-opacity duration-150"
          style={{ opacity: open ? 0.35 : 0.22 }}
        />

        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="relative z-[1] w-full py-[10px] pl-3 pr-9 bg-[var(--riso-paper,#f7f0e2)] border-none text-left flex items-center justify-between transition-[outline-color] duration-150 font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[13px]"
          style={{
            outline: `2px solid ${open ? "var(--riso-primary)" : "var(--riso-secondary)"}`,
            cursor: disabled ? "not-allowed" : "pointer",
            color: currentLabel
              ? "var(--riso-overlap,#7b4f7a)"
              : "rgba(0,0,0,0.35)",
            opacity: disabled ? 0.4 : 1,
          }}
        >
          <span>{currentLabel ?? placeholder}</span>

          {/* Two-ink chevron */}
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            aria-hidden
            className="absolute right-[10px] top-1/2 shrink-0 transition-transform duration-200"
            style={{
              transform: `translateY(-50%) ${open ? "rotate(180deg)" : ""}`,
            }}
          >
            <line
              x1="1"
              y1="1"
              x2="8"
              y2="9"
              stroke="var(--riso-primary)"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <line
              x1="8"
              y1="9"
              x2="15"
              y2="1"
              stroke="var(--riso-primary)"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <line
              x1="2.5"
              y1="2.5"
              x2="9.5"
              y2="10.5"
              stroke="var(--riso-secondary)"
              strokeWidth="1"
              strokeLinecap="square"
              opacity="0.6"
            />
            <line
              x1="9.5"
              y1="10.5"
              x2="16.5"
              y2="2.5"
              stroke="var(--riso-secondary)"
              strokeWidth="1"
              strokeLinecap="square"
              opacity="0.6"
            />
          </svg>
        </button>

        {/* Dropdown list */}
        {open && (
          <div
            role="listbox"
            className="absolute top-[calc(100%+2px)] left-0 right-0 z-[100] bg-[var(--riso-paper,#f7f0e2)] outline outline-2 outline-[var(--riso-primary)] [filter:drop-shadow(4px_4px_0_var(--riso-secondary))] max-h-[240px] overflow-y-auto"
          >
            {options.map((opt) => {
              const isSelected = opt.value === currentValue;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt)}
                  className={`px-3 py-[10px] relative transition-colors duration-100 font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[13px] ${isSelected ? "bg-[var(--riso-primary)] text-white" : opt.disabled ? "cursor-not-allowed text-black/30 bg-transparent" : "cursor-pointer text-[var(--riso-overlap,#7b4f7a)] bg-transparent"}`}
                  onMouseEnter={(e) => {
                    if (!isSelected && !opt.disabled)
                      (e.currentTarget as HTMLDivElement).style.background =
                        "color-mix(in srgb,var(--riso-secondary) 15%,transparent)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLDivElement).style.background =
                        "transparent";
                  }}
                >
                  {opt.label}
                  {/* Double-rule between options */}
                  {!isSelected && (
                    <div
                      aria-hidden
                      className="absolute bottom-0 left-2 right-2 h-[1px] bg-[var(--riso-secondary)] opacity-20"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
