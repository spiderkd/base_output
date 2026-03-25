import * as React from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export type RisoThemeName =
  | "pink-teal"
  | "red-yellow"
  | "blue-pink"
  | "black-yellow";

export interface RisoThemeProps {
  /** Pick a named preset. Individual color props override preset values. */
  theme?: RisoThemeName;
  /** Override primary ink color. Any CSS color string. */
  primary?: string;
  /** Override secondary ink color. Any CSS color string. */
  secondary?: string;
  /** Override overlap/multiply color. Any CSS color string. */
  overlap?: string;
  /** Override paper/background color. Any CSS color string. */
  paper?: string;
}

// ── Preset table ─────────────────────────────────────────────────────────────
// Mirrors riso.ts but kept local so this file has zero imports other than React.
// These are the exact same values as riso-theme ships in its cssVars.

const PRESETS: Record<
  RisoThemeName,
  Required<Omit<RisoThemeProps, "theme">>
> = {
  "pink-teal": {
    primary: "#ff5e7e",
    secondary: "#00a99d",
    overlap: "#7b4f7a",
    paper: "#f7f0e2",
  },
  "red-yellow": {
    primary: "#e8362a",
    secondary: "#f5d800",
    overlap: "#c07a00",
    paper: "#f6f0e0",
  },
  "blue-pink": {
    primary: "#3d6bce",
    secondary: "#ff5e7e",
    overlap: "#7b3fa0",
    paper: "#f8f6ff",
  },
  "black-yellow": {
    primary: "#1a1a1a",
    secondary: "#f5d800",
    overlap: "#3a3200",
    paper: "#f5efdc",
  },
};

// ── Resolver ─────────────────────────────────────────────────────────────────

/**
 * Resolves a theme name + optional raw overrides into an inline style object.
 *
 * Returns `{}` when called with no arguments — the component then falls
 * through to CSS vars already in globals.css from the riso-theme install.
 *
 * Only sets keys that are explicitly defined, so partial overrides work:
 *   resolveRisoVars({ theme: "blue-pink", primary: "#custom" })
 *   → uses blue-pink's secondary/overlap/paper, but overrides primary.
 */
export function resolveRisoVars({
  theme,
  primary,
  secondary,
  overlap,
  paper,
}: RisoThemeProps = {}): React.CSSProperties {
  // Start with preset if a named theme was requested
  const base = theme ? PRESETS[theme] : {};

  // Merge: explicit props override preset values
  const resolved = {
    "--riso-primary": primary ?? (base as any).primary,
    "--riso-secondary": secondary ?? (base as any).secondary,
    "--riso-overlap": overlap ?? (base as any).overlap,
    "--riso-paper": paper ?? (base as any).paper,
  };

  // Strip undefined keys so we don't pollute inline styles with "undefined"
  return Object.fromEntries(
    Object.entries(resolved).filter(([, v]) => v !== undefined),
  ) as React.CSSProperties;
}
