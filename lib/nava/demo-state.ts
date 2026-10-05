import { platformCatalog } from "@/lib/nava/navigation";
import type {
  AccountType,
  ActivityItem,
  AuditFinding,
  Client,
  ContentItem,
  ContentVariant,
  NavaState,
  OnboardingPayload,
  Platform,
  SessionUser,
  SocialAccount,
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
      scheduledFor: "2026-10-06T09:00:00.000Z",
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
      scheduledFor: "2026-10-07T03:30:00.000Z",
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
      scheduledFor: "2026-10-08T11:45:00.000Z",
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
