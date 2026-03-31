"use client";

// registry/riso/ui/manual-tab.tsx — Risograph Manual Tab
//
// Adapted from Crumble's ManualTab.
// All rough.js borders replaced with:
//   • Deps section: outline + secondary drop-shadow (riso print frame)
//   • File accordion: uses the project's own <Accordion> primitive
//   • Code blocks: paper-bg surface with primary-left-border accent
//   • Skeleton: paper/primary color ramp

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";


// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileEntry {
  path: string;
  content: string;
  target?: string;
}

interface RegistryJson {
  files: FileEntry[];
}

export interface ManualTabProps extends RisoThemeProps {
  slug: string;
  peerDeps?: string[];
  files?: FileEntry[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop() ?? "";
  const map: Record<string, string> = {
    tsx: "tsx",
    ts: "typescript",
    jsx: "jsx",
    js: "javascript",
    css: "css",
    json: "json",
    md: "markdown",
    mdx: "mdx",
  };
  return map[ext] ?? "plaintext";
}

function getFilename(path: string): string {
  return path.split("/").pop() ?? path;
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      aria-label="Copy"
      onClick={handleCopy}
      className={cn("hover:opacity-60 transition-opacity", className)}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px 6px",
        color: "var(--riso-primary, #ff5e7e)",
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      {copied ? (
        <Check
          style={{
            width: 13,
            height: 13,
            color: "var(--riso-secondary, #00a99d)",
          }}
        />
      ) : (
        <Copy style={{ width: 13, height: 13 }} />
      )}
    </button>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        marginBottom: 8,
        fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        color: "var(--riso-secondary, #00a99d)",
      }}
    >
      {children}
    </p>
  );
}

// ─── DepsSection ──────────────────────────────────────────────────────────────
// Riso-print-frame box: primary outline + secondary hard shadow.

