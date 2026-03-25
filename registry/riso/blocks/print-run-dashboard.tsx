"use client";

// registry/new-york/blocks/print-run-dashboard.tsx — Print-Run Dashboard Block ★
//
// Combines: StatCard + BarChart + Progress (×3) + Toggle (×2)
// A complete production monitoring panel.

import * as React from "react";
import { StatCard } from "@/registry/riso/ui/stat-card";
import { BarChart } from "@/registry/riso/ui/bar-chart";
import { Progress } from "@/registry/riso/ui/progress";
import { Toggle } from "@/registry/riso/ui/toggle";
import { Separator } from "@/registry/riso/ui/separator";

export function PrintRunDashboard() {
  const [grain, setGrain] = React.useState(true);
  const [misreg, setMisreg] = React.useState(true);

  return (
    <div className="bg-[var(--riso-paper,#f7f0e2)] outline  outline-[var(--riso-primary)] [filter:drop-shadow(6px_6px_0_var(--riso-secondary))] p-7 flex flex-col gap-6">
      {/* Dashboard header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.3em] text-[var(--riso-secondary)] m-0">
            JOB-0992-A · Live Monitor
          </p>
          <h2 className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[22px] uppercase text-[var(--riso-primary)] mt-1 mb-0 mx-0 [text-shadow:2px_2px_0_var(--riso-secondary)]">
            Print Run Dashboard
          </h2>
        </div>

        <div className="flex gap-4">
          {/* <Toggle size="sm" label="Grain" checked={grain} onChange={setGrain} />
          <Toggle
            size="sm"
            label="Misreg"
            checked={misreg}
            onChange={setMisreg}
          /> */}
          <Toggle
            size="sm"
            label="Grain"
            checked={grain}
            onChange={(e) => setGrain(e.target.checked)}
          />

          <Toggle
            size="sm"
            label="Misreg"
            checked={misreg}
            onChange={(e) => setMisreg(e.target.checked)}
          />
        </div>
      </div>

      <Separator />

      {/* Stat cards row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          value="9,247"
          label="Sheets Printed"
          trend={12}
          trendLabel="vs yesterday"
          sparkline={[42, 58, 51, 67, 72, 68, 80, 75, 88, 92]}
        />
        <StatCard
          value="2.1px"
          label="Avg Misreg"
          trend={-0.3}
          trendLabel="better"
          filled
        />
        <StatCard
          value="99.1%"
          label="Uptime"
          sparkline={[95, 98, 97, 99, 100, 99, 100, 99, 99, 100]}
        />
      </div>

      <Separator variant="dotted" />

      {/* Bar chart — sheets per hour */}
      <div>
        <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.15em] text-[var(--riso-secondary)] mb-3 mt-0 mx-0">
          Sheets per Hour
        </p>
        <BarChart
          width={400}
          data={[
            { label: "09:00", value: 68 },
            { label: "10:00", value: 82 },
            { label: "11:00", value: 55 },
            { label: "12:00", value: 40 },
            { label: "13:00", value: 91 },
            { label: "14:00", value: 74 },
          ]}
          height={140}
        />
      </div>

      <Separator />

      {/* Progress meters */}
      <div className="flex flex-col gap-[14px]">
        <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.15em] text-[var(--riso-secondary)] m-0">
          System Status
        </p>
        <Progress value={72} label="Print Progress" variant="default" />
        <Progress value={38} label="Ink Remaining" variant="halftone" />
        <Progress value={95} label="Registration Accuracy" variant="default" />
      </div>
    </div>
  );
}
