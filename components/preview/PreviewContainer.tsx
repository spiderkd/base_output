// "use client";

// // components/preview/PreviewContainer.tsx — Riso PreviewContainer
// // Simple container that shows the component on a paper-textured background.
// // No theme switcher — just preview + code tabs + install command.

// import { useState, type ReactNode } from "react";
// import { RisoProvider } from "@/lib/riso-context";

// interface PreviewContainerProps {
//   children: ReactNode;
//   code?: string;
//   componentName?: string;
// }

// type Tab = "preview" | "code";

// export function PreviewContainer({
//   children,
//   code,
//   componentName,
// }: PreviewContainerProps) {
//   const [tab, setTab] = useState<Tab>("preview");

//   const installCommand = componentName
//     ? `npx shadcn add https://riso.dev/r/${componentName}.json`
//     : null;

//   return (
//     <div
//       className="my-6 overflow-hidden"
//       style={{
//         outline: "2px solid var(--riso-primary, #ff5e7e)",
//         filter: "drop-shadow(4px 4px 0px var(--riso-secondary, #00a99d))",
//       }}
//     >
//       {/* Tab bar */}
//       <div
//         className="flex items-center justify-between px-3 py-2 border-b-2"
//         style={{
//           background: "var(--riso-primary, #ff5e7e)",
//           borderColor: "var(--riso-primary, #ff5e7e)",
//         }}
//       >
//         <div className="flex gap-1">
//           {(["preview", "code"] as Tab[]).map((t) => (
//             <button
//               key={t}
//               onClick={() => setTab(t)}
//               className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all"
//               style={{
//                 fontFamily:
//                   "var(--font-riso-label, 'Space Grotesk', sans-serif)",
//                 background: tab === t ? "white" : "transparent",
//                 color: tab === t ? "var(--riso-primary, #ff5e7e)" : "white",
//                 outline: tab === t ? "none" : "none",
//               }}
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         {componentName && (
//           <span
//             className="text-[9px] uppercase tracking-widest opacity-80"
//             style={{
//               fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
//               color: "white",
//             }}
//           >
//             {componentName}
//           </span>
//         )}
//       </div>

//       {/* Content */}
//       {tab === "preview" ? (
//         <RisoProvider>
//           <div
//             className="flex min-h-[140px] items-center justify-center p-10"
//             style={{
//               background: "var(--riso-paper, #f7f0e2)",
//               // Subtle grain via inline SVG data URI
//               backgroundImage: `
//                 url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E"),
//                 linear-gradient(var(--riso-paper, #f7f0e2), var(--riso-paper, #f7f0e2))
//               `,
//             }}
//           >
//             {children}
//           </div>
//         </RisoProvider>
//       ) : (
//         <div className="overflow-x-auto p-4" style={{ background: "#1a1a1a" }}>
//           <pre
//             className="text-sm leading-relaxed"
//             style={{
//               color: "#f7f0e2",
//               fontFamily: "var(--font-mono, monospace)",
//             }}
//           >
//             <code>{code ?? "// no code provided"}</code>
//           </pre>
//         </div>
//       )}

//       {/* Install command */}
//       {installCommand && (
//         <div
//           className="flex items-center justify-between gap-2 px-3 py-2 border-t-2"
//           style={{
//             background: "var(--riso-paper, #f7f0e2)",
//             borderColor: "var(--riso-secondary, #00a99d)",
//           }}
//         >
//           <code
//             className="text-xs"
//             style={{
//               fontFamily: "var(--font-mono, monospace)",
//               color: "var(--riso-secondary, #00a99d)",
//             }}
//           >
//             {installCommand}
//           </code>
//           <button
//             onClick={() => navigator.clipboard.writeText(installCommand)}
//             className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-all"
//             style={{
//               fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
//               outline: "2px solid var(--riso-secondary, #00a99d)",
//               color: "var(--riso-secondary, #00a99d)",
//               background: "transparent",
//             }}
//           >
//             copy
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

// components/preview/PreviewContainer.tsx — Riso PreviewContainer
// Simple container that shows the component on a paper-textured background.
// No theme switcher — just preview + code tabs + install command.

import { useState, type ReactNode } from "react";
// No local RisoProvider — CSS vars are set on <html> by the root provider,
// so they cascade into every component on the page including inside this container.

interface PreviewContainerProps {
  children: ReactNode;
  code?: string;
  componentName?: string;
}

type Tab = "preview" | "code";

export function PreviewContainer({
  children,
  code,
  componentName,
}: PreviewContainerProps) {
  const [tab, setTab] = useState<Tab>("preview");

  const installCommand = componentName
    ? `npx shadcn add https://riso.dev/r/${componentName}.json`
    : null;

  return (
    <div
      className="my-6 overflow-hidden"
      style={{
        outline: "2px solid var(--riso-primary, #ff5e7e)",
        filter: "drop-shadow(4px 4px 0px var(--riso-secondary, #00a99d))",
      }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b-2"
        style={{
          background: "var(--riso-primary, #ff5e7e)",
          borderColor: "var(--riso-primary, #ff5e7e)",
        }}
      >
        <div className="flex gap-1">
          {(["preview", "code"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all"
              style={{
                fontFamily:
                  "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                background: tab === t ? "white" : "transparent",
                color: tab === t ? "var(--riso-primary, #ff5e7e)" : "white",
                outline: tab === t ? "none" : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {componentName && (
          <span
            className="text-[9px] uppercase tracking-widest opacity-80"
            style={{
              fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
              color: "white",
            }}
          >
            {componentName}
          </span>
        )}
      </div>

      {/* Content */}
      {tab === "preview" ? (
        <div
          className="flex min-h-[140px] items-center justify-center p-10"
          style={{
            background: "var(--riso-paper, #f7f0e2)",
            // Subtle grain via inline SVG data URI
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E"),
              linear-gradient(var(--riso-paper, #f7f0e2), var(--riso-paper, #f7f0e2))
            `,
          }}
        >
          {children}
        </div>
      ) : (
        <div className="overflow-x-auto p-4" style={{ background: "#1a1a1a" }}>
          <pre
            className="text-sm leading-relaxed"
            style={{
              color: "#f7f0e2",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            <code>{code ?? "// no code provided"}</code>
          </pre>
        </div>
      )}

      {/* Install command */}
      {installCommand && (
        <div
          className="flex items-center justify-between gap-2 px-3 py-2 border-t-2"
          style={{
            background: "var(--riso-paper, #f7f0e2)",
            borderColor: "var(--riso-secondary, #00a99d)",
          }}
        >
          <code
            className="text-xs"
            style={{
              fontFamily: "var(--font-mono, monospace)",
              color: "var(--riso-secondary, #00a99d)",
            }}
          >
            {installCommand}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(installCommand)}
            className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-all"
            style={{
              fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
              outline: "2px solid var(--riso-secondary, #00a99d)",
              color: "var(--riso-secondary, #00a99d)",
              background: "transparent",
            }}
          >
            copy
          </button>
        </div>
      )}
    </div>
  );
}
