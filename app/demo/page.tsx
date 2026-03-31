"use client";

// registry/riso/templates/pages/portfolio-page.tsx
//
// Changes from previous version:
//   ProcessSection — Timeline items now carry animated Progress bars as
//     ReactNode content. A single IntersectionObserver fires once when the
//     section enters the viewport; it flips `fired` state from false → true,
//     which changes every Progress value from 0 → its real target.
//     Progress already has transition-[width] duration-[400ms] in its CSS,
//     so the bars fill themselves. Staggered via CSS animation-delay on the
//     wrapper div (not on Progress, which doesn't take that prop).
//
//   StatsBand → replaced entirely with WorkEthicSection:
//     Three InkDensityMeter columns (value, label, height, width, animated,
//     showValue — all verified props). Animated prop is true by default so
//     the meter counts up when value changes. Same IntersectionObserver
//     pattern: value starts at 0, flips to real target on entry.
//     SparklineRow (data, width, height, ink) used inside each column to
//     show a small activity chart below the meter.

import * as React from "react";
import { MisregTextReveal } from "@/registry/riso/ui/misreg-text-reveal";
import { GhostGrid } from "@/registry/riso/ui/ghost-grid";
import { PlateRegistration } from "@/registry/riso/ui/plate-registration";
import { Avatar } from "@/registry/riso/ui/avatar";
import { Badge } from "@/registry/riso/ui/badge";
import { Stamp } from "@/registry/riso/ui/stamp";
import { Timeline } from "@/registry/riso/ui/timeline";
import { Progress } from "@/registry/riso/ui/progress";
import { Separator } from "@/registry/riso/ui/separator";
import { InkDensityMeter } from "@/registry/riso/ui/ink-density-meter";
import { SparklineRow } from "@/registry/riso/ui/sparkline-row";
import { InkBlotLoader } from "@/registry/riso/ui/ink-blot-loader";
import { Input } from "@/registry/riso/ui/input";
import { Textarea } from "@/registry/riso/ui/textarea";
import { Button } from "@/registry/riso/ui/button";
import { Link } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — fires once when element enters viewport
// Used by ProcessSection and WorkEthicSection independently.
// ─────────────────────────────────────────────────────────────────────────────

function useOnceVisible(threshold = 0.25) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, threshold]);

  return { ref, visible };
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const WORK = [
  {
    slug: "riso-ui",
    title: "Riso UI",
    year: "2024",
    category: "Design System",
    tags: ["React", "TypeScript", "SVG"],
    desc: "Component library simulating risograph printing in React. 47 components, zero runtime dependencies, four ink themes.",
    featured: true,
  },
  {
    slug: "letterform-atlas",
    title: "Letterform Atlas",
    year: "2024",
    category: "Editorial",
    tags: ["Next.js", "MDX", "Figma"],
    desc: "Typography reference site for an independent print archive. Halftone image processing, custom glyph search.",
    featured: false,
  },
  {
    slug: "pressroom",
    title: "Pressroom Scheduler",
    year: "2023",
    category: "SaaS",
    tags: ["React", "Supabase"],
    desc: "Production scheduling tool for Berlin print studios. Real-time job queue, ink inventory, plate tracking.",
    featured: false,
  },
  {
    slug: "zine-archive",
    title: "Zine Archive",
    year: "2023",
    category: "Archive / Search",
    tags: ["Astro", "Algolia", "CSS"],
    desc: "Searchable database of 3,200 independent zines. Full-text search, tag taxonomy, scanned cover viewer.",
    featured: false,
  },
];

// Process timeline — content is ReactNode, built dynamically in ProcessSection
// so it can read the `fired` boolean from the parent's IntersectionObserver.
// The items array here only carries the non-content fields; content is injected
// when building the items array inside ProcessSection.

