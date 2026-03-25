"use client";

import * as React from "react";
import { ToastProvider, useToast } from "@/registry/riso/ui/toast";
import { Button } from "@/registry/riso/ui/button";

function ToastTriggers() {
  const { toast } = useToast();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button
        variant="primary"
        size="sm"
        onClick={() =>
          toast({
            title: "Job Registered",
            description: "JOB-0992 queued for printing",
          })
        }
      >
        Default
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({
            title: "Print Complete",
            description: "847 sheets at 99.2% accuracy",
            variant: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        size="sm"
        style={{
          background: "var(--riso-overlap,#7b4f7a)",
          color: "white",
          filter: "drop-shadow(4px 4px 0 var(--riso-primary))",
        }}
        onClick={() =>
          toast({
            title: "Ink Level Low",
            description: "Secondary drum at 12%",
            variant: "warning",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() =>
          toast({
            title: "Paper Jam",
            description: "Clear tray 2 before resuming",
            variant: "danger",
          })
        }
      >
        Danger
      </Button>
    </div>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastTriggers />
    </ToastProvider>
  );
}

function SingleToastTrigger() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: "Job Registered",
          description: "JOB-0992 queued for printing",
        })
      }
    >
      Show Toast
    </Button>
  );
}

export function SingleToastDemo() {
  return (
    <ToastProvider>
      <SingleToastTrigger />
    </ToastProvider>
  );
}
