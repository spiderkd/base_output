// lib/riso-filters.ts — SVG filter string builders
// Injected ONCE into the DOM via RisoFilterProvider, referenced by ID everywhere

export function buildGrainFilter(id: string, intensity: number = 0.35): string {
  const slope = 1 + intensity * 0.6;
  return `<filter id="${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
      <feComponentTransfer in="grayNoise" result="scaledNoise">
        <feFuncA type="linear" slope="${slope.toFixed(2)}" intercept="-0.15"/>
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="scaledNoise" mode="multiply" result="blended"/>
      <feComposite in="blended" in2="SourceGraphic" operator="in"/>
    </filter>`;
}

export function buildBleedFilter(id: string, radius: number = 0.8): string {
  return `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="${radius}" in="SourceGraphic" result="blur"/>
      <feColorMatrix in="blur" mode="matrix" result="sharpBleed"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"/>
      <feComposite in="SourceGraphic" in2="sharpBleed" operator="atop"/>
    </filter>`;
}

export const FILTER_IDS = {
  grainBorder:      "riso-grain-border",
  grainFill:        "riso-grain-fill",
  grainInteractive: "riso-grain-interactive",
  bleedSoft:        "riso-bleed-soft",
  bleedMed:         "riso-bleed-med",
} as const;

export function buildAllFilters(): string {
  return [
    buildGrainFilter(FILTER_IDS.grainBorder,      0.35),
    buildGrainFilter(FILTER_IDS.grainFill,         0.50),
    buildGrainFilter(FILTER_IDS.grainInteractive,  0.42),
    buildBleedFilter(FILTER_IDS.bleedSoft,         0.5),
    buildBleedFilter(FILTER_IDS.bleedMed,          1.0),
  ].join("\n    ");
}

/** CSS halftone dot pattern for fill areas */
export function halftoneCSS(color: string, size: number = 4): string {
  return `radial-gradient(circle, ${color} 1.5px, transparent 0) 0 0 / ${size}px ${size}px`;
}
