// import { source } from "@/lib/source";
// import {
//   DocsPage,
//   DocsBody,
//   DocsDescription,
//   DocsTitle,
// } from "fumadocs-ui/page";
// import { notFound } from "next/navigation";
// import { createRelativeLink } from "fumadocs-ui/mdx";
// import { getMDXComponents } from "@/mdx-components";
// import { CopyPage } from "./page.client";

// export default async function Page(props: {
//   params: Promise<{ slug?: string[] }>;
// }) {
//   const params = await props.params;
//   const page = source.getPage(params.slug);
//   if (!page) notFound();

//   const MDXContent = page.data.body;

//   return (
//     <DocsPage toc={page.data.toc} full={page.data.full}>
//       <DocsTitle>{page.data.title}</DocsTitle>
//       <DocsDescription>{page.data.description}</DocsDescription>
//       <div className="flex gap-2 items-center">
//         <CopyPage content={page.data.content} />
//       </div>
//       <DocsBody>
//         <MDXContent
//           components={getMDXComponents({
//             // this allows you to link to other pages with relative file paths
//             a: createRelativeLink(source, page),
//           })}
//         />
//       </DocsBody>
//     </DocsPage>
//   );
// }

// export async function generateStaticParams() {
//   return source.generateParams();
// }

// export async function generateMetadata(props: {
//   params: Promise<{ slug?: string[] }>;
// }) {
//   const params = await props.params;
//   const page = source.getPage(params.slug);
//   if (!page) notFound();

//   return {
//     title: page.data.title,
//     description: page.data.description,
//   };
// }

import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        // Style: normal (clean list, not clerk dropdown)
        style: "normal",
        // Custom header for the TOC panel
        header: (
          <p
            style={{
              fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
              fontWeight: 700,
              fontSize: 8,
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: "var(--riso-secondary)",
              margin: 0,
              paddingBottom: 10,
              borderBottom: "2px solid var(--riso-primary)",
              position: "relative",
            }}
          >
            On this page
            {/* Secondary misreg rule under TOC header */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                bottom: -4,
                left: 0,
                right: 0,
                height: 1,
                background: "var(--riso-secondary)",
                opacity: 0.6,
                display: "block",
              }}
            />
          </p>
        ),
      }}
      breadcrumb={{
        enabled: true,
        includePage: false,
      }}
    >
      {/* Page title with misreg ghost */}
      <div style={{ position: "relative", marginBottom: 4 }}>
        <DocsTitle
          style={{
            fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
            fontWeight: 900,
            fontSize: "clamp(24px,4vw,40px)",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            color: "var(--riso-primary)",
            margin: 0,
            position: "relative",
          }}
        >
          {page.data.title}
        </DocsTitle>
      </div>

      {/* Description */}
      <DocsDescription
        style={{
          fontFamily: "var(--font-riso-body,'Work Sans',sans-serif)",
          fontSize: 15,
          lineHeight: 1.7,
          color: "var(--riso-overlap,#7b4f7a)",
          marginTop: 8,
          marginBottom: 28,
        }}
      >
        {page.data.description}
      </DocsDescription>

      {/* Double rule under description */}
      <div style={{ position: "relative", height: 8, marginBottom: 32 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "var(--riso-primary)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 0,
            right: 0,
            height: 1,
            background: "var(--riso-secondary)",
            opacity: 0.7,
          }}
        />
      </div>

      {/* MDX body */}
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: `${page.data.title} — RISO UI`,
    description: page.data.description,
  };
}
