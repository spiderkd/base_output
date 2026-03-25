"use client";

// registry/new-york/ui/pagination.tsx — Risograph Pagination
//
// Visual system:
//   - Current page: Stamp-style circle with primary fill
//   - Other pages: ghost button style
//   - Prev/Next: two-ink chevron buttons

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface PaginationProps extends RisoThemeProps {
  total: number;
  page: number;
  perPage?: number;
  onChange: (page: number) => void;
  siblings?: number;
  className?: string;
  style?: React.CSSProperties;
}

function PaginationChevron({ dir, disabled }: { dir: "left" | "right"; disabled?: boolean }) {
  const ltr = dir === "right";
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
      <line
        x1={ltr ? 2 : 14} y1="1" x2={ltr ? 14 : 2} y2="6"
        stroke={disabled ? "color-mix(in srgb,var(--riso-primary) 35%,transparent)" : "var(--riso-primary)"}
        strokeWidth="2" strokeLinecap="square"
      />
      <line
        x1={ltr ? 2 : 14} y1="11" x2={ltr ? 14 : 2} y2="6"
        stroke={disabled ? "color-mix(in srgb,var(--riso-primary) 35%,transparent)" : "var(--riso-primary)"}
        strokeWidth="2" strokeLinecap="square"
      />
      {/* Secondary offset */}
      <line
        x1={(ltr ? 2 : 14) + 1.5} y1="2.5" x2={(ltr ? 14 : 2) + 1.5} y2="7.5"
        stroke="var(--riso-secondary)" strokeWidth="1" strokeLinecap="square" opacity="0.6"
      />
    </svg>
  );
}

export function Pagination({ total,
  page,
  perPage = 10,
  onChange,
  siblings = 1,
  className, theme, primary, secondary, overlap, paper, style }: PaginationProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const totalPages = Math.ceil(total / perPage);

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const pages = React.useMemo(() => {
    if (totalPages <= 7) return range(1, totalPages);
    const leftSibs = Math.max(page - siblings, 1);
    const rightSibs = Math.min(page + siblings, totalPages);
    const showLeft = leftSibs > 2;
    const showRight = rightSibs < totalPages - 1;

    if (!showLeft && showRight) return [...range(1, 3 + siblings * 2), "...", totalPages];
    if (showLeft && !showRight) return [1, "...", ...range(totalPages - 3 - siblings * 2, totalPages)];
    if (showLeft && showRight) return [1, "...", ...range(leftSibs, rightSibs), "...", totalPages];
    return range(1, totalPages);
  }, [page, siblings, totalPages]);

  return (
    <nav aria-label="Pagination" className={cn(className)} style={{ ...risoStyle, ...style }}>
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={`w-9 h-9 flex items-center justify-center bg-transparent border-none outline outline-2 outline-[color-mix(in_srgb,var(--riso-primary)_40%,transparent)] ${page === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <PaginationChevron dir="left" disabled={page === 1} />
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[10px] text-[var(--riso-secondary)]">
                ···
              </span>
            );
          }
          const isCurrent = p === page;
          return (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              aria-current={isCurrent ? "page" : undefined}
              className={`relative w-9 h-9 flex items-center justify-center border-none cursor-pointer font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[11px] ${isCurrent ? "bg-[var(--riso-primary)] text-white [filter:drop-shadow(2px_2px_0_var(--riso-secondary))] outline-none" : "bg-transparent text-[var(--riso-primary)] outline outline-2 outline-[color-mix(in_srgb,var(--riso-primary)_40%,transparent)]"}`}
            >
              {p}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={`w-9 h-9 flex items-center justify-center bg-transparent border-none outline outline-2 outline-[color-mix(in_srgb,var(--riso-primary)_40%,transparent)] ${page === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <PaginationChevron dir="right" disabled={page === totalPages} />
        </button>
      </div>
    </nav>
  );
}


