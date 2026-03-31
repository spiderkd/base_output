"use client";

import * as React from "react";
import Link from "next/link";
import { useRiso, risoThemes } from "@/lib/riso-context";
import { NavbarSidebarTrigger } from "fumadocs-ui/layouts/docs";

const THEME_ORDER = ["pink-teal", "red-yellow", "blue-pink", "black-yellow"];

const THEME_COLORS: Record<string, { p: string; s: string }> = {
  "pink-teal": { p: "#ff5e7e", s: "#00a99d" },
  "red-yellow": { p: "#e8362a", s: "#f5d800" },
  "blue-pink": { p: "#3d6bce", s: "#ff5e7e" },
  "black-yellow": { p: "#1a1a1a", s: "#f5d800" },
};

export function RisoDocsNavbar() {
  const { themeName, setTheme } = useRiso();

  return (
    <header
      style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "var(--riso-paper,#f7f0e2)",
        borderBottom: "3px solid var(--riso-primary)",
        position: "relative",
        flexShrink: 0,
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

      {/* Left side: hamburger (mobile only) + logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Hamburger — only visible on mobile via fumadocs's built-in trigger */}
        <NavbarSidebarTrigger
          style={{
            // fumadocs already hides this on desktop via its own styles,
            // but you can reinforce with a media query class if needed
            background: "none",
            border: "none",
            padding: 4,
            cursor: "pointer",
            color: "var(--riso-primary)",
            display: "flex",
            alignItems: "center",
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            position: "relative",
            display: "inline-block",
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
              fontSize: 17,
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
              fontSize: 17,
              textTransform: "uppercase" as const,
              letterSpacing: "0.04em",
              color: "var(--riso-primary)",
              whiteSpace: "nowrap" as const,
            }}
          >
            RISO UI
          </span>
        </Link>
      </div>

      {/* Theme dot switcher */}
      <div
        role="group"
        aria-label="Switch ink theme"
        style={{ display: "flex", gap: 6, alignItems: "center" }}
      >
        {THEME_ORDER.map((name) => {
          const c = THEME_COLORS[name];
          const active = themeName === name;
          return (
            <button
              key={name}
              onClick={() => setTheme(name)}
              aria-label={`Switch to ${risoThemes[name]?.name ?? name}`}
              aria-pressed={active}
              title={risoThemes[name]?.name ?? name}
              style={{
                width: active ? 17 : 10,
                height: active ? 17 : 10,
                background: c.p,
                border: active ? `2.5px solid ${c.s}` : "2px solid transparent",
                cursor: "pointer",
                padding: 0,
                outline: "none",
                transition: "width 150ms, height 150ms",
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>
    </header>
  );
}
