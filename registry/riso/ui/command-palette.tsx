// "use client";

// // registry/riso/ui/command-palette.tsx — Risograph Command Palette
// //
// // Visual system:
// //   - Opens as a centered dialog (keyboard shortcut driven)
// //   - Search input: large, paper background, primary underline only (no full outline)
// //   - Results list: halftone background behind hovered result
// //   - Category headers: stamp-style labels
// //   - Highlighted result: primary ink fill
// //   - Keyboard navigation: arrow keys + enter

// import * as React from "react";
// import { cn } from "@/lib/utils";

// interface CommandItem {
//   id: string;
//   label: string;
//   description?: string;
//   category?: string;
//   onSelect?: () => void;
//   keywords?: string[];
// }

// interface CommandPaletteProps {
//   open: boolean;
//   onClose: () => void;
//   items: CommandItem[];
//   placeholder?: string;
//   className?: string;
// }

// export function CommandPalette({
//   open,
//   onClose,
//   items,
//   placeholder = "Type a command or search…",
//   className,
// }: CommandPaletteProps) {
//   const [query, setQuery]       = React.useState("");
//   const [activeIdx, setActiveIdx] = React.useState(0);
//   const inputRef = React.useRef<HTMLInputElement>(null);

//   const filtered = React.useMemo(() => {
//     if (!query) return items;
//     const q = query.toLowerCase();
//     return items.filter(item =>
//       item.label.toLowerCase().includes(q) ||
//       item.description?.toLowerCase().includes(q) ||
//       item.keywords?.some(k => k.toLowerCase().includes(q))
//     );
//   }, [query, items]);

//   // Group by category
//   const grouped = React.useMemo(() => {
//     const map = new Map<string, CommandItem[]>();
//     filtered.forEach(item => {
//       const cat = item.category ?? "";
//       if (!map.has(cat)) map.set(cat, []);
//       map.get(cat)!.push(item);
//     });
//     return map;
//   }, [filtered]);

//   React.useEffect(() => {
//     if (open) {
//       setQuery("");
//       setActiveIdx(0);
//       setTimeout(() => inputRef.current?.focus(), 60);
//     }
//   }, [open]);

//   React.useEffect(() => { setActiveIdx(0); }, [query]);

//   const handleKey = (e: React.KeyboardEvent) => {
//     if (e.key === "Escape") { onClose(); return; }
//     if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); return; }
//     if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); return; }
//     if (e.key === "Enter") {
//       filtered[activeIdx]?.onSelect?.();
//       onClose();
//     }
//   };

//   if (!open) return null;

//   let flatIdx = -1;

//   return (
//     <div
//       style={{
//         position: "fixed", inset: 0, zIndex: 500,
//         display: "flex", alignItems: "flex-start", justifyContent: "center",
//         paddingTop: "12vh",
//       }}
//       onClick={e => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       {/* Halftone backdrop */}
//       <div aria-hidden style={{
//         position: "absolute", inset: 0,
//         backgroundImage: "radial-gradient(circle,var(--riso-overlap,#7b4f7a) 1px,transparent 0)",
//         backgroundSize: "5px 5px", opacity: 0.18,
//       }}/>

//       {/* Panel */}
//       <div
//         className={cn(className)}
//         onKeyDown={handleKey}
//         style={{
//           position: "relative",
//           width: "min(560px, 90vw)",
//           maxHeight: "60vh",
//           display: "flex", flexDirection: "column",
//           filter: "drop-shadow(6px 6px 0 var(--riso-secondary))",
//         }}
//       >
//         {/* Shadow layer */}
//         <div aria-hidden style={{
//           position: "absolute", inset: 0,
//           background: "var(--riso-secondary)", opacity: 0.5,
//           transform: "translate(6px,6px)",
//         }}/>

