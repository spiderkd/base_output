"use client";

import * as React from "react";
import { Countdown } from "@/registry/riso/ui/countdown";
import { Progress } from "@/registry/riso/ui/progress";
import { Timeline } from "@/registry/riso/ui/timeline";

// ─────────────────────────────────────────────
// COUNTDOWN DEMOS
// ─────────────────────────────────────────────

/** Default: 90-second live countdown */
export function CountdownDefaultDemo() {
  const [seconds, setSeconds] = React.useState(90);
  const [done, setDone] = React.useState(false);

  // Reset when it hits zero so preview stays useful
  React.useEffect(() => {
    if (done) {
      const t = setTimeout(() => {
        setSeconds(90);
        setDone(false);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <Countdown
        key={seconds + String(done)}
        seconds={seconds}
        onComplete={() => setDone(true)}
      />
      {done && (
        <span
          style={{
            fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--riso-secondary)",
          }}
        >
          ✦ Print run complete — resetting…
        </span>
      )}
    </div>
  );
}

/** Interactive: user sets the start duration */
export function CountdownInteractiveDemo() {
  const PRESETS = [30, 60, 300, 3600] as const;
  const [seconds, setSeconds] = React.useState(60);
  const [key, setKey] = React.useState(0);

  const restart = (s: number) => {
    setSeconds(s);
    setKey((k) => k + 1);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      <Countdown key={key} seconds={seconds} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PRESETS.map((s) => (
          <button
            key={s}
            onClick={() => restart(s)}
            style={{
              fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
              fontWeight: 700,
              fontSize: 9,
              textTransform: "uppercase" as const,
              letterSpacing: "0.12em",
              padding: "6px 12px",
              background: seconds === s ? "var(--riso-primary)" : "transparent",
              color: seconds === s ? "white" : "var(--riso-primary)",
              outline: "2px solid var(--riso-primary)",
              border: "none",
              cursor: "pointer",
              filter:
                seconds === s
                  ? "drop-shadow(3px 3px 0 var(--riso-secondary))"
                  : "none",
              transition: "all 180ms",
            }}
          >
            {s < 60 ? `${s}s` : s < 3600 ? `${s / 60}m` : "1h"}
          </button>
        ))}
      </div>
    </div>
  );
}

/** No labels variant */
export function CountdownNoLabelsDemo() {
  return <Countdown seconds={45} showLabels={false} />;
}

// ─────────────────────────────────────────────
// PROGRESS DEMOS
// ─────────────────────────────────────────────

/** Animated: auto-increments from 0 → 100 */
export function ProgressAnimatedDemo() {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (value >= 100) return;
    const t = setTimeout(() => setValue((v) => Math.min(100, v + 1)), 30);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <Progress value={value} label="Ink Coverage" />
    </div>
  );
}

/** Interactive: scrub the value with a slider */
export function ProgressInteractiveDemo() {
  const [value, setValue] = React.useState(42);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <Progress value={value} label="Print Density" />
      <Progress value={value} label="Ink Coverage" variant="halftone" />
      <Progress value={value} label="Ink Bleed" variant="ink-bleed" />

      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{
          accentColor: "var(--riso-primary)",
          width: "100%",
          cursor: "pointer",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
          fontWeight: 700,
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "var(--riso-secondary)",
        }}
      >
        Drag slider to compare variants
      </span>
    </div>
  );
}

/** All three variants stacked at fixed values */
export function ProgressVariantsDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        maxWidth: 380,
      }}
    >
      <Progress value={72} label="Default" variant="default" />
      <Progress value={55} label="Halftone" variant="halftone" />
      <Progress value={88} label="Ink Bleed" variant="ink-bleed" />
    </div>
  );
}

// ─────────────────────────────────────────────
// TIMELINE DEMOS
// ─────────────────────────────────────────────

const PRINT_RUN_ITEMS = [
  {
    id: "1",
    label: "Artwork Approved",
    date: "Mon 09:00",
    status: "complete" as const,
    content: "Final PDF confirmed by client",
  },
  {
    id: "2",
    label: "Plates Burned",
    date: "Mon 11:30",
    status: "complete" as const,
    content: "Thermal masters — primary & secondary",
  },
  {
    id: "3",
    label: "Print Running",
    date: "Tue 08:00",
    status: "current" as const,
    content: "Pass 1 of 2 — primary ink",
  },
  {
    id: "4",
    label: "QA Inspection",
    date: "Tue 14:00",
    status: "upcoming" as const,
  },
  {
    id: "5",
    label: "Delivery",
    date: "Wed 16:00",
    status: "upcoming" as const,
  },
];

/** Default static timeline */
export function TimelineDefaultDemo() {
  return <Timeline items={PRINT_RUN_ITEMS} />;
}

/** Animated: items reveal one-by-one on mount */
export function TimelineAnimatedDemo() {
  const [visible, setVisible] = React.useState(0);

  React.useEffect(() => {
    if (visible >= PRINT_RUN_ITEMS.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 350);
    return () => clearTimeout(t);
  }, [visible]);

  const restart = () => setVisible(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {PRINT_RUN_ITEMS.slice(0, visible).map((item, idx) => (
          <div
            key={item.id}
            style={{
              opacity: 1,
              transform: "translateX(0)",
              transition:
                "opacity 300ms ease, transform 300ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <Timeline
              items={[item]}
              style={{ marginBottom: idx < visible - 1 ? 0 : undefined }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={restart}
        style={{
          fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
          fontWeight: 700,
          fontSize: 9,
          textTransform: "uppercase" as const,
          letterSpacing: "0.12em",
          padding: "6px 14px",
          background: "transparent",
          outline: "2px solid var(--riso-secondary)",
          border: "none",
          cursor: "pointer",
          color: "var(--riso-primary)",
        }}
      >
        ↺ Replay
      </button>
    </div>
  );
}

/** Interactive: advance / rewind the active step */
export function TimelineInteractiveDemo() {
  const BASE_ITEMS = [
    {
      id: "design",
      label: "Design",
      date: "Day 1",
      content: "Artwork finalised",
    },
    { id: "plates", label: "Plates", date: "Day 2", content: "Masters burned" },
    { id: "pass1", label: "Pass 1", date: "Day 3", content: "Primary ink" },
    { id: "pass2", label: "Pass 2", date: "Day 4", content: "Secondary ink" },
    { id: "finish", label: "Finished", date: "Day 5" },
  ];

  const [current, setCurrent] = React.useState(2);

  const items = BASE_ITEMS.map((item, idx) => ({
    ...item,
    status: (idx < current
      ? "complete"
      : idx === current
        ? "current"
        : "upcoming") as "complete" | "current" | "upcoming",
  }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "flex-start",
      }}
    >
      <Timeline items={items} />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          style={{
            fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase" as const,
            letterSpacing: "0.12em",
            padding: "6px 12px",
            background: "transparent",
            outline: "2px solid var(--riso-secondary)",
            border: "none",
            cursor: "pointer",
            color: "var(--riso-primary)",
          }}
        >
          ← Prev
        </button>
        <button
          onClick={() =>
            setCurrent((c) => Math.min(BASE_ITEMS.length - 1, c + 1))
          }
          style={{
            fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase" as const,
            letterSpacing: "0.12em",
            padding: "6px 12px",
            background: "var(--riso-primary)",
            border: "none",
            cursor: "pointer",
            color: "white",
            filter: "drop-shadow(3px 3px 0 var(--riso-secondary))",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
