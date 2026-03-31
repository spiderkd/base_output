import Link from "next/link";

// ── data ────────────────────────────────────────────────────────
const COMPONENTS = [
  { name: "Button", slug: "button", desc: "Hard shadow compresses on hover" },
  { name: "Card", slug: "card", desc: "Stacked paper, misreg depth" },
  { name: "Badge", slug: "badge", desc: "Overprint creates third ink color" },
  { name: "Dialog", slug: "dialog", desc: "Plate snap animation on open" },
  { name: "Toast", slug: "toast", desc: "Stamp-entry countdown bar" },
  { name: "Table", slug: "table", desc: "Halftone odd rows, sort chevrons" },
  { name: "RisoChart", slug: "riso-chart", desc: "Multiply blend = third ink" },
  {
    name: "Timeline",
    slug: "timeline",
    desc: "Double-rule spine, stamp nodes",
  },
  { name: "Countdown", slug: "countdown", desc: "Plate-swap digit animation" },
  {
    name: "InkBlotLoader",
    slug: "ink-blot-loader",
    desc: "Morphing blobs, multiply overlap",
  },
  { name: "TornPaper", slug: "torn-paper", desc: "PRNG-generated tear edge" },
  {
    name: "GhostGrid",
    slug: "ghost-grid",
    desc: "Faint numerals as page texture",
  },
];

const FEATURES = [
  {
    num: "01",
    title: "Misregistration",
    body: "Every component is two layers — primary ink and a secondary offset. Where they overlap, mix-blend-mode: multiply creates the third riso color automatically.",
  },
  {
    num: "02",
    title: "Zero blur. Ever.",
    body: "No gaussian blur. No backdrop-filter. Depth is expressed as hard offset only: drop-shadow(4px 4px 0 color). The stacking principle, applied everywhere.",
  },
  {
    num: "03",
    title: "SVG grain + halftone",
    body: "Texture and density gradients are pure SVG feTurbulence filters. No canvas, no resize observers. CSS transitions handle all interactions.",
  },
  {
    num: "04",
    title: "shadcn registry",
    body: "One command installs any component. You own the source — copy it, modify it, ship it. Same registry format as shadcn/ui.",
  },
];

const THEMES = [
  { label: "Pink · Teal", p: "#ff5e7e", s: "#00a99d", o: "#7b4f7a" },
  { label: "Red · Yellow", p: "#e8362a", s: "#f5d800", o: "#c07a00" },
  { label: "Blue · Pink", p: "#3d6bce", s: "#ff5e7e", o: "#7b3fa0" },
  { label: "Black · Yellow", p: "#1a1a1a", s: "#f5d800", o: "#3a3200" },
];

// ── helpers ─────────────────────────────────────────────────────
const DoubleRule = () => (
  <div style={{ position: "relative", height: 8 }}>
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
);

