"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CalendarRange,
  Check,
  CircleUserRound,
  Bluesky,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  Facebook,
  Funnel,
  Hash,
  ImagePlus,
  Instagram,
  Info,
  Lightbulb,
  Linkedin,
  MessageCircle,
  MessageSquareText,
  PenLine,
  Plus,
  Search,
  Sparkles,
  Substack,
  Threads,
  Tiktok,
  XTwitter,
  Youtube,
  UsersRound,
  WalletCards,
  WaveHand,
  X,
} from "@/components/nava/icons";
import { z } from "zod";
import { ConnectChannelDialog } from "@/components/nava/connect-channel-dialog";
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
import type { Platform, TaskPriority, TaskStatus, WorkspaceTask } from "@/lib/nava/types";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

const platformIcons: Record<Platform, typeof Instagram> = {
  instagram: Instagram,
  tiktok: Tiktok,
  threads: Threads,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  x: XTwitter,
  bluesky: Bluesky,
  substack: Substack,
};

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
    scopedTasks,
    sessionUser,
    state,
    workspace,
  } = useNava();

  if (!workspace || !sessionUser) {
    return null;
  }

  const scheduledPosts = [...scopedContentItems]
    .filter((item) => item.status === "scheduled" && new Date(item.scheduledFor) >= new Date())
    .sort((left, right) => +new Date(left.scheduledFor) - +new Date(right.scheduledFor));
  const pendingApprovals = scopedContentItems.filter(
    (item) => item.approvalStatus === "pending" || item.approvalStatus === "revision-requested",
  );
  const connectedChannels = scopedSocialAccounts.filter(
    (account) => account.connectionStatus === "connected",
  );
  const postingGoals = scopedContentItems.filter((item) => item.status === "idea" || item.status === "draft").length;
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
              label: "Connected channels",
              note: "Accounts available in the selected workspace scope.",
            },
            {
              value: postingGoals,
              label: "Unscheduled posts",
              note: "Ideas and drafts that still need a publish time.",
            },
            {
              value: pendingApprovals.length,
              label: "Awaiting approval",
              note: "Posts currently marked for review or changes.",
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

        {connectedChannels.length === 0 ? <div className="flex items-center gap-3 rounded-2xl bg-[#dff0ff] px-6 py-4 text-sm text-[#265a82]">
          <Info className="h-4 w-4" />
          <p>
            Connect a channel to start tracking your posting streak, goals, and engagement in one
            place.
          </p>
        </div> : null}
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
              href: "/app/accounts",
              done: connectedChannels.length > 0,
            },
            {
              step: "2. Create a post",
              description: "Draft your first post in just a few clicks and attach platform-specific variants.",
              buttonLabel: "Create Post",
              icon: PenLine,
              href: "/app/posts/new",
              done: scopedContentItems.length > 0,
            },
            {
              step: "3. Explore analytics",
              description: "Track goals, activity, and account health from one clean dashboard view.",
              buttonLabel: "Get Started",
              icon: ArrowUpRight,
              href: "/app/analytics",
              done: false,
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
                  {card.done ? <Check className="mt-1 h-5 w-5 text-emerald-600" /> : <CircleHelp className="mt-1 h-5 w-5 text-[var(--muted-foreground)]" />}
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

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="space-y-4 p-5 shadow-none">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Upcoming posts</h2><Link href="/app/calendar" className="text-sm font-medium text-[var(--surface-brand)]">Open calendar</Link></div>
          {scheduledPosts.slice(0, 4).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-card-alt)] p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{item.title}</p><p className="text-xs text-[var(--muted-foreground)]">{item.platformVariants.map((variant) => getPlatformLabel(variant.platform)).join(", ")}</p></div><span className="shrink-0 text-xs text-[var(--muted-foreground)]">{formatDateTime(item.scheduledFor)}</span></div>)}
          {scheduledPosts.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">No posts are scheduled in this scope yet.</p> : null}
        </Card>
        <Card className="space-y-4 p-5 shadow-none">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Tasks due soon</h2><Link href="/app/posts" className="text-sm font-medium text-[var(--surface-brand)]">Open tasks</Link></div>
          {scopedTasks.filter((task) => task.status !== "done").sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate)).slice(0, 4).map((task) => <div key={task.id} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-card-alt)] p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{task.title}</p><p className="text-xs text-[var(--muted-foreground)]">{task.assignee} · {task.status.replace("-", " ")}</p></div><span className="shrink-0 text-xs text-[var(--muted-foreground)]">{new Date(task.dueDate).toLocaleDateString()}</span></div>)}
          {scopedTasks.filter((task) => task.status !== "done").length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">No open tasks in this scope.</p> : null}
        </Card>
        <Card className="space-y-4 p-5 shadow-none">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Posts awaiting approval</h2><Link href="/app/approval" className="text-sm font-medium text-[var(--surface-brand)]">Review posts</Link></div>
          {pendingApprovals.slice(0, 4).map((item) => <div key={item.id} className="rounded-xl bg-[var(--surface-card-alt)] p-3"><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs capitalize text-[var(--muted-foreground)]">{item.approvalStatus.replace("-", " ")}</p></div>)}
          {pendingApprovals.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">No posts are waiting for approval.</p> : null}
        </Card>
      </section>
      <PublishingTrends items={scopedContentItems} />
      <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Recent workspace activity</h2><Badge tone="neutral">Demo activity</Badge></div><div className="grid gap-3 md:grid-cols-3">{state.activities.map((activity) => <Card key={activity.id} className="space-y-2 p-4 shadow-none"><div className="flex items-center justify-between gap-2"><p className="font-semibold">{activity.title}</p><Badge tone={activity.tone === "attention" ? "warning" : activity.tone === "positive" ? "success" : "neutral"}>{activity.timeLabel}</Badge></div><p className="text-sm leading-6 text-[var(--muted-foreground)]">{activity.detail}</p></Card>)}</div></section>
    </div>
  );
}

const taskStatuses: Array<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review", label: "In Review" },
  { value: "done", label: "Done" },
];

export function TaskPage() {
  const { addTask, scopedTasks, selectedClient, state, updateContentItem, updateTask, workspace } = useNava();
  const [view, setView] = useState<"board" | "list">("board");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [form, setForm] = useState({ title: "", description: "", clientId: "", relatedPostId: "", assignee: "You", priority: "medium" as TaskPriority, status: "todo" as TaskStatus, dueDate: "", labels: "" });
  if (!workspace) return null;
  const visibleTasks = scopedTasks.filter((task) => {
    const matchesQuery = `${task.title} ${task.description} ${task.labels.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (statusFilter === "all" || task.status === statusFilter) && (priorityFilter === "all" || task.priority === priorityFilter);
  });
  const selectedTask = scopedTasks.find((task) => task.id === selectedTaskId) ?? null;
  const isOverdue = (task: WorkspaceTask) => task.status !== "done" && new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    addTask({ title: form.title.trim(), description: form.description.trim(), clientId: form.clientId || (workspace.selectedClientId !== "all" ? workspace.selectedClientId : null), relatedPostId: form.relatedPostId || null, assignee: form.assignee.trim() || "Unassigned", priority: form.priority, status: form.status, dueDate: new Date(`${form.dueDate}T17:00:00`).toISOString(), labels: form.labels.split(",").map((label) => label.trim()).filter(Boolean) });
    setCreateOpen(false);
    setForm((current) => ({ ...current, title: "", description: "", relatedPostId: "", labels: "" }));
  };
  const addComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTask || !newComment.trim()) return;
    updateTask(selectedTask.id, { comments: [...selectedTask.comments, `${new Date().toLocaleString()}: ${newComment.trim()}`] });
    setNewComment("");
  };

  return (
    <div className="space-y-5">
      <SectionHeading eyebrow="Workspace tasks" title={selectedClient ? `${selectedClient.name} tasks` : "Task management"} description="Track work, reviews, and deadlines across your workspace." actions={<Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" />New Task</Button>} />
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-[var(--surface-card)] p-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl bg-[var(--surface-card-alt)] px-3 py-2"><Search className="h-4 w-4 text-[var(--muted-foreground)]" /><input aria-label="Search tasks" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" className="w-full bg-transparent text-sm outline-none" /></div>
        <div className="flex flex-wrap items-center gap-2"><select aria-label="Filter tasks by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm"><option value="all">All statuses</option>{taskStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select><select aria-label="Filter tasks by priority" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="rounded-xl border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm"><option value="all">All priorities</option>{["high", "medium", "low"].map((priority) => <option key={priority}>{priority}</option>)}</select><div className="flex rounded-xl border border-[var(--border-subtle)] p-1">{(["board", "list"] as const).map((mode) => <button key={mode} type="button" aria-pressed={view === mode} onClick={() => setView(mode)} className={cn("rounded-lg px-3 py-1.5 text-sm capitalize", view === mode ? "bg-[var(--surface-accent)] text-[var(--surface-accent-foreground)]" : "text-[var(--muted-foreground)]")}>{mode}</button>)}</div><Badge tone="neutral">Local demo tasks</Badge></div>
      </section>

      {view === "board" ? <div className="grid gap-3 rounded-[24px] bg-[#F7F6F3] p-3 sm:p-4 xl:grid-cols-4">{taskStatuses.map((status) => {
        const columnTasks = visibleTasks.filter((task) => task.status === status.value);
        return <section key={status.value} aria-label={`${status.label} tasks`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (draggedTaskId) updateTask(draggedTaskId, { status: status.value }); setDraggedTaskId(null); }} className={cn("min-h-52 rounded-[20px] bg-[#F7F6F3] p-3 transition-colors", draggedTaskId && "ring-1 ring-[var(--border-strong)]")}><header className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-semibold">{status.label}</h2><Badge>{columnTasks.length}</Badge></header><div className="min-h-36 space-y-2 rounded-xl">{columnTasks.map((task) => <TaskCard key={task.id} task={task} clients={state.clients} overdue={isOverdue(task)} onOpen={() => setSelectedTaskId(task.id)} onStatusChange={(nextStatus) => updateTask(task.id, { status: nextStatus })} onDragStart={() => setDraggedTaskId(task.id)} onDragEnd={() => setDraggedTaskId(null)} />)}<button type="button" onClick={() => { setForm((current) => ({ ...current, status: status.value })); setCreateOpen(true); }} className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm text-[var(--muted-foreground)] hover:bg-white"><Plus className="h-4 w-4" />Add task</button></div></section>;
      })}</div> : <div className="overflow-x-auto rounded-[22px] bg-[var(--surface-card)]"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-[var(--border-subtle)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]"><tr>{["Task", "Client", "Assignee", "Priority", "Due date", "Status"].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead><tbody>{visibleTasks.map((task) => <tr key={task.id} className="border-b border-[var(--border-subtle)] last:border-0"><td className="px-4 py-3"><button type="button" onClick={() => setSelectedTaskId(task.id)} className="text-left font-semibold hover:text-[var(--surface-brand)]">{task.title}<span className="mt-1 block max-w-sm truncate text-xs font-normal text-[var(--muted-foreground)]">{task.description}</span></button></td><td className="px-4 py-3">{state.clients.find((client) => client.id === task.clientId)?.name ?? "Workspace"}</td><td className="px-4 py-3">{task.assignee}</td><td className="px-4 py-3"><Badge tone={task.priority === "high" ? "critical" : task.priority === "medium" ? "warning" : "neutral"}>{task.priority}</Badge></td><td className={cn("px-4 py-3", isOverdue(task) && "font-semibold text-rose-600")}>{new Date(task.dueDate).toLocaleDateString()}</td><td className="px-4 py-3"><select aria-label={`Status for ${task.title}`} value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as TaskStatus })} className="rounded-lg border border-[var(--border-subtle)] bg-white px-2 py-1.5">{taskStatuses.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></td></tr>)}</tbody></table>{visibleTasks.length === 0 ? <EmptyState title="No tasks match these filters" description="Try changing your search or add a task to get started." /> : null}</div>}

      {createOpen ? <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-[#292928]/60 p-4" onClick={() => setCreateOpen(false)}><section role="dialog" aria-modal="true" aria-labelledby="new-task-title" className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}><header className="flex items-center justify-between"><h2 id="new-task-title" className="text-lg font-semibold">Create task</h2><button type="button" aria-label="Close" onClick={() => setCreateOpen(false)}><X className="h-5 w-5" /></button></header><form className="grid gap-3 sm:grid-cols-2" onSubmit={handleCreate}><Input aria-label="Task title" placeholder="Task title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /><Input aria-label="Assignee" placeholder="Assignee" value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })} /><Textarea aria-label="Task description" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="sm:col-span-2" /><select aria-label="Client" value={form.clientId} onChange={(event) => setForm({ ...form, clientId: event.target.value })} className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm"><option value="">Workspace task</option>{state.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select><select aria-label="Related post" value={form.relatedPostId} onChange={(event) => setForm({ ...form, relatedPostId: event.target.value })} className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm"><option value="">No related post</option>{state.contentItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><input aria-label="Due date" type="date" required value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm" /><select aria-label="Priority" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as TaskPriority })} className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm">{["high", "medium", "low"].map((priority) => <option key={priority}>{priority}</option>)}</select><select aria-label="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as TaskStatus })} className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm">{taskStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select><Input aria-label="Labels" placeholder="Labels, comma separated" value={form.labels} onChange={(event) => setForm({ ...form, labels: event.target.value })} /><div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button type="submit">Create Task</Button></div></form></section></div> : null}
      {selectedTask ? <div role="presentation" className="fixed inset-0 z-50 flex justify-end bg-[#292928]/45" onClick={() => setSelectedTaskId(null)}><section role="dialog" aria-modal="true" aria-labelledby="task-detail-title" className="h-full w-full max-w-lg space-y-5 overflow-y-auto bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between"><div><p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Task details</p><Input id="task-detail-title" aria-label="Task title" className="mt-2 text-xl font-semibold" value={selectedTask.title} onChange={(event) => updateTask(selectedTask.id, { title: event.target.value })} /></div><button type="button" aria-label="Close details" onClick={() => setSelectedTaskId(null)}><X className="h-5 w-5" /></button></header>
        <Textarea aria-label="Task description" placeholder="Description" value={selectedTask.description} onChange={(event) => updateTask(selectedTask.id, { description: event.target.value })} />
        <div className="grid grid-cols-2 gap-3"><label className="space-y-1 text-xs text-[var(--muted-foreground)]">Status<select value={selectedTask.status} onChange={(event) => updateTask(selectedTask.id, { status: event.target.value as TaskStatus })} className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] p-2 text-sm text-foreground">{taskStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label><label className="space-y-1 text-xs text-[var(--muted-foreground)]">Priority<select value={selectedTask.priority} onChange={(event) => updateTask(selectedTask.id, { priority: event.target.value as TaskPriority })} className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] p-2 text-sm text-foreground">{["high", "medium", "low"].map((priority) => <option key={priority}>{priority}</option>)}</select></label><label className="space-y-1 text-xs text-[var(--muted-foreground)]">Assignee<Input value={selectedTask.assignee} onChange={(event) => updateTask(selectedTask.id, { assignee: event.target.value })} className="mt-1" /></label><label className="space-y-1 text-xs text-[var(--muted-foreground)]">Due date<input type="date" value={new Date(selectedTask.dueDate).toISOString().slice(0, 10)} onChange={(event) => updateTask(selectedTask.id, { dueDate: new Date(`${event.target.value}T17:00:00`).toISOString() })} className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] p-2 text-sm text-foreground" /></label><label className="col-span-2 space-y-1 text-xs text-[var(--muted-foreground)]">Client<select value={selectedTask.clientId ?? ""} onChange={(event) => updateTask(selectedTask.id, { clientId: event.target.value || null })} className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] p-2 text-sm text-foreground"><option value="">Workspace-wide</option>{state.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label></div>
        <label className="space-y-1 text-xs text-[var(--muted-foreground)]">Related post<select value={selectedTask.relatedPostId ?? ""} onChange={(event) => updateTask(selectedTask.id, { relatedPostId: event.target.value || null })} className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] p-2 text-sm text-foreground"><option value="">No related post</option>{state.contentItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        {selectedTask.relatedPostId ? <Button variant="secondary" size="sm" onClick={() => { updateContentItem(selectedTask.relatedPostId!, { approvalStatus: "pending" }); updateTask(selectedTask.id, { status: "in-review" }); }}>Submit post for approval</Button> : null}
        <div><h3 className="mb-2 text-sm font-semibold">Labels</h3><Input aria-label="Task labels" value={selectedTask.labels.join(", ")} onChange={(event) => updateTask(selectedTask.id, { labels: event.target.value.split(",").map((label) => label.trim()).filter(Boolean) })} placeholder="Labels, comma separated" /></div>
        <div><h3 className="mb-2 text-sm font-semibold">Comments & activity</h3><div className="space-y-2">{selectedTask.comments.map((comment, index) => <p key={`${index}-${comment}`} className="rounded-xl bg-[var(--surface-card-alt)] p-3 text-sm">{comment}</p>)}{selectedTask.comments.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">No comments yet.</p> : null}</div><form onSubmit={addComment} className="mt-3 flex gap-2"><Input aria-label="Add a comment" placeholder="Add a comment" value={newComment} onChange={(event) => setNewComment(event.target.value)} /><Button type="submit" size="sm">Add</Button></form></div>
      </section></div> : null}
    </div>
  );
}

function TaskCard({ task, clients, overdue, onOpen, onStatusChange, onDragStart, onDragEnd }: { task: WorkspaceTask; clients: Array<{ id: string; name: string }>; overdue: boolean; onOpen: () => void; onStatusChange: (status: TaskStatus) => void; onDragStart: () => void; onDragEnd: () => void }) {
  return <article draggable onDragStart={onDragStart} onDragEnd={onDragEnd} className="cursor-grab rounded-xl border border-[var(--border-subtle)] bg-white p-3 active:cursor-grabbing"><button type="button" onClick={onOpen} className="w-full text-left"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-semibold leading-5">{task.title}</h3><Badge tone={task.priority === "high" ? "critical" : task.priority === "medium" ? "warning" : "neutral"}>{task.priority}</Badge></div><p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted-foreground)]">{task.description}</p></button><div className="mt-3 flex flex-wrap gap-1">{task.labels.map((label) => <span key={label} className="rounded-md bg-[var(--surface-card-alt)] px-2 py-1 text-[10px]">{label}</span>)}</div><div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-2 text-[11px]"><span className="max-w-28 truncate text-[var(--muted-foreground)]">{clients.find((client) => client.id === task.clientId)?.name ?? "Workspace"} · {task.assignee}</span><span className={cn("shrink-0", overdue ? "font-semibold text-rose-600" : "text-[var(--muted-foreground)]")}>{overdue ? "Overdue · " : "Due "}{new Date(task.dueDate).toLocaleDateString()}</span></div><label className="sr-only" htmlFor={`task-status-${task.id}`}>Move {task.title}</label><select id={`task-status-${task.id}`} value={task.status} onChange={(event) => onStatusChange(event.target.value as TaskStatus)} className="mt-2 w-full rounded-lg border border-[var(--border-subtle)] px-2 py-1.5 text-xs">{taskStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></article>;
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

      {scopedContentItems.length === 0 ? (
        <div className="flex min-h-[560px] items-center justify-center rounded-xl bg-[var(--surface-card-alt)] p-6">
          <div className="max-w-sm space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--surface-brand)]">
              <Plus className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold">No posts yet</h2>
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                Create a post to start building content for your connected social channels.
              </p>
            </div>
            <Link
              href="/app/posts/new"
              className="inline-flex items-center justify-center rounded-full bg-[var(--surface-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--surface-accent-foreground)] transition hover:brightness-95"
            >
              Create Post
            </Link>
          </div>
        </div>
      ) : view === "board" ? (
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
  const { scopedContentItems, selectedClient, updateContentItem } = useNava();
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<"List" | "Week" | "Day" | "Month">("Week");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const activeItems = scopedContentItems.filter((item) => {
    const platformMatch = platformFilter === "all" || item.platformVariants.some((variant) => variant.platform === platformFilter);
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    return platformMatch && statusMatch;
  });
  const editingPost = scopedContentItems.find((item) => item.id === editingPostId) ?? null;
  const dayCount = calendarView === "Day" ? 1 : 7;
  const startOfWeek = new Date(anchorDate);
  startOfWeek.setDate(anchorDate.getDate() - anchorDate.getDay());
  const calendarDays = Array.from({ length: dayCount }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + (calendarView === "Day" ? anchorDate.getDay() : index));
    return day;
  });
  const monthTitle = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(anchorDate);
  const dateTitle = calendarView === "Day"
    ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(anchorDate)
    : calendarView === "Month"
      ? monthTitle
      : `${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(calendarDays[0])} – ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(calendarDays[calendarDays.length - 1])}`;
  const shiftDate = (direction: number) => {
    const next = new Date(anchorDate);
    if (calendarView === "Month") next.setMonth(next.getMonth() + direction);
    else next.setDate(next.getDate() + direction * (calendarView === "Day" ? 1 : 7));
    setAnchorDate(next);
  };
  const sameDate = (left: Date, right: Date) => left.toDateString() === right.toDateString();
  const hours = Array.from({ length: 24 }, (_, hour) => hour);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-[var(--surface-card)] px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white"><CalendarRange className="h-5 w-5" /></span>
          <div>
            <h1 className="text-xl font-semibold">Publish</h1>
            <p className="text-xs text-[var(--muted-foreground)]">{selectedClient?.name ?? "Publishing calendar"}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-[var(--border-subtle)] p-1">
            {(["List", "Calendar"] as const).map((mode) => (
              <button key={mode} type="button" onClick={() => setCalendarView(mode === "List" ? "List" : "Week")} className={cn("rounded-lg px-3 py-2 text-sm font-medium", (mode === "Calendar" ? calendarView !== "List" : calendarView === "List") ? "bg-[var(--surface-accent)] text-[var(--surface-accent-foreground)]" : "text-[var(--muted-foreground)]")}>{mode === "Calendar" ? <CalendarRange className="mr-1.5 inline h-4 w-4" /> : null}{mode}</button>
            ))}
          </div>
          <Link href="/app/posts/new" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface-card-alt)]"><Plus className="h-4 w-4" />New Post</Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-[var(--surface-card)] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-label="Previous period" onClick={() => shiftDate(-1)} className="rounded-lg p-2 hover:bg-[var(--surface-card-alt)]"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" aria-label="Next period" onClick={() => shiftDate(1)} className="rounded-lg p-2 hover:bg-[var(--surface-card-alt)]"><ChevronRight className="h-4 w-4" /></button>
          <h2 className="min-w-36 text-base font-semibold">{dateTitle}</h2>
          <button type="button" onClick={() => setAnchorDate(new Date())} className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm font-medium">Today</button>
          <select aria-label="Calendar view" value={calendarView} onChange={(event) => setCalendarView(event.target.value as typeof calendarView)} className="rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm">
            {["List", "Day", "Week", "Month"].map((view) => <option key={view}>{view}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Filter by channel" value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)} className="rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm"><option value="all">All channels</option>{platformCatalog.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}</select>
          <select aria-label="Filter by post status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm"><option value="all">All posts</option>{["idea", "draft", "scheduled", "published"].map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select>
        </div>
      </div>

      {calendarView === "Month" ? (
        <div className="overflow-x-auto rounded-[22px] bg-[var(--surface-card)]">
          <div className="grid min-w-[760px] grid-cols-7 border-b border-[var(--border-subtle)]">{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => <div key={day} className="px-3 py-3 text-center text-sm font-semibold text-[var(--muted-foreground)]">{day}</div>)}</div>
          <div className="grid min-w-[760px] grid-cols-7">
            {Array.from({ length: 35 }, (_, index) => {
              const first = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
              const day = new Date(first);
              day.setDate(1 - first.getDay() + index);
              const items = activeItems.filter((item) => sameDate(new Date(item.scheduledFor), day));
              return <div key={index} className={cn("min-h-28 border-b border-r border-[var(--border-subtle)] p-2", day.getMonth() !== anchorDate.getMonth() && "bg-[var(--surface-card-alt)]/50")}><span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs", sameDate(day, new Date()) && "bg-[var(--surface-brand)] text-white")}>{day.getDate()}</span><div className="mt-2 space-y-1">{items.map((item) => <button key={item.id} type="button" onClick={() => setEditingPostId(item.id)} className={cn("block w-full truncate rounded-md px-2 py-1 text-left text-xs font-medium", item.approvalStatus === "pending" ? "bg-amber-50 text-amber-900" : item.status === "published" ? "bg-sky-50 text-sky-900" : item.status === "scheduled" ? "bg-emerald-50 text-emerald-900" : "bg-[var(--surface-card-alt)] text-foreground")}>{item.title}</button>)}</div></div>;
            })}
          </div>
        </div>
      ) : calendarView === "List" ? (
        <div className="space-y-2 rounded-[22px] bg-[var(--surface-card)] p-4 sm:p-6">
          {[...activeItems].sort((left, right) => +new Date(left.scheduledFor) - +new Date(right.scheduledFor)).map((item) => <button key={item.id} type="button" onClick={() => setEditingPostId(item.id)} className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] p-4 text-left transition hover:bg-[var(--surface-card-alt)]"><div className="min-w-0"><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.platformVariants.map((variant) => getPlatformLabel(variant.platform)).join(", ")}</p></div><div className="flex items-center gap-2"><span className="text-sm text-[var(--muted-foreground)]">{formatDateTime(item.scheduledFor)}</span><Badge tone={getStatusTone(item.status)}>{item.status}</Badge></div></button>)}
          {activeItems.length === 0 ? <p className="py-10 text-center text-sm text-[var(--muted-foreground)]">No posts match the selected filters.</p> : null}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[22px] bg-[var(--surface-card)]">
          <div className="min-w-[760px]">
            <div className="grid border-b border-[var(--border-subtle)]" style={{ gridTemplateColumns: `64px repeat(${calendarDays.length}, minmax(0, 1fr))` }}>
              <div className="border-r border-[var(--border-subtle)]" />
              {calendarDays.map((day) => <div key={day.toISOString()} className={cn("border-r border-[var(--border-subtle)] px-2 py-3 text-center text-sm font-medium text-[var(--muted-foreground)]", sameDate(day, new Date()) && "text-[var(--surface-brand)]")}><span>{new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(day)}</span><span className="ml-2">{day.getDate()}</span></div>)}
            </div>
            <div className="max-h-[calc(100vh-330px)] min-h-[560px] overflow-y-auto">
              {hours.map((hour) => <div key={hour} className="grid min-h-14" style={{ gridTemplateColumns: `64px repeat(${calendarDays.length}, minmax(0, 1fr))` }}><div className="-mt-2 border-r border-[var(--border-subtle)] pr-2 text-right text-[11px] text-[var(--muted-foreground)]">{hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}</div>{calendarDays.map((day) => {
                const items = activeItems.filter((item) => {
                  const date = new Date(item.scheduledFor);
                  return sameDate(date, day) && date.getHours() === hour;
                });
                return <div key={day.toISOString()} className="min-h-14 border-r border-t border-[var(--border-subtle)] px-1.5 py-1">{items.map((item) => <button key={item.id} type="button" onClick={() => setEditingPostId(item.id)} className={cn("block w-full rounded-lg border px-2 py-1.5 text-left text-xs hover:border-[var(--surface-brand)]", item.approvalStatus === "pending" ? "border-amber-200 bg-amber-50" : item.status === "published" ? "border-sky-200 bg-sky-50" : item.status === "scheduled" ? "border-emerald-200 bg-emerald-50" : "border-[var(--border-subtle)] bg-[var(--surface-card-alt)]")}><p className="font-semibold leading-4">{item.title}</p><p className="mt-1 text-[10px] text-[var(--muted-foreground)]">{formatDateTime(item.scheduledFor)} · {item.status}</p><div className="mt-1 flex gap-1">{item.platformVariants.map((variant) => <span key={variant.id} title={getPlatformLabel(variant.platform)} className="h-2 w-2 rounded-full" style={{ backgroundColor: getPlatformAccent(variant.platform) }} />)}</div></button>)}</div>;
              })}</div>)}
            </div>
          </div>
        </div>
      )}
      {editingPost ? <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-[#292928]/60 p-4" onClick={() => setEditingPostId(null)}><section role="dialog" aria-modal="true" aria-labelledby="calendar-post-title" className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-5" onClick={(event) => event.stopPropagation()}><header className="flex items-center justify-between"><h2 id="calendar-post-title" className="text-lg font-semibold">Edit scheduled post</h2><button type="button" aria-label="Close" onClick={() => setEditingPostId(null)}><X className="h-5 w-5" /></button></header><p className="text-sm text-[var(--muted-foreground)]">{editingPost.platformVariants.map((variant) => getPlatformLabel(variant.platform)).join(", ")}</p><Input aria-label="Post title" value={editingPost.title} onChange={(event) => updateContentItem(editingPost.id, { title: event.target.value })} /><Textarea aria-label="Post content" value={editingPost.summary} onChange={(event) => updateContentItem(editingPost.id, { summary: event.target.value })} /><div className="grid gap-3 sm:grid-cols-2"><Input aria-label="Publish date and time" type="datetime-local" value={new Date(editingPost.scheduledFor).toISOString().slice(0, 16)} onChange={(event) => updateContentItem(editingPost.id, { scheduledFor: new Date(event.target.value).toISOString() })} /><select aria-label="Post status" value={editingPost.status} onChange={(event) => updateContentItem(editingPost.id, { status: event.target.value as typeof editingPost.status })} className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm">{["idea", "draft", "scheduled", "published"].map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></div><div className="flex justify-end"><Button onClick={() => setEditingPostId(null)}>Done</Button></div></section></div> : null}
    </div>
  );
}

export function AccountsPage() {
  const { scopedSocialAccounts, updateSocialAccountStatus } = useNava();
  const [connectOpen, setConnectOpen] = useState(false);
  const connectedAccounts = scopedSocialAccounts.filter((account) => account.connectionStatus === "connected");

  return <div className="space-y-5">
    <SectionHeading eyebrow="Accounts" title="Social accounts" description="Manage your connected social accounts and channels." actions={<Button variant="secondary" onClick={() => setConnectOpen(true)}><Plus className="mr-2 h-4 w-4" />Connect Account</Button>} />
    {connectedAccounts.length ? <div className="grid gap-4 xl:grid-cols-2">{connectedAccounts.map((account) => {
      const PlatformIcon = platformIcons[account.platform];
      return <Card key={account.id} className="flex items-center justify-between gap-4 p-5 shadow-none">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: getPlatformAccent(account.platform) }}><PlatformIcon className="h-6 w-6" color="#ffffff" /></span>
          <div className="min-w-0"><p className="font-semibold">{getPlatformLabel(account.platform)}</p><p className="truncate text-sm text-[var(--muted-foreground)]">@{account.handle.replace(/^@/, "")}</p></div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => updateSocialAccountStatus(account.id, "disconnected")}>Disconnect</Button>
      </Card>;
    })}</div> : <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-[var(--border-subtle)] bg-white px-6 py-12 text-center"><div className="relative mb-6 flex h-32 w-40 items-center justify-center"><div className="absolute left-4 top-5 h-20 w-20 rounded-[28px] bg-[#f0ecff]"/><div className="absolute right-3 top-2 h-24 w-24 rounded-[30px] bg-[#eaf5ff]"/><div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#292928] text-white"><CircleUserRound className="h-8 w-8"/></div><span className="absolute bottom-1 right-5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#d62976] text-white"><Plus className="h-5 w-5"/></span></div><h2 className="text-xl font-semibold">No accounts connected yet</h2><p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted-foreground)]">Connect your social accounts to manage channels, plan content, and review performance in one place.</p><Button variant="secondary" className="mt-5" onClick={() => setConnectOpen(true)}><Plus className="mr-2 h-4 w-4"/>Connect Account</Button></div>}
    <ConnectChannelDialog open={connectOpen} onClose={() => setConnectOpen(false)} />
  </div>;
}

export function GroupsPage() {
  const { addGroup, removeGroup, scopedGroups, scopedSocialAccounts, state, updateGroup, workspace } = useNava();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", clientId: "", accountIds: [] as string[], members: "You" });
  const openCreate = () => { setEditingId(null); setForm({ name: "", description: "", clientId: workspace?.selectedClientId !== "all" ? workspace?.selectedClientId ?? "" : "", accountIds: [], members: "You" }); setDialogOpen(true); };
  const openEdit = (group: (typeof scopedGroups)[number]) => { setEditingId(group.id); setForm({ name: group.name, description: group.description, clientId: group.clientId ?? "", accountIds: group.accountIds, members: group.members.join(", ") }); setDialogOpen(true); };
  const saveGroup = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const payload = { name: form.name.trim(), description: form.description.trim(), clientId: form.clientId || null, accountIds: form.accountIds, members: form.members.split(",").map((member) => member.trim()).filter(Boolean) }; if (editingId) updateGroup(editingId, payload); else addGroup(payload); setDialogOpen(false); };
  const visibleGroups = scopedGroups.filter((group) => `${group.name} ${group.description} ${group.members.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-5"><SectionHeading eyebrow="Account groups" title="Groups" description="Bundle social accounts and workspace members into useful brand or team collections." actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Create Group</Button>} /><div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-[var(--surface-card)] p-4"><label className="flex min-w-48 flex-1 items-center gap-2 rounded-xl bg-[var(--surface-card-alt)] px-3 py-2 sm:max-w-sm"><Search className="h-4 w-4 text-[var(--muted-foreground)]" /><input aria-label="Search groups" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search groups" className="w-full bg-transparent text-sm outline-none" /></label><span className="text-sm text-[var(--muted-foreground)]">Groups organize accounts and members; they are not campaigns.</span></div>
    {visibleGroups.length ? <div className="grid gap-4 xl:grid-cols-2">{visibleGroups.map((group) => <Card key={group.id} className="space-y-4 p-5 shadow-none"><header className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{group.name}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">{group.description}</p><p className="mt-2 text-xs font-medium text-[var(--surface-brand)]">{state.clients.find((client) => client.id === group.clientId)?.name ?? "Workspace-wide"}</p></div><Badge>{group.accountIds.length} accounts</Badge></header><div className="flex flex-wrap gap-2">{group.accountIds.map((accountId) => { const account = state.socialAccounts.find((candidate) => candidate.id === accountId); return account ? <span key={account.id} className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-card-alt)] px-3 py-1.5 text-xs"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: getPlatformAccent(account.platform) }} />{getPlatformLabel(account.platform)} · @{account.handle}</span> : null; })}{group.accountIds.length === 0 ? <span className="text-sm text-[var(--muted-foreground)]">No accounts assigned yet</span> : null}</div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3"><div><p className="text-xs text-[var(--muted-foreground)]">Members</p><p className="mt-1 text-sm font-medium">{group.members.join(", ") || "No members"}</p></div><div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => openEdit(group)}>Edit Group</Button><Button variant="ghost" size="sm" onClick={() => { if (window.confirm(`Delete ${group.name}?`)) removeGroup(group.id); }}>Delete</Button></div></div></Card>)}</div> : <EmptyState title="No groups found" description={query ? "Try a different search." : "Create a group to organize accounts and team members."} action={!query ? <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Create Group</Button> : undefined} />}
    {dialogOpen ? <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-[#292928]/60 p-4" onClick={() => setDialogOpen(false)}><section role="dialog" aria-modal="true" aria-labelledby="group-editor-title" className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-5" onClick={(event) => event.stopPropagation()}><header className="flex items-center justify-between"><h2 id="group-editor-title" className="font-semibold">{editingId ? "Edit group" : "Create group"}</h2><button type="button" aria-label="Close" onClick={() => setDialogOpen(false)}><X className="h-5 w-5" /></button></header><form onSubmit={saveGroup} className="space-y-3"><Input aria-label="Group name" placeholder="Group name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><Textarea aria-label="Group description" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /><select aria-label="Group client" value={form.clientId} onChange={(event) => setForm({ ...form, clientId: event.target.value })} className="w-full rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm"><option value="">Workspace-wide</option>{state.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select><fieldset className="space-y-2"><legend className="text-sm font-medium">Social accounts</legend><div className="grid gap-2 sm:grid-cols-2">{scopedSocialAccounts.map((account) => <label key={account.id} className="flex items-center gap-2 rounded-lg bg-[var(--surface-card-alt)] px-3 py-2 text-sm"><input type="checkbox" checked={form.accountIds.includes(account.id)} onChange={(event) => setForm({ ...form, accountIds: event.target.checked ? [...form.accountIds, account.id] : form.accountIds.filter((id) => id !== account.id) })} />{getPlatformLabel(account.platform)} · @{account.handle}</label>)}</div>{scopedSocialAccounts.length === 0 ? <p className="text-xs text-[var(--muted-foreground)]">No accounts in the selected scope.</p> : null}</fieldset><Input aria-label="Group members" placeholder="Members, comma separated" value={form.members} onChange={(event) => setForm({ ...form, members: event.target.value })} /><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit">Save Group</Button></div></form></section></div> : null}
  </div>;
}

export function AnalyticsPage() {
  const { scopedContentItems, scopedSocialAccounts } = useNava();
  const [range, setRange] = useState("30");
  const [platform, setPlatform] = useState("all");
  const rangeStart = new Date();
  rangeStart.setDate(rangeStart.getDate() - Number(range));
  const items = scopedContentItems.filter((item) => new Date(item.scheduledFor) >= rangeStart && (platform === "all" || item.platformVariants.some((variant) => variant.platform === platform)));
  const statuses = ["idea", "draft", "scheduled", "published"] as const;
  const postsByPlatform = platformCatalog.map((entry) => ({ platform: entry, count: items.filter((item) => item.platformVariants.some((variant) => variant.platform === entry.value)).length })).filter((entry) => entry.count > 0);
  const exportReport = () => {
    const rows = [["Post", "Status", "Scheduled for", "Platforms"], ...items.map((item) => [item.title, item.status, item.scheduledFor, item.platformVariants.map((variant) => getPlatformLabel(variant.platform)).join("; ")])];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "nava-publishing-report.csv"; anchor.click(); URL.revokeObjectURL(url);
  };
  return <div className="space-y-5"><SectionHeading eyebrow="Reporting" title="Publishing analytics" description="Counts are calculated from this workspace’s local demo schedule. Platform reach, impressions, and engagement are unavailable until social analytics APIs are connected." actions={<Button variant="secondary" onClick={exportReport}>Export CSV</Button>} /><section className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-[var(--surface-card)] p-4"><Badge tone="warning">Local demo schedule · No platform performance data</Badge><div className="flex gap-2"><select aria-label="Analytics date range" value={range} onChange={(event) => setRange(event.target.value)} className="rounded-xl border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select><select aria-label="Analytics platform filter" value={platform} onChange={(event) => setPlatform(event.target.value)} className="rounded-xl border border-[var(--border-subtle)] bg-white px-3 py-2 text-sm"><option value="all">All platforms</option>{platformCatalog.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select></div></section>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{statuses.map((status) => <Card key={status} className="space-y-2 p-5 shadow-none"><p className="text-sm font-medium capitalize text-[var(--muted-foreground)]">{status} posts</p><p className="text-4xl font-semibold tracking-tight">{items.filter((item) => item.status === status).length}</p><p className="text-xs text-[var(--muted-foreground)]">Posts scheduled or planned in selected date range</p></Card>)}</div>
    <div className="grid gap-4 xl:grid-cols-2"><Card className="space-y-4 p-5 shadow-none"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Publishing volume by platform</h2><ArrowUpRight className="h-5 w-5 text-[var(--surface-brand)]" /></div>{postsByPlatform.length ? <div className="space-y-4">{postsByPlatform.map(({ platform: entry, count }) => <div key={entry.value} className="space-y-2"><div className="flex justify-between text-sm"><span className="font-medium">{entry.label}</span><span className="text-[var(--muted-foreground)]">{count} posts</span></div><div className="h-2.5 rounded-full bg-[var(--surface-card-alt)]"><div className="h-2.5 rounded-full" style={{ width: `${Math.max(8, count / Math.max(items.length, 1) * 100)}%`, backgroundColor: entry.accent }} /></div></div>)}</div> : <p className="text-sm text-[var(--muted-foreground)]">No posts in this date range.</p>}</Card><Card className="space-y-4 p-5 shadow-none"><h2 className="text-lg font-semibold">Account health</h2>{scopedSocialAccounts.length ? scopedSocialAccounts.map((account) => <div key={account.id} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-card-alt)] p-3"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getPlatformAccent(account.platform) }} /><div><p className="text-sm font-medium">{getPlatformLabel(account.platform)} · @{account.handle}</p><p className="text-xs text-[var(--muted-foreground)]">{account.dataSource === "demo" ? "Demo connection status" : "Connected"}</p></div></div><Badge tone={getStatusTone(account.connectionStatus)}>{account.connectionStatus}</Badge></div>) : <p className="text-sm text-[var(--muted-foreground)]">No accounts in the selected client scope.</p>}</Card></div>
    <Card className="space-y-3 p-5 shadow-none"><h2 className="text-lg font-semibold">Posts in report</h2>{items.length ? <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="border-b border-[var(--border-subtle)] text-xs text-[var(--muted-foreground)]"><tr><th className="py-2">Post</th><th>Status</th><th>Platforms</th><th>Scheduled</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b border-[var(--border-subtle)] last:border-0"><td className="py-3 font-medium">{item.title}</td><td><Badge tone={getStatusTone(item.status)}>{item.status}</Badge></td><td>{item.platformVariants.map((variant) => getPlatformLabel(variant.platform)).join(", ")}</td><td className="text-[var(--muted-foreground)]">{formatDateTime(item.scheduledFor)}</td></tr>)}</tbody></table></div> : <p className="text-sm text-[var(--muted-foreground)]">No content to report for this period.</p>}</Card>
  </div>;
}

export function ApprovalPage() {
  const { duplicateContentItem, removeContentItem, scopedContentItems, scopedTasks, updateContentItem, updateTask } = useNava();
  const [activeTab, setActiveTab] = useState("Queued Posts");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [calendarView, setCalendarView] = useState("List");
  const [sortBy, setSortBy] = useState("newest");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", summary: "", scheduledFor: "", status: "draft" as "idea" | "draft" | "scheduled" | "published" });
  const tabs = ["Queued Posts", "Unscheduled", "Error", "Delivered", "Pending Review"];
  const tabItems = scopedContentItems.filter((item) => {
    if (activeTab === "Queued Posts") return item.status === "scheduled";
    if (activeTab === "Unscheduled") return item.status === "idea" || item.status === "draft";
    if (activeTab === "Delivered") return item.status === "published";
    if (activeTab === "Pending Review") return item.approvalStatus === "pending" || item.approvalStatus === "revision-requested";
    return false;
  });
  const visibleItems = tabItems.filter((item) => {
    const matchesSearch = `${item.title} ${item.summary}`.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = platform === "all" || item.platformVariants.some((variant) => variant.platform === platform);
    const matchesDate = !dateFilter || new Date(item.scheduledFor).toLocaleDateString("en-CA") === dateFilter;
    return matchesSearch && matchesPlatform && matchesDate;
  }).sort((left, right) => sortBy === "title" ? left.title.localeCompare(right.title) : sortBy === "oldest" ? +new Date(left.scheduledFor) - +new Date(right.scheduledFor) : +new Date(right.scheduledFor) - +new Date(left.scheduledFor));
  const openEdit = (item: (typeof scopedContentItems)[number]) => {
    setEditingPost(item.id);
    setEditForm({ title: item.title, summary: item.summary, scheduledFor: new Date(item.scheduledFor).toISOString().slice(0, 16), status: item.status });
  };
  const saveEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingPost || !editForm.title.trim()) return;
    updateContentItem(editingPost, { title: editForm.title.trim(), summary: editForm.summary.trim(), scheduledFor: new Date(editForm.scheduledFor).toISOString(), status: editForm.status });
    setEditingPost(null);
  };
  const reviewPost = (postId: string, approvalStatus: "approved" | "revision-requested") => {
    updateContentItem(postId, { approvalStatus });
    const relatedTask = scopedTasks.find((task) => task.relatedPostId === postId && task.status === "in-review");
    if (relatedTask) updateTask(relatedTask.id, { status: approvalStatus === "approved" ? "done" : "in-progress" });
  };

  return (
    <div className="space-y-5">
      <section className="space-y-5 rounded-[22px] bg-[var(--surface-card)] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Post status">
            {tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={cn("border-b-2 px-3 py-2.5 text-sm font-medium transition", activeTab === tab ? "border-[var(--surface-brand)] text-foreground" : "border-transparent text-[var(--muted-foreground)] hover:text-foreground")}>{tab}<span className="ml-2 text-xs text-[var(--muted-foreground)]">{scopedContentItems.filter((item) => tab === "Queued Posts" ? item.status === "scheduled" : tab === "Unscheduled" ? item.status === "idea" || item.status === "draft" : tab === "Delivered" ? item.status === "published" : tab === "Pending Review" ? item.approvalStatus === "pending" || item.approvalStatus === "revision-requested" : false).length}</span></button>)}
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-[var(--border-subtle)] p-1">
            {(["List", "Day", "Week", "Month"] as const).map((view) => <button key={view} type="button" aria-pressed={calendarView === view} onClick={() => setCalendarView(view)} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition", calendarView === view ? "bg-[var(--surface-accent)] text-[var(--surface-accent-foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)]")}>{view}</button>)}
          </div>
          <Link href="/app/posts/new" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-[var(--surface-card-alt)]"><Plus className="h-4 w-4" />New Post</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex min-w-48 flex-1 items-center gap-2 rounded-xl bg-[var(--surface-card-alt)] px-3 py-2.5 text-[var(--muted-foreground)] sm:max-w-sm"><Search className="h-4 w-4 shrink-0" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a post" className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-[var(--muted-foreground)]" /></label>
          <label className="flex items-center gap-2 rounded-xl bg-[var(--surface-card-alt)] px-3 py-2.5 text-sm text-[var(--muted-foreground)]"><CalendarDays className="h-4 w-4" /><input aria-label="Filter posts from date" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="max-w-36 bg-transparent text-sm text-foreground outline-none" /></label>
          <label className="flex items-center gap-2 rounded-xl bg-[var(--surface-card-alt)] px-3 py-2.5 text-sm text-[var(--muted-foreground)]"><Funnel className="h-4 w-4" /><select aria-label="Filter posts by channel" value={platform} onChange={(event) => setPlatform(event.target.value)} className="bg-transparent text-sm text-foreground outline-none"><option value="all">All channels</option>{platformCatalog.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select></label>
          <select aria-label="Sort posts" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-xl bg-[var(--surface-card-alt)] px-3 py-2.5 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title A–Z</option></select>
        </div>
      </section>

      {visibleItems.length ? (
        <section className={cn("rounded-[22px] bg-[var(--surface-card)] p-4 sm:p-6", calendarView !== "List" && "grid gap-3 sm:grid-cols-2 xl:grid-cols-3")}>
          {visibleItems.map((item) => <article key={item.id} className={cn("border-b border-[var(--border-subtle)] py-4 first:pt-0 last:border-0 last:pb-0", calendarView !== "List" && "rounded-xl border border-[var(--border-subtle)] bg-white p-4") }>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">{item.platformVariants.map((variant) => <span key={variant.id} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-card-alt)] px-2.5 py-1 text-xs font-medium"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: getPlatformAccent(variant.platform) }} />{getPlatformLabel(variant.platform)}</span>)}</div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted-foreground)]">{item.summary}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 text-right text-sm text-[var(--muted-foreground)]"><p>{formatDateTime(item.scheduledFor)}</p><Badge tone={getStatusTone(item.status)}>{item.status}</Badge>{item.approvalStatus === "pending" || item.approvalStatus === "revision-requested" ? <div className="flex gap-1"><Button variant="secondary" size="sm" onClick={() => reviewPost(item.id, "approved")}>Approve</Button><Button variant="ghost" size="sm" onClick={() => reviewPost(item.id, "revision-requested")}>Request changes</Button></div> : null}<div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Button><Button variant="ghost" size="sm" onClick={() => duplicateContentItem(item.id)}>Duplicate</Button><Button variant="ghost" size="sm" onClick={() => { if (window.confirm(`Delete “${item.title}”?`)) removeContentItem(item.id); }}>Delete</Button></div></div>
            </div>
          </article>)}
        </section>
      ) : (
        <section className="flex min-h-[430px] items-center justify-center rounded-[22px] bg-[var(--surface-card)] p-6">
          <div className="max-w-md space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-card-alt)] text-[var(--surface-brand)]"><CalendarDays className="h-6 w-6" /></div>
            <div className="space-y-2"><h1 className="text-2xl font-semibold tracking-tight">{search || platform !== "all" || dateFilter ? "No matching posts" : activeTab === "Queued Posts" ? "No queued posts yet" : `No ${activeTab.toLowerCase()} posts`}</h1><p className="text-sm leading-6 text-[var(--muted-foreground)]">{search || platform !== "all" || dateFilter ? "Try changing your search, date, or channel filter." : "Create a post and schedule it for your social media accounts."}</p></div>
            {!search && platform === "all" && !dateFilter ? <Link href="/app/posts/new" className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--surface-accent-foreground)] transition hover:brightness-95"><Plus className="h-4 w-4" />Create Post</Link> : null}
          </div>
        </section>
      )}
      {editingPost ? <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-[#292928]/60 p-4" onClick={() => setEditingPost(null)}><section role="dialog" aria-modal="true" aria-labelledby="edit-post-title" className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-5" onClick={(event) => event.stopPropagation()}><header className="flex items-center justify-between"><h2 id="edit-post-title" className="font-semibold">Edit post</h2><button type="button" aria-label="Close" onClick={() => setEditingPost(null)}><X className="h-5 w-5" /></button></header><form onSubmit={saveEdit} className="space-y-3"><Input aria-label="Post title" required value={editForm.title} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} /><Textarea aria-label="Post content" value={editForm.summary} onChange={(event) => setEditForm({ ...editForm, summary: event.target.value })} /><div className="grid gap-3 sm:grid-cols-2"><Input aria-label="Scheduled date and time" type="datetime-local" required value={editForm.scheduledFor} onChange={(event) => setEditForm({ ...editForm, scheduledFor: event.target.value })} /><select aria-label="Post status" value={editForm.status} onChange={(event) => setEditForm({ ...editForm, status: event.target.value as typeof editForm.status })} className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm">{["idea", "draft", "scheduled", "published"].map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></div><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setEditingPost(null)}>Cancel</Button><Button type="submit">Save Changes</Button></div></form></section></div> : null}
    </div>
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
  const { scopedConversations, state, updateConversation } = useNava();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("open");
  const [note, setNote] = useState("");
  const filtered = scopedConversations.filter((conversation) => (filter === "all" || (filter === "unread" ? conversation.unread : conversation.status === filter)) && `${conversation.contactName} ${conversation.preview}`.toLowerCase().includes(query.toLowerCase()));
  const selected = scopedConversations.find((conversation) => conversation.id === selectedId) ?? null;
  const addNote = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!selected || !note.trim()) return; updateConversation(selected.id, { messages: [...selected.messages, `Internal note · ${new Date().toLocaleString()}: ${note.trim()}`] }); setNote(""); };
  return <div className="space-y-5"><SectionHeading eyebrow="Engagement" title="Inbox" description="Review demo conversations, assign follow-ups, and track resolution. Replies are disabled until provider APIs are connected." /><div className="grid min-h-[620px] overflow-hidden rounded-[22px] bg-[var(--surface-card)] lg:grid-cols-[minmax(280px,0.8fr)_1.2fr]"><aside className="border-b border-[var(--border-subtle)] lg:border-b-0 lg:border-r"><div className="space-y-3 border-b border-[var(--border-subtle)] p-4"><div className="flex gap-1">{["open", "unread", "resolved", "all"].map((option) => <button key={option} type="button" onClick={() => setFilter(option)} className={cn("rounded-lg px-2.5 py-1.5 text-xs capitalize", filter === option ? "bg-[var(--surface-accent)] text-[var(--surface-accent-foreground)]" : "text-[var(--muted-foreground)] hover:bg-[var(--surface-card-alt)]")}>{option}</button>)}</div><label className="flex items-center gap-2 rounded-xl bg-[var(--surface-card-alt)] px-3 py-2"><Search className="h-4 w-4 text-[var(--muted-foreground)]" /><input aria-label="Search inbox" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" className="w-full bg-transparent text-sm outline-none" /></label></div><div className="max-h-[520px] overflow-auto">{filtered.map((conversation) => <button key={conversation.id} type="button" onClick={() => { setSelectedId(conversation.id); updateConversation(conversation.id, { unread: false }); }} className={cn("w-full border-b border-[var(--border-subtle)] p-4 text-left transition hover:bg-[var(--surface-card-alt)]", selectedId === conversation.id && "bg-[var(--surface-card-alt)]")}><div className="flex items-center justify-between gap-3"><span className="font-semibold">{conversation.contactName}</span>{conversation.unread ? <span className="h-2 w-2 rounded-full bg-[var(--surface-brand)]" /> : null}</div><p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{conversation.preview}</p><div className="mt-2 flex items-center justify-between text-xs text-[var(--muted-foreground)]"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: getPlatformAccent(conversation.platform) }} />{getPlatformLabel(conversation.platform)} · {conversation.kind === "public-comment" ? "Comment" : "Message"}</span><Badge tone={conversation.status === "resolved" ? "success" : "neutral"}>{conversation.status}</Badge></div></button>)}{filtered.length === 0 ? <p className="p-5 text-sm text-[var(--muted-foreground)]">No conversations match this view.</p> : null}</div></aside><section className="flex min-h-[500px] flex-col">{selected ? <><header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] p-4"><div><h2 className="font-semibold">{selected.contactName}</h2><p className="text-xs text-[var(--muted-foreground)]">{state.clients.find((client) => client.id === selected.clientId)?.name ?? "Workspace"} · {selected.kind === "public-comment" ? "Public comment" : "Private message"}</p></div><div className="flex gap-2"><select aria-label="Assign conversation" value={selected.assignee} onChange={(event) => updateConversation(selected.id, { assignee: event.target.value })} className="rounded-lg border border-[var(--border-subtle)] bg-white px-2 py-1.5 text-xs"><option>You</option><option>Unassigned</option><option>Team member</option></select><Button variant="secondary" size="sm" onClick={() => updateConversation(selected.id, { status: selected.status === "resolved" ? "open" : "resolved" })}>{selected.status === "resolved" ? "Reopen" : "Resolve"}</Button></div></header><div className="flex-1 space-y-3 overflow-auto p-5">{selected.messages.map((message, index) => <p key={`${index}-${message}`} className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6", message.startsWith("Internal note") ? "ml-auto bg-amber-50 text-amber-900" : "bg-[var(--surface-card-alt)]")}>{message}</p>)}</div><div className="space-y-3 border-t border-[var(--border-subtle)] p-4"><div className="rounded-xl bg-[var(--surface-card-alt)] p-3 text-xs leading-5 text-[var(--muted-foreground)]">Demo inbox content. This provider does not expose a live messaging API, so replies are not sent.</div><form onSubmit={addNote} className="flex gap-2"><Input aria-label="Add internal note" placeholder="Add internal note" value={note} onChange={(event) => setNote(event.target.value)} /><Button type="submit" variant="secondary">Add note</Button><Button type="button" disabled title="Connect a supported provider to send replies">Reply</Button></form></div></> : <div className="flex flex-1 items-center justify-center p-8 text-center"><div className="max-w-sm"><MessageSquareText className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" /><h2 className="mt-3 font-semibold">Choose a conversation</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Demo conversation content is provided for preview. Social inbox permissions are not connected.</p></div></div>}</section></div></div>;
}

