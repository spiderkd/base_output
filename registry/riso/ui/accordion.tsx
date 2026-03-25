"use client";

// registry/new-york/ui/accordion.tsx — Risograph Accordion
//
// Theming — three ways, lowest → highest priority:
//   1. globals.css  :root vars from riso-theme install  (automatic, zero config)
//   2. data-riso-theme on any ancestor element          (section/page level)
//   3. theme / primary / secondary / overlap / paper props  (per instance)
//
// Example usage:
//   <Accordion items={items} />                           ← uses installed theme
//   <Accordion items={items} theme="blue-pink" />         ← named preset
//   <Accordion items={items} primary="#1a1aff" />         ← raw escape hatch
//   <Accordion items={items} theme="red-yellow" secondary="#custom" />

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AccordionItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface AccordionProps extends RisoThemeProps {
  items: AccordionItem[];
  defaultOpen?: string;
  /** Allow multiple items open simultaneously */
  multiple?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ── Chevron ──────────────────────────────────────────────────────────────────

function RisoChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="12"
      viewBox="0 0 20 12"
      fill="none"
      aria-hidden
      style={{
        flexShrink: 0,
        transition: "transform 200ms",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      {/* Primary ink arms */}
      <line
        x1="2"
        y1="2"
        x2="10"
        y2="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
      <line
        x1="10"
        y1="10"
        x2="18"
        y2="2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
      {/* Secondary ink arms — misregistration offset */}
      <line
        x1="3.5"
        y1="3.5"
        x2="11.5"
        y2="11.5"
        stroke="var(--riso-secondary, #00a99d)"
        strokeWidth="1"
        strokeLinecap="square"
        opacity="0.7"
      />
      <line
        x1="11.5"
        y1="11.5"
        x2="19.5"
        y2="3.5"
        stroke="var(--riso-secondary, #00a99d)"
        strokeWidth="1"
        strokeLinecap="square"
        opacity="0.7"
      />
    </svg>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────

export function Accordion({
  items,
  defaultOpen,
  multiple = false,
  // RisoThemeProps
  theme,
  primary,
  secondary,
  overlap,
  paper,
  // DOM props
  className,
  style,
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(
    defaultOpen ? new Set([defaultOpen]) : new Set(),
  );

  const toggle = (value: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        if (!multiple) next.clear();
        next.add(value);
      }
      return next;
    });
  };

  // Merge theme preset + individual prop overrides into inline CSS vars.
  // Returns {} when nothing is passed → falls through to globals.css vars.
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });

  return (
    <div className={cn("w-full", className)} style={{ ...risoStyle, ...style }}>
      {items.map((item, idx) => {
        const isOpen = openItems.has(item.value);

        return (
          <div key={item.value}>
            {/* Double-rule separator — primary bar + secondary offset */}
            {idx > 0 && (
              <div
                aria-hidden
                style={{ position: "relative", height: 7, width: "100%" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "var(--riso-primary, #ff5e7e)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: "var(--riso-secondary, #00a99d)",
                    opacity: 0.7,
                  }}
                />
              </div>
            )}

            {/* Header button */}
            <button
              onClick={() => toggle(item.value)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left group"
              style={{
                padding: "14px 16px",
                background: isOpen
                  ? "var(--riso-primary, #ff5e7e)"
                  : "transparent",
                color: isOpen ? "white" : "var(--riso-primary, #ff5e7e)",
                fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
                fontWeight: 900,
                fontSize: 15,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background 150ms, color 150ms",
              }}
            >
              {/* Misregistration hover shadow — only shown on closed items */}
              {!isOpen && (
                <span
                  aria-hidden
                  className="group-hover:opacity-40"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--riso-secondary, #00a99d)",
                    transform: "translate(3px, 3px)",
                    zIndex: -1,
                    opacity: 0,
                    transition: "opacity 120ms",
                    pointerEvents: "none",
                  }}
                />
              )}
              <span>{item.label}</span>
              <RisoChevron open={isOpen} />
            </button>

            {/* Content panel — max-height collapse animation */}
            <div
              role="region"
              aria-hidden={!isOpen}
              style={{
                maxHeight: isOpen ? 600 : 0,
                overflow: "hidden",
                transition: "max-height 250ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  position: "relative",
                  background: "var(--riso-paper, #f7f0e2)",
                  borderLeft: "2px solid var(--riso-secondary, #00a99d)",
                }}
              >
                {/* Halftone dot texture overlay */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "radial-gradient(circle, var(--riso-secondary, #00a99d) 1px, transparent 0)",
                    backgroundSize: "5px 5px",
                    opacity: 0.08,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    fontFamily:
                      "var(--font-riso-body, 'Work Sans', sans-serif)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--riso-overlap, #7b4f7a)",
                  }}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
