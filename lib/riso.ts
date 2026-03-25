// lib/riso.ts — Risograph ink palette, themes, and effect parameters

export type RisoInk =
  | "black"
  | "fluorescent-pink"
  | "bright-red"
  | "yellow"
  | "teal"
  | "blue"
  | "hunter-green"
  | "purple";

export const inkColors: Record<RisoInk, string> = {
  "black":            "#1a1a1a",
  "fluorescent-pink": "#ff5e7e",
  "bright-red":       "#e8362a",
  "yellow":           "#f5d800",
  "teal":             "#00a99d",
  "blue":             "#3d6bce",
  "hunter-green":     "#2c6e4a",
  "purple":           "#7b4f7a",
};

export type RisoTheme = {
  name: string;
  primary: RisoInk;
  secondary: RisoInk;
  overlap: string;
  paper: string;
};

export const risoThemes: Record<string, RisoTheme> = {
  "pink-teal": {
    name: "Pink & Teal", primary: "fluorescent-pink", secondary: "teal",
    overlap: "#7b4f7a", paper: "#f7f0e2",
  },
  "red-yellow": {
    name: "Red & Yellow", primary: "bright-red", secondary: "yellow",
    overlap: "#c07a00", paper: "#f6f0e0",
  },
  "blue-pink": {
    name: "Blue & Pink", primary: "blue", secondary: "fluorescent-pink",
    overlap: "#7b3fa0", paper: "#f8f6ff",
  },
  "black-yellow": {
    name: "Black & Yellow", primary: "black", secondary: "yellow",
    overlap: "#3a3200", paper: "#f5efdc",
  },
};

export const defaultThemeName = "pink-teal";

export type RisoVariant = "border" | "fill" | "interactive" | "chart";

export interface RisoEffectParams {
  grainIntensity: number;
  misregOffset:   number;
  bleedRadius:    number;
  halftoneSize:   number;
}

export const variantEffects: Record<RisoVariant, RisoEffectParams> = {
  border:      { grainIntensity: 0.35, misregOffset: 1.5, bleedRadius: 0.8, halftoneSize: 3 },
  fill:        { grainIntensity: 0.50, misregOffset: 2.0, bleedRadius: 1.2, halftoneSize: 4 },
  interactive: { grainIntensity: 0.40, misregOffset: 2.5, bleedRadius: 1.0, halftoneSize: 3 },
  chart:       { grainIntensity: 0.45, misregOffset: 1.8, bleedRadius: 0.6, halftoneSize: 5 },
};

export function resolveTheme(themeName: string) {
  const theme = risoThemes[themeName] ?? risoThemes[defaultThemeName];
  return {
    primary:   inkColors[theme.primary],
    secondary: inkColors[theme.secondary],
    overlap:   theme.overlap,
    paper:     theme.paper,
    theme,
  };
}
