"use client";

import * as React from "react";
import { Stepper } from "@/registry/riso/ui/stepper";

const STEPS = [
  { id: "plate", label: "Plate Prep", description: "Thermal master" },
  { id: "ink", label: "Ink Load", description: "Two-drum setup" },
  { id: "align", label: "Alignment", description: "Registration" },
  { id: "print", label: "Print Run", description: "Full production" },
];

export function InteractiveStepperDemo() {
  const [current, setCurrent] = React.useState(2);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Stepper steps={STEPS} currentStep={current} />
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
          onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}
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

export function VerticalStepperDemo() {
  return (
    <Stepper
      orientation="vertical"
      currentStep={1}
      steps={[
        {
          id: "upload",
          label: "Upload Artwork",
          description: "PDF or AI file",
        },
        {
          id: "proof",
          label: "Proof Review",
          description: "Check registration",
        },
        { id: "print", label: "Print", description: "Two-pass production" },
        { id: "ship", label: "Delivery" },
      ]}
    />
  );
}
