"use client";

// registry/new-york/ui/calendar.tsx — Risograph Calendar
//
// Visual system:
//   - Selected date: PrintBlock treatment (solid primary fill, white text)
//   - Today: primary outline with secondary hard shadow
//   - Events: small colored rectangles that bleed slightly past cell border
//   - Day headers: uppercase label style in secondary color
//   - Navigation: two-ink chevrons

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveRisoVars, type RisoThemeProps } from "@/lib/riso-utils";

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  label: string;
  ink?: "primary" | "secondary" | "overlap";
}

interface CalendarProps extends RisoThemeProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  events?: CalendarEvent[];
  className?: string;
  style?: React.CSSProperties;
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function toKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function Calendar({ value,
  defaultValue,
  onChange,
  events = [],
  className, theme, primary, secondary, overlap, paper, style }: CalendarProps) {
  const risoStyle = resolveRisoVars({ theme, primary, secondary, overlap, paper });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selected, setSelected] = React.useState<Date | undefined>(
    value ?? defaultValue,
  );
  const [viewDate, setViewDate] = React.useState(() => {
    const d = value ?? defaultValue ?? today;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const currentSelected = value ?? selected;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Generate calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsMap = React.useMemo(() => {
    const m: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      if (!m[ev.date]) m[ev.date] = [];
      m[ev.date].push(ev);
    });
    return m;
  }, [events]);

  const navigate = (dir: -1 | 1) => {
    setViewDate(new Date(year, month + dir, 1));
  };

  const handleSelect = (d: Date) => {
    setSelected(d);
    onChange?.(d);
  };

  return (
    <div
      className={cn(
        "inline-block bg-[var(--riso-paper,#f7f0e2)]  outline-2 outline-[var(--riso-primary)] [filter:drop-shadow(4px_4px_0_var(--riso-secondary))] min-w-[280px]",
        className,
      )} style={{ ...risoStyle, ...style }}
    >
      {/* Header — month/year + nav */}
      <div className="flex items-center justify-between px-[14px] py-[10px] border-b-2 border-[var(--riso-primary)] bg-[var(--riso-primary)]">
        <button
          onClick={() => navigate(-1)}
          className="bg-transparent border-none cursor-pointer p-1"
          aria-label="Previous month"
        >
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            aria-hidden
          >
            <line
              x1="15"
              y1="1"
              x2="8"
              y2="9"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <line
              x1="8"
              y1="9"
              x2="1"
              y2="1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </button>

        <h3 className="font-[family-name:var(--font-riso-headline,'Epilogue',sans-serif)] font-black text-[14px] uppercase tracking-[0.05em] text-white m-0 [text-shadow:1px_1px_0_var(--riso-secondary)]">
          {MONTHS[month]} {year}
        </h3>

        <button
          onClick={() => navigate(1)}
          className="bg-transparent border-none cursor-pointer p-1"
          aria-label="Next month"
        >
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            aria-hidden
          >
            <line
              x1="1"
              y1="1"
              x2="8"
              y2="9"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <line
              x1="8"
              y1="9"
              x2="15"
              y2="1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-1.5 px-0 text-center font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] font-bold text-[8px] uppercase tracking-[0.15em] text-[var(--riso-secondary)]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Double-rule separator */}
      <div className="relative h-[6px]">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--riso-primary)]" />
        <div className="absolute top-1 left-0 right-0 h-[1px] bg-[var(--riso-secondary)] opacity-70" />
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} className="py-1.5" />;

          const key = toKey(date);
          const isToday = date.getTime() === today.getTime();
          const isSel = currentSelected && toKey(currentSelected) === key;
          const dayEvs = eventsMap[key] ?? [];
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          return (
            <div
              key={key}
              onClick={() => handleSelect(date)}
              className={cn(
                "relative py-1 px-0.5 cursor-pointer text-center",
                isSel && "bg-[var(--riso-primary)]",
                isToday &&
                !isSel &&
                " outline-2 outline-[var(--riso-primary)] [filter:drop-shadow(2px_2px_0_var(--riso-secondary))]",
              )}
              onMouseEnter={(e) => {
                if (!isSel)
                  (e.currentTarget as HTMLDivElement).style.background =
                    "color-mix(in srgb,var(--riso-secondary) 15%,transparent)";
              }}
              onMouseLeave={(e) => {
                if (!isSel)
                  (e.currentTarget as HTMLDivElement).style.background =
                    "transparent";
              }}
            >
              <span
                className={cn(
                  "block font-[family-name:var(--font-riso-label,'Space_Grotesk',sans-serif)] text-[11px]",
                  isSel || isToday ? "font-bold" : "font-normal",
                  isSel
                    ? "text-white"
                    : isWeekend
                      ? "text-[var(--riso-secondary)]"
                      : "text-[var(--riso-overlap,#7b4f7a)]",
                )}
              >
                {date.getDate()}
              </span>

              {/* Event dots — bleed past cell border */}
              {dayEvs.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-0.5">
                  {dayEvs.slice(0, 3).map((ev, ei) => {
                    const c =
                      ev.ink === "secondary"
                        ? "var(--riso-secondary)"
                        : ev.ink === "overlap"
                          ? "var(--riso-overlap,#7b4f7a)"
                          : "var(--riso-primary)";
                    return (
                      <div
                        key={ei}
                        className="w-[5px] h-[5px] -mb-0.5"
                        style={{ background: isSel ? "white" : c }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


