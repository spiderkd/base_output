// "use client";

// export function CopyPage({ content }: { content: string }) {
//   return (
//     <button
//       className="bg-fd-secondary p-2 inline-flex text-fd-secondary-foreground font-medium text-sm border rounded-lg hover:bg-fd-accent hover:text-fd-accent-foreground"
//       onClick={() => {
//         void navigator.clipboard.writeText(content);
//         console.log("copied content");
//       }}
//     >
//       Copy Page
//     </button>
//   );
// }

"use client";

export function CopyPage({ content }: { content: string }) {
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(content);
      }}
      style={{
        fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
        fontWeight: 700,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        padding: "6px 14px",
        background: "transparent",
        color: "var(--riso-secondary)",
        outline: "1.5px solid var(--riso-secondary)",
        border: "none",
        cursor: "pointer",
        transition: "filter 100ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.filter =
          "drop-shadow(2px 2px 0 var(--riso-primary))";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.filter = "none";
      }}
    >
      Copy MDX
    </button>
  );
}
