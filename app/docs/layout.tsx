import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "@/lib/source";

import { RisoDocsNavbar } from "@/components/nav/riso-docs-navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        // Replace fumadocs's default navbar with our minimal riso one
        enabled: true,
        component: <RisoDocsNavbar />,
      }}
      sidebar={{
        // banner: <RisoSidebarLogo />,
        defaultOpenLevel: 1,

        collapsible: true,
      }}
      disableThemeSwitch
    >
      {children}
    </DocsLayout>
  );
}