function DepsSection({ peerDeps }: { peerDeps: string[] }) {
  const allDeps = ["roughjs", ...peerDeps].filter(
    (dep, idx, arr) => arr.indexOf(dep) === idx,
  );

  return (
    <div style={{ marginBottom: 20 }}>
      <SectionLabel>Dependencies</SectionLabel>
      <div
        style={{
          position: "relative",
          padding: "10px 16px",
          outline: "2px solid var(--riso-primary, #ff5e7e)",
          boxShadow: "3px 3px 0 0 var(--riso-secondary, #00a99d)",
          background: "var(--riso-paper, #f7f0e2)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
          }}
        >
          {allDeps.map((dep) => (
            <code
              key={dep}
              style={{
                fontFamily:
                  "var(--font-riso-mono, 'JetBrains Mono', monospace)",
                fontSize: 12,
                color: "var(--riso-overlap, #7b4f7a)",
                padding: "1px 6px",
                outline: "1px solid var(--riso-secondary, #00a99d)",
                background:
                  "color-mix(in srgb, var(--riso-secondary, #00a99d) 8%, transparent)",
              }}
            >
              {dep}
            </code>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HighlightedCode ──────────────────────────────────────────────────────────
// Falls back to plain monospace while Shiki hydrates.

function HighlightedCode({
  content,
  language,
}: {
  content: string;
  language: string;
}) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Dynamically import shiki only if available
    import("shiki")
      .then(({ codeToHtml }) => {
        const isDark = document.documentElement.classList.contains("dark");
        return codeToHtml(content, {
          lang: language,
          theme: isDark ? "github-dark" : "github-light",
        });
      })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        // shiki not available — plain fallback
      });

    return () => {
      cancelled = true;
    };
  }, [content, language]);

  if (html === null) {
    return (
      <pre
        style={{
          overflowX: "auto",
          padding: "14px 16px",
          margin: 0,
          fontFamily: "var(--font-riso-mono, 'JetBrains Mono', monospace)",
          fontSize: 12,
          lineHeight: 1.7,
          color: "var(--riso-overlap, #7b4f7a)",
        }}
      >
        <code>{content}</code>
      </pre>
    );
  }

  return (
    <div
      style={{ overflow: "hidden" }}
      className="[&>pre]:overflow-x-auto [&>pre]:p-4 [&>pre]:font-mono [&>pre]:text-xs [&>pre]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ─── FileAccordionItem ────────────────────────────────────────────────────────
// Renders a single file as an accordion item usable with the riso Accordion.

export function FileAccordionItem({
  file,
  isOpen,
  onToggle,
}: {
  file: FileEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const filename = getFilename(file.path);
  const language = getLanguageFromPath(file.path);

  return (
    <div>
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full group"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "11px 14px",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          background: isOpen ? "var(--riso-primary, #ff5e7e)" : "transparent",
          color: isOpen ? "white" : "var(--riso-primary, #ff5e7e)",
          fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
          fontWeight: 900,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          position: "relative",
          transition: "background 150ms, color 150ms",
        }}
      >
        {/* Hover misreg shadow for closed items */}
        {!isOpen && (
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
        <span
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            minWidth: 0,
          }}
        >
          <span style={{ flexShrink: 0 }}>{filename}</span>
          <span
            style={{
              fontFamily: "var(--font-riso-mono, 'JetBrains Mono', monospace)",
              fontSize: 10,
              fontWeight: 400,
              textTransform: "none",
              letterSpacing: 0,
              opacity: 0.65,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            className="hidden sm:block"
          >
            {file.target ?? file.path}
          </span>
        </span>

        {/* Riso chevron */}
        <svg
          width="18"
          height="11"
          viewBox="0 0 20 12"
          fill="none"
          aria-hidden
          style={{
            flexShrink: 0,
            transition: "transform 200ms",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <line
            x1="2"
            y1="2"
            x2="10"
            y2="10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
          <line
            x1="10"
            y1="10"
            x2="18"
            y2="2"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
          <line
            x1="3.5"
            y1="3.5"
            x2="11.5"
            y2="11.5"
            stroke="var(--riso-secondary, #00a99d)"
            strokeWidth="1"
            strokeLinecap="square"
            opacity="0.7"
          />
          <line
            x1="11.5"
            y1="11.5"
            x2="19.5"
            y2="3.5"
            stroke="var(--riso-secondary, #00a99d)"
            strokeWidth="1"
            strokeLinecap="square"
            opacity="0.7"
          />
        </svg>
      </button>

      {/* Content panel — max-height collapse */}
      <div
        role="region"
        aria-hidden={!isOpen}
        style={{
          maxHeight: isOpen ? 600 : 0,
          overflow: "hidden",
          transition: "max-height 250ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            position: "relative",
            background: "var(--riso-paper, #f7f0e2)",
            borderLeft: "3px solid var(--riso-secondary, #00a99d)",
          }}
        >
          {/* Halftone dot texture overlay */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, var(--riso-secondary, #00a99d) 1px, transparent 0)",
              backgroundSize: "5px 5px",
              opacity: 0.06,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            {/* File path + copy */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 14px 0",
                gap: 8,
              }}
            >
              <code
                style={{
                  fontFamily:
                    "var(--font-riso-mono, 'JetBrains Mono', monospace)",
                  fontSize: 11,
                  color: "var(--riso-overlap, #7b4f7a)",
                  opacity: 0.7,
                  wordBreak: "break-all",
                }}
              >
                {file.target ?? file.path}
              </code>
              <CopyButton text={file.content} />
            </div>
            <HighlightedCode content={file.content} language={language} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SkeletonLoader ───────────────────────────────────────────────────────────

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-1.5" aria-label="Loading files...">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 44,
            background:
              "color-mix(in srgb, var(--riso-primary, #ff5e7e) 12%, var(--riso-paper, #f7f0e2))",
            opacity: 1 - i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// ─── ManualTab ────────────────────────────────────────────────────────────────

export function ManualTab({
  slug,
  peerDeps = [],
  files: filesProp,
  theme,
  primary,
  secondary,
  overlap,
  paper,
}: ManualTabProps) {
  const [files, setFiles] = useState<FileEntry[]>(filesProp ?? []);
  const [loading, setLoading] = useState(!filesProp);
  const [error, setError] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Fetch base files when filesProp is provided
  useEffect(() => {
    if (!filesProp) return;
    let cancelled = false;
    Promise.all(
      (["rough-lib", "use-rough"] as const).map((s) =>
        fetch(`${window.location.origin}/r/${s}.json`).then(
          (r) => r.json() as Promise<RegistryJson>,
        ),
      ),
    )
      .then((datas) => {
        if (cancelled) return;
        const baseFiles = datas.flatMap((d) => d.files ?? []);
        setFiles([...filesProp, ...baseFiles]);
      })
      .catch(() => {
        if (!cancelled) setFiles(filesProp);
      });
    return () => {
      cancelled = true;
    };
  }, [filesProp]);

  // Fetch all files when no filesProp
  useEffect(() => {
    if (filesProp) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchRegistry = (s: string) =>
      fetch(`${window.location.origin}/r/${s}.json`).then((res) => {
        if (!res.ok) throw new Error(`Registry fetch failed: ${res.status}`);
        return res.json() as Promise<RegistryJson>;
      });

    Promise.all([fetchRegistry(slug), fetchRegistry("riso-utils")])
      .then(([componentData, ...baseDatas]) => {
        if (cancelled) return;
        const baseFiles = baseDatas.flatMap((d) => d.files ?? []);
        setFiles([...(componentData.files ?? []), ...baseFiles]);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, filesProp]);

  return (
    <div style={risoStyle}>
      {/* Dependencies */}
      {peerDeps.length > 0 && <DepsSection peerDeps={peerDeps} />}

      {/* Files */}
      <div>
        <SectionLabel>Files</SectionLabel>

        {loading && <SkeletonLoader />}

        {!loading && error && (
          <div
            style={{
              padding: "12px 16px",
              outline: "1.5px solid var(--riso-primary, #ff5e7e)",
              fontSize: 13,
              color: "var(--riso-overlap, #7b4f7a)",
              fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
            }}
          >
            <p style={{ margin: "0 0 4px" }}>
              Could not load files automatically.
            </p>
            <a
              href={`${window.location.origin}/r/${slug}.json`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--riso-primary, #ff5e7e)",
                textDecoration: "underline",
                fontWeight: 700,
              }}
            >
              Open registry JSON →
            </a>
          </div>
        )}

        {!loading && !error && files.length > 0 && (
          <div>
            {files.map((file, index) => (
              <React.Fragment key={file.path}>
                {/* Double-rule separator between items */}
                {index > 0 && (
                  <div aria-hidden style={{ position: "relative", height: 7 }}>
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
                )}
                <FileAccordionItem
                  file={file}
                  isOpen={openItems.has(index)}
                  onToggle={() => toggleItem(index)}
                />
              </React.Fragment>
            ))}
          </div>
        )}

        {!loading && !error && files.length === 0 && (
          <p
            style={{
              fontSize: 13,
              color: "var(--riso-overlap, #7b4f7a)",
              fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
            }}
          >
            No files found.
          </p>
        )}
      </div>
    </div>
  );
}
