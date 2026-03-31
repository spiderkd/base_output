"use client";

// components/preview/PreviewContainer.tsx — Riso PreviewContainer

import { useState, type ReactNode } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";

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
  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [rotation, setRotation] = useState(0);

 

  const handleRefresh = () => {
    setPreviewKey((k) => k + 1);
    setRotation((r) => r + 360);
  };

  const handleCopy = () => {
    if (!code) return;
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        {/* Left: tabs */}
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
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Right: component name + refresh */}
        <div className="flex items-center gap-2">
          {componentName && (
            <span
              className="text-[9px] uppercase tracking-widest opacity-80"
              style={{
                fontFamily:
                  "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                color: "white",
              }}
            >
              {componentName}
            </span>
          )}

          <button
            onClick={handleRefresh}
            aria-label="Refresh preview"
            className="p-1 opacity-80 hover:opacity-100 transition-opacity"
            style={{ color: "white" }}
          >
            <RefreshCw
              className="w-3 h-3"
              style={{
                transition: "transform 0.4s ease",
                transform: `rotate(${rotation}deg)`,
              }}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      {tab === "preview" ? (
        <div
          key={previewKey}
          className="flex min-h-[140px] items-center justify-center p-10"
          style={{
            background: "var(--riso-paper, #f7f0e2)",
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E"),
              linear-gradient(var(--riso-paper, #f7f0e2), var(--riso-paper, #f7f0e2))
            `,
          }}
        >
          {children}
        </div>
      ) : (
        <div
          className="relative overflow-x-auto p-4"
          style={{ background: "#1a1a1a" }}
        >
          {/* Copy button */}
          <button
            onClick={handleCopy}
            aria-label="Copy code"
            className="absolute top-5    right-5 p-1.5 transition-colors"
            style={{
              color: copied
                ? "var(--riso-paper, #f7f0e2)"
                : "rgba(247,240,226,0.5)",
              background: "var(--riso-primary, #ff5e7e  )",
            }}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy
                className="w-3.5 h-3.5 "
                style={{ color: "var(--riso-paper)" }}
              />
            )}
          </button>

          <pre
            className="text-sm leading-relaxed pr-8"
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
      {/* {installCommand && (
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
      )} */}
    </div>
  );
}
