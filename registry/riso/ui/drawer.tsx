"use client";

// registry/new-york/ui/drawer.tsx — Risograph Drawer
//
// Visual system:
//   - Slides in from an edge (right/left/top/bottom)
//   - Secondary shadow layer enters slightly delayed — "trails behind" primary panel
//   - Snaps to 4px offset when settled (same mechanic as Dialog)
//   - Halftone dot backdrop instead of plain grey
//   - Close button: two-ink X

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type DrawerSide = "right" | "left" | "top" | "bottom";

interface DrawerProps extends RisoThemeProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const TRANSLATE: Record<DrawerSide, { enter: string; exit: string }> = {
  right: { enter: "translateX(0)", exit: "translateX(100%)" },
  left: { enter: "translateX(0)", exit: "translateX(-100%)" },
  top: { enter: "translateY(0)", exit: "translateY(-100%)" },
  bottom: { enter: "translateY(0)", exit: "translateY(100%)" },
};

const SHADOW_OFFSET: Record<DrawerSide, { settled: string; initial: string }> =
{
  right: {
    settled: "translate(-4px, 4px)",
    initial: "translate(-12px, 12px)",
  },
  left: { settled: "translate(4px, 4px)", initial: "translate(12px, 12px)" },
  top: { settled: "translate(4px, 4px)", initial: "translate(12px, 12px)" },
  bottom: {
    settled: "translate(4px, -4px)",
    initial: "translate(12px, -12px)",
  },
};

const POSITION: Record<DrawerSide, React.CSSProperties> = {
  right: { right: 0, top: 0, bottom: 0 },
  left: { left: 0, top: 0, bottom: 0 },
  top: { top: 0, left: 0, right: 0 },
  bottom: { bottom: 0, left: 0, right: 0 },
};

const BORDER: Record<DrawerSide, string> = {
  right: "border-left: 2px solid var(--riso-primary)",
  left: "border-right: 2px solid var(--riso-primary)",
  top: "border-bottom: 2px solid var(--riso-primary)",
  bottom: "border-top: 2px solid var(--riso-primary)",
};

export function Drawer({ open,
  onClose,
  side = "right",
  title,
  description,
  children,
  width = 360,
  className, theme, primary, secondary, overlap, paper, style }: DrawerProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const [settled, setSettled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      const t = setTimeout(() => setSettled(true), 60);
      return () => clearTimeout(t);
    } else {
      setSettled(false);
      const t = setTimeout(() => setMounted(false), 320);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  const isHoriz = side === "left" || side === "right";

  return createPortal(
    <>
      {/* Halftone backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-[200] [background-image:radial-gradient(circle,var(--riso-overlap,#7b4f7a)_1px,transparent_0)] [background-size:5px_5px] transition-opacity duration-300"
        style={{ ...risoStyle, ...({ opacity: open ? 0.2 : 0 }) }}
      />

      {/* Drawer container */}
      <div
        className="fixed z-[201] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
        style={{
          ...POSITION[side],
          width: isHoriz ? width : "100%",
          height: !isHoriz ? width : "100%",
          transform: open ? TRANSLATE[side].enter : TRANSLATE[side].exit,
        }}
      >
        {/* Shadow layer — trails behind */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--riso-secondary)] opacity-60"
          style={{
            transform: settled
              ? SHADOW_OFFSET[side].settled
              : SHADOW_OFFSET[side].initial,
            transition: "transform 320ms cubic-bezier(0.22,1,0.36,1) 60ms",
          }}
        />

        {/* Panel body */}
        <div
          //
          className={
            (cn(
              "absolute inset-0 bg-[var(--riso-paper,#f7f0e2)] flex flex-col overflow-hidden",
              className,
              side === "right" && "border-l-2 border-[var(--riso-primary)]",
              side === "left" && "border-r-2 border-[var(--riso-primary)]",
              side === "top" && "border-b-2 border-[var(--riso-primary)]",
              side === "bottom" && "border-t-2 border-[var(--riso-primary)]",
            ),
              className)
          }
        >
          {/* Header */}
          {(title || description) && (
            <div className="px-5 py-4 border-b-2 border-[var(--riso-primary)] bg-[var(--riso-primary)] relative shrink-0">
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="absolute top-3 right-3 bg-transparent border-none cursor-pointer p-1"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                >
                  <line
                    x1="1"
                    y1="1"
                    x2="13"
                    y2="13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                  <line
                    x1="13"
                    y1="1"
                    x2="1"
                    y2="13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              </button>

              {title && (
                <h2 className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[17px] uppercase tracking-[0.03em] text-white m-0 pr-7 [text-shadow:1.5px_1.5px_0_var(--riso-secondary)]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.15em] text-white/75 mt-[3px] mb-0 mx-0">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </>,
    document.body,
  );
}


