"use client";

// registry/riso/ui/install-tabs.tsx — Risograph Install Tabs
//
// Adapted from Crumble's InstallTabs — replaces all rough.js / useRough
// drawing with riso CSS-var tokens and the project's own print-aesthetic idioms:
//   • Active tab: solid primary fill, secondary hard-shadow
//   • PM sub-tabs: outline variant in secondary
//   • Command block: double-rule border (primary + secondary offset)
//   • Separator: primary 2px bar + secondary 1px offset bar (misregistration)
//
// Usage:
//   <InstallTabs slug="my-component" />
//   <InstallTabs slug="my-component" theme="blue-pink" peerDeps={["framer-motion"]} />

import * as React from "react";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";
import { ManualTab } from "./riso-manual-tab";

// ─── Types ────────────────────────────────────────────────────────────────────

type PackageManager = "npm" | "pnpm" | "bun";

export interface InstallTabsProps extends RisoThemeProps {
  files?: { path: string; content: string }[];
  peerDeps?: string[];
  slug: string;
  className?: string;
  style?: React.CSSProperties;
}

const PM_PREFIXES: Record<PackageManager, string> = {
  npm: "npx shadcn add",
  pnpm: "pnpm dlx shadcn add",
  bun: "bunx --bun shadcn add",
};

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      aria-label="Copy to clipboard"
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px 6px",
        color: "var(--riso-primary, #ff5e7e)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "opacity 120ms",
      }}
      className="hover:opacity-60"
    >
      {copied ? (
        <Check
          style={{
            width: 14,
            height: 14,
            color: "var(--riso-secondary, #00a99d)",
          }}
        />
      ) : (
        <Copy style={{ width: 14, height: 14 }} />
      )}
    </button>
  );
}

// ─── RisoSeparator ────────────────────────────────────────────────────────────
// Inline double-rule: primary 2px + secondary 1px offset (misregistration)

function RisoSeparator() {
  return (
    <div aria-hidden style={{ position: "relative", height: 7, width: "100%" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "var(--riso-primary, #ff5e7e)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--riso-secondary, #00a99d)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

// ─── RisoTab ──────────────────────────────────────────────────────────────────
// Top-level tab (CLI / Manual).
// Active: solid primary fill, white text. Inactive: transparent, primary text.
// Hard secondary shadow appears on hover (misreg plate shift).

function RisoTab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group"
      style={{
        position: "relative",
        padding: "8px 20px",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
        fontWeight: 900,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        background: active ? "var(--riso-primary, #ff5e7e)" : "transparent",
        color: active ? "white" : "var(--riso-primary, #ff5e7e)",
        transition: "background 120ms, color 120ms",
        // Active tab sits on the separator line — -mb trick via inline
        marginBottom: active ? -2 : 0,
        zIndex: active ? 1 : 0,
      }}
    >
      {/* Misreg hover shadow for inactive tabs */}
      {!active && (
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none"
          style={{
            background: "var(--riso-secondary, #00a99d)",
            transform: "translate(2px, 2px)",
            zIndex: -1,
          }}
        />
      )}
      {children}
    </button>
  );
}

// ─── RisoPmTab ────────────────────────────────────────────────────────────────
// Sub-level PM tab (npm / pnpm / bun).
// Active: outline in secondary + secondary text.
// Inactive: muted text, secondary outline on hover.

function RisoPmTab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        padding: "2px 10px",
        border: "none",
        outline: active
          ? "1.5px solid var(--riso-secondary, #00a99d)"
          : "1px solid transparent",
        cursor: "pointer",
        fontFamily: "var(--font-riso-mono, 'JetBrains Mono', monospace)",
        fontSize: 11,
        fontWeight: active ? 700 : 500,
        background: active ? "transparent" : "transparent",
        color: active
          ? "var(--riso-secondary, #00a99d)"
          : "color-mix(in srgb, var(--riso-primary, #ff5e7e) 40%, transparent)",
        transition: "all 120ms",
      }}
      className="hover:opacity-80"
    >
      {children}
    </button>
  );
}

// ─── CommandBlock ─────────────────────────────────────────────────────────────
// Box with double-rule border (primary + secondary offset = misreg print frame)

function CommandBlock({ command }: { command: string }) {
  return (
    <div
      style={{
        position: "relative",
        marginTop: 10,
        // Outer primary border
        outline: "2px solid var(--riso-primary, #ff5e7e)",
        // Secondary hard offset shadow (plate shift)
        boxShadow: "3px 3px 0 0 var(--riso-secondary, #00a99d)",
        background: "var(--riso-paper, #f7f0e2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "10px 16px",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: "var(--font-riso-mono, 'JetBrains Mono', monospace)",
            fontSize: 13,
            color: "var(--riso-overlap, #7b4f7a)",
            overflowX: "auto",
            flex: 1,
          }}
        >
          <code>{command}</code>
        </pre>
        <CopyButton text={command} />
      </div>
    </div>
  );
}

// ─── InstallTabs ──────────────────────────────────────────────────────────────

export function InstallTabs({
  files,
  peerDeps = [],
  slug,
  className,
  style,
}: InstallTabsProps) {
  const [activeTop, setActiveTop] = useState<"cli" | "manual">("cli");
  const [activePm, setActivePm] = useState<PackageManager>("npm");

  const registryUrl = `https://bydefaulthuman.fun/r/${slug}.json`;

  return (
    <div className={cn("w-full", className)} style={{ ...style }}>
      {/* ── Tab list with double-rule base separator ── */}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
          {(["cli", "manual"] as const).map((tab) => (
            <RisoTab
              key={tab}
              active={activeTop === tab}
              onClick={() => setActiveTop(tab)}
            >
              {tab === "cli" ? "CLI" : "Manual"}
            </RisoTab>
          ))}
        </div>
        {/* Double-rule separator under tabs */}
        <RisoSeparator />
      </div>

      {/* ── CLI Panel ── */}
      {activeTop === "cli" && (
        <div style={{ paddingTop: 12 }}>
          {/* PM sub-tabs row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontFamily:
                  "var(--font-riso-mono, 'JetBrains Mono', monospace)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color:
                  "color-mix(in srgb, var(--riso-secondary, #00a99d) 50%, transparent)",
              }}
            >
              package manager
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {(["npm", "pnpm", "bun"] as PackageManager[]).map((pm) => (
                <RisoPmTab
                  key={pm}
                  active={activePm === pm}
                  onClick={() => setActivePm(pm)}
                >
                  {pm}
                </RisoPmTab>
              ))}
            </div>
          </div>

          <CommandBlock command={`${PM_PREFIXES[activePm]} ${registryUrl}`} />
        </div>
      )}

      {/* ── Manual Panel ── */}
      {activeTop === "manual" && (
        <div style={{ paddingTop: 12 }}>
          <ManualTab slug={slug} peerDeps={peerDeps} files={files} />
        </div>
      )}
    </div>
  );
}
