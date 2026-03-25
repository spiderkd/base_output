// import type { ReactNode } from "react";
// import { HomeLayout } from "fumadocs-ui/layouts/home";
// import { baseOptions } from "@/app/layout.config";

// export default function Layout({ children }: { children: ReactNode }) {
//   return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
// }

import type { ReactNode } from "react";
import { RisoNavbar } from "@/components/riso-navbar";

// Home route group layout.
// Uses our custom RisoNavbar — NOT fumadocs HomeLayout,
// which would inject its own nav/header we don't want.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{ minHeight: "100vh", background: "var(--riso-paper,#f7f0e2)" }}
    >
      <RisoNavbar />
      {children}
    </div>
  );
}
