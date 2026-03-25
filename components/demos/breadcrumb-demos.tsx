"use client";

import * as React from "react";
import { Breadcrumb } from "@/registry/riso/ui/breadcrumb";

export function BasicBreadcrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { label: "Docs", href: "/docs" },
        { label: "Components", href: "/docs/components" },
        { label: "Breadcrumb" },
      ]}
    />
  );
}

export function CollapsedBreadcrumbDemo() {
  return (
    <Breadcrumb
      maxItems={3}
      items={[
        { label: "Home", href: "/" },
        { label: "Print Jobs", href: "/jobs" },
        { label: "2025", href: "/jobs/2025" },
        { label: "March", href: "/jobs/2025/march" },
        { label: "JOB-0992" },
      ]}
    />
  );
}

export function ClickHandlerBreadcrumbDemo() {
  const [path, setPath] = React.useState("Ink Config");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Breadcrumb
        items={[
          { label: "Dashboard", onClick: () => setPath("Dashboard") },
          { label: "Settings", onClick: () => setPath("Settings") },
          { label: path },
        ]}
      />
      <span
        style={{
          fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
          fontWeight: 700,
          fontSize: 9,
          textTransform: "uppercase" as const,
          letterSpacing: "0.12em",
          color: "var(--riso-secondary)",
        }}
      >
        Click parent items ↑
      </span>
    </div>
  );
}