const PROCESS_STEPS = [
  {
    id: "brief",
    label: "Brief & constraints",
    date: "Week 1",
    status: "complete" as const,
    skill: "Strategy",
    note: "Map the real problem. Find the productive constraint.",
    proficiency: 92,
  },
  {
    id: "structure",
    label: "Architecture",
    date: "Week 2",
    status: "complete" as const,
    skill: "Systems design",
    note: "Component API, token system, a11y skeleton — before any visuals.",
    proficiency: 88,
  },
  {
    id: "visual",
    label: "Visual language",
    date: "Week 3",
    status: "complete" as const,
    skill: "Design",
    note: "Typography, spacing, colour — applied to the structure.",
    proficiency: 95,
  },
  {
    id: "build",
    label: "Build & ship",
    date: "Week 4",
    status: "current" as const,
    skill: "Engineering",
    note: "Production code. Handoff is a GitHub repo, not a Figma file.",
    proficiency: 90,
  },
  {
    id: "iterate",
    label: "Iterate in the open",
    date: "Ongoing",
    status: "upcoming" as const,
    skill: "Product",
    note: "Changelog, issue tracker, public roadmap.",
    proficiency: 78,
  },
];

// Work ethic meters — replace old generic stats band
const ETHIC_METERS = [
  {
    label: "Ink coverage",
    sublabel: "Pixel craft",
    value: 94,
    sparkData: [40, 55, 62, 71, 68, 80, 85, 91, 94],
    ink: "primary" as const,
    note: "CSS fidelity, SVG precision, sub-pixel typography.",
  },
  {
    label: "Press run",
    sublabel: "Shipped work",
    value: 81,
    sparkData: [20, 28, 35, 40, 52, 60, 68, 76, 81],
    ink: "secondary" as const,
    note: "Production deploys, not Figma frames.",
  },
  {
    label: "Registration",
    sublabel: "System thinking",
    value: 88,
    sparkData: [30, 38, 50, 55, 62, 70, 78, 84, 88],
    ink: "primary" as const,
    note: "Design tokens, API surfaces, constraints that scale.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────────

function PortfolioNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--riso-paper, #f7f0e2)",
        borderBottom: "3px solid var(--riso-primary)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -5,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--riso-secondary)",
          opacity: 0.65,
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logotype */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 2,
              top: 2,
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--riso-secondary)",
              opacity: 0.35,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            AV
          </span>
          <span
            style={{
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--riso-primary)",
              position: "relative",
            }}
          >
            AV
          </span>
        </div>

        <nav
          aria-label="Portfolio navigation"
          style={{ display: "flex", gap: 4 }}
        >
          {(["Work", "Process", "About", "Contact"] as const).map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontFamily:
                  "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                fontWeight: 700,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--riso-overlap, #7b4f7a)",
                textDecoration: "none",
                padding: "6px 14px",
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        <Button variant="primary" size="sm">
          Hire me →
        </Button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "95vh",
        display: "flex",
        alignItems: "center",
        background: "var(--riso-paper, #f7f0e2)",
      }}
    >
      <GhostGrid count={4} opacity={0.04} stagger />

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: "var(--riso-primary)",
          zIndex: 1,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 8,
          top: 0,
          bottom: 0,
          width: 2,
          background: "var(--riso-secondary)",
          opacity: 0.55,
          zIndex: 1,
        }}
      />

      <PlateRegistration
        variant="full-bleed"
        size={52}
        primaryOpacity={0.28}
        secondaryOpacity={0.18}
        style={{ position: "absolute", inset: 0 }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "50%",
          backgroundImage:
            "radial-gradient(circle, var(--riso-secondary) 1.5px, transparent 0)",
          backgroundSize: "7px 7px",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "100px 52px 80px",
          position: "relative",
          zIndex: 2,
          width: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            color: "var(--riso-secondary)",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 32,
              height: 2,
              background: "var(--riso-secondary)",
            }}
          />
          Design Engineer · Berlin
        </p>

        <div style={{ marginBottom: 8 }}>
          <MisregTextReveal text="Alexandra" as="h1" size={96} animateOnMount />
        </div>
        <div style={{ marginBottom: 32 }}>
          <MisregTextReveal text="Voss." as="h1" size={96} animateOnMount />
        </div>

        <p
          style={{
            fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
            fontSize: 18,
            lineHeight: 1.75,
            color: "var(--riso-overlap, #7b4f7a)",
            maxWidth: 540,
            marginBottom: 44,
          }}
        >
          I design and build interfaces that feel like they were printed — hard
          edges, two-colour ink, intentional misregistration. Currently building
          Riso UI.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 48,
          }}
        >
          <Button variant="primary" size="lg">
            <a
              href="#work"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              View work ↓
            </a>
          </Button>
          <Button variant="secondary" size="lg">
            Download CV
          </Button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["React", "TypeScript", "Figma", "SVG / CSS", "Risograph"].map(
            (skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ),
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 56,
          right: 56,
          zIndex: 2,
          opacity: 0.9,
        }}
      >
        <Stamp
          label="Available"
          sublabel="For Work"
          variant="approved"
          size={108}
          rotate={-5}
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORK
// ─────────────────────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  wide = false,
}: {
  project: (typeof WORK)[0];
  wide?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--riso-paper, #f7f0e2)",
        outline: "2px solid var(--riso-primary)",
        filter: hovered
          ? "drop-shadow(1px 1px 0 var(--riso-secondary))"
          : "drop-shadow(5px 5px 0 var(--riso-secondary))",
        transform: hovered ? "translate(4px, 4px)" : "translate(0, 0)",
        transition: "filter 150ms, transform 150ms",
        cursor: "pointer",
        display: "flex",
        flexDirection: wide ? "row" : "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: wide ? 320 : "100%",
          height: wide ? "100%" : 200,
          minHeight: wide ? 260 : 200,
          background:
            "color-mix(in srgb, var(--riso-primary) 10%, var(--riso-paper, #f7f0e2))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, var(--riso-primary) 1.5px, transparent 0)",
            backgroundSize: "6px 6px",
            opacity: 0.13,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, var(--riso-secondary) 1px, transparent 0)",
            backgroundSize: "10px 10px",
            backgroundPosition: "3px 3px",
            opacity: 0.09,
            mixBlendMode: "multiply",
          }}
        />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <Badge variant="default">{project.year}</Badge>
        </div>
      </div>

      <div
        style={{
          padding: "24px 24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
            fontWeight: 700,
            fontSize: 8,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "var(--riso-secondary)",
            margin: 0,
          }}
        >
          {project.category}
        </p>

        <div style={{ position: "relative", display: "inline-block" }}>
          <h3
            aria-hidden
            style={{
              position: "absolute",
              left: 2,
              top: 2,
              margin: 0,
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: wide ? 28 : 22,
              textTransform: "uppercase",
              color: "var(--riso-secondary)",
              opacity: 0.3,
              userSelect: "none",
            }}
          >
            {project.title}
          </h3>
          <h3
            style={{
              margin: 0,
              position: "relative",
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: wide ? 28 : 22,
              textTransform: "uppercase",
              color: "var(--riso-primary)",
            }}
          >
            {project.title}
          </h3>
        </div>

        <p
          style={{
            fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
            fontSize: 13,
            lineHeight: 1.7,
            color: "var(--riso-overlap, #7b4f7a)",
            margin: 0,
            flex: 1,
          }}
        >
          {project.desc}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--riso-primary)",
            margin: 0,
            borderBottom: "2px solid var(--riso-primary)",
            paddingBottom: 2,
            display: "inline-block",
          }}
        >
          View project →
        </p>
      </div>
    </article>
  );
}

