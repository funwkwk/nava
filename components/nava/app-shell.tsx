"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  CalendarRange,
  ChartColumnBig,
  CircleUserRound,
  FolderKanban,
  Grid2x2,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  Plus,
  Settings,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";
import { useNava } from "@/components/nava/nava-provider";
import { Badge, Button, Card, EmptyState, Select, cn } from "@/components/nava/ui";
import { settingsNavigation, workspaceNavigation } from "@/lib/nava/navigation";
import { platformCatalog } from "@/lib/nava/navigation";

const navIcons = {
  "/app": LayoutDashboard,
  "/app/posts": FolderKanban,
  "/app/calendar": CalendarRange,
  "/app/accounts": CircleUserRound,
  "/app/groups": UsersRound,
  "/app/analytics": ChartColumnBig,
  "/app/inbox": Inbox,
  "/app/contect": UserRoundSearch,
  "/app/settings": Settings,
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready, sessionUser, state, workspace, selectedClient, selectClient } = useNava();

  if (!ready) {
    return (
      <main className="min-h-screen bg-[var(--surface-canvas)] px-6 py-8">
        <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="h-14 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-[680px] animate-pulse rounded-[28px] bg-slate-200" />
          </div>
          <div className="h-[760px] animate-pulse rounded-[28px] bg-white" />
        </div>
      </main>
    );
  }

  if (!sessionUser) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-8 lg:px-10">
        <EmptyState
          title="Sign in before opening the workspace"
          description="The new dashboard shell is ready, but it still needs a workspace owner before it can show the social workspace surfaces."
          action={
            <div className="flex flex-wrap gap-3">
              <Link href="/signup">
                <Button>Create account</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>
            </div>
          }
        />
      </main>
    );
  }

  if (!state.session.onboardingCompleted || !workspace) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-8 lg:px-10">
        <EmptyState
          title="Finish onboarding to unlock the workspace"
          description="NAVA still needs a workspace, ownership context, and the first connected social account before the redesigned dashboard becomes useful."
          action={
            <div className="flex flex-wrap gap-3">
              <Link href="/onboarding">
                <Button>Continue onboarding</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">Return to landing</Button>
              </Link>
            </div>
          }
        />
      </main>
    );
  }

  const navigation = [...workspaceNavigation, settingsNavigation];

  return (
    <main className="min-h-screen bg-[var(--surface-canvas)] p-4 lg:p-6">
      <div className="mx-auto grid max-w-[1560px] gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="flex min-h-[calc(100vh-3rem)] flex-col rounded-[28px] border border-[var(--surface-sidebar-border)] bg-[var(--surface-sidebar)] px-4 py-5">
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1f232b] text-sm font-semibold text-white">
                N
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">NAVA</p>
                <p className="text-xs text-[var(--muted-foreground)]">Workspace Suite</p>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-card)]">
              <Grid2x2 className="h-4 w-4 text-[var(--muted-foreground)]" />
            </div>
          </div>

          <button
            type="button"
            className="mb-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--surface-accent)] px-4 py-3 text-sm font-semibold text-[var(--surface-accent-foreground)] transition hover:brightness-95"
          >
            <Plus className="h-4 w-4" />
            New
          </button>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const active =
                item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
              const Icon = navIcons[item.href as keyof typeof navIcons];

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm transition",
                    active
                      ? "bg-[var(--surface-card)] text-foreground shadow-[var(--shadow-soft)]"
                      : "text-[var(--muted-foreground)] hover:bg-white/70 hover:text-foreground",
                  )}
                >
                  <span className="flex items-center gap-3">
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {item.href === "/app/inbox" ? (
                    <span className="rounded-full bg-[#ffebeb] px-2 py-0.5 text-[11px] font-semibold text-[#d84c4c]">
                      4
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 space-y-3 px-2">
            <p className="text-sm font-medium text-[var(--muted-foreground)]">Connect channels</p>
            <div className="flex flex-wrap gap-2">
              {platformCatalog.slice(0, 4).map((platform) => (
                <div
                  key={platform.value}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: platform.accent }}
                  title={platform.label}
                >
                  {platform.shortLabel}
                </div>
              ))}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--muted-foreground)]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <Card className="rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-none">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {state.socialAccounts.filter((account) => account.connectionStatus === "connected").length}/
                    {state.socialAccounts.length} channels connected
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Refresh the remaining accounts to unlock streak tracking.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full px-2 py-1 text-sm text-[var(--muted-foreground)]"
                >
                  ×
                </button>
              </div>
              <div className="mt-3 flex gap-1.5">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-1.5 flex-1 rounded-full bg-[var(--surface-card-alt)]">
                    <div
                      className={cn(
                        "h-1.5 rounded-full bg-[var(--surface-brand)]",
                        item === 0 ? "w-4/5" : item === 1 ? "w-2/5" : "w-1/5",
                      )}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex items-center justify-between rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111827] text-sm font-semibold text-white">
                  {sessionUser.name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{workspace.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Free Plan</p>
                </div>
              </div>
              <Badge tone="neutral">{sessionUser.accountType}</Badge>
            </div>
          </div>
        </aside>

        <section className="min-w-0 rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-card)] lg:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="brand">Demo mode</Badge>
              <Badge tone={state.supabaseConfigured ? "success" : "warning"}>
                {state.supabaseConfigured ? "Supabase ready" : "Local preview"}
              </Badge>
              {sessionUser.accountType === "agency" ? (
                <Select
                  value={workspace.selectedClientId}
                  onChange={(event) => selectClient(event.target.value)}
                  className="min-w-52 border-none bg-[var(--surface-card-alt)] shadow-none"
                >
                  <option value="all">All Clients</option>
                  {state.clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Select>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-card-alt)] text-[var(--muted-foreground)] transition hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 rounded-2xl bg-[var(--surface-card-alt)] px-3.5 py-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                  <MessageSquareText className="h-4 w-4 text-[var(--surface-brand)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{sessionUser.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {selectedClient ? `${selectedClient.name} active` : workspace.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}
