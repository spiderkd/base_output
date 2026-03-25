"use client";

import * as React from "react";
import { Dialog } from "@/registry/riso/ui/dialog";
import { Button } from "@/registry/riso/ui/button";
import { Input } from "@/registry/riso/ui/input";

export function BasicDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Print Job Details"
        description="Job ID: JOB-0992-A"
      >
        <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
          Two-pass risograph configuration: fluorescent pink primary, teal
          secondary. Estimated 847 sheets. Misregistration tolerance: 2px.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="sm" onClick={() => setOpen(false)}>
            Confirm Job
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export function DangerDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Destructive Action
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Purge Drum System?"
        description="This action cannot be undone"
      >
        <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
          Purging will clear all ink from both drums and require a full reload.
          Allow 12 minutes.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="danger" size="sm" onClick={() => setOpen(false)}>
            Purge Now
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
