"use client";

// registry/riso/blocks/analytics-panel.tsx — Analytics Panel Block ★
//
// Combines: Tabs (×3 views) + RisoChart + Timeline + StatCard (×2) + Badge

import * as React from "react";
import { Tabs } from "@/components/riso/ui/tabs";
import { RisoChart } from "@/components/riso/ui/riso-chart";
import { Timeline } from "@/components/riso/ui/timeline";
import { StatCard } from "@/components/riso/ui/stat-card";
import { Badge } from "@/components/riso/ui/badge";
import { Separator } from "@/components/riso/ui/separator";

const overviewContent = (
  <div className="flex flex-col gap-5">
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        value="847"
        label="Total Jobs"
        trend={18}
        sparkline={[20, 35, 28, 44, 38, 52, 48, 60, 55, 72]}
      />
      <StatCard value="99.1%" label="Accuracy" trend={0.4} filled />
    </div>
    <Separator />
    <RisoChart
      data={[
        { label: "Primary", value: 38, ink: "primary" },
        { label: "Secondary", value: 28, ink: "secondary" },
        { label: "Overlap", value: 21, ink: "overlap" },
        { label: "Custom", value: 13 },
      ]}
      size={180}
    />
  </div>
);

const activityContent = (
  <Timeline
    items={[
      {
        id: "1",
        label: "Job JOB-0992 completed",
        date: "14:22",
        status: "complete",
        content: "847 sheets · Pink/Teal · 99.2% accuracy",
      },
      {
        id: "2",
        label: "Drum maintenance",
        date: "12:00",
        status: "complete",
        content: "Secondary drum cleaned and re-inked",
      },
      {
        id: "3",
        label: "JOB-0993 in progress",
        date: "14:30",
        status: "current",
        content: "Estimated 2h 15m remaining",
      },
      {
        id: "4",
        label: "Scheduled calibration",
        date: "17:00",
        status: "upcoming",
        content: "Full plate alignment check",
      },
    ]}
  />
);

const statusContent = (
  <div className="flex flex-col gap-3">
    {[
      {
        label: "Print Engine",
        status: "approved" as const,
        note: "Running at 98% capacity",
      },
      {
        label: "Drum System",
        status: "approved" as const,
        note: "Both drums loaded",
      },
      {
        label: "Paper Feed",
        status: "pending" as const,
        note: "Jam detected at tray 2",
      },
      {
        label: "Ink Supply",
        status: "approved" as const,
        note: "Primary: 72% · Secondary: 38%",
      },
    ].map(({ label, status, note }) => (
      <div
        key={label}
        className="flex items-center justify-between px-[14px] py-[10px] bg-[var(--riso-paper,#f7f0e2)] outline  outline-[color-mix(in_srgb,var(--riso-primary)_25%,transparent)]"
      >
        <div>
          <p className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[13px] uppercase text-[var(--riso-primary)] m-0">
            {label}
          </p>
          <p className="font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[11px] text-[var(--riso-secondary)] mt-0.5 mb-0 mx-0">
            {note}
          </p>
        </div>
        <Badge variant={status === "approved" ? "secondary" : "stamp"}>
          {status === "approved" ? "OK" : "Alert"}
        </Badge>
      </div>
    ))}
  </div>
);

export function AnalyticsPanel() {
  return (
    <div className="bg-[var(--riso-paper,#f7f0e2)] outline  outline-[var(--riso-primary)] [filter:drop-shadow(6px_6px_0_var(--riso-secondary))] p-6 max-w-[520px]">
      {/* Header */}
      <div className="mb-5 flex justify-between items-end">
        <div>
          <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.28em] text-[var(--riso-secondary)] m-0">
            Live · Updated 30s ago
          </p>
          <h2 className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[20px] uppercase text-[var(--riso-primary)] mt-1 mb-0 mx-0 [text-shadow:2px_2px_0_var(--riso-secondary)]">
            Analytics Panel
          </h2>
        </div>
        <Badge variant="overprint">Live</Badge>
      </div>

      <Tabs
        tabs={[
          { value: "overview", label: "Overview", content: overviewContent },
          { value: "activity", label: "Activity", content: activityContent },
          { value: "status", label: "Status", content: statusContent },
        ]}
        defaultValue="overview"
      />
    </div>
  );
}