//         <div style={{
//           position: "relative",
//           background: "var(--riso-paper,#f7f0e2)",
//           outline: "2px solid var(--riso-primary)",
//           display: "flex", flexDirection: "column",
//           overflow: "hidden",
//         }}>
//           {/* Search input */}
//           <div style={{
//             padding: "12px 16px",
//             borderBottom: "2px solid var(--riso-primary)",
//             display: "flex", alignItems: "center", gap: 10,
//           }}>
//             {/* Search icon */}
//             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
//               <circle cx="7" cy="7" r="5" stroke="var(--riso-secondary)" strokeWidth="2"/>
//               <line x1="11" y1="11" x2="15" y2="15" stroke="var(--riso-primary)" strokeWidth="2" strokeLinecap="square"/>
//               <circle cx="8.5" cy="8.5" r="5" stroke="var(--riso-primary)" strokeWidth="1.5" opacity="0.4"/>
//             </svg>

//             <input
//               ref={inputRef}
//               value={query}
//               onChange={e => setQuery(e.target.value)}
//               placeholder={placeholder}
//               style={{
//                 flex: 1, background: "transparent", border: "none", outline: "none",
//                 fontFamily: "var(--font-riso-body,'Work Sans',sans-serif)",
//                 fontSize: 14, color: "var(--riso-overlap,#7b4f7a)",
//               }}
//             />

//             <kbd style={{
//               fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
//               fontWeight: 700, fontSize: 9, textTransform: "uppercase",
//               color: "var(--riso-secondary)", opacity: 0.6,
//             }}>
//               ESC
//             </kbd>
//           </div>

//           {/* Results */}
//           <div className="overflow-y-auto max-h-[calc(60vh-54px)]">
//             {filtered.length === 0 ? (
//               <div style={{
//                 padding: "20px 16px", textAlign: "center",
//                 fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
//                 fontWeight: 700, fontSize: 10, textTransform: "uppercase",
//                 letterSpacing: "0.12em", color: "var(--riso-secondary)", opacity: 0.6,
//               }}>
//                 No results
//               </div>
//             ) : (
//               Array.from(grouped.entries()).map(([cat, catItems]) => (
//                 <div key={cat}>
//                   {cat && (
//                     <div style={{
//                       padding: "8px 16px 4px",
//                       fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
//                       fontWeight: 700, fontSize: 8, textTransform: "uppercase",
//                       letterSpacing: "0.2em", color: "var(--riso-secondary)",
//                       borderBottom: "1px solid color-mix(in srgb,var(--riso-secondary) 30%,transparent)",
//                       marginBottom: 2,
//                     }}>
//                       {cat}
//                     </div>
//                   )}
//                   {catItems.map(item => {
//                     flatIdx++;
//                     const iIdx = flatIdx;
//                     const isActive = iIdx === activeIdx;
//                     return (
//                       <div
//                         key={item.id}
//                         onClick={() => { item.onSelect?.(); onClose(); }}
//                         onMouseEnter={() => setActiveIdx(iIdx)}
//                         style={{
//                           padding: "9px 16px",
//                           cursor: "pointer",
//                           background: isActive ? "var(--riso-primary)" : "transparent",
//                           position: "relative",
//                           transition: "background 80ms",
//                         }}
//                       >
//                         {/* Halftone on hover */}
//                         {isActive && (
//                           <div aria-hidden style={{
//                             position: "absolute", inset: 0,
//                             backgroundImage: "radial-gradient(circle,rgba(255,255,255,.15) 1px,transparent 0)",
//                             backgroundSize: "3px 3px",
//                             pointerEvents: "none",
//                           }}/>
//                         )}
//                         <div className="relative">
//                           <p style={{
//                             fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
//                             fontWeight: 700, fontSize: 12, textTransform: "uppercase",
//                             letterSpacing: "0.08em",
//                             color: isActive ? "white" : "var(--riso-overlap,#7b4f7a)",
//                             margin: 0,
//                           }}>
//                             {item.label}
//                           </p>
//                           {item.description && (
//                             <p style={{
//                               fontFamily: "var(--font-riso-body,'Work Sans',sans-serif)",
//                               fontSize: 11,
//                               color: isActive ? "rgba(255,255,255,0.75)" : "var(--riso-secondary)",
//                               margin: "2px 0 0",
//                             }}>
//                               {item.description}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