function WorkSection() {
  const [featured, ...rest] = WORK;

  return (
    <section
      id="work"
      style={{ background: "var(--riso-paper, #f7f0e2)", padding: "80px 0" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div>
            <p
              style={{
                fontFamily:
                  "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                fontWeight: 700,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.38em",
                color: "var(--riso-secondary)",
                marginBottom: 14,
              }}
            >
              Selected work
            </p>
            <MisregTextReveal
              text="Print runs."
              as="h2"
              size={44}
              animateOnMount={false}
            />
          </div>
          <PlateRegistration
            variant="target"
            size={48}
            primaryOpacity={0.5}
            secondaryOpacity={0.35}
          />
        </div>

        <Separator variant="heavy" style={{ marginBottom: 32 }} />

        <div style={{ marginBottom: 3 }}>
          <ProjectCard project={featured} wide />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 3,
          }}
        >
          {rest.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS — animated Timeline
//
// Design: each Timeline item's `content` slot receives a Progress bar that
// starts at value=0 and jumps to the real proficiency value when the section
// becomes visible. Progress has built-in CSS transition-[width] duration-400ms
// so the bars fill themselves with no extra animation code.
//
// Stagger: each item's wrapper div gets a CSS transition-delay so bar fills
// land 100ms apart. We use inline style transitionDelay on the wrapper —
// Progress itself renders the filled div with its own transition, the delay
// here affects the moment the parent re-renders with the new value, which is
// immediate (all bars get the new value at once on `fired`), so we need a
// different approach: each Progress gets its own local value that increments
// on a timer with per-item stagger.
//
// Stagger implementation: custom AnimatedProgress wrapper reads `fired` and
// `delay` props, uses useEffect with setTimeout(delay) to flip from 0 → target
// after the stagger duration. Progress itself animates the rest via its CSS.
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedProgress({
  target,
  fired,
  delay,
  label,
}: {
  target: number;
  fired: boolean;
  delay: number;
  label: string;
}) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!fired) return;
    const t = setTimeout(() => setValue(target), delay);
    return () => clearTimeout(t);
  }, [fired, target, delay]);

  // Progress: value (0-100), label?, showValue?, variant?
  return <Progress value={value} label={label} showValue variant="halftone" />;
}

