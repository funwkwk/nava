import { platformCatalog } from "@/lib/nava/navigation";
import type {
  AccountType,
  AccountGroup,
  ActivityItem,
  AuditFinding,
  Client,
  ContentItem,
  ContentVariant,
  WorkspaceContact,
  WorkspaceConversation,
  NavaState,
  OnboardingPayload,
  Platform,
  SessionUser,
  SocialAccount,
  WorkspaceTask,
  Workspace,
} from "@/lib/nava/types";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function formatPlatformLabel(platform: Platform) {
  return platformCatalog.find((entry) => entry.value === platform)?.label ?? platform;
}

function createVariant(platform: Platform, title: string, objective: string): ContentVariant {
  const baseLabel = formatPlatformLabel(platform);

  return {
    id: createId("variant"),
    platform,
    caption: `${title} for ${baseLabel}: spotlight the benefit, lead with a clear hook, and end with a ${objective.toLowerCase()} CTA.`,
    assetType: platform === "tiktok" || platform === "youtube" ? "Short-form video" : "Static + caption",
    cta: objective === "Traffic" ? "Visit the site" : "Save this idea",
  };
}

function createActivities(accountType: AccountType): ActivityItem[] {
  return [
    {
      id: createId("activity"),
      title: "Approval reminder sent",
      detail:
        accountType === "agency"
          ? "The latest reel concept is waiting on client review."
          : "Your carousel draft is ready for a final polish.",
      timeLabel: "12 minutes ago",
      tone: "attention",
    },
    {
      id: createId("activity"),
      title: "Publishing window optimized",
      detail: "Upcoming posts were rebalanced around your strongest engagement blocks.",
      timeLabel: "1 hour ago",
      tone: "positive",
    },
    {
      id: createId("activity"),
      title: "Weekly audit refreshed",
      detail: "Caption structure and hook quality were re-scored using demo analytics.",
      timeLabel: "Today",
      tone: "neutral",
    },
  ];
}

function createContentSeed(
  workspace: Workspace,
  accountType: AccountType,
  clientIds: Array<string | null>,
): ContentItem[] {
  const scheduleAt = (daysFromNow: number, hour: number, minute = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  };
  const [primaryClientId] = clientIds;
  const secondaryClientId = clientIds[1] ?? primaryClientId ?? null;

  const items: Array<{
    title: string;
    summary: string;
    pillar: string;
    objective: string;
    status: ContentItem["status"];
    approvalStatus: ContentItem["approvalStatus"];
    scheduledFor: string;
    platforms: Platform[];
    clientId: string | null;
  }> = [
    {
      title: "Launch week teaser sequence",
      summary: "Tease the weekly drop with a clean sequence of hooks, proof points, and CTA follow-ups.",
      pillar: "Launch",
      objective: "Engagement",
      status: "scheduled",
      approvalStatus: accountType === "agency" ? "pending" : "approved",
      scheduledFor: scheduleAt(1, 9),
      platforms: ["instagram", "threads"],
      clientId: primaryClientId ?? null,
    },
    {
      title: "Founder insight carousel",
      summary: "Turn a founder note into a simple teaching carousel with one takeaway per slide.",
      pillar: "Education",
      objective: "Authority",
      status: "draft",
      approvalStatus: accountType === "agency" ? "revision-requested" : "not-required",
      scheduledFor: scheduleAt(2, 10, 30),
      platforms: ["instagram", "linkedin"],
      clientId: primaryClientId ?? null,
    },
    {
      title: "Community pulse short video",
      summary: "Capture a behind-the-scenes moment that makes the brand feel active and human.",
      pillar: "Community",
      objective: "Reach",
      status: "idea",
      approvalStatus: "not-required",
      scheduledFor: scheduleAt(3, 11, 45),
      platforms: ["tiktok", "youtube"],
      clientId: secondaryClientId,
    },
  ];

  return items.map((item) => ({
    id: createId("content"),
    workspaceId: workspace.id,
    clientId: item.clientId,
    title: item.title,
    summary: item.summary,
    pillar: item.pillar,
    objective: item.objective,
    status: item.status,
    approvalStatus: item.approvalStatus,
    scheduledFor: item.scheduledFor,
    platformVariants: item.platforms.map((platform) =>
      createVariant(platform, item.title, item.objective),
    ),
  }));
}

