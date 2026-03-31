"use client";

// registry/riso/blocks/press-release-card.tsx — Press Release Card Block ★
//
// Combines: PrintBlock + Stamp + Badge (×3) + Separator + Avatar + Button

import * as React from "react";
import { PrintBlock } from "@/components/riso/ui/print-block";
import { Stamp } from "@/components/riso/ui/stamp";
import { Badge } from "@/components/riso/ui/badge";
import { Separator } from "@/components/riso/ui/separator";
import { Avatar } from "@/components/riso/ui/avatar";
import { Button } from "@/components/riso/ui/button";

interface PressReleaseCardProps {
  title?: string;
  subtitle?: string;
  date?: string;
  author?: string;
  authorInitials?: string;
  tags?: string[];
  status?: "approved" | "draft" | "pending" | "rejected";
  body?: string;
}

export function PressReleaseCard({
  title = "Riso UI Version 2.0",
  subtitle = "A two-ink misregistration component library",
  date = "March 2025",
  author = "Analog Press Studio",
  authorInitials = "AP",
  tags = ["Open Source", "Design System", "Risograph"],
  status = "approved",
  body = "Riso UI introduces a complete two-ink misregistration design system built with zero runtime dependencies. All visual effects — grain, bleed, halftone, hard shadow — are achieved through pure SVG filters and CSS blend modes.",
}: PressReleaseCardProps) {
  return (
    <div className="bg-[var(--riso-paper,#f7f0e2)] outline  outline-[var(--riso-primary)] [filter:drop-shadow(6px_6px_0_var(--riso-secondary))] max-w-[520px] relative">
      {/* Stamp — positioned top-right, rotated, overlaps header */}
      <div className="absolute top-3 right-4 z-10">
        <Stamp variant={status} size={72} />
      </div>

      {/* PrintBlock header */}
      <PrintBlock ink="primary" className="px-6 py-5">
        <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.3em] text-white/65 m-0">
          Press Release · {date}
        </p>
        <h2 className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[22px] uppercase tracking-[0.03em] leading-[1.1] text-white mt-1.5 mb-0 mx-0 pr-20">
          {title}
        </h2>
        <p className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.12em] text-white/70 mt-1 mb-0 mx-0">
          {subtitle}
        </p>
      </PrintBlock>

      {/* Tags */}
      <div className="px-6 py-3 flex gap-2 flex-wrap">
        {tags.map((tag, i) => (
          <Badge
            key={tag}
            variant={i === 0 ? "default" : i === 1 ? "secondary" : "stamp"}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <Separator />

      {/* Body text */}
      <div className="px-6 py-4">
        <p className="font-[family-name:var(--font-riso-body,'Work_Sans',sans-serif)] text-[12px] leading-[1.7] text-[var(--riso-overlap,#7b4f7a)] m-0">
          {body}
        </p>
      </div>

      <Separator variant="dotted" />

      {/* Footer — author + CTA */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <Avatar initials={authorInitials} size="sm" />
          <span className="font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[9px] uppercase tracking-[0.12em] text-[var(--riso-secondary)]">
            {author}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Share
          </Button>
          <Button variant="primary" size="sm">
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
}
