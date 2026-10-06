"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Eye,
  Funnel,
  Hash,
  ImagePlus,
  Info,
  Lightbulb,
  MessageCircle,
  MessageSquareText,
  PenLine,
  Plus,
  Sparkles,
  UsersRound,
  WalletCards,
  WaveHand,
  X,
} from "@/components/nava/icons";
import { z } from "zod";
import { useNava } from "@/components/nava/nava-provider";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  SectionHeading,
  Select,
  Textarea,
  cn,
} from "@/components/nava/ui";
import { platformCatalog } from "@/lib/nava/navigation";
import type { Platform } from "@/lib/nava/types";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDayLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function getGreeting(name: string) {
  const hour = new Date().getHours();

  if (hour < 12) {
    return `Good Morning, ${name}!`;
  }

  if (hour < 18) {
    return `Good Afternoon, ${name}!`;
  }

  return `Good Evening, ${name}!`;
}

function getStatusTone(status: string) {
  if (status === "scheduled" || status === "approved" || status === "connected") {
    return "success" as const;
  }

  if (status === "pending" || status === "revision-requested" || status === "attention") {
    return "warning" as const;
  }

  if (status === "critical") {
    return "critical" as const;
  }

  return "neutral" as const;
}

function getPlatformLabel(platform: string) {
  return platformCatalog.find((entry) => entry.value === platform)?.label ?? platform;
}

function getPlatformAccent(platform: string) {
  return platformCatalog.find((entry) => entry.value === platform)?.accent ?? "#0F67EA";
}

function surfaceBox(className?: string) {
  return cn(
    "rounded-[22px] bg-[var(--surface-card-alt)]",
    className,
  );
}

function SocialPill({ platform }: { platform: string }) {
  return (
    <span
      className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
      style={{ backgroundColor: getPlatformAccent(platform) }}
    >
      {getPlatformLabel(platform)}
    </span>
  );
}

