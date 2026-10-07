"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "@/components/nava/icons";
import { cn } from "@/components/nava/ui";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toLocalValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function DateTimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = new Date(value);
  const valid = !Number.isNaN(selected.getTime());
  const base = valid ? selected : new Date();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => new Date(base.getFullYear(), base.getMonth(), 1));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: first.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const today = new Date();

  function commit(next: Date) {
    onChange(toLocalValue(next));
  }

  function pickDay(day: number) {
    commit(new Date(view.getFullYear(), view.getMonth(), day, base.getHours(), base.getMinutes()));
  }

  function setTime(hours: number, minutes: number) {
    const next = new Date(base);
    next.setHours(hours, minutes, 0, 0);
    commit(next);
  }

  const timeSelect =
    "h-9 w-full cursor-pointer appearance-none rounded-xl bg-[var(--surface-card-alt)] px-3 text-center text-sm outline-none";

  return (
    <div ref={ref} className="relative w-fit max-w-full">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl bg-[var(--surface-card-alt)] px-3 text-xs hover:brightness-95"
      >
        <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
          <CalendarDays className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
          {valid
            ? base.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "Pick a date"}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-[var(--muted-foreground)] transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-40 mt-2 w-72 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(41,41,40,0.18)]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--surface-card-alt)]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <p className="text-sm font-semibold">
              {view.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--surface-card-alt)]"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[var(--muted-foreground)]">
            {weekdays.map((day) => (
              <span key={day} className="py-1">{day}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              if (!day) return <span key={`blank-${index}`} />;
              const isSelected =
                valid &&
                selected.getFullYear() === view.getFullYear() &&
                selected.getMonth() === view.getMonth() &&
                selected.getDate() === day;
              const isToday =
                today.getFullYear() === view.getFullYear() &&
                today.getMonth() === view.getMonth() &&
                today.getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => pickDay(day)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-full text-sm transition",
                    isSelected
                      ? "bg-[var(--surface-brand)] font-semibold text-white"
                      : "hover:bg-[var(--surface-card-alt)]",
                    isToday && !isSelected && "font-semibold text-[var(--surface-brand)]",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <select
              aria-label="Hour"
              value={base.getHours()}
              onChange={(event) => setTime(Number(event.target.value), base.getMinutes())}
              className={timeSelect}
            >
              {Array.from({ length: 24 }, (_, hour) => (
                <option key={hour} value={hour}>{pad(hour)}</option>
              ))}
            </select>
            <span className="text-sm font-semibold">:</span>
            <select
              aria-label="Minute"
              value={base.getMinutes()}
              onChange={(event) => setTime(base.getHours(), Number(event.target.value))}
              className={timeSelect}
            >
              {Array.from({ length: 60 }, (_, minute) => (
                <option key={minute} value={minute}>{pad(minute)}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-9 shrink-0 rounded-xl bg-[var(--surface-brand)] px-4 text-sm font-medium text-white hover:bg-[var(--surface-brand-strong)]"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
