"use client";

// lib/riso-context.tsx — RisoProvider and useRiso hook
//
// Theme architecture:
//   - CSS vars live on document.documentElement (<html>)
//   - This means EVERY component on the page inherits the same vars
//     regardless of nesting — including inside PreviewContainer
//   - Theme is persisted to localStorage under key "riso-theme"
//   - A blocking <script> in <head> applies the saved theme before paint
//     to prevent flash (see app/layout.tsx)

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  risoThemes,
  defaultThemeName,
  resolveTheme,
  type RisoTheme,
} from "./riso";

// ── types ───────────────────────────────────────────────────────────────────

export interface RisoContextValue {
  themeName: string;
  theme: RisoTheme;
  primary: string;
  secondary: string;
  overlap: string;
  paper: string;
  setTheme: (name: string) => void;
  grainEnabled: boolean;
  setGrainEnabled: (v: boolean) => void;
  misregEnabled: boolean;
  setMisregEnabled: (v: boolean) => void;
}

// ── helpers ──────────────────────────────────────────────────────────────────

const LS_KEY = "riso-theme";

/** Apply a resolved theme to document.documentElement CSS vars */
function applyToHtml(resolved: ReturnType<typeof resolveTheme>) {
  const root = document.documentElement;
  root.style.setProperty("--riso-primary", resolved.primary);
  root.style.setProperty("--riso-secondary", resolved.secondary);
  root.style.setProperty("--riso-overlap", resolved.overlap);
  root.style.setProperty("--riso-paper", resolved.paper);
  root.setAttribute("data-riso-theme", resolved.theme.name ?? "Pink & Teal");
}

function readStoredTheme(): string {
  if (typeof window === "undefined") return defaultThemeName;
  return localStorage.getItem(LS_KEY) ?? defaultThemeName;
}

// ── context ──────────────────────────────────────────────────────────────────

const RisoContext = createContext<RisoContextValue | null>(null);

// ── provider ─────────────────────────────────────────────────────────────────

export function RisoProvider({
  children,
  defaultTheme = defaultThemeName,
}: {
  children: React.ReactNode;
  defaultTheme?: string;
}) {
  // Initialise from localStorage (client) or prop (SSR fallback)
  // We use a lazy initialiser so the first render uses the right value
  const [themeName, setThemeNameState] = useState<string>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return readStoredTheme();
  });

  const [grainEnabled, setGrainEnabled] = useState(true);
  const [misregEnabled, setMisregEnabled] = useState(true);

  // On mount: sync html element with whatever localStorage says
  // (handles the case where SSR defaultTheme differs from stored value)
  useEffect(() => {
    const stored = readStoredTheme();
    const resolved = resolveTheme(stored);
    applyToHtml(resolved);
    setThemeNameState(stored);
  }, []);

  // setTheme: updates state + localStorage + html element atomically
  const setTheme = useCallback((name: string) => {
    const resolved = resolveTheme(name);
    applyToHtml(resolved);
    localStorage.setItem(LS_KEY, name);
    setThemeNameState(name);
  }, []);

  const resolved = useMemo(() => resolveTheme(themeName), [themeName]);

  const value: RisoContextValue = {
    themeName,
    theme: resolved.theme,
    primary: resolved.primary,
    secondary: resolved.secondary,
    overlap: resolved.overlap,
    paper: resolved.paper,
    setTheme,
    grainEnabled,
    setGrainEnabled,
    misregEnabled,
    setMisregEnabled,
  };

  // No wrapper div — vars live on <html>, so children don't need a
  // containing element to inherit them.
  return <RisoContext.Provider value={value}>{children}</RisoContext.Provider>;
}

// ── hook ─────────────────────────────────────────────────────────────────────

export function useRiso(): RisoContextValue {
  const ctx = useContext(RisoContext);
  if (!ctx) throw new Error("useRiso must be used inside <RisoProvider>");
  return ctx;
}

// Re-export so consumers don't need a separate import
export { risoThemes };
