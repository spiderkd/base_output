"use client";

import * as React from "react";
import { Badge } from "@/registry/riso/ui/badge";
import { Breadcrumb } from "@/registry/riso/ui/breadcrumb";
import { Button } from "@/registry/riso/ui/button";
import { CommandPalette } from "@/registry/riso/ui/command-palette";
import { Pagination } from "@/registry/riso/ui/pagination";
import { Table } from "@/registry/riso/ui/table";
import * as RisoUtils from "@/lib/riso-utils";

export interface SearchItem extends Record<string, unknown> {
  name: string;
  category: string;
  status: "stable" | "beta" | "new";
}

export interface SearchResultsProps extends RisoUtils.RisoThemeProps {
  items?: SearchItem[];
  pageSize?: number;
}

const DEFAULT_ITEMS: SearchItem[] = [
  { name: "Accordion", category: "Disclosure", status: "stable" },
  { name: "Alert", category: "Feedback", status: "stable" },
  { name: "Badge", category: "Data Display", status: "stable" },
  { name: "Breadcrumb", category: "Navigation", status: "stable" },
  { name: "Button", category: "Inputs", status: "stable" },
  { name: "Calendar", category: "Scheduling", status: "beta" },
  { name: "Card", category: "Layout", status: "stable" },
  { name: "Checkbox", category: "Inputs", status: "stable" },
  { name: "Command Palette", category: "Navigation", status: "new" },
  { name: "Countdown", category: "Scheduling", status: "new" },
  { name: "Dialog", category: "Feedback", status: "beta" },
  { name: "Drawer", category: "Navigation", status: "beta" },
  { name: "Pagination", category: "Navigation", status: "stable" },
  { name: "Print Block", category: "Display", status: "new" },
  { name: "Progress", category: "Feedback", status: "stable" },
  { name: "Radio Group", category: "Inputs", status: "stable" },
  { name: "Separator", category: "Layout", status: "stable" },
  { name: "Slider", category: "Inputs", status: "beta" },
  { name: "Timeline", category: "Scheduling", status: "new" },
  { name: "Toast", category: "Feedback", status: "beta" },
];

export function SearchResults({
  items = DEFAULT_ITEMS,
  pageSize = 5,
  theme,
  primary,
  secondary,
  overlap,
  paper,
}: SearchResultsProps) {
  const risoStyle = RisoUtils.resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items;
    const normalizedQuery = query.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  React.useEffect(() => {
    setPage(1);
  }, [query]);

  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  const tableColumns = React.useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        sortable: true,
      },
      {
        key: "category",
        header: "Category",
        sortable: true,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        render: (value: unknown) => {
          const status = String(value) as SearchItem["status"];
          if (status === "new") return <Badge>{status}</Badge>;
          if (status === "beta") return <Badge variant="secondary">{status}</Badge>;
          return <Badge variant="overprint">{status}</Badge>;
        },
      },
    ],
    [],
  );

  const commandItems = React.useMemo(
    () =>
      items.map((item) => ({
        id: item.name.toLowerCase().replace(/\s+/g, "-"),
        label: item.name,
        description: `${item.category} · ${item.status}`,
        category: item.category,
        keywords: [item.category, item.status],
        onSelect: () => setQuery(item.name),
      })),
    [items],
  );

  return (
    <section
      className="w-full max-w-[920px] space-y-5 bg-[var(--riso-paper)] p-5 outline-2 outline-[var(--riso-primary)] [filter:drop-shadow(4px_4px_0_var(--riso-secondary))]"
      style={risoStyle}
    >
      <Breadcrumb
        items={[
          { label: "Home" },
          { label: "Search" },
          { label: query || "All" },
        ]}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="flex min-h-[52px] flex-1 items-center justify-between gap-3 bg-[var(--riso-paper)] px-4 py-3 text-left outline-2 outline-[var(--riso-primary)] [filter:drop-shadow(4px_4px_0_var(--riso-secondary))]"
        >
          <span className="font-[family-name:var(--font-riso-body)] text-[14px] text-[var(--riso-overlap)]">
            {query ? `Search components… ${query}` : "Search components…"}
          </span>
          <span className="font-[family-name:var(--font-riso-label)] text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--riso-secondary)]">
            Palette
          </span>
        </button>

        <Button variant="secondary" onClick={() => setQuery("")}>
          Clear
        </Button>
      </div>

      <Table<SearchItem>
        columns={tableColumns}
        data={paginatedItems}
        caption={`${filteredItems.length} result${filteredItems.length === 1 ? "" : "s"}`}
      />

      <div className="flex justify-center">
        <Pagination
          total={filteredItems.length}
          page={page}
          perPage={pageSize}
          onChange={setPage}
        />
      </div>

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        items={commandItems}
        placeholder="Search components…"
      />
    </section>
  );
}
