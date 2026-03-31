"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRiso, risoThemes } from "@/lib/riso-context";

const NAV_LINKS = [
  { label: "Docs", href: "/docs/getting-started/introduction" },
  { label: "Components", href: "/docs/components/button" },
  { label: "GitHub", href: "https://github.com", external: true },
];

// Ordered theme list for the dot switcher
const THEME_ORDER = ["pink-teal", "red-yellow", "blue-pink", "black-yellow"];

// Resolved colors for the dot swatches (static — just for visual display)
const THEME_COLORS: Record<string, { p: string; s: string }> = {
  "pink-teal": { p: "#ff5e7e", s: "#00a99d" },
  "red-yellow": { p: "#e8362a", s: "#f5d800" },
  "blue-pink": { p: "#3d6bce", s: "#ff5e7e" },
  "black-yellow": { p: "#1a1a1a", s: "#f5d800" },
};

export function RisoNavbar() {
  const pathname = usePathname();
  const { themeName, setTheme } = useRiso();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--riso-paper,#f7f0e2)",
        borderBottom: "3px solid var(--riso-primary)",
      }}
    >
      {/* Secondary misreg rule */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -5,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--riso-secondary)",
          opacity: 0.7,
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            position: "relative",
            display: "inline-block",
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 2,
              top: 2,
              fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
              fontWeight: 900,
              fontSize: 20,
              textTransform: "uppercase" as const,
              letterSpacing: "0.04em",
              color: "var(--riso-secondary)",
              opacity: 0.35,
              userSelect: "none" as const,
              whiteSpace: "nowrap" as const,
            }}
          >
            RISO UI
          </span>
          <span
            style={{
              position: "relative",
              fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
              fontWeight: 900,
              fontSize: 20,
              textTransform: "uppercase" as const,
              letterSpacing: "0.04em",
              color: "var(--riso-primary)",
              whiteSpace: "nowrap" as const,
            }}
          >
            RISO UI
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_LINKS.map((link) => {
            const active =
              !link.external &&
              !!pathname?.startsWith(
                link.href.split("/").slice(0, 2).join("/"),
              );
            return (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily:
                    "var(--font-riso-label,'Space Grotesk',sans-serif)",
                  fontWeight: 700,
                  fontSize: 10,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.15em",
                  textDecoration: "none",
                  padding: "6px 16px",
                  color: active ? "white" : "var(--riso-primary)",
                  background: active ? "var(--riso-primary)" : "transparent",
                  filter: active
                    ? "drop-shadow(3px 3px 0 var(--riso-secondary))"
                    : "none",
                  transition: "background 100ms, color 100ms",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: theme switcher + CTA ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexShrink: 0,
          }}
        >
          {/* Ink theme dot switcher */}
          <div
            role="group"
            aria-label="Switch ink theme"
            style={{ display: "flex", gap: 6, alignItems: "center" }}
          >
            {THEME_ORDER.map((name) => {
              const colors = THEME_COLORS[name];
              const isActive = themeName === name;
              return (
                <button
                  key={name}
                  onClick={() => setTheme(name)}
                  aria-label={`Switch to ${risoThemes[name]?.name ?? name} theme`}
                  aria-pressed={isActive}
                  title={risoThemes[name]?.name ?? name}
                  style={{
                    width: isActive ? 18 : 11,
                    height: isActive ? 18 : 11,
                    background: colors.p,
                    border: isActive
                      ? `2.5px solid ${colors.s}`
                      : "2px solid transparent",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 150ms, height 150ms, border-color 150ms",
                    flexShrink: 0,
                    outline: "none",
                  }}
                />
              );
            })}
          </div>

          {/* Get Started CTA */}
          <Link
            href="/docs/getting-started/introduction"
            style={{
              fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
              fontWeight: 700,
              fontSize: 9,
              textTransform: "uppercase" as const,
              letterSpacing: "0.15em",
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              background: "var(--riso-primary)",
              filter: "drop-shadow(4px 4px 0 var(--riso-secondary))",
              whiteSpace: "nowrap" as const,
              transition: "filter 120ms, transform 120ms",
              display: "block",
            }}
          >
            Get Started →
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 6,
            }}
          >
            <svg
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              aria-hidden
            >
              <line
                x1="0"
                y1="1"
                x2="20"
                y2="1"
                stroke="var(--riso-primary)"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <line
                x1="2"
                y1="3"
                x2="22"
                y2="3"
                stroke="var(--riso-secondary)"
                strokeWidth="1"
                strokeLinecap="square"
                opacity="0.5"
              />
              <line
                x1="0"
                y1="7"
                x2="20"
                y2="7"
                stroke="var(--riso-primary)"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <line
                x1="2"
                y1="9"
                x2="22"
                y2="9"
                stroke="var(--riso-secondary)"
                strokeWidth="1"
                strokeLinecap="square"
                opacity="0.5"
              />
              <line
                x1="0"
                y1="13"
                x2="20"
                y2="13"
                stroke="var(--riso-primary)"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <line
                x1="2"
                y1="15"
                x2="22"
                y2="15"
                stroke="var(--riso-secondary)"
                strokeWidth="1"
                strokeLinecap="square"
                opacity="0.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "2px solid var(--riso-primary)",
            background: "var(--riso-paper,#f7f0e2)",
            padding: "8px 24px 16px",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              target={link.external ? "_blank" : undefined}
              style={{
                display: "block",
                fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase" as const,
                letterSpacing: "0.15em",
                color: "var(--riso-primary)",
                textDecoration: "none",
                padding: "12px 0",
                borderBottom:
                  "1px solid color-mix(in srgb,var(--riso-primary) 18%,transparent)",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile theme switcher */}
          <div
            style={{
              paddingTop: 14,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
                fontWeight: 700,
                fontSize: 8,
                textTransform: "uppercase" as const,
                letterSpacing: "0.2em",
                color: "var(--riso-secondary)",
              }}
            >
              Ink theme
            </span>
            {THEME_ORDER.map((name) => {
              const colors = THEME_COLORS[name];
              const isActive = themeName === name;
              return (
                <button
                  key={name}
                  onClick={() => {
                    setTheme(name);
                    setMobileOpen(false);
                  }}
                  title={risoThemes[name]?.name ?? name}
                  style={{
                    width: isActive ? 20 : 13,
                    height: isActive ? 20 : 13,
                    background: colors.p,
                    border: isActive
                      ? `2.5px solid ${colors.s}`
                      : "2px solid transparent",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 150ms",
                    outline: "none",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
