"use client";

// registry/riso/ui/misreg-text-reveal.tsx — Risograph Misregistration Text Reveal ★
//
// Visual system:
//   - Two-layer animated headline
//   - Primary text slides in from left at t=0
//   - Secondary ghost layer follows 80ms later, settles to 2px right/down
//   - On hover: layers briefly separate further (plate misalignment) then snap back
//   - Works for any heading size
//   - Can be triggered by scroll intersection or always-on

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface MisregTextRevealProps extends RisoThemeProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  size?: number;
  animateOnMount?: boolean; // if false, only plays on intersection
  className?: string;
  style?: React.CSSProperties;
}

export function MisregTextReveal({
  text,
  as: Tag = "h2",
  size = 36,
  animateOnMount = true,
  className,
  style,
  theme,
  primary,
  secondary,
  overlap,
  paper,
}: MisregTextRevealProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [phase, setPhase] = React.useState<
    "idle" | "primary-in" | "settled" | "hover"
  >(animateOnMount ? "idle" : "settled");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Trigger animation on mount / intersection
  React.useEffect(() => {
    if (!animateOnMount) return;

    if (!("IntersectionObserver" in window)) {
      setPhase("settled");
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("primary-in");
          const t = setTimeout(() => setPhase("settled"), 480);
          obs.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [animateOnMount]);

  const primaryTransform = {
    idle: "translateX(-24px)",
    "primary-in": "translateX(0)",
    settled: "translateX(0)",
    hover: "translateX(0)",
  }[phase];

  const primaryOpacity = phase === "idle" ? 0 : 1;

  const ghostTransform = {
    idle: "translateX(-24px)",
    "primary-in": "translateX(6px) translateY(6px)", // overshoots
    settled: "translateX(2px) translateY(2px)", // normal misreg
    hover: "translateX(6px) translateY(4px)", // exaggerated on hover
  }[phase];

  const ghostOpacity = {
    idle: 0,
    "primary-in": 0,
    settled: 0.42,
    hover: 0.55,
  }[phase];

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", className)}
      style={{ ...risoStyle, ...style }}
      onMouseEnter={() => phase === "settled" && setPhase("hover")}
      onMouseLeave={() => phase === "hover" && setPhase("settled")}
    >
      {/* Ghost / secondary layer */}
      <Tag
        aria-hidden
        className="absolute top-0 left-0 font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black uppercase tracking-[0.04em] leading-[1.1] text-[var(--riso-secondary)] select-none pointer-events-none whitespace-nowrap"
        style={{
          fontSize: size,
          opacity: ghostOpacity,
          transform: ghostTransform,
          transition:
            phase === "primary-in"
              ? "transform 400ms cubic-bezier(0.22,1,0.36,1) 80ms, opacity 300ms 80ms"
              : "transform 300ms cubic-bezier(0.22,1,0.36,1), opacity 200ms",
        }}
      >
        {text}
      </Tag>

      {/* Primary layer */}
      <Tag
        className="relative font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black uppercase tracking-[0.04em] leading-[1.1] text-[var(--riso-primary)] m-0 whitespace-nowrap"
        style={{
          fontSize: size,
          opacity: primaryOpacity,
          transform: primaryTransform,
          transition:
            "transform 400ms cubic-bezier(0.22,1,0.36,1), opacity 300ms",
        }}
      >
        {text}
      </Tag>
    </div>
  );
}