// ── page ─────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main style={{ background: "var(--riso-paper,#f7f0e2)" }}>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 24px 64px",
          position: "relative",
        }}
      >
        {/* Corner registration marks */}
        {(["tl", "tr", "bl", "br"] as const).map((corner) => (
          <svg
            key={corner}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            aria-hidden
            style={{
              position: "absolute",
              top: corner.startsWith("t") ? 16 : undefined,
              bottom: corner.startsWith("b") ? 16 : undefined,
              left: corner.endsWith("l") ? 0 : undefined,
              right: corner.endsWith("r") ? 0 : undefined,
              opacity: 0.22,
              transform:
                corner === "tr"
                  ? "scaleX(-1)"
                  : corner === "bl"
                    ? "scaleY(-1)"
                    : corner === "br"
                      ? "scale(-1,-1)"
                      : "none",
            }}
          >
            <line
              x1="20"
              y1="0"
              x2="20"
              y2="16"
              stroke="var(--riso-primary)"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <line
              x1="0"
              y1="20"
              x2="16"
              y2="20"
              stroke="var(--riso-primary)"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
            <circle
              cx="20"
              cy="20"
              r="6"
              fill="none"
              stroke="var(--riso-primary)"
              strokeWidth="1.5"
            />
            <circle cx="20" cy="20" r="2" fill="var(--riso-primary)" />
            {/* secondary offset */}
            <line
              x1="22"
              y1="2"
              x2="22"
              y2="18"
              stroke="var(--riso-secondary)"
              strokeWidth="1"
              strokeLinecap="square"
              opacity="0.6"
            />
            <line
              x1="2"
              y1="22"
              x2="18"
              y2="22"
              stroke="var(--riso-secondary)"
              strokeWidth="1"
              strokeLinecap="square"
              opacity="0.6"
            />
          </svg>
        ))}

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.35em",
            color: "var(--riso-secondary)",
            marginBottom: 24,
          }}
        >
          Risograph Component Library for React
        </p>

        {/* Misreg headline */}
        <div
          style={{
            position: "relative",
            marginBottom: 28,
            display: "inline-block",
          }}
        >
          <h1
            aria-hidden
            style={{
              position: "absolute",
              left: 4,
              top: 4,
              margin: 0,
              fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(52px,8vw,96px)",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              lineHeight: 1,
              color: "var(--riso-secondary)",
              opacity: 0.3,
              userSelect: "none",
            }}
          >
            Two Inks.{"\n"}One System.
          </h1>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(52px,8vw,96px)",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              lineHeight: 1,
              color: "var(--riso-primary)",
              position: "relative",
              whiteSpace: "pre-line",
            }}
          >
            Two Inks.{"\n"}One System.
          </h1>
        </div>

        <p
          style={{
            fontFamily: "var(--font-riso-body,'Work Sans',sans-serif)",
            fontSize: 17,
            lineHeight: 1.75,
            color: "var(--riso-overlap,#7b4f7a)",
            maxWidth: 500,
            marginBottom: 40,
          }}
        >
          Riso UI simulates risograph printing in React — flat ink, hard
          shadows, halftone textures, intentional misregistration. Pure SVG
          filters. Zero external runtime dependencies.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 36,
          }}
        >
          <Link
            href="/docs/getting-started/introduction"
            style={{
              fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
              fontWeight: 700,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "white",
              textDecoration: "none",
              padding: "13px 30px",
              background: "var(--riso-primary)",
              filter: "drop-shadow(5px 5px 0 var(--riso-secondary))",
            }}
          >
            Get Started →
          </Link>
          <Link
            href="/docs/components/button"
            style={{
              fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
              fontWeight: 700,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--riso-primary)",
              textDecoration: "none",
              padding: "13px 30px",
              outline: "2px solid var(--riso-primary)",
              filter: "drop-shadow(2px 2px 0 var(--riso-secondary))",
            }}
          >
            Browse Components
          </Link>
        </div>

        {/* Stats row */}
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}
        >
          {["47 Components", "5 Blocks", "0 Dependencies", "4 Ink Themes"].map(
            (s) => (
              <span
                key={s}
                style={{
                  fontFamily:
                    "var(--font-riso-label,'Space Grotesk',sans-serif)",
                  fontWeight: 700,
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--riso-overlap,#7b4f7a)",
                  padding: "3px 10px",
                  border:
                    "1px solid color-mix(in srgb,var(--riso-primary) 30%,transparent)",
                }}
              >
                {s}
              </span>
            ),
          )}
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <DoubleRule />
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}
      >
        <p
          style={{
            fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.35em",
            color: "var(--riso-secondary)",
            marginBottom: 40,
          }}
        >
          How it works
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 3,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.num}
              style={{
                padding: "28px 22px",
                position: "relative",
                outline:
                  "1px solid color-mix(in srgb,var(--riso-primary) 20%,transparent)",
              }}
            >
              {/* Ghost number */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 10,
                  right: 14,
                  fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
                  fontWeight: 900,
                  fontSize: 64,
                  color: "var(--riso-primary)",
                  opacity: 0.07,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {f.num}
              </span>

              <span
                style={{
                  fontFamily:
                    "var(--font-riso-label,'Space Grotesk',sans-serif)",
                  fontWeight: 700,
                  fontSize: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  color: "var(--riso-secondary)",
                  display: "block",
                  marginBottom: 10,
                }}
              >
                {f.num}
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
                  fontWeight: 900,
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "var(--riso-primary)",
                  margin: "0 0 10px",
                }}
              >
                {f.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-riso-body,'Work Sans',sans-serif)",
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "var(--riso-overlap,#7b4f7a)",
                  margin: 0,
                }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <DoubleRule />
      </div>

      {/* ── COMPONENT GRID ───────────────────────────────────── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 40,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
                fontWeight: 700,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.35em",
                color: "var(--riso-secondary)",
                margin: "0 0 8px",
              }}
            >
              What ships
            </p>
            <div style={{ position: "relative", display: "inline-block" }}>
              <h2
                aria-hidden
                style={{
                  position: "absolute",
                  left: 2,
                  top: 2,
                  margin: 0,
                  fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
                  fontWeight: 900,
                  fontSize: 28,
                  textTransform: "uppercase",
                  color: "var(--riso-secondary)",
                  opacity: 0.3,
                  userSelect: "none",
                }}
              >
                47 Components
              </h2>
              <h2
                style={{
                  margin: 0,
                  position: "relative",
                  fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
                  fontWeight: 900,
                  fontSize: 28,
                  textTransform: "uppercase",
                  color: "var(--riso-primary)",
                }}
              >
                47 Components
              </h2>
            </div>
          </div>
          <Link
            href="/docs/components/button"
            style={{
              fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
              fontWeight: 700,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--riso-primary)",
              textDecoration: "none",
              borderBottom: "2px solid var(--riso-primary)",
              paddingBottom: 2,
            }}
          >
            Browse all →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 3,
          }}
        >
          {COMPONENTS.map((c) => (
            <Link
              key={c.slug}
              href={`/docs/components/${c.slug}`}
              style={{
                textDecoration: "none",
                display: "block",
                padding: "18px 20px",
                outline:
                  "1px solid color-mix(in srgb,var(--riso-primary) 22%,transparent)",
                transition:
                  "outline-color 100ms, filter 100ms, transform 100ms",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
                  fontWeight: 900,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: "var(--riso-primary)",
                  margin: "0 0 5px",
                }}
              >
                {c.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-riso-body,'Work Sans',sans-serif)",
                  fontSize: 11,
                  color: "var(--riso-overlap,#7b4f7a)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {c.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── INK THEMES BAND ──────────────────────────────────── */}
      <section
        style={{
          background: "var(--riso-primary)",
          padding: "72px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Halftone overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle,rgba(255,255,255,.12) 1.5px,transparent 0)",
            backgroundSize: "4px 4px",
            pointerEvents: "none",
          }}
        />
        {/* Secondary misreg shadow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--riso-secondary)",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <p
            style={{
              fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
              fontWeight: 700,
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.6)",
              marginBottom: 16,
            }}
          >
            Four ink combinations
          </p>

          <h2
            style={{
              fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
              fontWeight: 900,
              fontSize: "clamp(28px,5vw,52px)",
              textTransform: "uppercase",
              color: "white",
              margin: "0 0 36px",
              textShadow: "3px 3px 0 var(--riso-secondary)",
              lineHeight: 1.1,
            }}
          >
            Real riso ink catalog.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 3,
            }}
          >
            {THEMES.map((t) => (
              <div
                key={t.label}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "20px 20px 22px",
                  outline: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {/* Ink swatches — primary, secondary, overlap via multiply */}
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    marginBottom: 14,
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: 22, height: 22, background: t.p }} />
                  <div style={{ width: 22, height: 22, background: t.s }} />
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      background: t.o,
                      mixBlendMode: "multiply",
                    }}
                  />
                  <span
                    style={{
                      fontFamily:
                        "var(--font-riso-label,'Space Grotesk',sans-serif)",
                      fontWeight: 700,
                      fontSize: 7,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "rgba(255,255,255,.5)",
                      marginLeft: 4,
                    }}
                  >
                    + overlap
                  </span>
                </div>
                <p
                  style={{
                    fontFamily:
                      "var(--font-riso-label,'Space Grotesk',sans-serif)",
                    fontWeight: 700,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "white",
                    margin: 0,
                  }}
                >
                  {t.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "3px solid var(--riso-primary)",
          padding: "28px 24px",
          position: "relative",
        }}
      >
        <div
          aria-hidden
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
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 2,
                top: 2,
                fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
                fontWeight: 900,
                fontSize: 16,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--riso-secondary)",
                opacity: 0.3,
                userSelect: "none",
              }}
            >
              RISO UI
            </span>
            <span
              style={{
                position: "relative",
                fontFamily: "var(--font-riso-headline,'Epilogue',sans-serif)",
                fontWeight: 900,
                fontSize: 16,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--riso-primary)",
              }}
            >
              RISO UI
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Docs", href: "/docs/getting-started/introduction" },
              { label: "Components", href: "/docs/components/button" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                style={{
                  fontFamily:
                    "var(--font-riso-label,'Space Grotesk',sans-serif)",
                  fontWeight: 700,
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--riso-secondary)",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))}
            <span
              style={{
                fontFamily: "var(--font-riso-label,'Space Grotesk',sans-serif)",
                fontWeight: 700,
                fontSize: 8,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "color-mix(in srgb,var(--riso-primary) 35%,transparent)",
              }}
            >
              v0.2.0
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
