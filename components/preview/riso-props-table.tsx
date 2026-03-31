"use client";

// registry/riso/ui/props-table.tsx — Risograph Props Table
//
// Adapted from Crumble's PropsTable.
// All rough.js row dividers replaced with riso double-rule separators.
// The header gets the full "heavy" separator (3px primary + 1.5px secondary).
// Row dividers use the "default" weight (2px + 1px).
// Hover state: row background tints in primary at low opacity + misreg
// secondary shadow on the prop code badge.
//
// Usage:
//   <PropsTable rows={[
//     { prop: "slug",     type: "string",  required: true,  description: "Registry slug used for install URLs." },
//     { prop: "theme",    type: "RisoThemeName", default: "pink-teal", description: "Named color preset." },
//     { prop: "multiple", type: "boolean", default: "false", description: "Allow multiple open items." },
//   ]} />
//   <PropsTable rows={rows} theme="blue-pink" />

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PropRow {
  prop: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface PropsTableProps extends RisoThemeProps {
  rows: PropRow[];
  className?: string;
  style?: React.CSSProperties;
}

// ─── RisoRowDivider ───────────────────────────────────────────────────────────
// Lightweight double-rule used between data rows.

function RisoRowDivider({ heavy = false }: { heavy?: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        height: heavy ? 10 : 7,
        width: "100%",
      }}
    >
      {/* Primary line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: heavy ? 3 : 2,
          background: "var(--riso-primary, #ff5e7e)",
        }}
      />
      {/* Secondary offset line — misregistration */}
      <div
        style={{
          position: "absolute",
          top: heavy ? 6 : 4,
          left: 0,
          right: 0,
          height: heavy ? 1.5 : 1,
          background: "var(--riso-secondary, #00a99d)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

// ─── PropBadge ────────────────────────────────────────────────────────────────
// Inline code badge for prop names.
// On hover the parent row triggers a secondary-offset shadow.

function PropBadge({
  name,
  required,
  hovered,
}: {
  name: string;
  required?: boolean;
  hovered: boolean;
}) {
  return (
    <code
      style={{
        display: "inline-block",
        fontFamily: "var(--font-riso-mono, 'JetBrains Mono', monospace)",
        fontSize: 12,
        fontWeight: 600,
        padding: "1px 7px",
        background:
          "color-mix(in srgb, var(--riso-primary, #ff5e7e) 10%, var(--riso-paper, #f7f0e2))",
        color: "var(--riso-primary, #ff5e7e)",
        outline: "1.5px solid var(--riso-primary, #ff5e7e)",
        // Misreg shadow emerges on hover
        boxShadow: hovered
          ? "2px 2px 0 0 var(--riso-secondary, #00a99d)"
          : "none",
        transition: "box-shadow 120ms",
      }}
    >
      {name}
      {required && (
        <span
          style={{
            marginLeft: 3,
            color: "var(--riso-secondary, #00a99d)",
            fontStyle: "normal",
          }}
        >
          *
        </span>
      )}
    </code>
  );
}

// ─── TableRow ─────────────────────────────────────────────────────────────────

function TableRow({ row, isLast }: { row: PropRow; isLast: boolean }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(120px,1fr) minmax(140px,1.2fr) minmax(80px,0.8fr) minmax(160px,2fr)",
          gap: "0 16px",
          padding: "10px 4px",
          background: hovered
            ? "color-mix(in srgb, var(--riso-primary, #ff5e7e) 6%, transparent)"
            : "transparent",
          transition: "background 100ms",
        }}
      >
        {/* Prop */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <PropBadge
            name={row.prop}
            required={row.required}
            hovered={hovered}
          />
        </div>

        {/* Type */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <code
            style={{
              fontFamily: "var(--font-riso-mono, 'JetBrains Mono', monospace)",
              fontSize: 12,
              color: "var(--riso-overlap, #7b4f7a)",
              opacity: 0.85,
            }}
          >
            {row.type}
          </code>
        </div>

        {/* Default */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {row.default ? (
            <code
              style={{
                fontFamily:
                  "var(--font-riso-mono, 'JetBrains Mono', monospace)",
                fontSize: 12,
                color: "var(--riso-secondary, #00a99d)",
                opacity: 0.9,
              }}
            >
              {row.default}
            </code>
          ) : (
            <span
              style={{
                fontFamily:
                  "var(--font-riso-mono, 'JetBrains Mono', monospace)",
                fontSize: 12,
                color: "var(--riso-primary, #ff5e7e)",
                opacity: 0.25,
              }}
            >
              —
            </span>
          )}
        </div>

        {/* Description */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--riso-overlap, #7b4f7a)",
            }}
          >
            {row.description}
          </span>
        </div>
      </div>

      {/* Row divider — skipped after last row */}
      {!isLast && <RisoRowDivider />}
    </div>
  );
}

// ─── PropsTable ───────────────────────────────────────────────────────────────

export function PropsTable({
  rows,

  className,
  style,
}: PropsTableProps) {
  const HEADERS = ["Prop", "Type", "Default", "Description"] as const;

  return (
    <div
      className={cn("my-4 w-full overflow-x-auto", className)}
      style={{ ...style }}
    >
      <div style={{ minWidth: 560 }}>
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(120px,1fr) minmax(140px,1.2fr) minmax(80px,0.8fr) minmax(160px,2fr)",
            gap: "0 16px",
            padding: "0 4px 8px",
          }}
        >
          {HEADERS.map((label) => (
            <span
              key={label}
              style={{
                fontFamily:
                  "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--riso-secondary, #00a99d)",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Heavy separator under header */}
        <RisoRowDivider />

        {/* Data rows */}
        <div style={{ marginTop: 2 }}>
          {rows.map((row, index) => (
            <TableRow
              key={row.prop}
              row={row}
              isLast={index === rows.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
