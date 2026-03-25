"use client";

// registry/new-york/ui/breadcrumb.tsx — Risograph Breadcrumb
//
// Visual system:
//   - Separator: thick diagonal slash drawn as two SVG lines (primary + secondary offset)
//   - Active/current item: primary ink color, heavier weight
//   - Parent items: secondary color, lighter
//   - Ellipsis: three dots in alternating ink colors

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps extends RisoThemeProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  className?: string;
  style?: React.CSSProperties;
}

function SlashSeparator() {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden className="shrink-0 mx-0.5">
      {/* Primary slash */}
      <line x1="10" y1="2" x2="4" y2="18" stroke="var(--riso-primary)" strokeWidth="2.5" strokeLinecap="square" />
      {/* Secondary offset slash */}
      <line x1="12" y1="4" x2="6" y2="20" stroke="var(--riso-secondary)" strokeWidth="1" strokeLinecap="square" opacity="0.6" />
    </svg>
  );
}

export function Breadcrumb({ items, maxItems = 4, className, theme, primary, secondary, overlap, paper, style }: BreadcrumbProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const [expanded, setExpanded] = React.useState(false);

  const visible = !expanded && items.length > maxItems
    ? [items[0], null, ...items.slice(-2)]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={cn(className)} style={{ ...risoStyle, ...style }}>
      <ol className="flex items-center flex-wrap gap-0 list-none m-0 p-0">
        {visible.map((item, idx) => {
          const isLast = idx === visible.length - 1;
          const isEllipsis = item === null;

          return (
            <React.Fragment key={idx}>
              <li>
                {isEllipsis ? (
                  <button
                    onClick={() => setExpanded(true)}
                    aria-label="Show full path"
                    className="bg-transparent border-none cursor-pointer flex gap-0.5 px-1 py-0 items-center"
                  >
                    {["var(--riso-primary)", "var(--riso-secondary)", "var(--riso-overlap,#7b4f7a)"].map((c, i) => (
                      <span key={i} className="inline-block w-1 h-1" style={{ background: c }} />
                    ))}
                  </button>
                ) : (
                  <a
                    href={item!.href ?? "#"}
                    onClick={e => { if (item!.onClick) { e.preventDefault(); item!.onClick(); } }}
                    aria-current={isLast ? "page" : undefined}
                    className={cn(
                      "font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[10px] uppercase tracking-[0.12em] no-underline py-0.5 px-1",
                      isLast ? "text-[var(--riso-primary)] border-b-2 border-[var(--riso-primary)]" : "text-[var(--riso-secondary)]"
                    )}
                  >
                    {item!.label}
                  </a>
                )}
              </li>
              {!isLast && <li aria-hidden><SlashSeparator /></li>}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}