// registry/riso/ui/command-palette.tsx — Risograph Command Palette
//
// Visual system:
//   - Opens as a centered dialog (keyboard shortcut driven)
//   - Search input: large, paper background, primary underline only (no full outline)
//   - Results list: halftone background behind hovered result
//   - Category headers: stamp-style labels
//   - Highlighted result: primary ink fill
//   - Keyboard navigation: arrow keys + enter

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  onSelect?: () => void;
  keywords?: string[];
}

interface CommandPaletteProps extends RisoThemeProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "Type a command or search…",
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: CommandPaletteProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [query, setQuery] = React.useState("");
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [query, items]);

  // Group by category
  const grouped = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const cat = item.category ?? "";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    });
    return map;
  }, [filtered]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  React.useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      filtered[activeIdx]?.onSelect?.();
      onClose();
    }
  };

  if (!open) return null;

  let flatIdx = -1;

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-start justify-center pt-[12vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ ...risoStyle, ...style }}
    >
      {/* Halftone backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(circle,var(--riso-overlap,#7b4f7a)_1px,transparent_0)] [background-size:5px_5px] opacity-[0.18]"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-[min(560px,90vw)] max-h-[60vh] flex flex-col [filter:drop-shadow(6px_6px_0_var(--riso-secondary))]",
          className,
        )}
        onKeyDown={handleKey}
      >
        {/* Shadow layer */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--riso-secondary)] opacity-50 translate-x-[6px] translate-y-[6px]"
        />

        <div className="relative bg-[var(--riso-paper,#f7f0e2)]  outline-2 outline-[var(--riso-primary)] flex flex-col overflow-hidden">
          {/* Search input */}
          <div className="px-4 py-3 border-b-2 border-[var(--riso-primary)] flex items-center gap-[10px]">
            {/* Search icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="shrink-0"
            >
              <circle
                cx="7"
                cy="7"
                r="5"
                stroke="var(--riso-secondary)"
                strokeWidth="2"
              />
              <line
                x1="11"
                y1="11"
                x2="15"
                y2="15"
                stroke="var(--riso-primary)"
                strokeWidth="2"
                strokeLinecap="square"
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="5"
                stroke="var(--riso-primary)"
                strokeWidth="1.5"
                opacity="0.4"
              />
            </svg>

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[14px] text-[var(--riso-overlap,#7b4f7a)]"
            />

            <kbd className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase text-[var(--riso-secondary)] opacity-60">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-[calc(60vh-54px)]">
            {filtered.length === 0 ? (
              <div className="px-4 py-5 text-center font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[10px] uppercase tracking-[0.12em] text-[var(--riso-secondary)] opacity-60">
                No results
              </div>
            ) : (
              Array.from(grouped.entries()).map(([cat, catItems]) => (
                <div key={cat}>
                  {cat && (
                    <div className="px-4 pt-2 pb-1 font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.2em] text-[var(--riso-secondary)] border-b border-[color-mix(in_srgb,var(--riso-secondary)_30%,transparent)] mb-0.5">
                      {cat}
                    </div>
                  )}
                  {catItems.map((item) => {
                    flatIdx++;
                    const iIdx = flatIdx;
                    const isActive = iIdx === activeIdx;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          item.onSelect?.();
                          onClose();
                        }}
                        onMouseEnter={() => setActiveIdx(iIdx)}
                        className={`px-4 py-[9px] cursor-pointer relative transition-colors duration-[80ms] ${isActive ? "bg-[var(--riso-primary)]" : "bg-transparent"}`}
                      >
                        {/* Halftone on hover */}
                        {isActive && (
                          <div
                            aria-hidden
                            className="absolute inset-0 [background-image:radial-gradient(circle,rgba(255,255,255,.15)_1px,transparent_0)] [background-size:3px_3px] pointer-events-none"
                          />
                        )}
                        <div className="relative">
                          <p
                            className={`font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[12px] uppercase tracking-[0.08em] m-0 ${isActive ? "text-white" : "text-[var(--riso-overlap,#7b4f7a)]"}`}
                          >
                            {item.label}
                          </p>
                          {item.description && (
                            <p
                              className={`font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[11px] mt-0.5 mb-0 mx-0 ${isActive ? "text-white/75" : "text-[var(--riso-secondary)]"}`}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
