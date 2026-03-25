"use client";

import * as React from "react";
import { RisoChart } from "@/registry/riso/ui/riso-chart";

export function BasicRisoChartDemo() {
  return (
    <RisoChart
      data={[
        { label: "Primary", value: 38, ink: "primary" },
        { label: "Secondary", value: 28, ink: "secondary" },
        { label: "Overlap", value: 21, ink: "overlap" },
        { label: "Blue", value: 13 },
      ]}
    />
  );
}

export function PieRisoChartDemo() {
  return (
    <RisoChart
      donut={false}
      data={[
        { label: "Pink", value: 45, ink: "primary" },
        { label: "Teal", value: 35, ink: "secondary" },
        { label: "Other", value: 20 },
      ]}
    />
  );
}

export function NoLegendRisoChartDemo() {
  return (
    <RisoChart
      showLegend={false}
      size={160}
      data={[
        { label: "A", value: 50, ink: "primary" },
        { label: "B", value: 30, ink: "secondary" },
        { label: "C", value: 20, ink: "overlap" },
      ]}
    />
  );
}
