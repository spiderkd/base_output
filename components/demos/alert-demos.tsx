"use client";

import * as React from "react";
import { Alert } from "@/registry/riso/ui/alert";

export function AllAlertsDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 480,
      }}
    >
      <Alert variant="info" title="Info">
        Use PLATE-XXXX format for all job IDs.
      </Alert>
      <Alert variant="success" title="Job Queued">
        JOB-0992 has been added to the print queue.
      </Alert>
      <Alert variant="warning" title="Ink Level Low">
        Secondary drum at 12% — consider reloading.
      </Alert>
      <Alert variant="danger" title="Paper Jam Detected" dismissible>
        Feed halted. Clear tray 2 before resuming.
      </Alert>
    </div>
  );
}

export function DismissibleAlertDemo() {
  return (
    <Alert variant="warning" title="Maintenance scheduled" dismissible>
      Full drum cleaning at 17:00. Expect 45 minutes downtime.
    </Alert>
  );
}