function createTaskSeed(workspace: Workspace, clientIds: Array<string | null>): WorkspaceTask[] {
  const dueDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(17, 0, 0, 0);
    return date.toISOString();
  };
  return [
    { id: createId("task"), workspaceId: workspace.id, title: "Review launch week captions", description: "Check tone, links, and final calls to action before scheduling.", clientId: clientIds[0] ?? null, relatedPostId: null, assignee: "You", priority: "high", status: "in-progress", dueDate: dueDate(0), labels: ["Launch", "Copy"], comments: [] },
    { id: createId("task"), workspaceId: workspace.id, title: "Approve founder carousel", description: "Share the final carousel copy with the client for review.", clientId: clientIds[0] ?? null, relatedPostId: null, assignee: "You", priority: "medium", status: "in-review", dueDate: dueDate(1), labels: ["Review"], comments: [] },
    { id: createId("task"), workspaceId: workspace.id, title: "Prepare short-form video brief", description: "Collect the hook, shot list, and asset requirements for the next video.", clientId: clientIds[1] ?? clientIds[0] ?? null, relatedPostId: null, assignee: "Unassigned", priority: "medium", status: "todo", dueDate: dueDate(3), labels: ["Video"], comments: [] },
    { id: createId("task"), workspaceId: workspace.id, title: "Send weekly performance recap", description: "Summarize publishing activity and the most useful learnings.", clientId: clientIds[0] ?? null, relatedPostId: null, assignee: "You", priority: "low", status: "done", dueDate: dueDate(-1), labels: ["Reporting"], comments: [] },
  ];
}

function createGroupSeed(workspace: Workspace, clients: Client[], accounts: SocialAccount[]): AccountGroup[] {
  const firstClient = clients[0];
  return [{ id: createId("group"), workspaceId: workspace.id, clientId: firstClient?.id ?? null, name: firstClient ? `${firstClient.name} social` : "Social channels", description: "Core social publishing accounts for this workspace.", accountIds: accounts.map((account) => account.id), members: ["You"] }];
}

function createContactSeed(workspace: Workspace, clients: Client[]): WorkspaceContact[] {
  const clientId = clients[0]?.id ?? null;
  return [
    { id: createId("contact"), workspaceId: workspace.id, clientId, name: "Jordan Lee", username: "@jordancreates", platform: "instagram", tags: ["Creator", "Partner"], assignee: "You", lastInteraction: new Date().toISOString(), notes: "Demo contact. Interested in the upcoming launch collaboration." },
    { id: createId("contact"), workspaceId: workspace.id, clientId, name: "Casey Morgan", username: "@casey.morgan", platform: "facebook", tags: ["Customer"], assignee: "Unassigned", lastInteraction: new Date(Date.now() - 86400000 * 2).toISOString(), notes: "Demo contact record." },
  ];
}

function createConversationSeed(workspace: Workspace, clients: Client[]): WorkspaceConversation[] {
  const clientId = clients[0]?.id ?? null;
  return [
    { id: createId("conversation"), workspaceId: workspace.id, clientId, contactName: "Jordan Lee", platform: "instagram", kind: "public-comment", preview: "Love this direction — when is the launch?", messages: ["Jordan Lee · Demo comment: Love this direction — when is the launch?"], unread: true, status: "open", priority: "medium", assignee: "Unassigned", replySupported: false },
    { id: createId("conversation"), workspaceId: workspace.id, clientId, contactName: "Casey Morgan", platform: "facebook", kind: "private-message", preview: "Could you share more details about the new collection?", messages: ["Casey Morgan · Demo message: Could you share more details about the new collection?"], unread: false, status: "open", priority: "low", assignee: "You", replySupported: false },
    { id: createId("conversation"), workspaceId: workspace.id, clientId, contactName: "Taylor Kim", platform: "threads", kind: "public-comment", preview: "The tips in this post were really helpful.", messages: ["Taylor Kim · Demo reply: The tips in this post were really helpful."], unread: false, status: "resolved", priority: "low", assignee: "You", replySupported: false },
  ];
}

function createAuditSeed(clientIds: Array<string | null>): AuditFinding[] {
  return [
    {
      id: createId("audit"),
      clientId: clientIds[0] ?? null,
      severity: "critical",
      title: "High-performing short-form posts are underrepresented",
      evidence: "Short-form content drove the strongest reach in demo analytics but only accounts for one upcoming slot.",
      recommendation: "Increase short-form frequency from 1 to 3 posts this week and reuse the launch hook with two new proof angles.",
    },
    {
      id: createId("audit"),
      clientId: clientIds[0] ?? null,
      severity: "high",
      title: "Approval lead time is slowing scheduled output",
      evidence: "One scheduled item is blocked in pending review within 24 hours of publish time.",
      recommendation: "Send an approval reminder 48 hours before publish and move revision comments into the share-link flow.",
    },
    {
      id: createId("audit"),
      clientId: clientIds[1] ?? clientIds[0] ?? null,
      severity: "medium",
      title: "Educational captions need stronger opening hooks",
      evidence: "Authority posts have stable saves but softer early retention compared with community-led content.",
      recommendation: "Rewrite the first two lines to lead with a specific outcome and keep the CTA focused on one action.",
    },
  ];
}

