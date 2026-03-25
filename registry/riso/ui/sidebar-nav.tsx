"use client";

// registry/new-york/ui/sidebar-nav.tsx — Risograph Sidebar Navigation
//
// Visual system:
//   - Active item: PrintBlock treatment (solid primary left strip + faded primary bg)
//   - Hover: secondary misreg strip (2px left border in secondary)
//   - Section headers: uppercase label with double-rule below
//   - Icons: optional, drawn inline

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SidebarNavProps extends RisoThemeProps {
  sections: NavSection[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function SidebarNav({ sections,
  activeId,
  onSelect,
  className, theme, primary, secondary, overlap, paper, style }: SidebarNavProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  return (
    <nav className={cn("flex flex-col gap-0", className)} aria-label="Sidebar navigation" style={{ ...risoStyle, ...style }}>
      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 16 }}>
          {section.title && (
            <>
              <div style={{ padding: "0 12px 6px", position: "relative" }}>
                <span style={{
                  fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
                  fontWeight: 700, fontSize: 8, textTransform: "uppercase",
                  letterSpacing: "0.2em", color: "var(--riso-secondary)",
                }}>
                  {section.title}
                </span>
              </div>
              {/* Double-rule under section header */}
              <div style={{ position: "relative", height: 6, marginBottom: 4 }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--riso-secondary)", opacity: 0.4 }} />
                <div style={{ position: "absolute", top: 4, left: 0, right: 0, height: 1, background: "var(--riso-primary)", opacity: 0.2 }} />
              </div>
            </>
          )}

          {section.items.map(item => {
            const isActive = item.id === activeId;
            return (
              <a
                key={item.id}
                href={item.href ?? "#"}
                onClick={e => { if (onSelect) { e.preventDefault(); onSelect(item.id); } }}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px",
                  textDecoration: "none",
                  position: "relative",
                  background: isActive
                    ? "color-mix(in srgb,var(--riso-primary) 10%,transparent)"
                    : "transparent",
                  transition: "background 100ms",
                }}
                onMouseEnter={e => {
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "color-mix(in srgb,var(--riso-secondary) 12%,transparent)";
                }}
                onMouseLeave={e => {
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                {/* Active left strip — PrintBlock style */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: isActive ? 4 : 0,
                    background: "var(--riso-primary)",
                    transition: "width 120ms",
                  }}
                />

                {/* Hover secondary strip */}
                {!isActive && (
                  <div
                    aria-hidden
                    className="hover-strip"
                    style={{
                      position: "absolute", left: 0, top: 0, bottom: 0,
                      width: 2,
                      background: "var(--riso-secondary)",
                      opacity: 0,
                      transition: "opacity 100ms",
                    }}
                  />
                )}

                {/* Icon */}
                {item.icon && (
                  <span style={{
                    color: isActive ? "var(--riso-primary)" : "var(--riso-secondary)",
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </span>
                )}

                {/* Label */}
                <span style={{
                  fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
                  fontWeight: 700, fontSize: 11, textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: isActive ? "var(--riso-primary)" : "var(--riso-overlap,#7b4f7a)",
                  flex: 1,
                }}>
                  {item.label}
                </span>

                {/* Badge */}
                {item.badge !== undefined && (
                  <span style={{
                    background: isActive ? "var(--riso-primary)" : "var(--riso-secondary)",
                    color: "white",
                    fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
                    fontWeight: 700, fontSize: 8,
                    padding: "1px 6px",
                    flexShrink: 0,
                  }}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}


