"use client";

import * as React from "react";
import { Badge } from "@/registry/riso/ui/badge";
import { Button } from "@/registry/riso/ui/button";
import { Card } from "@/registry/riso/ui/card";
import { PrintBlock } from "@/registry/riso/ui/print-block";
import { Separator } from "@/registry/riso/ui/separator";
import { Stamp } from "@/registry/riso/ui/stamp";
import { TornPaper } from "@/registry/riso/ui/torn-paper";
import * as RisoUtils from "@/lib/riso-utils";

export interface EditionCardProps extends RisoUtils.RisoThemeProps {
  editionNumber?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  price?: string;
  inkColors?: string[];
  stampText?: string;
  onBuy?: () => void;
}

export function EditionCard({
  editionNumber = "Ed. 042 / 200",
  title = "Midnight Bloom",
  subtitle = "Two-pass risograph print",
  description = "A layered floral composition with deliberate misregistration and soft grain texture across a short-run archival edition.",
  price = "¥4,800",
  inkColors = ["Fluorescent Pink", "Marine Blue"],
  stampText = "LIMITED",
  onBuy,
  theme,
  primary,
  secondary,
  overlap,
  paper,
}: EditionCardProps) {
  const risoStyle = RisoUtils.resolveRisoVars({
    theme,
    primary,
    secondary,
    overlap,
    paper,
  });
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [added]);

  const handleBuy = () => {
    onBuy?.();
    setAdded(true);
  };

  return (
    <Card
      className="relative w-full max-w-[420px] overflow-hidden p-0"
      style={risoStyle}
    >
      <div className="relative">
        <PrintBlock className="pr-24">
          <p className="font-[family-name:var(--font-riso-label)] text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--riso-paper)]">
            Limited edition
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-riso-headline)] text-[22px] font-black uppercase tracking-[0.03em] text-[var(--riso-paper)]">
            {editionNumber}
          </h3>
        </PrintBlock>

        <Stamp
          label={stampText}
          size={88}
          rotate={12}
          className="absolute -right-2 -top-4 z-[1]"
        />
      </div>

      <div className="space-y-5 bg-[var(--riso-paper)] p-5">
        <div>
          <h4 className="font-[family-name:var(--font-riso-headline)] text-[24px] font-black uppercase tracking-[0.03em] text-[var(--riso-primary)]">
            {title}
          </h4>
          <p className="mt-1 font-[family-name:var(--font-riso-label)] text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--riso-secondary)]">
            {subtitle}
          </p>
          <Separator className="mt-4" />
          <p className="mt-4 text-[13px] leading-[1.7] text-[var(--riso-overlap)]">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {inkColors.map((inkColor) => (
            <Badge key={inkColor} variant="secondary">
              {inkColor}
            </Badge>
          ))}
        </div>

        <TornPaper seed={42} height={40} fill="paper" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-riso-label)] text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--riso-secondary)]">
              Price
            </p>
            <p className="mt-1 font-[family-name:var(--font-riso-headline)] text-[26px] font-black uppercase tracking-[0.02em] text-[var(--riso-primary)]">
              {price}
            </p>
          </div>

          <Button onClick={handleBuy}>{added ? "Added" : "Buy Print"}</Button>
        </div>
      </div>
    </Card>
  );
}
