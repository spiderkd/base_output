"use client";

// registry/new-york/ui/timeline.tsx — Risograph Timeline
//
// Visual system:
//   - Vertical double-rule spine (primary 2px + secondary 1px, offset 3px right)
//   - Event nodes: small stamp-style circles
//     - Past/complete: filled primary dot
//     - Current: outlined primary circle with secondary shadow
//     - Future: dashed outline circle
//   - Content: card to the right of the spine
//   - Date/label annotation: left of the spine (secondary color)

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type TimelineItemStatus = "complete" | "current" | "upcoming";

interface TimelineItem {
  id: string;
  label: string;
  date?: string;
  content?: React.ReactNode;
  status?: TimelineItemStatus;
}

interface TimelineProps extends RisoThemeProps {
  items: TimelineItem[];
  className?: string;
  style?: React.CSSProperties;
}

const SPINE_X = 120; // px from left edge to spine center

function SpineNode({
  status,
  size = 14,
}: {
  status: TimelineItemStatus;
  size?: number;
}) {
  const r = size / 2;
  const cx = r + 3;

  return (
    <svg
      width={size + 8}
      height={size + 8}
      viewBox={`0 0 ${size + 8} ${size + 8}`}
      aria-hidden
    >
      {/* Shadow circle */}
      <circle
        cx={cx + 2.5}
        cy={r + 4.5}
        r={r - 1}
        fill={status === "complete" ? "var(--riso-secondary)" : "none"}
        stroke={status !== "complete" ? "var(--riso-secondary)" : "none"}
        strokeWidth={1}
        opacity={0.5}
      />

      {/* Main node circle */}
      <circle
        cx={cx}
        cy={r + 2}
        r={r - 1}
        fill={
          status === "complete"
            ? "var(--riso-primary)"
            : "var(--riso-paper,#f7f0e2)"
        }
        stroke="var(--riso-primary)"
        strokeWidth={status === "upcoming" ? 1.5 : 2}
        strokeDasharray={status === "upcoming" ? "3 2" : "none"}
      />

      {/* Inner dot for current */}
      {status === "current" && (
        <circle cx={cx} cy={r + 2} r={r * 0.35} fill="var(--riso-primary)" />
      )}

      {/* Checkmark for complete */}
      {status === "complete" && (
        <polyline
          points={`${cx - r * 0.45},${r + 2} ${cx - r * 0.05},${r + r * 0.5} ${cx + r * 0.5},${r + 2 - r * 0.45}`}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      )}
    </svg>
  );
}

export function Timeline({ items, className, theme, primary, secondary, overlap, paper, style }: TimelineProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  return (
    <div
      className={cn("relative", className)}
      style={{ ...risoStyle, ...({ paddingLeft: SPINE_X + 24 }) }}
    >
      {/* Vertical double-rule spine */}
      <div
        aria-hidden
        className="absolute top-2 bottom-2 w-[2px] bg-[var(--riso-primary)]"
        style={{ left: SPINE_X }}
      />
      <div
        aria-hidden
        className="absolute top-2 bottom-2 w-[1px] bg-[var(--riso-secondary)] opacity-70"
        style={{ left: SPINE_X + 4 }}
      />

      {/* Items */}
      {items.map((item, idx) => {
        const status: TimelineItemStatus =
          item.status ??
          (idx === 0
            ? "current"
            : idx < items.length - 1
              ? "complete"
              : "upcoming");

        return (
          <div
            key={item.id}
            className="relative flex items-start"
            style={{ marginBottom: idx < items.length - 1 ? 28 : 0 }}
          >
            {/* Date label (left of spine) */}
            {item.date && (
              <div
                className="absolute top-1 text-right"
                style={{ right: "calc(100% + 12px)", width: SPINE_X - 24 }}
              >
                <span className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.15em] text-[var(--riso-secondary)] whitespace-nowrap">
                  {item.date}
                </span>
              </div>
            )}

            {/* Spine node — sits on top of the spine line */}
            <div
              className="absolute top-0 z-[1]"
              style={{ left: -(SPINE_X + 24) + SPINE_X - 10 }}
            >
              <SpineNode status={status} />
            </div>

            {/* Content card */}
            <div className="flex-1">
              <div
                className={cn(
                  "relative bg-[var(--riso-paper,#f7f0e2)] px-[14px] py-[10px]",
                  status === "current"
                    ? " outline-2 outline-[var(--riso-primary)] [filter:drop-shadow(3px_3px_0_var(--riso-secondary))]"
                    : " outline-[1px] outline-[color-mix(in_srgb,var(--riso-primary)_30%,transparent)]",
                )}
              >
                <p
                  className={cn(
                    "font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[13px] uppercase tracking-[0.03em] m-0",
                    status === "upcoming"
                      ? "text-[color-mix(in_srgb,var(--riso-primary)_50%,transparent)]"
                      : "text-[var(--riso-primary)]",
                  )}
                >
                  {item.label}
                </p>
                {item.content && (
                  <div className="font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[12px] text-[var(--riso-overlap,#7b4f7a)] mt-1 leading-[1.5]">
                    {item.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


