"use client";

import * as React from "react";
import { CommandPalette } from "@/registry/riso/ui/command-palette";
import { Button } from "@/registry/riso/ui/button";

const ITEMS = [
  {
    id: "new",
    label: "New Print Job",
    description: "Create a new job",
    category: "Jobs",
  },
  {
    id: "queue",
    label: "View Queue",
    description: "See all pending jobs",
    category: "Jobs",
  },
  {
    id: "docs",
    label: "Documentation",
    description: "Browse component docs",
    category: "Navigate",
  },
  {
    id: "showcase",
    label: "View Showcase",
    description: "Open component gallery",
    category: "Navigate",
  },
  {
    id: "theme",
    label: "Change Theme",
    description: "Switch ink combination",
    category: "Settings",
  },
  {
    id: "grain",
    label: "Toggle Grain",
    description: "Enable/disable grain",
    category: "Settings",
    keywords: ["texture", "filter"],
  },
];

export function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        Open Command Palette
      </Button>
      <span
        style={{
          fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
          fontWeight: 700,
          fontSize: 9,
          textTransform: "uppercase" as const,
          letterSpacing: "0.15em",
          color: "var(--riso-secondary)",
          opacity: 0.7,
        }}
      >
        or ⌘K
      </span>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={ITEMS.map((item) => ({
          ...item,
          onSelect: () => setOpen(false),
        }))}
      />
    </div>
  );
}
