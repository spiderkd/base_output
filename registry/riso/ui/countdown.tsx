"use client";

// registry/riso/ui/countdown.tsx — Two-Color Countdown Timer ★
//
// Visual system:
//   - Digits drawn in two SVG layers (primary large, secondary smaller/offset)
//   - Digit transition: "plate swap" animation
//     - Primary exits downward, new primary enters from above
//     - Secondary layer lags behind giving the misreg illusion
//   - Colon separator: double-rule style (two vertical lines)
//   - Units label: uppercase print label below each digit pair

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface CountdownProps extends RisoThemeProps {
  targetDate?: Date;
  seconds?: number; // alternative: total seconds
  onComplete?: () => void;
  showLabels?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function pad2(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

interface DigitProps {
  value: string;
  prevValue: string;
  animKey: number;
}

function DigitPair({ value, prevValue, animKey }: DigitProps) {
  const [transitioning, setTransitioning] = React.useState(false);
  const [displayValue, setDisplayValue] = React.useState(value);
  const prevRef = React.useRef(prevValue);

  React.useEffect(() => {
    if (value !== prevRef.current) {
      setTransitioning(true);
      const t = setTimeout(() => {
        setDisplayValue(value);
        prevRef.current = value;
        setTransitioning(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [value, animKey]);

  const enterY = transitioning ? "-100%" : "0%";
  const exitY = transitioning ? "20%" : "0%";

  return (
    <div className="relative w-[72px] h-[88px] overflow-hidden bg-[var(--riso-paper,#f7f0e2)] outline-2 outline-[var(--riso-primary)] [filter:drop-shadow(4px_4px_0_var(--riso-secondary))]">
      {/* Secondary ghost digit — lags behind */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(3px, 3px) translateY(${transitioning ? "10%" : "0%"})`,
          transition: "transform 280ms cubic-bezier(0.22,1,0.36,1) 60ms",
          pointerEvents: "none",
        }}
      >
        <span className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[52px] text-[var(--riso-secondary)] opacity-45 leading-none select-none">
          {transitioning ? prevRef.current : displayValue}
        </span>
      </div>

      {/* Primary digit */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${enterY})`,
          transition: transitioning
            ? "transform 220ms cubic-bezier(0.22,1,0.36,1)"
            : "none",
        }}
      >
        <span className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[52px] text-[var(--riso-primary)] leading-none select-none">
          {displayValue}
        </span>
      </div>
    </div>
  );
}

function DoubleSeparator() {
  return (
    <div className="flex flex-col items-center justify-center gap-[14px] w-5 pb-5">
      {[0, 1].map((i) => (
        <div key={i} className="relative w-[6px] h-[8px]">
          <div className="absolute top-0 left-0 w-[6px] h-[6px] bg-[var(--riso-primary)]" />
          <div className="absolute top-0.5 left-0.5 w-[6px] h-[6px] bg-[var(--riso-secondary)] opacity-55" />
        </div>
      ))}
    </div>
  );
}

export function Countdown({
  targetDate,
  seconds: initialSeconds,
  onComplete,
  showLabels = true,
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: CountdownProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const calcRemaining = React.useCallback((): number => {
    if (targetDate) {
      return Math.max(
        0,
        Math.floor((targetDate.getTime() - Date.now()) / 1000),
      );
    }
    return initialSeconds ?? 0;
  }, [targetDate, initialSeconds]);

  const [remaining, setRemaining] = React.useState(calcRemaining);
  const [tick, setTick] = React.useState(0);
  const prevRef = React.useRef({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const days = pad2(Math.floor(remaining / 86400));
  const hours = pad2(Math.floor((remaining % 86400) / 3600));
  const minutes = pad2(Math.floor((remaining % 3600) / 60));
  const secs = pad2(remaining % 60);

  React.useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    const id = setInterval(() => {
      prevRef.current = { days, hours, minutes, seconds: secs };
      setRemaining(calcRemaining());
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [remaining, calcRemaining, onComplete, days, hours, minutes, secs]);

  const showDays = remaining >= 86400;

  const segments = [
    ...(showDays
      ? [{ value: days, prev: prevRef.current.days, label: "Days" }]
      : []),
    { value: hours, prev: prevRef.current.hours, label: "Hours" },
    { value: minutes, prev: prevRef.current.minutes, label: "Min" },
    { value: secs, prev: prevRef.current.seconds, label: "Sec" },
  ];

  return (
    <div
      className={cn("inline-flex flex-col gap-2", className)}
      style={{ ...risoStyle, ...style }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {segments.map((seg, idx) => (
          <React.Fragment key={seg.label}>
            <div className="flex flex-col items-center gap-1.5">
              <DigitPair
                value={seg.value}
                prevValue={seg.prev}
                animKey={tick}
              />
              {showLabels && (
                <span className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.2em] text-[var(--riso-secondary)]">
                  {seg.label}
                </span>
              )}
            </div>
            {idx < segments.length - 1 && <DoubleSeparator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
