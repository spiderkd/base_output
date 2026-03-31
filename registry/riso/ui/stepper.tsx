"use client";

// registry/riso/ui/stepper.tsx — Risograph Steps / Stepper
//
// Visual system:
//   - Completed steps: Stamp-approved style (filled primary circle, white checkmark)
//   - Current step: primary outline circle with secondary shadow
//   - Future steps: dashed outline circle (upcoming, lighter)
//   - Connector line: double-rule, solid for complete sections, dashed for upcoming
//   - Step labels: uppercase print style

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

type StepStatus = "complete" | "current" | "upcoming";

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps extends RisoThemeProps {
  steps: Step[];
  currentStep: number; // 0-based index
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

function StepNode({ status, number }: { status: StepStatus; number: number }) {
  return (
    <div className="relative w-8 h-8 shrink-0">
      {/* Shadow */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden
        className="absolute top-0 left-0"
      >
        <circle
          cx="17.5"
          cy="17.5"
          r="13"
          fill={status === "complete" ? "var(--riso-secondary)" : "none"}
          stroke={status !== "complete" ? "var(--riso-secondary)" : "none"}
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>

      {/* Main circle */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden
        className="relative"
      >
        <circle
          cx="15"
          cy="15"
          r="13"
          fill={
            status === "complete"
              ? "var(--riso-primary)"
              : "var(--riso-paper,#f7f0e2)"
          }
          stroke="var(--riso-primary)"
          strokeWidth={status === "current" ? 2.5 : 2}
          strokeDasharray={status === "upcoming" ? "3 2.5" : "none"}
          strokeOpacity={status === "upcoming" ? 0.5 : 1}
        />

        {status === "complete" ? (
          <polyline
            points="8,15 13,20 22,9"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
        ) : (
          <text
            x="15"
            y="15"
            textAnchor="middle"
            dominantBaseline="central"
            fill={
              status === "current"
                ? "var(--riso-primary)"
                : "color-mix(in srgb,var(--riso-primary) 50%,transparent)"
            }
            fontSize="10"
            fontFamily="var(--font-riso-label,'Space Grotesk',sans-serif)"
            fontWeight="700"
          >
            {number}
          </text>
        )}
      </svg>
    </div>
  );
}

function ConnectorLine({
  complete,
  orientation,
}: {
  complete: boolean;
  orientation: "horizontal" | "vertical";
}) {
  const isH = orientation === "horizontal";
  return (
    <div
      className={cn(
        "relative self-start",
        isH ? "flex-1 mt-[15px] ml-0" : "h-8 ml-[15px]",
      )}
    >
      {/* Primary line */}
      <div
        className={cn(
          "absolute bg-[var(--riso-primary)]",
          complete ? "opacity-100" : "opacity-35",
          isH
            ? "top-0 left-1 right-1 h-[2px]"
            : "left-0 top-1 bottom-1 w-[2px]",
          !complete &&
            isH &&
            "border-t-2 border-dashed border-[var(--riso-primary)] bg-transparent",
          !complete &&
            !isH &&
            "border-l-2 border-dashed border-[var(--riso-primary)] bg-transparent",
        )}
      />
      {/* Secondary offset line */}
      <div
        className={cn(
          "absolute bg-[var(--riso-secondary)]",
          complete ? "opacity-60" : "opacity-20",
          isH
            ? "top-[3px] left-1 right-1 h-[1px]"
            : "left-1 top-1 bottom-1 w-[1px]",
        )}
      />
    </div>
  );
}

export function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
  className,
  theme,
  primary,
  secondary,
  overlap,
  paper,
  style,
}: StepperProps) {
  const risoStyle = resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const isH = orientation === "horizontal";

  return (
    <div
      className={cn(
        "flex gap-0",
        isH ? "flex-row items-start" : "flex-col items-stretch",
        className,
      )}
      style={{ ...risoStyle, ...style }}
    >
      {steps.map((step, idx) => {
        const status: StepStatus =
          idx < currentStep
            ? "complete"
            : idx === currentStep
              ? "current"
              : "upcoming";

        return (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div
              className={cn(
                "flex shrink-0",
                isH
                  ? "flex-col items-center gap-1.5 min-w-[80px]"
                  : "flex-row items-start gap-3",
              )}
            >
              <StepNode status={status} number={idx + 1} />

              <div className={isH ? "text-center pt-0" : "text-left pt-1.5"}>
                <p
                  className={cn(
                    "font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.12em] m-0",
                    status === "current" && "text-[var(--riso-primary)]",
                    status === "complete" && "text-[var(--riso-secondary)]",
                    status === "upcoming" &&
                      "text-[color-mix(in_srgb,var(--riso-primary)_45%,transparent)]",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[10px] text-[var(--riso-secondary)] opacity-70 mt-0.5 mb-0 mx-0">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector (not after last step) */}
            {idx < steps.length - 1 && (
              <ConnectorLine
                complete={idx < currentStep}
                orientation={orientation}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
