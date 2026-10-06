"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  BadgeDollarSign,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CodeXml,
  FlaskConical,
  Heart,
  LayoutGrid,
  LogOut,
  Settings,
  Zap,
} from "@/components/nava/icons";
import { cn } from "@/components/nava/ui";

function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) close();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return ref;
}

export function ClientMenu({
  value,
  clients,
  onSelect,
}: {
  value: string;
  clients: Array<{ id: string; name: string }>;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const options = [{ id: "all", name: "All Clients" }, ...clients];
  const current = options.find((option) => option.id === value) ?? options[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className="flex min-w-48 items-center justify-between gap-3 rounded-xl bg-[var(--surface-card-alt)] px-3.5 py-2 text-sm font-medium transition hover:brightness-95"
      >
        {current.name}
        <ChevronDown className={cn("h-4 w-4 text-[var(--muted-foreground)] transition", open && "rotate-180")} />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-40 mt-2 max-h-72 w-64 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-[0_12px_32px_rgba(25,28,35,0.14)]"
        >
          {options.map((option) => (
            <li key={option.id} role="option" aria-selected={option.id === current.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(option.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-card-alt)]"
              >
                {option.name}
                {option.id === current.id ? <Check className="h-4 w-4" /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function MenuItem({
  href,
  icon,
  label,
  trailing,
  onClick,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
  trailing?: ReactNode;
  onClick?: () => void;
}) {
  const className =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-card-alt)]";
  const content = (
    <>
      <span className="text-[var(--muted-foreground)]">{icon}</span>
      <span className="flex-1">{label}</span>
      {trailing}
    </>
  );

  return href ? (
    <Link href={href} onClick={onClick} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function ProfileMenu({
  name,
  organization,
  channels,
  onLogout,
}: {
  name: string;
  organization: string;
  channels: number;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useDismiss(open, close);
  const icon = "h-[18px] w-[18px]";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className="flex items-center gap-2.5 rounded-full bg-[var(--surface-card-alt)] py-1.5 pl-2 pr-3 transition hover:brightness-95"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-accent)] text-xs font-semibold text-[var(--surface-accent-foreground)]">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden text-sm font-medium sm:block">{name}</span>
        <ChevronDown className={cn("hidden h-4 w-4 text-[var(--muted-foreground)] transition sm:block", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-72 rounded-2xl bg-white p-3 shadow-[0_12px_32px_rgba(25,28,35,0.16)]"
        >
          <div className="px-2 pb-3">
            <p className="text-base font-semibold">{organization}</p>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              Free plan · {channels} channels
            </p>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--surface-card-alt)] py-2 text-sm font-medium hover:brightness-95"
            >
              <Zap className="h-4 w-4" /> Upgrade Plan
            </button>
          </div>
          <div className="space-y-0.5 border-t border-[var(--border-subtle)] py-2">
            <MenuItem href="/app/settings" onClick={close} icon={<Settings className={icon} />} label="Settings" trailing={<span className="h-2 w-2 rounded-full bg-amber-300" />} />
            <MenuItem href="/app/accounts" onClick={close} icon={<LayoutGrid className={icon} />} label="Channels" />
            <MenuItem href="/app/settings" onClick={close} icon={<BadgeDollarSign className={icon} />} label="Plans and Billing" />
            <MenuItem icon={<CircleHelp className={icon} />} label="Help & Support" trailing={<ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />} />
          </div>
          <div className="space-y-0.5 border-t border-[var(--border-subtle)] py-2">
            <MenuItem icon={<CodeXml className={icon} />} label="API" trailing={<span className="rounded-full bg-[#fbe0f3] px-2 py-0.5 text-xs font-medium text-[#8a1b63]">New</span>} />
            <MenuItem icon={<LayoutGrid className={icon} />} label="Apps & Integrations" trailing={<ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />} />
            <MenuItem icon={<FlaskConical className={icon} />} label="Beta Features" trailing={<span className="rounded-full bg-[#dff5ee] px-2 py-0.5 text-xs font-medium text-[#12664a]">Off</span>} />
            <MenuItem icon={<Heart className={icon} />} label="Refer a Friend" />
          </div>
          <div className="border-t border-[var(--border-subtle)] pt-2">
            <MenuItem icon={<LogOut className={icon} />} label="Log out" onClick={() => { close(); onLogout(); }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
