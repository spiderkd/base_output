"use client";

import * as React from "react";
import { InkCursor } from "@/registry/riso/ui/ink-cursor";

export function InkCursorDemo() {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Toggle */}
        <div
          onClick={() => setEnabled((e) => !e)}
          style={{
            position: "relative",
            width: 51,
            height: 27,
            background: enabled
              ? "var(--riso-primary)"
              : "var(--riso-paper,#f7f0e2)",
            outline: "2px solid var(--riso-primary)",
            flexShrink: 0,
            cursor: "pointer",
            transition: "background .18s",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              outline: "2px solid var(--riso-secondary)",
              top: 3,
              left: 3,
              opacity: 0.35,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 17,
              height: 17,
              background: enabled ? "white" : "var(--riso-secondary)",
              top: 3,
              left: 3,
              transform: enabled ? "translateX(24px)" : "none",
              transition:
                "transform .18s cubic-bezier(.4,0,.2,1), background .18s",
              zIndex: 1,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
            fontWeight: 700,
            fontSize: 11,
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            color: "var(--riso-overlap,#7b4f7a)",
          }}
        >
          {enabled ? "Ink Cursor — ON (move your mouse)" : "Ink Cursor — OFF"}
        </span>
      </div>

      {enabled && <InkCursor dotRadius={5} dotLife={800} density={12} />}

      {enabled && (
        <div
          style={{
            padding: "12px 16px",
            background:
              "color-mix(in srgb,var(--riso-secondary) 10%,transparent)",
            fontFamily: "var(--font-riso-body,'Work Sans',sans-serif)",
            fontSize: 12,
            color: "var(--riso-overlap,#7b4f7a)",
            lineHeight: 1.5,
          }}
        >
          Move your cursor over the page. Primary and secondary ink dots overlap
          to produce the third ink color via{" "}
          <code>mix-blend-mode: multiply</code>.
        </div>
      )}
    </div>
  );
}
