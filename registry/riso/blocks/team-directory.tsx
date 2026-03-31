"use client";

// registry/riso/blocks/team-directory.tsx — Team Directory Block ★
//
// Combines: AvatarGroup + StatCard + Table + Badge + Stamp

import * as React from "react";
import { Avatar, AvatarGroup } from "@/registry/riso/ui/avatar";
import { StatCard } from "@/components/riso/ui/stat-card";
import { Table } from "@/components/riso/ui/table";
import { Badge } from "@/components/riso/ui/badge";
import { Stamp } from "@/components/riso/ui/stamp";
import { Separator } from "@/components/riso/ui/separator";

type MemberStatus = "approved" | "pending" | "draft";

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  department: string;
  jobs: number;
  status: MemberStatus;
}

const MEMBERS: TeamMember[] = [
  {
    id: "1",
    initials: "JP",
    name: "Jamie Park",
    role: "Lead Printer",
    department: "Press",
    jobs: 142,
    status: "approved",
  },
  {
    id: "2",
    initials: "MR",
    name: "Maya Rodriguez",
    role: "Color Technician",
    department: "Ink Lab",
    jobs: 98,
    status: "approved",
  },
  {
    id: "3",
    initials: "TK",
    name: "Taro Kobayashi",
    role: "Plate Maker",
    department: "Pre-Press",
    jobs: 67,
    status: "pending",
  },
  {
    id: "4",
    initials: "SL",
    name: "Sam Lee",
    role: "Paper Handler",
    department: "Logistics",
    jobs: 55,
    status: "approved",
  },
  {
    id: "5",
    initials: "AW",
    name: "Anya Wolff",
    role: "QA Inspector",
    department: "Quality",
    jobs: 44,
    status: "draft",
  },
];

export function TeamDirectory() {
  const [selected, setSelected] = React.useState<string | null>(null);

  const columns = [
    {
      key: "name",
      header: "Member",
      render: (_: unknown, row: TeamMember) => (
        <div className="flex items-center gap-2">
          <Avatar initials={row.initials} size="sm" />
          <div>
            <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[11px] uppercase tracking-[0.08em] text-[var(--riso-primary)] m-0">
              {row.name}
            </p>
            <p className="font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[10px] text-[var(--riso-secondary)] m-0">
              {row.role}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Dept",
      render: (_: unknown, row: TeamMember) => (
        <Badge
          variant={
            row.department === "Press"
              ? "default"
              : row.department === "Ink Lab"
                ? "secondary"
                : "outline"
          }
        >
          {row.department}
        </Badge>
      ),
    },
    {
      key: "jobs",
      header: "Jobs",
      align: "right" as const,
      sortable: true,
      render: (v: unknown) => (
        <span className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[11px] text-[var(--riso-overlap,#7b4f7a)] [font-variant-numeric:tabular-nums]">
          {String(v)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_: unknown, row: TeamMember) => (
        <Stamp variant={row.status} size={36} rotate={-1} />
      ),
    },
  ];

  return (
    <div className="bg-[var(--riso-paper,#f7f0e2)]  outline-2 outline-[var(--riso-primary)] [filter:drop-shadow(6px_6px_0_var(--riso-secondary))] p-6">
      {/* Header + Avatar group + stat */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.28em] text-[var(--riso-secondary)] m-0">
            Analog Press Studio
          </p>
          <h2 className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[20px] uppercase text-[var(--riso-primary)] mt-1 mb-3 mx-0 [text-shadow:2px_2px_0_var(--riso-secondary)]">
            Team Directory
          </h2>

          <AvatarGroup>
            {MEMBERS.slice(0, 4).map((m) => (
              <Avatar key={m.id} initials={m.initials} size="sm" />
            ))}
            <Avatar
              initials={`+${Math.max(0, MEMBERS.length - 4)}`}
              size="sm"
              variant="filled"
            />
          </AvatarGroup>
        </div>

        <StatCard value={String(MEMBERS.length)} label="Members" trend={2} />
      </div>

      <Separator />

      {/* Table */}
      <div className="mt-4">
        <Table
          columns={columns as Parameters<typeof Table>[0]["columns"]}
          data={MEMBERS as unknown as Record<string, unknown>[]}
          caption="All active press operators"
        />
      </div>

      <Separator variant="dotted" className="mt-4" />

      {/* Department badge legend */}
      <div className="mt-3 flex gap-2 flex-wrap items-center">
        <span className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.15em] text-[var(--riso-secondary)]">
          Departments:
        </span>
        {["Press", "Ink Lab", "Pre-Press", "Logistics", "Quality"].map((d) => (
          <Badge key={d} variant="outline" className="text-[7px]">
            {d}
          </Badge>
        ))}
      </div>
    </div>
  );
}
