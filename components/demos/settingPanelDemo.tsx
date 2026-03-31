"use client";
import { SettingsPanel } from "@/registry/riso/blocks/settings-panel";
import { Button } from "@/registry/riso/ui/button";
import React from "react";

export function SettingsPanelDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex justify-center ">
      <Button onClick={() => setOpen(!open)}>Open Settings Panel</Button>
      <SettingsPanel open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