function ProcessSection() {
  const { ref, visible } = useOnceVisible(0.2);

  // Build Timeline items with animated Progress bars as content
  const items = PROCESS_STEPS.map((step, idx) => ({
    id: step.id,
    label: step.label,
    date: step.date,
    status: step.status,
    content: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          paddingTop: 6,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
            fontSize: 12,
            lineHeight: 1.5,
            color: "var(--riso-overlap, #7b4f7a)",
            margin: 0,
          }}
        >
          {step.note}
        </p>
        {/* AnimatedProgress fires after section enters viewport.
            Delay = idx * 120ms so bars stagger left-to-right top-to-bottom. */}
        <AnimatedProgress
          target={step.proficiency}
          fired={visible}
          delay={idx * 120}
          label={step.skill}
        />
      </div>
    ),
  }));

  return (
    <section
      id="process"
      ref={ref as React.RefObject<HTMLElement>}
      style={{ background: "var(--riso-paper, #f7f0e2)", padding: "80px 0" }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "start",
        }}
      >
        {/* Left — copy */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
              fontWeight: 700,
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.38em",
              color: "var(--riso-secondary)",
              marginBottom: 14,
            }}
          >
            How I work
          </p>

          <MisregTextReveal
            text="Constraint first."
            as="h2"
            size={40}
            animateOnMount={false}
          />

          <p
            style={{
              fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
              fontSize: 15,
              lineHeight: 1.85,
              color: "var(--riso-overlap, #7b4f7a)",
              marginTop: 24,
              marginBottom: 20,
            }}
          >
            Every project starts with the same question: what can we remove? The
            answer shapes everything — the API surface, the visual system, the
            ship date.
          </p>

          <p
            style={{
              fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
              fontSize: 15,
              lineHeight: 1.85,
              color: "var(--riso-overlap, #7b4f7a)",
              marginBottom: 40,
            }}
          >
            I work across design and engineering. Handoff is a pull request, not
            a Figma link. The finished product is the only deliverable that
            matters.
          </p>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <PlateRegistration
              variant="cross"
              size={32}
              primaryOpacity={0.6}
              secondaryOpacity={0.4}
            />
            <PlateRegistration
              variant="cross"
              size={32}
              primaryOpacity={0.6}
              secondaryOpacity={0.4}
            />
            <PlateRegistration
              variant="cross"
              size={32}
              primaryOpacity={0.6}
              secondaryOpacity={0.4}
            />
          </div>
        </div>

        {/* Right — Timeline with animated Progress bars in each content slot */}
        <Timeline items={items} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORK ETHIC SECTION — replaces generic stats band
