"use client";

import * as React from "react";
import { SidebarNav } from "@/registry/riso/ui/sidebar-nav";

export function BasicSidebarDemo() {
  const [active, setActive] = React.useState("button");
  return (
    <div style={{ width: 220 }}>
      <SidebarNav
        activeId={active}
        onSelect={setActive}
        sections={[
          {
            title: "Foundation",
            items: [
              { id: "button", label: "Button" },
              { id: "card", label: "Card" },
              { id: "badge", label: "Badge", badge: "New" },
            ],
          },
          {
            title: "Data",
            items: [
              { id: "table", label: "Table" },
              { id: "bar-chart", label: "BarChart" },
            ],
          },
        ]}
      />
    </div>
  );
}

export function BadgeSidebarDemo() {
  const [active, setActive] = React.useState("jobs");
  return (
    <div style={{ width: 220 }}>
      <SidebarNav
        activeId={active}
        onSelect={setActive}
        sections={[
          {
            title: "Workspace",
            items: [
              { id: "jobs", label: "Print Jobs", badge: 3 },
              { id: "settings", label: "Settings" },
              { id: "archive", label: "Archive", badge: "12" },
            ],
          },
        ]}
      />
    </div>
  );
}
