import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span
        style={{
          fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
          fontWeight: 900,
          fontSize: "1.1rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--riso-primary, #ff5e7e)",
          position: "relative",
        }}
      >
        RISO UI
      </span>
    ),
  },
  links: [
    { text: "Docs", url: "/docs", active: "nested-url" },
    {
      text: "Components",
      url: "/docs/components/button",
      active: "nested-url",
    },
  ],
};