//
// Three InkDensityMeter columns. Each meter has animated=true (default) so
// it counts up internally when value changes. We use the same fired pattern:
// value starts 0, flips to real target when section enters viewport.
//
// InkDensityMeter props: value, label, height, width, showValue, animated.
// SparklineRow props: data (number[]), width, height, ink ("primary"|"secondary").
//
// Layout: primary-ink background, three equal columns each with a label,
// InkDensityMeter standing vertically, a SparklineRow below it,
// and a small note line at the bottom.
// ─────────────────────────────────────────────────────────────────────────────

function WorkEthicSection() {
  const { ref, visible } = useOnceVisible(0.3);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        background: "var(--riso-primary)",
        padding: "80px 0",
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
            "radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 0)",
          backgroundSize: "4px 4px",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--riso-secondary)",
          opacity: 0.07,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
        }}
      >
        {/* Header */}
        <p
          style={{
            fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
            fontWeight: 700,
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.38em",
            color: "rgba(255,255,255,0.5)",
            marginBottom: 12,
          }}
        >
          Ink levels
        </p>

        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: 64,
          }}
        >
          <h2
            aria-hidden
            style={{
              position: "absolute",
              left: 3,
              top: 3,
              margin: 0,
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: 40,
              textTransform: "uppercase",
              color: "var(--riso-secondary)",
              opacity: 0.35,
              userSelect: "none",
            }}
          >
            How full is the press.
          </h2>
          <h2
            style={{
              margin: 0,
              position: "relative",
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: 40,
              textTransform: "uppercase",
              color: "white",
            }}
          >
            How full is the press.
          </h2>
        </div>

        {/* Meter columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
            alignItems: "end",
          }}
        >
          {ETHIC_METERS.map((meter, idx) => (
            <div
              key={meter.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              {/* Column heading */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily:
                      "var(--font-riso-headline, 'Epilogue', sans-serif)",
                    fontWeight: 900,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "white",
                    margin: "0 0 4px",
                  }}
                >
                  {meter.sublabel}
                </p>
                <p
                  style={{
                    fontFamily:
                      "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                    fontWeight: 700,
                    fontSize: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.5)",
                    margin: 0,
                  }}
                >
                  {meter.label}
                </p>
              </div>

              {/* InkDensityMeter — value flips from 0 → target when visible.
                  animated=true (default) so it counts up itself.
                  Each meter gets a staggered delay via its own fired state. */}
              <InkDensityMeter
                value={visible ? meter.value : 0}
                label={undefined}
                height={180}
                width={56}
                showValue
                animated
                // White ink look — override via RisoThemeProps
                primary="rgba(255,255,255,0.9)"
                secondary="var(--riso-secondary)"
                paper="rgba(255,255,255,0.08)"
              />

              {/* SparklineRow — activity over time */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <p
                  style={{
                    fontFamily:
                      "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                    fontWeight: 700,
                    fontSize: 7,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                  }}
                >
                  Trajectory
                </p>
                <SparklineRow
                  data={meter.sparkData}
                  width={100}
                  height={32}
                  ink={meter.ink}
                  // White ink — override SparklineRow colors via RisoThemeProps
                  primary="rgba(255,255,255,0.85)"
                  secondary="var(--riso-secondary)"
                />
              </div>

              {/* Note */}
              <p
                style={{
                  fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.65)",
                  textAlign: "center",
                  margin: 0,
                  maxWidth: 180,
                }}
              >
                {meter.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom double rule */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <div style={{ height: 3, background: "rgba(255,255,255,0.2)" }} />
        <div
          style={{
            height: 1,
            background: "var(--riso-secondary)",
            opacity: 0.55,
          }}
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section
      id="about"
      style={{
        background: "var(--riso-primary)",
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 0)",
          backgroundSize: "4px 4px",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: -40,
          bottom: -120,
          fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
          fontWeight: 900,
          fontSize: 360,
          lineHeight: 1,
          color: "rgba(255,255,255,0.04)",
          textTransform: "uppercase",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        AV
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 72,
          alignItems: "center",
          position: "relative",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 32,
            }}
          >
            <Avatar initials="AV" size="xl" variant="filled" />
            <div>
              <p
                style={{
                  fontFamily:
                    "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                  fontWeight: 700,
                  fontSize: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: 6,
                }}
              >
                About
              </p>
              <p
                style={{
                  fontFamily:
                    "var(--font-riso-headline, 'Epilogue', sans-serif)",
                  fontWeight: 900,
                  fontSize: 28,
                  textTransform: "uppercase",
                  color: "white",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Alexandra Voss
              </p>
            </div>
          </div>

          <Separator variant="dotted" style={{ marginBottom: 28 }} />

          <p
            style={{
              fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
              fontSize: 15,
              lineHeight: 1.85,
              color: "rgba(255,255,255,0.85)",
              marginBottom: 20,
            }}
          >
            Design engineer based in Berlin. Four years running the visual
            design practice at two independent print studios — that's where the
            obsession with multiply blend modes and registration marks started.
          </p>

          <p
            style={{
              fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
              fontSize: 15,
              lineHeight: 1.85,
              color: "rgba(255,255,255,0.85)",
              marginBottom: 32,
            }}
          >
            Before that: four years as a frontend engineer at a Berlin payments
            startup. Both halves inform the work.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              "Design Systems",
              "React / TypeScript",
              "SVG & CSS",
              "Figma",
              "Print Production",
            ].map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <Stamp
            label="Berlin"
            sublabel="Germany"
            variant="default"
            size={136}
            rotate={-7}
            primary="white"
            secondary="var(--riso-secondary)"
          />
          <Stamp
            label="Available"
            sublabel="Q3 2024"
            variant="approved"
            size={104}
            rotate={9}
            primary="white"
            secondary="var(--riso-secondary)"
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────────

function ContactSection() {
  type FormState = "idle" | "submitting" | "sent";
  const [state, setState] = React.useState<FormState>("idle");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.includes("@")) e.email = "Enter a valid email";
    if (message.trim().length < 20) e.message = "At least 20 characters please";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setState("submitting");
    setTimeout(() => setState("sent"), 1800);
  };

  return (
    <section
      id="contact"
      style={{ background: "var(--riso-paper, #f7f0e2)", padding: "80px 0" }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
              fontWeight: 700,
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.38em",
              color: "var(--riso-secondary)",
              marginBottom: 14,
            }}
          >
            Get in touch
          </p>

          <MisregTextReveal
            text="Let's make a print run."
            as="h2"
            size={36}
            animateOnMount={false}
          />

          <p
            style={{
              fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
              fontSize: 15,
              lineHeight: 1.85,
              color: "var(--riso-overlap, #7b4f7a)",
              marginTop: 24,
              marginBottom: 36,
            }}
          >
            Available for design systems work, frontend engineering projects,
            and risograph print consultations. I respond within 48 hours.
          </p>

          <a
            href="mailto:alex@example.com"
            style={{
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: 16,
              textTransform: "uppercase",
              color: "var(--riso-primary)",
              textDecoration: "none",
              borderBottom: "3px solid var(--riso-primary)",
              paddingBottom: 3,
              display: "inline-block",
              marginBottom: 32,
            }}
          >
            alex@example.com
          </a>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["GitHub", "Dribbble", "Read.cv"].map((platform) => (
              <a
                key={platform}
                href="#"
                style={{
                  fontFamily:
                    "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                  fontWeight: 700,
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "var(--riso-secondary)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: 20,
                    height: 2,
                    background: "var(--riso-secondary)",
                  }}
                />
                {platform}
              </a>
            ))}
          </div>
        </div>

        {state === "sent" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: "48px 28px",
              outline: "2px solid var(--riso-secondary)",
              filter: "drop-shadow(5px 5px 0 var(--riso-secondary))",
              minHeight: 340,
            }}
          >
            <Stamp label="Sent" variant="approved" size={96} rotate={4} />
            <p
              style={{
                fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
                fontWeight: 900,
                fontSize: 20,
                textTransform: "uppercase",
                color: "var(--riso-primary)",
                textAlign: "center",
                margin: 0,
              }}
            >
              Message delivered.
            </p>
            <p
              style={{
                fontFamily: "var(--font-riso-body, 'Work Sans', sans-serif)",
                fontSize: 14,
                lineHeight: 1.65,
                color: "var(--riso-overlap, #7b4f7a)",
                textAlign: "center",
                margin: 0,
              }}
            >
              I'll reply to {email} within 48 hours.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Input
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              disabled={state === "submitting"}
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={state === "submitting"}
            />
            <Textarea
              label="Message"
              placeholder="Tell me about the project — constraints, timeline, what success looks like."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={errors.message}
              showCount
              maxLength={1000}
              rows={6}
              disabled={state === "submitting"}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                loading={state === "submitting"}
                disabled={state === "submitting"}
              >
                {state === "submitting" ? "Sending…" : "Send message →"}
              </Button>
              {state === "submitting" && (
                <InkBlotLoader size="sm" label="Sending" />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function PortfolioFooter() {
  return (
    <footer
      style={{
        borderTop: "3px solid var(--riso-primary)",
        padding: "28px 24px",
        position: "relative",
        background: "var(--riso-paper, #f7f0e2)",
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
          opacity: 0.65,
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
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: 15,
              textTransform: "uppercase",
              color: "var(--riso-secondary)",
              opacity: 0.35,
              userSelect: "none",
            }}
          >
            Alexandra Voss
          </span>
          <span
            style={{
              position: "relative",
              fontFamily: "var(--font-riso-headline, 'Epilogue', sans-serif)",
              fontWeight: 900,
              fontSize: 15,
              textTransform: "uppercase",
              color: "var(--riso-primary)",
            }}
          >
            Alexandra Voss
          </span>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["Work", "Process", "About", "Contact"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                fontFamily:
                  "var(--font-riso-label, 'Space Grotesk', sans-serif)",
                fontWeight: 700,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--riso-secondary)",
                textDecoration: "none",
              }}
            >
              {l}
            </a>
          ))}
          <span
            style={{
              fontFamily: "var(--font-riso-label, 'Space Grotesk', sans-serif)",
              fontWeight: 700,
              fontSize: 8,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "color-mix(in srgb, var(--riso-primary) 35%, transparent)",
            }}
          >
            © 2024
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

function PortfolioPage() {
  return (
    <main style={{ background: "var(--riso-paper, #f7f0e2)" }}>
      <PortfolioNav />
      <HeroSection />
      <WorkSection />
      <ProcessSection />
      <WorkEthicSection />
      <AboutSection />
      <ContactSection />
      <PortfolioFooter />
    </main>
  );
}
export default PortfolioPage;
