"use client";

// registry/riso/ui/dialog.tsx — Risograph Dialog
//
// Visual system:
//   - Uses native <dialog> element for accessibility
//   - Border: 2px primary outline with secondary hard shadow
//   - On open: secondary layer animates from large offset (12px) → settled (4px)
//     simulating the ink plate snapping into rough registration
//   - Backdrop: halftone pattern overlay instead of plain grey blur
//   - Close button: X drawn as two crossing SVG lines in different ink colors
//   - Title: ghost text misreg effect

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface DialogProps extends RisoThemeProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: DialogProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [settled, setSettled] = React.useState(false);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      setSettled(false);
      // Let the large-offset layer "snap" into position
      const t = setTimeout(() => setSettled(true), 60);
      return () => clearTimeout(t);
    } else {
      setSettled(false);
      dialog.close();
    }
  }, [open]);

  // Close on backdrop click
  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <>
      <style style={{ ...risoStyle, ...style }}>{`
        dialog.riso-dialog::backdrop {
          background: transparent;
        }
        dialog.riso-dialog {
          border: none;
          padding: 0;
          background: transparent;
          max-width: min(480px, 90vw);
          width: 100%;
          outline: none;
        }
      `}</style>

      <dialog ref={dialogRef} className="riso-dialog" onClick={handleClick}>
        {/* Backdrop — halftone pattern */}
        <div
          aria-hidden
          className="fixed inset-0 [background-image:radial-gradient(circle,var(--riso-overlap,#7b4f7a)_1px,transparent_0)] [background-size:5px_5px] opacity-[0.18] pointer-events-none -z-10"
        />

        {/* Secondary ink layer — offset shadow that "snaps" on open */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--riso-secondary)] opacity-75"
          style={{
            transform: settled
              ? "translate(4px, 4px)"
              : "translate(12px, 12px)",
            transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            zIndex: 0,
          }}
        />

        {/* Dialog content */}
        <div
          className={cn(
            "relative bg-[var(--riso-paper,#f7f0e2)]  outline-2 outline-[var(--riso-primary)] p-6 z-[1]",
            className,
          )}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-3 right-3 w-7 h-7 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              {/* Primary ink X */}
              <line
                x1="2"
                y1="2"
                x2="14"
                y2="14"
                stroke="var(--riso-primary)"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <line
                x1="14"
                y1="2"
                x2="2"
                y2="14"
                stroke="var(--riso-primary)"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              {/* Secondary ink X — offset */}
              <line
                x1="3.5"
                y1="3.5"
                x2="15.5"
                y2="15.5"
                stroke="var(--riso-secondary)"
                strokeWidth="1"
                strokeLinecap="square"
                opacity="0.7"
              />
              <line
                x1="15.5"
                y1="3.5"
                x2="3.5"
                y2="15.5"
                stroke="var(--riso-secondary)"
                strokeWidth="1"
                strokeLinecap="square"
                opacity="0.7"
              />
            </svg>
          </button>

          {/* Header */}
          {(title || description) && (
            <div className="mb-4 pr-7">
              {title && (
                <h2 className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[20px] uppercase tracking-[0.03em] text-[var(--riso-primary)] m-0 leading-[1.1] [text-shadow:2px_2px_0_var(--riso-secondary)]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.15em] text-[var(--riso-secondary)] mt-1 mb-0 mx-0">
                  {description}
                </p>
              )}

              {/* Double-rule separator */}
              <div className="relative h-[7px] mt-3">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--riso-primary)]" />
                <div className="absolute top-1 left-0 right-0 h-[1px] bg-[var(--riso-secondary)] opacity-70" />
              </div>
            </div>
          )}

          {/* Body */}
          <div className="font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[13px] leading-[1.6] text-[var(--riso-overlap,#7b4f7a)]">
            {children}
          </div>
        </div>
      </dialog>
    </>
  );
}

// Trigger helper — wraps any clickable element to open the dialog
export function DialogTrigger({
  children,
  onClick,
}: {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  onClick: () => void;
}) {
  return React.cloneElement(children, { onClick });
}
