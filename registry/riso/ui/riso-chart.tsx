// "use client";

// // registry/riso/ui/riso-chart.tsx — Risograph Pie / Donut Chart
// //
// // Unique to Riso — no Crumble equivalent.
// //
// // Visual system:
// //   - Each segment is a solid flat ink color (no gradient, no hachure)
// //   - Segments are drawn with SVG arcs + mix-blend-mode: multiply
// //   - Where segments "overlap" (slight inset past 360°): color mixing produces third ink
// //   - Segment borders: none — the multiply blend creates natural boundaries
// //   - Legend: inline badges in the ink color, Space Grotesk label
// //   - Hover: segment lifts with a hard offset shadow in overlap color

// import * as React from "react";
// import { cn } from "@/lib/utils";

// interface ChartSegment {
//   label: string;
//   value: number;
//   ink?: "primary" | "secondary" | "overlap" | string;
// }

// interface RisoChartProps {
//   data: ChartSegment[];
//   size?: number;
//   donut?: boolean;
//   showLegend?: boolean;
//   className?: string;
// }

// function polarToXY(cx: number, cy: number, r: number, angle: number) {
//   const rad = ((angle - 90) * Math.PI) / 180;
//   return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
// }

// function arcPath(
//   cx: number, cy: number,
//   outerR: number, innerR: number,
//   startAngle: number, endAngle: number
// ): string {
//   const s1 = polarToXY(cx, cy, outerR, startAngle);
//   const e1 = polarToXY(cx, cy, outerR, endAngle);
//   const s2 = polarToXY(cx, cy, innerR, endAngle);
//   const e2 = polarToXY(cx, cy, innerR, startAngle);
//   const large = endAngle - startAngle > 180 ? 1 : 0;
//   return [
//     `M ${s1.x} ${s1.y}`,
//     `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}`,
//     `L ${s2.x} ${s2.y}`,
//     `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}`,
//     "Z",
//   ].join(" ");
// }

// const INK_COLORS = [
//   "var(--riso-primary)",
//   "var(--riso-secondary)",
//   "var(--riso-overlap, #7b4f7a)",
//   "#3d6bce",
//   "#e8362a",
//   "#f5d800",
// ];

// const INK_HEX: Record<string, string> = {
//   primary:   "#ff5e7e",
//   secondary: "#00a99d",
//   overlap:   "#7b4f7a",
// };

// export function RisoChart({
//   data,
//   size = 200,
//   donut = true,
//   showLegend = true,
//   className,
// }: RisoChartProps) {
//   const [hovered, setHovered] = React.useState<number | null>(null);
//   const cx = size / 2;
//   const outerR = size / 2 - 8;
//   const innerR = donut ? outerR * 0.52 : 0;

//   const total = data.reduce((s, d) => s + d.value, 0);
//   let cursor = 0;

//   const segments = data.map((d, idx) => {
//     const startAngle = (cursor / total) * 360;
//     const endAngle = ((cursor + d.value) / total) * 360;
//     cursor += d.value;
//     const color = d.ink
//       ? (d.ink.startsWith("var(") ? d.ink : `var(--riso-${d.ink}, ${INK_HEX[d.ink] ?? d.ink})`)
//       : INK_COLORS[idx % INK_COLORS.length];
//     return { ...d, startAngle, endAngle, color, idx };
//   });

//   return (
//     <div className={cn("flex flex-col items-center gap-4", className)}>
//       <div style={{ position: "relative", width: size, height: size }}>
//         <svg
//           width={size}
//           height={size}
//           viewBox={`0 0 ${size} ${size}`}
//           style={{ overflow: "visible" }}
//         >
//           <defs>
//             <filter id="riso-chart-grain" x="0%" y="0%" width="100%" height="100%">
//               <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
//               <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
//               <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blended"/>
//               <feComposite in="blended" in2="SourceGraphic" operator="in"/>
//             </filter>
//           </defs>

//           {segments.map((seg) => {
//             const isHovered = hovered === seg.idx;
//             const path = arcPath(cx, cy, outerR, innerR, seg.startAngle, seg.endAngle);
//             // Lifted segment: translate radially outward on hover
//             const midAngle = (seg.startAngle + seg.endAngle) / 2;
//             const rad = ((midAngle - 90) * Math.PI) / 180;
//             const dx = isHovered ? Math.cos(rad) * 6 : 0;
//             const dy = isHovered ? Math.sin(rad) * 6 : 0;

//             return (
//               <g
//                 key={seg.idx}
//                 transform={`translate(${dx}, ${dy})`}
//                 style={{ cursor: "pointer", transition: "transform 150ms" }}
//                 onMouseEnter={() => setHovered(seg.idx)}
//                 onMouseLeave={() => setHovered(null)}
//               >
//                 {/* Hard offset shadow on hover */}
//                 {isHovered && (
//                   <path
//                     d={path}
//                     fill="var(--riso-overlap, #7b4f7a)"
//                     transform="translate(3, 3)"
//                     opacity="0.45"
//                   />
//                 )}

//                 {/* Segment fill — multiply blend creates color mixing at boundaries */}
//                 <path
//                   d={path}
//                   fill={seg.color}
//                   style={{ mixBlendMode: "multiply" }}
//                   filter="url(#riso-chart-grain)"
//                 />

//                 {/* Halftone overlay */}
//                 <path
//                   d={path}
//                   fill="none"
//                   stroke="white"
//                   strokeWidth="0.5"
//                   opacity="0.3"
//                 />
//               </g>
//             );
//           })}

