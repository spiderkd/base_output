"use client";

// registry/new-york/ui/stat-card.tsx — Risograph StatCard
//
// Visual system:
//   - Large display number (Epilogue Black 900) with ghost text misreg in secondary
//   - Label below in Space Grotesk uppercase label style
//   - Trend indicator: small arrow as two SVG lines
//   - Optional inline sparkline (pure SVG, two-layer strokes)
//   - Hard shadow in secondary/overlap behind card

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface StatCardProps extends RisoThemeProps {
  value: string | number;
  label: string;
  trend?: number; // positive or negative %
  trendLabel?: string;
  sparkline?: number[]; // array of values for mini chart
  filled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function TrendArrow({ trend }: { trend: number }) {
  const up = trend >= 0;
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      {up ? (
        <>
          <line
            x1="7"
            y1="12"
            x2="7"
            y2="2"
            stroke="var(--riso-secondary)"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
          <line
            x1="2"
            y1="7"
            x2="7"
            y2="2"
            stroke="var(--riso-secondary)"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
          <line
            x1="12"
            y1="7"
            x2="7"
            y2="2"
            stroke="var(--riso-secondary)"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
          {/* Secondary offset */}
          <line
            x1="8.5"
            y1="13.5"
            x2="8.5"
            y2="3.5"
            stroke="var(--riso-primary)"
            strokeWidth="1"
            strokeLinecap="square"
            opacity="0.5"
          />
        </>
      ) : (
        <>
          <line
            x1="7"
            y1="2"
            x2="7"
            y2="12"
            stroke="var(--riso-primary)"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
          <line
            x1="2"
            y1="7"
            x2="7"
            y2="12"
            stroke="var(--riso-primary)"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
          <line
            x1="12"
            y1="7"
            x2="7"
            y2="12"
            stroke="var(--riso-primary)"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
          <line
            x1="8.5"
            y1="3.5"
            x2="8.5"
            y2="13.5"
            stroke="var(--riso-secondary)"
            strokeWidth="1"
            strokeLinecap="square"
            opacity="0.5"
          />
        </>
      )}
    </svg>
  );
}

function Sparkline({ data, filled }: { data: number[]; filled?: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 80,
    H = 32;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * (W - 4) + 2;
      const y = H - 4 - ((v - min) / range) * (H - 8);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={W} height={H} aria-hidden style={{ overflow: "visible" }}>
      {/* Secondary offset line */}
      <polyline
        points={pts}
        fill="none"
        stroke="var(--riso-secondary)"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        transform="translate(1.5, 1.5)"
        opacity={0.5}
      />
      {/* Primary line */}
      <polyline
        points={pts}
        fill="none"
        stroke={filled ? "white" : "var(--riso-primary)"}
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function StatCard({ value,
  label,
  trend,
  trendLabel,
  sparkline,
  filled = false,
  className, theme, primary, secondary, overlap, paper, style }: StatCardProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  return (
    <div className={cn("relative inline-block", className)} style={{ ...risoStyle, ...style }}>
      {/* Hard shadow layer */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--riso-secondary)",
          transform: "translate(4px, 4px)",
          opacity: 0.6,
        }}
      />

      {/* Card body */}
      <div
        style={{
          position: "relative",
          padding: "20px 24px",
          background: filled
            ? "var(--riso-primary)"
            : "var(--riso-paper, #f7f0e2)",
          outline: `2px solid ${filled ? "var(--riso-primary)" : "var(--riso-primary)"}`,
          minWidth: 160,
        }}
      >
        {/* Main value — ghost text misreg */}
        <div className="relative leading-none">
          {/* Ghost layer */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 2,
              left: 2,
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: 48,
              color: "var(--riso-secondary)",
              lineHeight: 1,
              opacity: 0.45,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {value}
          </span>

          {/* Primary value */}
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: 48,
              lineHeight: 1,
              color: filled ? "white" : "var(--riso-primary)",
              position: "relative",
            }}
          >
            {value}
          </span>
        </div>

        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: filled ? "rgba(255,255,255,0.75)" : "var(--riso-secondary)",
            margin: "6px 0 0",
          }}
        >
          {label}
        </p>

        {/* Sparkline + trend row */}
        {(sparkline || trend !== undefined) && (
          <div className="flex items-end justify-between mt-3">
            {sparkline && <Sparkline data={sparkline} filled={filled} />}

            {trend !== undefined && (
              <div className="flex items-center gap-1">
                <TrendArrow trend={trend} />
                <span
                  style={{
                    fontFamily:
                      "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                    fontWeight: 700,
                    fontSize: 10,
                    color: filled
                      ? "white"
                      : trend >= 0
                        ? "var(--riso-secondary)"
                        : "var(--riso-primary)",
                  }}
                >
                  {trend > 0 ? "+" : ""}
                  {trend}%
                  {trendLabel && (
                    <span className="ml-1 opacity-60 text-[9px]">
                      {trendLabel}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


