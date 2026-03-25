"use client";

import * as React from "react";
import { Drawer } from "@/registry/riso/ui/drawer";
import { Button } from "@/registry/riso/ui/button";
import { Input } from "@/registry/riso/ui/input";

export function RightDrawerDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        Open Right Drawer
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        title="Job Settings"
        description="Configure print parameters"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Paper Stock" defaultValue="Bond 80gsm" />
          <Input label="Sheet Count" type="number" defaultValue="500" />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Button size="sm" onClick={() => setOpen(false)}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export function LeftDrawerDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Open Left Drawer
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        title="Navigation"
        description="Main menu"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {["Dashboard", "Print Jobs", "Ink Config", "Settings"].map((item) => (
            <div
              key={item}
              onClick={() => setOpen(false)}
              style={{
                padding: "12px 0",
                borderBottom:
                  "1px solid color-mix(in srgb,var(--riso-primary) 15%,transparent)",
                fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
                color: "var(--riso-overlap,#7b4f7a)",
                cursor: "pointer",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