function PlaceholderPage({
  eyebrow,
  title,
  description,
  points,
  icon: Icon,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  icon: typeof UsersRound;
  actionLabel: string;
}) {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-5 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[var(--surface-card-alt)]">
            <Icon className="h-6 w-6 text-[var(--surface-brand)]" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
          </div>
          <Button>{actionLabel}</Button>
        </Card>

        <Card className="space-y-4 p-6">
          <p className="text-sm font-semibold text-[var(--muted-foreground)]">What belongs here</p>
          <div className="grid gap-3">
            {points.map((point) => (
              <div key={point} className={surfaceBox("px-4 py-3")}>
                <p className="text-sm leading-7 text-foreground">{point}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const {
    scopedContentItems,
    scopedSocialAccounts,
    sessionUser,
    workspace,
  } = useNava();

  if (!workspace || !sessionUser) {
    return null;
  }

  const scheduledPosts = [...scopedContentItems]
    .filter((item) => item.status === "scheduled")
    .sort((left, right) => +new Date(left.scheduledFor) - +new Date(right.scheduledFor));
  const pendingComments = scopedContentItems.filter(
    (item) => item.approvalStatus === "pending" || item.approvalStatus === "revision-requested",
  );
  const connectedChannels = scopedSocialAccounts.filter(
    (account) => account.connectionStatus === "connected",
  );
  const postingGoals = Math.max(scopedContentItems.length - scheduledPosts.length, 0);
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2f4ff] text-2xl">
              <WaveHand className="h-7 w-7 text-[var(--surface-brand)]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {getGreeting(sessionUser.name)}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date())}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-card-alt)] text-[var(--muted-foreground)] transition hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              value: connectedChannels.length,
              label: "Week Streak",
              note: "Connect accounts and publish consistently to grow your streak.",
            },
            {
              value: postingGoals,
              label: "Posting Goals",
              note: "Drafts not scheduled yet can become this week's publishing goals.",
            },
            {
              value: pendingComments.length,
              label: "Comment Score",
              note: "Pending conversations and reviews stay visible in the workspace.",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex min-h-28 items-center gap-4 rounded-2xl bg-[var(--surface-card-alt)] px-4 py-4"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[5px] border-[#e7e1d8] bg-white text-2xl font-semibold text-[#525968]">
                {stat.value}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium">{stat.label}</p>
                  <button
                    type="button"
                    aria-label={`About ${stat.label}`}
                    title={stat.note}
                    className="shrink-0 rounded-full text-[var(--muted-foreground)] transition hover:text-foreground"
                  >
                    <CircleHelp className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{stat.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-[#dff0ff] px-6 py-4 text-sm text-[#265a82]">
          <Info className="h-4 w-4" />
          <p>
            Connect a channel to start tracking your posting streak, goals, and engagement in one
            place.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">First Steps</h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {[
            {
              step: "1. Connect a channel",
              description: "Personalize your profile and connect the first social surface for real scheduling context.",
              buttonLabel: "Connect Channel",
              icon: Plus,
            },
            {
              step: "2. Create a post",
              description: "Draft your first post in just a few clicks and attach platform-specific variants.",
              buttonLabel: "Create Post",
              icon: PenLine,
              href: "/app/posts",
            },
            {
              step: "3. Explore analytics",
              description: "Track goals, activity, and account health from one clean dashboard view.",
              buttonLabel: "Get Started",
              icon: ArrowUpRight,
              href: "/app/analytics",
            },
          ].map((card) => {
            const Icon = card.icon;

            return (
              <Card key={card.step} className="space-y-4 bg-[var(--surface-card-alt)] p-5 shadow-none">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{card.step}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                      {card.description}
                    </p>
                  </div>
                  <Check className="mt-1 h-5 w-5 text-[var(--muted-foreground)]" />
                </div>
                {card.href ? (
                  <Link href={card.href}>
                    <Button variant="ghost" size="sm" className="bg-white hover:bg-white hover:brightness-95">
                      <Icon className="mr-2 h-4 w-4" />
                      {card.buttonLabel}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="ghost" size="sm" className="bg-white hover:bg-white hover:brightness-95">
                    <Icon className="mr-2 h-4 w-4" />
                    {card.buttonLabel}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <PublishingTrends items={scopedContentItems} />
    </div>
  );
}

function PublishingTrends({ items }: { items: Array<{ scheduledFor: string }> }) {
  const days = 30;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 9);
  const counts = Array.from({ length: days }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return items.filter((item) => new Date(item.scheduledFor).toDateString() === day.toDateString()).length;
  });
  const yMax = Math.max(10, Math.ceil(Math.max(...counts) / 5) * 5);
  const width = 1000;
  const height = 260;
  const left = 36;
  const bottom = 28;
  const plotW = width - left - 10;
  const plotH = height - bottom - 10;
  const x = (index: number) => left + (plotW * index) / (days - 1);
  const y = (value: number) => 10 + plotH - (plotH * value) / yMax;
  const fmt = (offset: number) => {
    const day = new Date(start);
    day.setDate(start.getDate() + offset);
    return day.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  };
  const ticks = [0, 4, 9, 14, 19, 24, 29];

  return (
    <section className="space-y-4 rounded-2xl bg-[var(--surface-card-alt)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Publishing Trends</h2>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex h-9 items-center gap-2 rounded-xl bg-white px-3 text-sm text-[var(--muted-foreground)]">
            <Funnel className="h-4 w-4" /> Filter By
          </button>
          <button type="button" className="inline-flex h-9 min-w-32 items-center justify-between gap-3 rounded-xl bg-white px-3 text-sm">
            Current <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
          </button>
        </div>
      </div>
      <p className="text-sm">Total Posts : {counts.reduce((sum, value) => sum + value, 0)}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Publishing trends chart">
        {Array.from({ length: yMax + 1 }, (_, value) => value).filter((value) => value % (yMax / 10) === 0).map((value) => (
          <g key={value}>
            <line x1={left} x2={width - 10} y1={y(value)} y2={y(value)} stroke="#e6e3dd" />
            <text x={left - 8} y={y(value) + 4} textAnchor="end" fontSize="12" fill="#525968">{value}</text>
          </g>
        ))}
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} x2={x(tick)} y1={10} y2={10 + plotH} stroke="#e6e3dd" />
            <text x={x(tick)} y={height - 8} textAnchor="middle" fontSize="12" fill="#525968">{tick === 9 ? "today" : fmt(tick)}</text>
          </g>
        ))}
        <polyline fill="none" stroke="#0f67ea" strokeWidth="2" strokeLinejoin="round" points={counts.map((value, index) => `${x(index)},${y(value)}`).join(" ")} />
        {counts.map((value, index) => (
          <circle key={index} cx={x(index)} cy={y(value)} r="2.5" fill="#0f67ea" />
        ))}
      </svg>
    </section>
  );
}

export function PostsPage() {
  const { addContentItem, scopedContentItems, selectedClient, sessionUser, state, workspace } = useNava();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [view, setView] = useState<"board" | "gallery">("board");
  const [form, setForm] = useState({
    title: "",
    summary: "",
    pillar: "Education",
    objective: "Engagement",
    scheduledFor: "2026-10-09T09:00",
    clientId: "",
    platforms: ["instagram", "threads"],
  });

  const contentSchema = z.object({
    title: z.string().trim().min(3, "Add a post title."),
    summary: z.string().trim().min(12, "Summarize the post clearly."),
    pillar: z.string().trim().min(2, "Choose a pillar."),
    objective: z.string().trim().min(2, "Choose an objective."),
    scheduledFor: z.string().trim().min(1, "Set a scheduled time."),
    clientId: z.string().optional(),
    platforms: z.array(z.string()).min(1, "Pick at least one platform."),
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function togglePlatform(platform: string) {
    setForm((previous) => {
      const exists = previous.platforms.includes(platform);

      return {
        ...previous,
        platforms: exists
          ? previous.platforms.filter((entry) => entry !== platform)
          : [...previous.platforms, platform],
      };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFeedback(null);

    const result = contentSchema.safeParse(form);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Review the post form and try again.");
      return;
    }

    addContentItem({
      ...result.data,
      clientId: result.data.clientId || null,
      platforms: result.data.platforms as Platform[],
      scheduledFor: new Date(result.data.scheduledFor).toISOString(),
    });
    setFeedback("Post created and added to the list.");
    setComposerOpen(false);
    setForm((previous) => ({
      ...previous,
      title: "",
      summary: "",
    }));
  }

  if (!workspace) {
    return null;
  }

  const columns = [
    { status: "idea", title: "Ideas" },
    { status: "draft", title: "To Do" },
    { status: "scheduled", title: "In Progress" },
    { status: "published", title: "Done" },
  ] as const;

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-5 border-b border-[var(--border-subtle)] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white">
              <Lightbulb className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Create</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                {selectedClient ? `${selectedClient.name} content` : "Plan and organize your content"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/app/content"
            className="inline-flex h-10 items-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 text-sm font-medium transition hover:bg-[var(--surface-card-alt)]"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Templates
          </Link>
          <Button size="sm" onClick={() => setComposerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Idea
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-5 text-sm">
          <button type="button" className="border-b-2 border-[var(--surface-brand)] px-1 py-2 font-semibold">
            Board
          </button>
          <Link href="/app/calendar" className="px-1 py-2 text-[var(--muted-foreground)] hover:text-foreground">
            Calendar
          </Link>
          <Link href="/app/content" className="px-1 py-2 text-[var(--muted-foreground)] hover:text-foreground">
            Templates
          </Link>
          <span className="hidden px-1 py-2 text-[var(--muted-foreground)] sm:block">Feeds</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--muted-foreground)]">
            <Hash className="h-4 w-4" />
            Tags
          </span>
          <div className="flex rounded-lg border border-[var(--border-subtle)] p-1">
            {(["board", "gallery"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={view === mode}
                onClick={() => setView(mode)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm capitalize transition",
                  view === mode ? "bg-[var(--surface-accent)] text-[var(--surface-accent-foreground)]" : "text-[var(--muted-foreground)]",
                )}
              >
                {mode === "board" ? "Board" : "Gallery"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {feedback ? (
        <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {feedback}
        </p>
      ) : null}

      {view === "board" ? (
        <div className="grid min-h-[560px] gap-4 overflow-x-auto pb-2 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            const items = scopedContentItems.filter((item) => item.status === column.status);

            return (
              <section key={column.status} className="min-w-0 rounded-xl bg-[var(--surface-card-alt)] p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">{column.title}</h2>
                    <span className="rounded-full bg-[#e9e7e3] px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">
                      {items.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Add to ${column.title}`}
                    onClick={() => setComposerOpen(true)}
                    className="rounded-md p-1 text-[var(--muted-foreground)] hover:bg-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <article key={item.id} className="rounded-lg border border-[var(--border-subtle)] bg-white p-3.5 shadow-[0_2px_8px_rgba(28,31,38,0.03)]">
                      <div className="mb-3 flex items-center gap-1.5">
                        {item.platformVariants.slice(0, 3).map((variant) => (
                          <span
                            key={variant.id}
                            title={getPlatformLabel(variant.platform)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white"
                            style={{ backgroundColor: getPlatformAccent(variant.platform) }}
                          >
                            {platformCatalog.find((platform) => platform.value === variant.platform)?.shortLabel}
                          </span>
                        ))}
                        <span className="ml-auto text-[11px] text-[var(--muted-foreground)]">
                          {item.pillar}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold leading-5">{item.title}</h3>
                      <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-[var(--muted-foreground)]">
                        {item.summary}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--muted-foreground)]">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDateTime(item.scheduledFor)}
                        </span>
                        <span>{item.objective}</span>
                      </div>
                    </article>
                  ))}
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm text-[var(--muted-foreground)] transition hover:bg-white hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    New Idea
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {scopedContentItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-[var(--border-subtle)] bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                {item.platformVariants.map((variant) => <SocialPill key={variant.id} platform={variant.platform} />)}
              </div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-2 line-clamp-4 text-sm leading-6 text-[var(--muted-foreground)]">{item.summary}</p>
              <p className="mt-4 text-xs text-[var(--muted-foreground)]">{formatDateTime(item.scheduledFor)}</p>
            </article>
          ))}
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="min-h-44 rounded-xl border border-dashed border-[var(--border-strong)] text-sm text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)]"
          >
            <Plus className="mx-auto mb-2 h-5 w-5" />
            New Idea
          </button>
        </div>
      )}

      {composerOpen ? (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#292928]/75 p-3 sm:p-6"
          onClick={() => setComposerOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="composer-title"
            className="flex max-h-[94vh] w-full max-w-[1050px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setComposerOpen(false);
              }
            }}
          >
            <header className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-3">
                <h2 id="composer-title" className="font-semibold">Create Post</h2>
                <span className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--muted-foreground)]">
                  Tags <span className="ml-1">⌄</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-[var(--muted-foreground)] sm:flex">
                  <Sparkles className="h-4 w-4" /> AI Assistant
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-accent)] px-3 py-1.5 text-sm font-medium text-[var(--surface-accent-foreground)]">
                  <Eye className="h-4 w-4" /> Preview
                </span>
                <button
                  type="button"
                  aria-label="Close post editor"
                  onClick={() => setComposerOpen(false)}
                  className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[1.7fr_1fr]">
              <form id="post-form" className="flex flex-col gap-4 p-5 sm:p-7" onSubmit={handleSubmit}>
                <div className="flex flex-wrap gap-2">
                  {platformCatalog.map((platform) => {
                    const active = form.platforms.includes(platform.value);
                    return (
                      <button
                        key={platform.value}
                        type="button"
                        aria-pressed={active}
                        title={platform.label}
                        onClick={() => togglePlatform(platform.value)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg border text-[11px] font-bold transition",
                          active ? "border-[var(--border-strong)] bg-[var(--surface-card-alt)] text-foreground" : "border-[var(--border-subtle)] text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)]",
                        )}
                      >
                        {platform.shortLabel}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] p-4">
                  <label className="block">
                    <span className="sr-only">Post title</span>
                    <Input
                      placeholder="Give your post a title"
                      value={form.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      className="rounded-lg border-0 px-1 shadow-none focus:ring-0"
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Post content</span>
                    <Textarea
                      placeholder="Start writing or get inspired with Templates"
                      value={form.summary}
                      onChange={(event) => updateField("summary", event.target.value)}
                      className="min-h-32 rounded-lg border-0 px-1 shadow-none focus:ring-0"
                    />
                  </label>
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border-strong)] text-center text-xs text-[var(--muted-foreground)]">
                    <ImagePlus className="mb-1 h-5 w-5" />
                    Add media
                  </div>
                  <div className="flex items-center gap-3 border-t border-[var(--border-subtle)] pt-3 text-[var(--muted-foreground)]">
                    <Plus className="h-4 w-4" />
                    <span>⌄</span>
                    <span className="h-5 border-l border-[var(--border-subtle)]" />
                    <span aria-label="Add emoji">☺</span>
                    <Hash className="h-4 w-4" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                    Content pillar
                    <Input value={form.pillar} onChange={(event) => updateField("pillar", event.target.value)} className="rounded-lg py-2.5" />
                  </label>
                  <label className="space-y-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                    Publish date
                    <Input type="datetime-local" value={form.scheduledFor} onChange={(event) => updateField("scheduledFor", event.target.value)} className="rounded-lg py-2.5" />
                  </label>
                  {sessionUser?.accountType === "agency" ? (
                    <label className="space-y-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                      Client
                      <Select value={form.clientId} onChange={(event) => updateField("clientId", event.target.value)} className="rounded-lg py-2.5">
                        <option value="">Use active client</option>
                        {state.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
                      </Select>
                    </label>
                  ) : null}
                  <label className="space-y-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                    Objective
                    <Input value={form.objective} onChange={(event) => updateField("objective", event.target.value)} className="rounded-lg py-2.5" />
                  </label>
                </div>
                {error ? <p role="alert" className="text-sm text-rose-600">{error}</p> : null}
              </form>

              <aside className="flex min-h-64 flex-col border-t border-[var(--border-subtle)] bg-[var(--surface-card-alt)] p-5 sm:p-7 md:border-l md:border-t-0">
                <h3 className="text-sm font-semibold">Post Previews</h3>
                <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                  <div className="mb-4 flex h-44 w-36 flex-col rounded-xl border border-[var(--border-subtle)] bg-white p-3 text-left shadow-sm">
                    <div className="mb-3 flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
                      <div className="h-5 w-5 rounded-full bg-[var(--surface-card-alt)]" />
                      <div className="h-2 w-16 rounded-full bg-[var(--surface-card-alt)]" />
                    </div>
                    <div className="flex flex-1 items-center justify-center rounded-md bg-[var(--surface-card-alt)] text-[var(--muted-foreground)]">
                      <ImagePlus className="h-6 w-6 opacity-50" />
                    </div>
                    <div className="mt-3 h-2 w-4/5 rounded-full bg-[var(--surface-card-alt)]" />
                    <div className="mt-1.5 h-2 w-3/5 rounded-full bg-[var(--surface-card-alt)]" />
                  </div>
                  <p className="text-sm font-medium">
                    {form.title || "See your post's preview here"}
                  </p>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--muted-foreground)]">
                    {form.summary || "Choose a channel and start writing to preview how your post will look."}
                  </p>
                </div>
              </aside>
            </div>

            <footer className="flex items-center justify-between border-t border-[var(--border-subtle)] px-5 py-3.5 sm:px-7">
              <button type="button" onClick={() => setComposerOpen(false)} className="text-sm font-medium text-[var(--muted-foreground)]">
                Cancel
              </button>
              <Button type="submit" form="post-form" size="sm">
                Save Draft
              </Button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export function CalendarPage() {
  const { scopedContentItems, selectedClient } = useNava();

  const agenda = useMemo(() => {
    return [...scopedContentItems].sort(
      (left, right) => +new Date(left.scheduledFor) - +new Date(right.scheduledFor),
    );
  }, [scopedContentItems]);

  const groupedAgenda = agenda.reduce<Record<string, typeof agenda>>((groups, item) => {
    const key = formatDayLabel(item.scheduledFor);
    groups[key] = groups[key] ? [...groups[key], item] : [item];
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Calender"
        title={selectedClient ? `${selectedClient.name} calender` : "Publishing calender"}
        description="Agenda-style scheduling with lightweight cards and enough metadata to avoid opening every item."
      />

      {agenda.length ? (
        <div className="space-y-4">
          {Object.entries(groupedAgenda).map(([group, items]) => (
            <Card key={group} className="space-y-4 p-5 shadow-none">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{group}</h2>
                <Badge tone="neutral">{items.length} scheduled</Badge>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className={surfaceBox("p-4")}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">{item.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.summary}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
                        <Badge tone={getStatusTone(item.approvalStatus)}>{item.approvalStatus}</Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">
                      <CalendarDays className="h-4 w-4" />
                      <span>{formatDateTime(item.scheduledFor)}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.platformVariants.map((variant) => (
                        <SocialPill key={variant.id} platform={variant.platform} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing scheduled yet"
          description="The calender fills automatically as soon as posts have a publish time."
        />
      )}
    </div>
  );
}

export function AccountsPage() {
  const { scopedSocialAccounts } = useNava();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Accounts"
        title="Connected channels"
        description="Review social account health, supported capabilities, and the handles currently mapped into the workspace."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {scopedSocialAccounts.map((account) => (
          <Card key={account.id} className="space-y-4 p-5 shadow-none">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white"
                  style={{ backgroundColor: getPlatformAccent(account.platform) }}
                >
                  {getPlatformLabel(account.platform).slice(0, 2)}
                </div>
                <div>
                  <p className="text-lg font-semibold">{getPlatformLabel(account.platform)}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{account.handle}</p>
                </div>
              </div>
              <Badge tone={getStatusTone(account.connectionStatus)}>{account.connectionStatus}</Badge>
            </div>

            <div className="grid gap-2">
              {account.capabilities.map((capability) => (
                <div key={capability} className={surfaceBox("px-4 py-3")}>
                  <p className="text-sm font-medium">{capability}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function GroupsPage() {
  const { state } = useNava();

  return (
    <PlaceholderPage
      eyebrow="Groups"
      title="Group work by brand, campaign, or publishing lane"
      description="This area can become the home for grouped workflows without breaking the cleaner dashboard direction."
      points={[
        `Create campaign groups across ${state.clients.length || 1} workspace scopes.`,
        "Bundle posts, approvals, and analytics into one visible operating lane.",
        "Keep the UX simple while preserving room for future agency workflows.",
      ]}
      icon={UsersRound}
      actionLabel="Create Group"
    />
  );
}

export function AnalyticsPage() {
  const { scopedContentItems, scopedSocialAccounts, state } = useNava();

  const bars = scopedSocialAccounts.map((account) => ({
    id: account.id,
    label: getPlatformLabel(account.platform),
    value: account.postsThisWeek,
    accent: getPlatformAccent(account.platform),
  }));

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Analytics"
        title="Performance overview"
        description="Analytical surfaces stay quiet, readable, and intentionally non-decorative while metrics are still demo-seeded."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {state.insightKpis.map((metric) => (
          <Card key={metric.id} className="space-y-2 p-5 shadow-none">
            <p className="text-sm font-medium text-[var(--muted-foreground)]">{metric.label}</p>
            <p className="text-4xl font-semibold tracking-tight">{metric.value}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{metric.delta}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4 p-6 shadow-none">
          <div className="flex items-center gap-3">
            <ArrowUpRight className="h-5 w-5 text-[var(--surface-brand)]" />
            <h2 className="text-2xl font-semibold tracking-tight">Channel output</h2>
          </div>
          <div className="space-y-4">
            {bars.map((bar) => (
              <div key={bar.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{bar.label}</span>
                  <span className="text-[var(--muted-foreground)]">{bar.value} scheduled posts</span>
                </div>
                <div className="h-3 rounded-full bg-[var(--surface-card-alt)]">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${Math.max(15, Math.min(100, bar.value * 22))}%`,
                      backgroundColor: bar.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 p-6 shadow-none">
          <div className="flex items-center gap-3">
            <WalletCards className="h-5 w-5 text-[var(--surface-brand)]" />
            <h2 className="text-2xl font-semibold tracking-tight">Top opportunities</h2>
          </div>
          <div className="space-y-3">
            {scopedContentItems.slice(0, 3).map((item) => (
              <div key={item.id} className={surfaceBox("p-4")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.summary}</p>
                  </div>
                  <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ApprovalPage() {
  const { scopedContentItems } = useNava();
  const needingReview = scopedContentItems.filter(
    (item) => item.approvalStatus === "pending" || item.approvalStatus === "revision-requested",
  );

  return (
    <PlaceholderPage
      eyebrow="Approval"
      title="Keep reviews clear and lightweight"
      description="Approval remains available as a separate surface, but the redesigned shell keeps the visual language calm and product-like."
      points={[
        `${needingReview.length} posts currently need feedback or approval.`,
        "Future share-link review can slot into this layout without reworking the shell.",
        "The dashboard already surfaces the most urgent review items up front.",
      ]}
      icon={MessageSquareText}
      actionLabel="Review Pending Items"
    />
  );
}

export function AuditPage() {
  return (
    <PlaceholderPage
      eyebrow="Audit"
      title="Audit recommendations without noisy visuals"
      description="The audit route stays available, but the new design pushes the core insight loop into simpler, calmer cards."
      points={[
        "Critical, high-priority, and opportunity findings can keep using the existing workspace data model.",
        "Recommendations remain actionable rather than decorative.",
        "This page can grow later without forcing a redesign of the new dashboard shell.",
      ]}
      icon={WalletCards}
      actionLabel="Open Audit Report"
    />
  );
}

export function InboxPage() {
  const { scopedContentItems } = useNava();
  const pending = scopedContentItems.filter((item) => item.approvalStatus !== "not-required");

  return (
    <PlaceholderPage
      eyebrow="Inbox"
      title="Review messages, approvals, and follow-ups"
      description="This surface is ready to become the communication inbox for comments, review notes, and social engagement."
      points={[
        `${pending.length} items already carry a review-ready approval state.`,
        "Future conversations can merge share-link comments and social inbox events.",
        "The layout stays intentionally spacious, close to the dashboard language you asked for.",
      ]}
      icon={MessageSquareText}
      actionLabel="Open Review Queue"
    />
  );
}

export function ContectPage() {
  const { state } = useNava();

  return (
    <PlaceholderPage
      eyebrow="Contect"
      title="Contact and relationship workspace"
      description="Use this area for client-side stakeholders, creator contacts, and campaign relationships without changing the rest of the shell."
      points={[
        `${state.clients.length} client records already provide the first ownership layer.`,
        "Can later support contact roles, notes, share-link recipients, and review history.",
        "Keeps the visual system consistent with the redesigned dashboard and sidebar.",
      ]}
      icon={UsersRound}
      actionLabel="Add Contact"
    />
  );
}

export function SettingsPage() {
  const { logout, resetDemo, sessionUser, setTheme, state, theme, workspace } = useNava();

  if (!workspace || !sessionUser) {
    return null;
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Settings"
        title="Workspace settings"
        description="A cleaner configuration area that matches the new shell while keeping environment status and demo controls accessible."
      />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4 p-6 shadow-none">
          <h2 className="text-2xl font-semibold tracking-tight">Workspace summary</h2>
          <div className="grid gap-3">
            <div className={surfaceBox("p-4")}>
              <p className="text-sm text-[var(--muted-foreground)]">Workspace</p>
              <p className="mt-1 text-lg font-semibold">{workspace.name}</p>
            </div>
            <div className={surfaceBox("p-4")}>
              <p className="text-sm text-[var(--muted-foreground)]">Account type</p>
              <p className="mt-1 text-lg font-semibold capitalize">{sessionUser.accountType}</p>
            </div>
            <div className={surfaceBox("p-4")}>
              <p className="text-sm text-[var(--muted-foreground)]">Owner email</p>
              <p className="mt-1 text-lg font-semibold">{sessionUser.email}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6 shadow-none">
          <h2 className="text-2xl font-semibold tracking-tight">Environment readiness</h2>
          <div className="grid gap-3">
            <div className={surfaceBox("p-4")}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Supabase configuration</p>
                <Badge tone={state.supabaseConfigured ? "success" : "warning"}>
                  {state.supabaseConfigured ? "Ready" : "Missing"}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                Connect NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to replace demo data with live services.
              </p>
            </div>
            <div className={surfaceBox("p-4")}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Demo state</p>
                <Badge tone="brand">Enabled</Badge>
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                Reset clears the local preview and returns the app to the onboarding flow.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={logout}>
              Sign out
            </Button>
            <Button variant="danger" onClick={resetDemo}>
              Reset demo workspace
            </Button>
          </div>
        </Card>
      </div>

      <Card className="space-y-4 p-6 shadow-none">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Appearance</h2>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            Light mode is now the default. You can switch the workspace color mode here at any time.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              value: "light",
              title: "Light mode",
              description: "Bright canvas with soft neutral surfaces, matching the default product look.",
            },
            {
              value: "dark",
              title: "Dark mode",
              description: "Deeper contrast for low-light work sessions and alternate workspace styling.",
            },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value as "light" | "dark")}
              className={cn(
                surfaceBox("p-5 text-left transition"),
                theme === option.value
                  ? "border-[var(--surface-brand)] bg-[var(--surface-brand-soft)]"
                  : "hover:border-[var(--border-strong)]",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold">{option.title}</p>
                <Badge tone={theme === option.value ? "brand" : "neutral"}>
                  {theme === option.value ? "Active" : "Available"}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