//           {/* Donut center — paper background */}
//           {donut && (
//             <circle
//               cx={cx} cy={cx} r={innerR - 1}
//               fill="var(--riso-paper, #f7f0e2)"
//             />
//           )}
//         </svg>
//       </div>

//       {/* Legend */}
//       {showLegend && (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", justifyContent: "center" }}>
//           {segments.map((seg) => (
//             <div key={seg.idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
//               <div style={{
//                 width: 10, height: 10,
//                 background: seg.color,
//                 mixBlendMode: "multiply",
//                 flexShrink: 0,
//               }} />
//               <span style={{
//                 fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
//                 fontWeight: 700, fontSize: 9,
//                 textTransform: "uppercase",
//                 letterSpacing: "0.12em",
//                 color: "var(--riso-overlap, #7b4f7a)",
//               }}>
//                 {seg.label} · {Math.round((seg.value / total) * 100)}%
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

// registry/riso/ui/riso-chart.tsx — Risograph Pie / Donut Chart
//
// Unique to Riso — no Crumble equivalent.
//
// Visual system:
//   - Each segment is a solid flat ink color (no gradient, no hachure)
//   - Segments are drawn with SVG arcs + mix-blend-mode: multiply
//   - Where segments "overlap" (slight inset past 360°): color mixing produces third ink
//   - Segment borders: none — the multiply blend creates natural boundaries
//   - Legend: inline badges in the ink color, Space Grotesk label
//   - Hover: segment lifts with a hard offset shadow in overlap color

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface ChartSegment {
  label: string;
  value: number;
  ink?: "primary" | "secondary" | "overlap" | string;
}

interface RisoChartProps extends RisoThemeProps {
  data: ChartSegment[];
  size?: number;
  donut?: boolean;
  showLegend?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function polarToXY(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const s1 = polarToXY(cx, cy, outerR, startAngle);
  const e1 = polarToXY(cx, cy, outerR, endAngle);
  const s2 = polarToXY(cx, cy, innerR, endAngle);
  const e2 = polarToXY(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

const INK_COLORS = [
  "var(--riso-primary)",
  "var(--riso-secondary)",
  "var(--riso-overlap, #7b4f7a)",
  "#3d6bce",
  "#e8362a",
  "#f5d800",
];

const INK_HEX: Record<string, string> = {
  primary: "#ff5e7e",
  secondary: "#00a99d",
  overlap: "#7b4f7a",
};

export function RisoChart({
  data,
  size = 200,
  donut = true,
  showLegend = true,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: RisoChartProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [hovered, setHovered] = React.useState<number | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 8;
  const innerR = donut ? outerR * 0.52 : 0;

  const total = data.reduce((s, d) => s + d.value, 0);
  let cursor = 0;

  const segments = data.map((d, idx) => {
    const startAngle = (cursor / total) * 360;
    const endAngle = ((cursor + d.value) / total) * 360;
    cursor += d.value;
    const color = d.ink
      ? d.ink.startsWith("var(")
        ? d.ink
        : `var(--riso-${d.ink}, ${INK_HEX[d.ink] ?? d.ink})`
      : INK_COLORS[idx % INK_COLORS.length];
    return { ...d, startAngle, endAngle, color, idx };
  });

  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      style={{ ...risoStyle, ...style }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter
              id="riso-chart-grain"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                type="saturate"
                values="0"
                in="noise"
                result="gray"
              />
              <feBlend
                in="SourceGraphic"
                in2="gray"
                mode="multiply"
                result="blended"
              />
              <feComposite in="blended" in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {segments.map((seg) => {
            const isHovered = hovered === seg.idx;
            const path = arcPath(
              cx,
              cy,
              outerR,
              innerR,
              seg.startAngle,
              seg.endAngle,
            );
            // Lifted segment: translate radially outward on hover
            const midAngle = (seg.startAngle + seg.endAngle) / 2;
            const rad = ((midAngle - 90) * Math.PI) / 180;
            const dx = isHovered ? Math.cos(rad) * 6 : 0;
            const dy = isHovered ? Math.sin(rad) * 6 : 0;

            return (
              <g
                key={seg.idx}
                transform={`translate(${dx}, ${dy})`}
                style={{ cursor: "pointer", transition: "transform 150ms" }}
                onMouseEnter={() => setHovered(seg.idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Hard offset shadow on hover */}
                {isHovered && (
                  <path
                    d={path}
                    fill="var(--riso-overlap, #7b4f7a)"
                    transform="translate(3, 3)"
                    opacity="0.45"
                  />
                )}

                {/* Segment fill — multiply blend creates color mixing at boundaries */}
                <path
                  d={path}
                  fill={seg.color}
                  style={{ mixBlendMode: "multiply" }}
                  filter="url(#riso-chart-grain)"
                />

                {/* Halftone overlay */}
                <path
                  d={path}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </g>
            );
          })}

          {/* Donut center — paper background */}
          {donut && (
            <circle
              cx={cx}
              cy={cy}
              r={innerR - 1}
              fill="var(--riso-paper, #f7f0e2)"
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 16px",
            justifyContent: "center",
          }}
        >
          {segments.map((seg) => (
            <div
              key={seg.idx}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: seg.color,
                  mixBlendMode: "multiply",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily:
                    "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                  fontWeight: 700,
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--riso-overlap, #7b4f7a)",
                }}
              >
                {seg.label} · {Math.round((seg.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
