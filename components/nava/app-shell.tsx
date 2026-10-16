"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarRange,
  ChartColumnBig,
  CheckCircle2,
  CircleUserRound,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  PenLine,
  Sidebar,
  UserRoundSearch,
  UsersRound,
} from "@/components/nava/icons";
import { ProfileMenu } from "@/components/nava/header-menus";
import { useNava } from "@/components/nava/nava-provider";
import { Button, EmptyState, cn } from "@/components/nava/ui";
import { workspaceNavigation } from "@/lib/nava/navigation";

const navIcons = {
  "/app": LayoutDashboard,
  "/app/posts": CheckCircle2,
  "/app/approval": FolderKanban,
  "/app/calendar": CalendarRange,
  "/app/accounts": CircleUserRound,
  "/app/groups": UsersRound,
  "/app/analytics": ChartColumnBig,
  "/app/inbox": Inbox,
  "/app/contect": UserRoundSearch,
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready, sessionUser, state, workspace, logout, scopedSocialAccounts } = useNava();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
            <Link href="/onboarding">
              <Button>Continue onboarding</Button>
            </Link>
          }
        />
      </main>
    );
  }
  const isComposer = pathname === "/app/posts/new";
  const navigation = workspaceNavigation;

  return (
    <main className="min-h-screen bg-[var(--surface-canvas)] p-3 sm:p-4 md:flex md:gap-4">
      <aside
        className={cn(
          "mb-3 flex w-full shrink-0 flex-col rounded-2xl bg-white px-4 py-4 transition-[width] duration-200 sm:px-5 md:sticky md:top-4 md:mb-0 md:h-[calc(100vh-2rem)] md:py-5",
          isSidebarCollapsed ? "md:w-[76px] md:px-4" : "md:w-[220px]",
        )}
      >
        <div className={cn("mb-6 flex items-center justify-between", isSidebarCollapsed && "md:flex-col md:justify-start md:gap-3")}>
          <Link href="/app" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#292928] text-sm font-semibold text-white">
              N
            </div>
            <span className={cn("text-lg font-semibold tracking-tight text-foreground", isSidebarCollapsed && "md:hidden")}>
              NAVA
            </span>
          </Link>
          <button
            type="button"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
            aria-expanded={!isSidebarCollapsed}
            title={isSidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition hover:bg-[var(--surface-card-alt)] hover:text-foreground"
          >
            <Sidebar className="h-3.5 w-3.5" />
          </button>
        </div>

        <Link
          href="/app/posts/new"
          title="Create Post"
          className={cn(
            "mb-4 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--surface-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--surface-accent-foreground)] transition hover:brightness-95",
            isSidebarCollapsed && "md:px-0",
          )}
        >
          {isSidebarCollapsed ? <PenLine className="hidden h-4 w-4 md:block" /> : null}
          <span className={isSidebarCollapsed ? "md:hidden" : undefined}>Create Post</span>
        </Link>

        <nav className={cn("grid grid-cols-2 gap-1 md:block md:space-y-1", isSidebarCollapsed && "md:space-y-2")}>
          {navigation.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : item.href === "/app/posts"
                  ? pathname === "/app/posts"
                  : pathname.startsWith(item.href);
            const Icon = navIcons[item.href as keyof typeof navIcons];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-[#e9e7e3] text-foreground"
                    : "text-[var(--muted-foreground)] hover:bg-white/70 hover:text-foreground",
                  isSidebarCollapsed && "md:justify-center md:px-0",
                )}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <span className="flex items-center gap-3">
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  <span className={cn("font-medium", isSidebarCollapsed && "md:hidden")}>{item.label}</span>
                </span>
                {item.href === "/app/inbox" && !isSidebarCollapsed ? (
                  <span className="rounded-full bg-[#ffebeb] px-2 py-0.5 text-[11px] font-semibold text-[#d84c4c]">
                    4
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-0 pt-6">
          <ProfileMenu
            name={sessionUser.name}
            organization={sessionUser.name}
            channels={scopedSocialAccounts.length}
            avatarUrl={sessionUser.avatarUrl}
            onLogout={logout}
            placement="top"
            collapsed={isSidebarCollapsed}
          />
        </div>

      </aside>

      <section className="min-w-0 flex-1">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
          {isComposer ? (
            children
          ) : (
            <div className="min-h-[50vh] rounded-[22px] bg-[var(--surface-card)] px-4 py-4 sm:px-6 lg:px-7 lg:py-5 md:min-h-[calc(100vh-2rem)]">
              {children}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
