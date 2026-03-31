"use client";

// registry/riso/blocks/registration-form.tsx — Registration Form Block ★
//
// Combines: Input (×4) + Checkbox (×2) + Select + Button + Toast
// On submit: triggers a stamp animation and success toast.

import * as React from "react";
import { Input } from "@/components/riso/ui/input";
import { Checkbox } from "@/components/riso/ui/checkbox";
import { Select } from "@/components/riso/ui/select";
import { Button } from "@/components/riso/ui/button";
import { Separator } from "@/components/riso/ui/separator";
import { useToast } from "@/components/riso/ui/toast";

const INK_OPTIONS = [
  { value: "pink-teal", label: "Fluorescent Pink + Teal" },
  { value: "red-yellow", label: "Bright Red + Yellow" },
  { value: "blue-pink", label: "Blue + Fluorescent Pink" },
  { value: "black-yellow", label: "Black + Yellow" },
];

export function RegistrationForm() {
  const { toast } = useToast();

  const [values, setValues] = React.useState({
    jobName: "",
    clientId: "",
    sheets: "",
    ink: "",
    rush: false,
    proofFirst: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const set = (k: string, v: string | boolean) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast({
      title: "Job Registered",
      description: `${values.jobName || "New job"} queued for printing`,
      variant: "success",
    });
  };

  return (
    <div className="bg-[var(--riso-paper,#f7f0e2)]  outline-2 outline-[var(--riso-primary)] [filter:drop-shadow(6px_6px_0_var(--riso-secondary))] p-0 max-w-[480px] relative overflow-hidden">
      {/* Header block */}
      <div className="bg-[var(--riso-primary)] px-6 py-4 relative">
        {/* Halftone texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none [background-image:radial-gradient(circle,rgba(255,255,255,.12)_1.5px,transparent_0)] [background-size:4px_4px]"
        />
        <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.3em] text-white/70 m-0">
          Riso Press · Job Submission
        </p>
        <h2 className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[20px] uppercase text-white mt-1 mb-0 mx-0 [text-shadow:2px_2px_0_var(--riso-secondary)] relative">
          Register Print Job
        </h2>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Job Name"
            placeholder="e.g. Zine Issue 04"
            value={values.jobName}
            onChange={(e) => set("jobName", e.target.value)}
          />
          <Input
            label="Client ID"
            placeholder="CLIENT-001"
            value={values.clientId}
            onChange={(e) => set("clientId", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Sheet Count"
            type="number"
            placeholder="500"
            value={values.sheets}
            onChange={(e) => set("sheets", e.target.value)}
          />
          <Select
            label="Ink Combination"
            placeholder="Choose inks…"
            options={INK_OPTIONS}
            onChange={(v) => set("ink", v)}
          />
        </div>

        <Separator variant="dotted" />

        <div className="flex gap-5">
          <Checkbox
            label="Rush Order"
            description="48h turnaround"
            checked={values.rush}
            onChange={(e) => set("rush", e.target.checked)}
          />
          <Checkbox
            label="Proof First"
            description="10-sheet proof run"
            checked={values.proofFirst}
            onChange={(e) => set("proofFirst", e.target.checked)}
          />
        </div>

        <Separator />

        <div className="flex gap-[10px] justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              setValues({
                jobName: "",
                clientId: "",
                sheets: "",
                ink: "",
                rush: false,
                proofFirst: false,
              })
            }
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={submitted}
          >
            {submitted ? "Queued ✓" : "Submit Job"}
          </Button>
        </div>
      </form>
    </div>
  );
}
