"use client";

// components/riso-filter-provider.tsx
// Place ONCE high in the layout — injects all SVG filter <defs> into the DOM.
// Every riso component references these filters by ID.

import { buildAllFilters } from "@/lib/riso-filters";

export function RisoFilterProvider() {
  return (
    <svg
      aria-hidden
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs dangerouslySetInnerHTML={{ __html: buildAllFilters() }} />
    </svg>
  );
}