export function ContectPage() {
  const { addContact, removeContact, scopedContacts, state, updateContact, workspace } = useNava();
  const [query, setQuery] = useState("");
  const [editorId, setEditorId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", clientId: "", platform: "instagram" as Platform, tags: "", assignee: "You", notes: "" });
  const startCreate = () => { setEditorId(null); setForm({ name: "", username: "", clientId: workspace?.selectedClientId !== "all" ? workspace?.selectedClientId ?? "" : "", platform: "instagram", tags: "", assignee: "You", notes: "" }); setDialogOpen(true); };
  const startEdit = (contact: (typeof scopedContacts)[number]) => { setEditorId(contact.id); setForm({ name: contact.name, username: contact.username, clientId: contact.clientId ?? "", platform: contact.platform, tags: contact.tags.join(", "), assignee: contact.assignee, notes: contact.notes }); setDialogOpen(true); };
  const saveContact = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const payload = { name: form.name.trim(), username: form.username.trim(), clientId: form.clientId || null, platform: form.platform, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean), assignee: form.assignee.trim() || "Unassigned", notes: form.notes.trim(), lastInteraction: editorId ? scopedContacts.find((contact) => contact.id === editorId)?.lastInteraction ?? new Date().toISOString() : new Date().toISOString() }; if (editorId) updateContact(editorId, payload); else addContact(payload); setDialogOpen(false); };
  const contacts = scopedContacts.filter((contact) => `${contact.name} ${contact.username} ${contact.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-5"><SectionHeading eyebrow="Relationships" title="Contacts" description="Keep workspace contacts distinct from client organizations and team members." actions={<Button onClick={startCreate}><Plus className="mr-2 h-4 w-4" />Add Contact</Button>} /><label className="flex max-w-md items-center gap-2 rounded-xl bg-[var(--surface-card)] px-3 py-2.5"><Search className="h-4 w-4 text-[var(--muted-foreground)]" /><input aria-label="Search contacts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search contacts" className="w-full bg-transparent text-sm outline-none" /></label>
    {contacts.length ? <div className="overflow-x-auto rounded-[22px] bg-[var(--surface-card)]"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-b border-[var(--border-subtle)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]"><tr>{["Contact", "Client", "Source", "Tags", "Assigned to", "Last interaction", ""].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead><tbody>{contacts.map((contact) => <tr key={contact.id} className="border-b border-[var(--border-subtle)] last:border-0"><td className="px-4 py-3"><button type="button" onClick={() => startEdit(contact)} className="text-left font-semibold hover:text-[var(--surface-brand)]">{contact.name}<span className="mt-1 block text-xs font-normal text-[var(--muted-foreground)]">{contact.username}</span></button></td><td className="px-4 py-3">{state.clients.find((client) => client.id === contact.clientId)?.name ?? "Workspace"}</td><td className="px-4 py-3"><span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: getPlatformAccent(contact.platform) }} />{getPlatformLabel(contact.platform)}</span></td><td className="px-4 py-3"><div className="flex gap-1">{contact.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div></td><td className="px-4 py-3">{contact.assignee}</td><td className="px-4 py-3 text-[var(--muted-foreground)]">{new Date(contact.lastInteraction).toLocaleDateString()}</td><td className="px-4 py-3"><Button variant="ghost" size="sm" onClick={() => { if (window.confirm(`Delete contact ${contact.name}?`)) removeContact(contact.id); }}>Delete</Button></td></tr>)}</tbody></table></div> : <EmptyState title="No contacts found" description={query ? "Try another name, username, or tag." : "Add a contact to start keeping relationship notes in one place."} action={!query ? <Button onClick={startCreate}><Plus className="mr-2 h-4 w-4" />Add Contact</Button> : undefined} />}
    {dialogOpen ? <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-[#292928]/60 p-4" onClick={() => setDialogOpen(false)}><section role="dialog" aria-modal="true" aria-labelledby="contact-editor-title" className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-5" onClick={(event) => event.stopPropagation()}><header className="flex items-center justify-between"><h2 id="contact-editor-title" className="font-semibold">{editorId ? "Edit contact" : "Add contact"}</h2><button type="button" aria-label="Close" onClick={() => setDialogOpen(false)}><X className="h-5 w-5" /></button></header><form onSubmit={saveContact} className="grid gap-3 sm:grid-cols-2"><Input aria-label="Contact name" placeholder="Name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><Input aria-label="Username or profile" placeholder="Username or profile" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /><select aria-label="Contact client" value={form.clientId} onChange={(event) => setForm({ ...form, clientId: event.target.value })} className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm"><option value="">Workspace-wide</option>{state.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select><Select aria-label="Source platform" value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value as Platform })}>{platformCatalog.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</Select><Input aria-label="Tags" placeholder="Tags, comma separated" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} /><Input aria-label="Assigned team member" placeholder="Assigned to" value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })} /><Textarea aria-label="Contact notes" placeholder="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="sm:col-span-2" /><div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit">Save Contact</Button></div></form></section></div> : null}
  </div>;
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
