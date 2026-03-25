"use client";

import * as React from "react";
import { Pagination } from "@/registry/riso/ui/pagination";

export function BasicPaginationDemo() {
  const [page, setPage] = React.useState(3);
  return <Pagination total={247} page={page} perPage={10} onChange={setPage} />;
}

export function SiblingsPaginationDemo() {
  const [page, setPage] = React.useState(5);
  return (
    <Pagination
      total={500}
      page={page}
      perPage={10}
      onChange={setPage}
      siblings={2}
    />
  );
}
