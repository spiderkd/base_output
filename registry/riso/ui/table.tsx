"use client";

// registry/new-york/ui/table.tsx — Risograph Table
//
// Visual system:
//   - Header row: solid primary fill, white text
//   - Odd data rows: halftone dot pattern at 8% opacity
//   - Even rows: plain paper
//   - Sort arrows: two-ink chevrons (reused pattern)
//   - Row hover: secondary fill at 12%
//   - Optional sticky header
//   - Column alignment support

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface TableProps<T extends Record<string, unknown>> extends RisoThemeProps {
  columns: TableColumn<T>[];
  data: T[];
  caption?: string;
  stickyHeader?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type SortDir = "asc" | "desc" | null;

function SortChevron({ dir }: { dir: SortDir }) {
  const active = dir !== null;
  const up = dir === "asc";

  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      aria-hidden
      className="ml-1 shrink-0"
    >
      {/* Up arrow */}
      <line
        x1="1"
        y1="3"
        x2="5"
        y2="0"
        stroke={active && up ? "white" : "rgba(255,255,255,0.5)"}
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <line
        x1="5"
        y1="0"
        x2="9"
        y2="3"
        stroke={active && up ? "white" : "rgba(255,255,255,0.5)"}
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      {/* Down arrow */}
      <line
        x1="1"
        y1="5"
        x2="5"
        y2="8"
        stroke={active && !up ? "white" : "rgba(255,255,255,0.5)"}
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <line
        x1="5"
        y1="8"
        x2="9"
        y2="5"
        stroke={active && !up ? "white" : "rgba(255,255,255,0.5)"}
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Table<T extends Record<string, unknown>>({ columns,
  data,
  caption,
  stickyHeader = false,
  className, theme, primary, secondary, overlap, paper, style }: TableProps<T>) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
        numeric: true,
      });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div
      className={cn(
        "w-full overflow-x-auto [filter:drop-shadow(4px_4px_0_var(--riso-secondary))]",
        className,
      )} style={{ ...risoStyle, ...style }}
    >
      <table className="w-full outline  outline-[var(--riso-primary)] [border-collapse:collapse]">
        {caption && (
          <caption className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.15em] text-[var(--riso-secondary)] text-left pb-2">
            {caption}
          </caption>
        )}

        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => col.sortable && handleSort(String(col.key))}
                className={cn(
                  "border-r border-r-white/20 select-none px-[14px] py-[10px] bg-[var(--riso-primary)] text-white font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.15em] whitespace-nowrap",
                  stickyHeader && "sticky top-0 z-[1]",
                )}
                style={{
                  textAlign: col.align ?? "left",
                  width: col.width,
                  cursor: col.sortable ? "pointer" : "default",
                }}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <SortChevron
                      dir={sortKey === String(col.key) ? sortDir : null}
                    />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sorted.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="relative"
              onMouseEnter={(e) =>
              ((e.currentTarget as HTMLTableRowElement).style.background =
                "color-mix(in srgb,var(--riso-secondary) 12%,transparent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLTableRowElement).style.background = "")
              }
            >
              {columns.map((col, colIdx) => {
                const val = row[col.key as keyof T];
                return (
                  <td
                    key={String(col.key)}
                    className="px-[14px] py-[9px] font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[12px] text-[var(--riso-overlap,#7b4f7a)] border-b border-b-[color-mix(in_srgb,var(--riso-primary)_15%,transparent)] relative"
                    style={{
                      textAlign: col.align ?? "left",
                      backgroundImage:
                        rowIdx % 2 !== 0
                          ? "radial-gradient(circle,var(--riso-primary) 1px,transparent 0)"
                          : "none",
                      backgroundSize: rowIdx % 2 !== 0 ? "4px 4px" : undefined,
                    }}
                  >
                    {/* Halftone overlay for odd rows */}
                    {rowIdx % 2 !== 0 && (
                      <div
                        aria-hidden
                        className="absolute inset-0 [background-image:radial-gradient(circle,var(--riso-primary)_1px,transparent_0)] [background-size:4px_4px] opacity-[0.07] pointer-events-none"
                      />
                    )}
                    <span className="relative z-[1]">
                      {col.render
                        ? col.render(val, row, rowIdx)
                        : String(val ?? "")}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


