"use client";

// registry/new-york/ui/tabs.tsx — Risograph Tabs
//
// Visual system:
//   - Inactive tabs: outline in secondary, paper background
//   - Active tab: solid primary fill with secondary underline offset 2px below primary underline
//   - The two underlines overlap with multiply blend — creating the overlap color at their junction
//   - Hover: secondary shadow appears under the tab (plate shifting)
//   - Tab list: no background, just a primary bottom border (2px)

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface TabsProps extends RisoThemeProps {
  tabs: { label: string; value: string; content: React.ReactNode }[];
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Tabs({ tabs, defaultValue, className, theme, primary, secondary, overlap, paper, style }: TabsProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const [active, setActive] = React.useState(defaultValue ?? tabs[0]?.value);
  const activeTab = tabs.find((t) => t.value === active);

  return (
    <div className={cn("w-full", className)} style={{ ...risoStyle, ...style }}>
      {/* Tab list */}
      <div className="relative flex items-end gap-0 border-b-2 border-[var(--riso-primary)]">
        {/* Secondary offset rule — the misreg underline */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 pointer-events-none h-[1px] bg-[var(--riso-secondary)] translate-y-0.5 opacity-70"
        />

        {tabs.map((tab) => {
          const isActive = tab.value === active;
          return (
            <button
              key={tab.value}
              onClick={() => setActive(tab.value)}
              className={` relative groupfont-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[10px] uppercase tracking-[0.15em] px-4 py-2 border-none cursor-pointer  transition-[background,color] duration-[120ms] ${isActive ? "bg-[var(--riso-primary)] text-white -mb-0.5 border-b-2 border-[var(--riso-primary)]" : "bg-transparent text-[var(--riso-primary)] mb-0"}`}
            >
              {/* Hover misreg shadow for inactive tabs */}
              {!isActive && (
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[var(--riso-secondary)] translate-x-0.5 translate-y-0.5 -z-10 "
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div className="py-5 px-0 text-[var(--riso-overlap,#7b4f7a)] font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)]">
        {activeTab?.content}
      </div>
    </div>
  );
}


