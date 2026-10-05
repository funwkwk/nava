"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CalendarRange,
  Check,
  CircleHelp,
  Clock3,
  Info,
  MessageCircle,
  MessageSquareText,
  PenLine,
  Plus,
  UsersRound,
  WalletCards,
} from "lucide-react";
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
    "rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface-card-alt)]",
    className,
  );
}

function EmptyDashboardBlock({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof CalendarRange;
}) {
  return (
    <div className={surfaceBox("flex min-h-[200px] flex-col items-center justify-center p-6 text-center")}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#efebe5]">
        <Icon className="h-5 w-5 text-[var(--muted-foreground)]" />
      </div>
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
    </div>
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
    selectedClient,
    sessionUser,
    state,
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
  const templateCards = [
    {
      emoji: "💡",
      title: "Post the tip you gave someone one-on-one",
      description: "Turn a private insight into a clean, public social post with one strong takeaway.",
    },
    {
      emoji: "📝",
      title: "Give yourself a report card for the year so far",
      description: "Package your recent wins, misses, and lessons into one concise reflection thread.",
    },
    {
      emoji: "📌",
      title: "Defend an opinion most disagree with",
      description: "Frame a contrarian take clearly, then support it with one proof point and one CTA.",
    },
    {
      emoji: "🔁",
      title: "Own a belief you've reversed",
      description: "Explain what changed your perspective and what your audience can learn from it.",
    },
  ];

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-[var(--border-subtle)] p-0 shadow-none">
        <div className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2f4ff] text-2xl">
              👋
            </div>
            <div className="space-y-1">
              <h1 className="text-[2rem] font-semibold tracking-tight">
                {getGreeting(sessionUser.name)}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date())}
                {selectedClient ? ` · ${selectedClient.name}` : ` · ${workspace.name}`}
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

        <div className="grid border-y border-[var(--border-subtle)] lg:grid-cols-3">
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
          ].map((stat, index, items) => (
            <div
              key={stat.label}
              className={cn(
                "flex items-center gap-4 px-6 py-5",
                index < items.length - 1 && "border-b border-[var(--border-subtle)] lg:border-b-0 lg:border-r",
              )}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#e7e1d8] text-2xl font-semibold text-[#525968]">
                {stat.value}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium">{stat.label}</p>
                  <CircleHelp className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{stat.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-[#dff0ff] px-6 py-4 text-sm text-[#265a82]">
          <Info className="h-4 w-4" />
          <p>
            Connect a channel to start tracking your posting streak, goals, and engagement in one
            place.
          </p>
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">First Steps</h2>
          <Badge tone="neutral">{state.mode === "demo" ? "Demo walkthrough" : "Workspace setup"}</Badge>
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
              <Card key={card.step} className="space-y-4 p-5 shadow-none">
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
                    <Button variant="secondary" size="sm">
                      <Icon className="mr-2 h-4 w-4" />
                      {card.buttonLabel}
                    </Button>
                  </Link>
                ) : (
                  <Button variant="secondary" size="sm">
                    <Icon className="mr-2 h-4 w-4" />
                    {card.buttonLabel}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">Up Next</h2>
          {scheduledPosts.length ? (
            <Card className="space-y-3 p-5 shadow-none">
              {scheduledPosts.slice(0, 3).map((item) => (
                <div key={item.id} className={surfaceBox("p-4")}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.summary}</p>
                    </div>
                    <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
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
            </Card>
          ) : (
            <EmptyDashboardBlock
              icon={CalendarRange}
              title="No posts scheduled yet."
              description="You'll see upcoming posts here as soon as your queue starts filling."
            />
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">Comments</h2>
          {pendingComments.length ? (
            <Card className="space-y-3 p-5 shadow-none">
              {pendingComments.slice(0, 3).map((item) => (
                <div key={item.id} className={surfaceBox("p-4")}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {item.approvalStatus === "pending"
                          ? "Waiting for feedback before publish."
                          : "Revisions requested before scheduling."}
                      </p>
                    </div>
                    <Badge tone={getStatusTone(item.approvalStatus)}>{item.approvalStatus}</Badge>
                  </div>
                </div>
              ))}
            </Card>
          ) : (
            <EmptyDashboardBlock
              icon={MessageCircle}
              title="No comments yet."
              description="You'll see the latest comments and review feedback here."
            />
          )}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
        <div className="grid gap-4 xl:grid-cols-4">
          {templateCards.map((card) => (
            <Card key={card.title} className="space-y-4 p-5 shadow-none">
              <div className="text-xl">{card.emoji}</div>
              <div>
                <p className="text-[1.15rem] font-semibold leading-8">{card.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  {card.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export function PostsPage() {
  const { addContentItem, scopedContentItems, selectedClient, sessionUser, state, workspace } = useNava();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    setForm((previous) => ({
      ...previous,
      title: "",
      summary: "",
    }));
  }

  if (!workspace) {
    return null;
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Posts"
        title={selectedClient ? `${selectedClient.name} posts` : "Post library"}
        description="Manage your publishing backlog, attach platform variants, and keep scheduling context visible without clutter."
        actions={<Badge tone="neutral">{scopedContentItems.length} posts</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-5 p-6 shadow-none">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Create a post</h2>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">
              Build one post object first, then attach channel-ready variations for each target.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              placeholder="Post title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
            <Textarea
              placeholder="What is this post about?"
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Content pillar"
                value={form.pillar}
                onChange={(event) => updateField("pillar", event.target.value)}
              />
              <Input
                placeholder="Objective"
                value={form.objective}
                onChange={(event) => updateField("objective", event.target.value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(event) => updateField("scheduledFor", event.target.value)}
              />
              {sessionUser?.accountType === "agency" ? (
                <Select
                  value={form.clientId}
                  onChange={(event) => updateField("clientId", event.target.value)}
                >
                  <option value="">Use active client</option>
                  {state.clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Select>
              ) : null}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--muted-foreground)]">Choose channels</p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {platformCatalog.map((platform) => {
                  const active = form.platforms.includes(platform.value);

                  return (
                    <button
                      key={platform.value}
                      type="button"
                      className={cn(
                        surfaceBox("px-4 py-3 text-left transition"),
                        active
                          ? "border-[var(--surface-brand)] bg-[var(--surface-brand-soft)]"
                          : "hover:border-[var(--border-strong)]",
                      )}
                      onClick={() => togglePlatform(platform.value)}
                    >
                      <p className="font-semibold">{platform.label}</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {platform.capabilities[0]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {feedback ? <p className="text-sm text-[var(--surface-brand)]">{feedback}</p> : null}

            <Button type="submit">Create Post</Button>
          </form>
        </Card>

        <Card className="space-y-4 p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Post list</h2>
              <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">
                Clean, table-like cards designed to feel less like generated UI and more like a real product workspace.
              </p>
            </div>
            <Badge tone="brand">{scopedContentItems.length}</Badge>
          </div>

          {scopedContentItems.length ? (
            <div className="space-y-3">
              {scopedContentItems.map((item) => (
                <div key={item.id} className={surfaceBox("p-4")}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">
                        {item.summary}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
                      <Badge tone={getStatusTone(item.approvalStatus)}>{item.approvalStatus}</Badge>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <Clock3 className="h-4 w-4" />
                    <span>{formatDateTime(item.scheduledFor)}</span>
                    <span>·</span>
                    <span>{item.objective}</span>
                    <span>·</span>
                    <span>{item.pillar}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.platformVariants.map((variant) => (
                      <SocialPill key={variant.id} platform={variant.platform} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No posts in this scope yet"
              description="Create your first post to start filling the calendar and dashboard."
            />
          )}
        </Card>
      </div>
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
