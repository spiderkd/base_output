"use client";

import * as React from "react";
import { Table } from "@/registry/riso/ui/table";
import { Badge } from "@/registry/riso/ui/badge";

const basicData = [
  { name: "Zine Issue 04", sheets: 500, status: "Complete" },
  { name: "Poster Run A", sheets: 200, status: "Pending" },
  { name: "Annual Report", sheets: 1200, status: "Approved" },
];

const fullData = [
  { name: "Zine Issue 04", sheets: 500, dept: "Editorial", status: "Complete" },
  { name: "Poster Run A", sheets: 200, dept: "Design", status: "Pending" },
  {
    name: "Annual Report",
    sheets: 1200,
    dept: "Corporate",
    status: "Approved",
  },
  { name: "Event Flyers", sheets: 350, dept: "Marketing", status: "Draft" },
];

export function BasicTableDemo() {
  return (
    <Table
      columns={[
        { key: "name", header: "Job Name" },
        {
          key: "sheets",
          header: "Sheets",
          align: "right" as const,
          sortable: true,
        },
        { key: "status", header: "Status" },
      ]}
      data={basicData as Record<string, unknown>[]}
    />
  );
}

export function RichTableDemo() {
  return (
    <Table
      columns={[
        { key: "name", header: "Job Name" },
        {
          key: "sheets",
          header: "Sheets",
          align: "right" as const,
          sortable: true,
        },
        { key: "dept", header: "Dept" },
        {
          key: "status",
          header: "Status",
          render: (value: unknown) => (
            <Badge
              variant={
                value === "Complete"
                  ? "secondary"
                  : value === "Approved"
                    ? "default"
                    : "outline"
              }
            >
              {String(value)}
            </Badge>
          ),
        },
      ]}
      data={fullData as Record<string, unknown>[]}
      caption="Recent print jobs"
    />
  );
}

export function StickyHeaderTableDemo() {
  return (
    <div style={{ maxHeight: 180, overflowY: "auto" }}>
      <Table
        columns={[
          { key: "name", header: "Job Name" },
          { key: "sheets", header: "Sheets", align: "right" as const },
        ]}
        data={[...fullData, ...fullData] as Record<string, unknown>[]}
        stickyHeader
      />
    </div>
  );
}