function createWorkspace(user: SessionUser, payload: OnboardingPayload): Workspace {
  return {
    id: createId("workspace"),
    name: payload.workspaceName,
    description: payload.workspaceDescription,
    accountType: user.accountType,
    selectedClientId: user.accountType === "agency" ? "all" : "all",
  };
}

function createClients(user: SessionUser, workspace: Workspace, payload: OnboardingPayload): Client[] {
  if (user.accountType === "personal") {
    return [];
  }

  const primaryClient: Client = {
    id: createId("client"),
    workspaceId: workspace.id,
    name: payload.firstClientName?.trim() || "Solstice Studio",
    description: "Primary brand workspace for strategy, publishing, and feedback.",
    website: payload.firstClientWebsite?.trim() || "https://solsticestudio.demo",
    industry: payload.firstClientIndustry?.trim() || "Lifestyle",
    accent: "#0F67EA",
  };

  const secondaryClient: Client = {
    id: createId("client"),
    workspaceId: workspace.id,
    name: "Northstar Coffee",
    description: "Demo brand seeded to preview multi-client workflow and switcher behavior.",
    website: "https://northstar.demo",
    industry: "Food & Beverage",
    accent: "#7C3AED",
  };

  return [primaryClient, secondaryClient];
}

function createSocialAccounts(
  workspace: Workspace,
  user: SessionUser,
  payload: OnboardingPayload,
  clients: Client[],
): SocialAccount[] {
  const primaryClientId = clients[0]?.id ?? null;

  return payload.platforms.map((platform, index) => {
    const meta = platformCatalog.find((entry) => entry.value === platform);

    return {
      id: createId("social"),
      workspaceId: workspace.id,
      clientId: user.accountType === "agency" ? primaryClientId : null,
      platform,
      handle: index === 0 ? payload.socialHandle : `${payload.socialHandle}-${platform.slice(0, 2)}`,
      connectionStatus: index === 0 ? "connected" : "attention",
      capabilities: meta?.capabilities ?? [],
      postsThisWeek: 2 + index,
      dataSource: "demo",
    };
  });
}

export function createEmptyState(supabaseReady: boolean): NavaState {
  return {
    mode: "demo",
    supabaseConfigured: supabaseReady,
    session: {
      status: "anonymous",
      onboardingCompleted: false,
      currentUser: null,
    },
    workspace: null,
    clients: [],
    socialAccounts: [],
    contentItems: [],
    tasks: [],
    groups: [],
    contacts: [],
    conversations: [],
    auditFindings: [],
    insightKpis: [],
    activities: [],
  };
}

export function createSeedStateFromOnboarding(
  user: SessionUser,
  payload: OnboardingPayload,
  supabaseReady: boolean,
): NavaState {
  const workspace = createWorkspace(user, payload);
  const clients = createClients(user, workspace, payload);
  const socialAccounts = createSocialAccounts(workspace, user, payload, clients);
  const clientIds = user.accountType === "agency" ? clients.map((client) => client.id) : [null];

  return {
    mode: "demo",
    supabaseConfigured: supabaseReady,
    session: {
      status: "authenticated",
      onboardingCompleted: true,
      currentUser: user,
    },
    workspace,
    clients,
    socialAccounts,
    contentItems: createContentSeed(workspace, user.accountType, clientIds),
    tasks: createTaskSeed(workspace, clientIds),
    groups: createGroupSeed(workspace, clients, socialAccounts),
    contacts: createContactSeed(workspace, clients),
    conversations: createConversationSeed(workspace, clients),
    auditFindings: createAuditSeed(clientIds),
    insightKpis: [
      {
        id: createId("kpi"),
        label: "Posts ready this week",
        value: user.accountType === "agency" ? "8" : "5",
        delta: "+2 from last week",
        tone: "positive",
      },
      {
        id: createId("kpi"),
        label: "Pending approvals",
        value: user.accountType === "agency" ? "3" : "0",
        delta: user.accountType === "agency" ? "1 due today" : "No blockers",
        tone: user.accountType === "agency" ? "attention" : "neutral",
      },
      {
        id: createId("kpi"),
        label: "Connection health",
        value: `${socialAccounts.filter((account) => account.connectionStatus === "connected").length}/${socialAccounts.length}`,
        delta: "1 account needs refresh",
        tone: "attention",
      },
      {
        id: createId("kpi"),
        label: "Audit opportunities",
        value: "6",
        delta: "2 high-impact recommendations",
        tone: "neutral",
      },
    ],
    activities: createActivities(user.accountType),
  };
}
