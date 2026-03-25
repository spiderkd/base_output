"use client";

// registry/new-york/ui/toast.tsx — Risograph Toast
//
// Visual system:
//   - Enters with a scale+bleed stamp animation (scale from 0.85, opacity 0→1)
//   - Primary/secondary/danger ink variants
//   - Auto-dismiss countdown shown as a shrinking primary fill bar at bottom
//   - Hard offset shadow in secondary color
//   - Stacks from bottom-right, each new toast shifts up

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type ToastVariant = "default" | "success" | "warning" | "danger";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const variantStyles: Record<
  ToastVariant,
  { bg: string; color: string; shadow: string }
> = {
  default: {
    bg: "var(--riso-primary)",
    color: "white",
    shadow: "var(--riso-secondary)",
  },
  success: {
    bg: "var(--riso-secondary)",
    color: "white",
    shadow: "var(--riso-primary)",
  },
  warning: {
    bg: "var(--riso-overlap,#7b4f7a)",
    color: "white",
    shadow: "var(--riso-primary)",
  },
  danger: { bg: "#e8362a", color: "white", shadow: "#1a1a1a" },
};

function ToastItem({ toast, onRemove }: ToastProps) {
  const [visible, setVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const duration = toast.duration ?? 4000;
  const { bg, color, shadow } = variantStyles[toast.variant ?? "default"];

  React.useEffect(() => {
    // Stamp-in animation
    const t = setTimeout(() => setVisible(true), 20);

    // Progress bar
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct <= 0) clearInterval(interval);
    }, 50);

    // Auto-remove
    const remove = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, duration);

    return () => {
      clearTimeout(t);
      clearTimeout(remove);
      clearInterval(interval);
    };
  }, [toast.id, duration, onRemove]);

  return (
    <div
      className="relative mb-2 min-w-[280px] max-w-[360px] transition-[transform,opacity] duration-[280ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
      style={{
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.88)",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Hard shadow */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-1 translate-y-1 opacity-50"
        style={{ background: shadow }}
      />

      {/* Toast body */}
      <div
        className="relative overflow-hidden" style={{ background: bg }}      >
        <div className="px-4 pt-3 pb-3 pr-10">
          <p
            className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[13px] uppercase tracking-[0.04em] m-0" style={{ color }}          >
            {toast.title}
          </p>
          {toast.description && (
            <p
              className="font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[11px] opacity-80 mt-[3px] mb-0 mx-0" style={{ color }}            >
              {toast.description}
            </p>
          )}
        </div>

        {/* Progress countdown bar */}
        <div className="h-[3px] bg-black/20">
          <div
            className="h-full bg-white/50 transition-[width] duration-[50ms] linear" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        aria-label="Dismiss"
        className="absolute top-2 right-2 bg-transparent border-none cursor-pointer w-6 h-6 flex items-center justify-center z-[1]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <line
            x1="1"
            y1="1"
            x2="11"
            y2="11"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="square"
          />
          <line
            x1="11"
            y1="1"
            x2="1"
            y2="11"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      </button>
    </div>
  );
}

// ── Toast Context & Provider ──────────────────────────────────────────────────

interface ToastContextType {
  toast: (item: Omit<ToastItem, "id">) => void;
}

interface ToastProviderProps extends RisoThemeProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children, theme, primary, secondary, overlap, paper, style }: ToastProviderProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...item, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            aria-label="Notifications"
            className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse"
            style={{ ...risoStyle, ...style }}
          >
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onRemove={removeToast} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}


